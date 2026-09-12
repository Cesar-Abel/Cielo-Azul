import {readFile,writeFile,rename,mkdir,readdir,unlink} from 'node:fs/promises';
import {createHash,randomUUID} from 'node:crypto';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
import path from 'node:path';
const exec=promisify(execFile),slug=/^[a-z0-9]+(?:-[a-z0-9]+)*$/,file=/^[a-zA-Z0-9_-]+\.(jpg|jpeg|png|webp|avif)$/;
const fail=message=>{throw Object.assign(Error(message),{status:422})};
function text(v,name,max=300){if(typeof v!=='string'||v.length>max||/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(v))fail('Revisa '+name);return v.trim()}
function required(v,name,max){const s=text(v,name,max);if(!s)fail('Falta '+name);return s}
const optional=(v,name,max)=>v==null||v===''?null:text(v,name,max);
const date=v=>/^\d{4}-\d{2}-\d{2}$/.test(v)&&!Number.isNaN(Date.parse(v))&&new Date(v).toISOString().slice(0,10)===v;
function url(v,label){try{const u=new URL(v);if(u.protocol!=='https:'||u.username||u.password)throw Error();return u.href}catch{fail(label+' debe ser un enlace HTTPS válido.')}}
export function validate(input){
 if(!input||!Array.isArray(input.trips)||!Array.isArray(input.destinations)||!Array.isArray(input.socials))fail('El respaldo no tiene el formato esperado.');
 if(input.trips.length>500||!input.destinations.length||input.destinations.length>100)fail('Límite: 500 viajes y 100 destinos.');
 const a=input.agency||{};const agency={name:'CieloAzul',phone:required(a.phone,'teléfono'),whatsapp:required(a.whatsapp,'WhatsApp'),email:required(a.email,'correo'),address:required(a.address,'dirección',500),source:url(a.source,'Sitio de referencia'),checked:date(a.checked)?a.checked:new Date().toISOString().slice(0,10)};
 if(!/^\+?\d{8,15}$/.test(agency.phone)||!/^\d{8,15}$/.test(agency.whatsapp))fail('Teléfono y WhatsApp: números con código de país (teléfono admite +).');
 if(!/^[^\s<>"@]+@[^\s<>"@]+\.[^\s<>"@]+$/.test(agency.email))fail('Revisa el correo de la agencia.');
 const destinations=input.destinations.map(d=>{if(!slug.test(d.id))fail('Identificador de destino inválido.');if(!/^[a-zA-Z0-9_-]+$/.test(d.image))fail('Foto de destino inválida.');return {id:d.id,name:required(d.name,'destino',100),image:d.image,alt:required(d.alt,'descripción de foto',250),intro:text(d.intro||'','introducción'),description:text(d.description||'','descripción',1000)}});
 if(new Set(destinations.map(d=>d.id)).size!==destinations.length)fail('Hay destinos con identificador repetido.');
 if(new Set(destinations.map(d=>d.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,''))).size!==destinations.length)fail('Hay nombres de destino repetidos.');
 const types={bus:'Todo incluido terrestre',air:'Todo incluido aéreo',tour:'Tour',international:'Internacional'};
 const trips=input.trips.map(t=>{if(!slug.test(t.id)||t.id.length>150)fail('Revisa el enlace del viaje.');if(!destinations.some(d=>d.id===t.destination))fail('Selecciona un destino válido para '+t.hotel);if(!date(t.start)||!date(t.end)||t.end<t.start)fail('Revisa las fechas de '+t.hotel);if(!(t.transport in types))fail('Selecciona un tipo válido.');if(t.price!==null&&(typeof t.price!=='number'||!Number.isFinite(t.price)||t.price<0||t.price>10000000))fail('Precio inválido; déjalo vacío si falta confirmar.');if(!Array.isArray(t.includes)||t.includes.length>40)fail('Revisa los servicios incluidos.');if(t.photo&&!file.test(t.photo)||t.poster&&!file.test(t.poster))fail('Archivo de imagen inválido.');return {id:t.id,destination:t.destination,hotel:required(t.hotel,'hotel o paquete',150),start:t.start,end:t.end,nights:(Date.parse(t.end)-Date.parse(t.start))/86400000,price:t.price,transport:t.transport,type:types[t.transport],origin:required(t.origin,'ciudad de salida',150),priceBasis:optional(t.priceBasis,'base del precio'),occupancy:optional(t.occupancy,'ocupación'),taxes:optional(t.taxes,'impuestos',1000),itinerary:optional(t.itinerary,'itinerario',6000),exclusions:optional(t.exclusions,'exclusiones',4000),conditions:optional(t.conditions,'condiciones',6000),includes:t.includes.map(x=>required(x,'servicio',500)),active:t.active!==false,source:t.source?url(t.source,'Fuente'):agency.source,checked:date(t.checked)?t.checked:new Date().toISOString().slice(0,10),photo:t.photo||null,photoAlt:text(t.photoAlt||'','descripción de foto',250),poster:t.poster||null,posterText:text(t.posterText||'','texto del cartel',6000),posterApproved:t.posterApproved===true}});
 if(new Set(trips.map(t=>t.id)).size!==trips.length)fail('Hay enlaces de viajes repetidos.');
 for(const t of trips){if(t.photo&&!t.photoAlt)fail('Describe la foto de '+t.hotel);if(t.posterApproved&&(!t.poster||!t.posterText))fail('Falta cartel o transcripción de '+t.hotel);}
 const socials=[['Facebook','f','facebook'],['Instagram','◎','instagram'],['TikTok','♪','tiktok'],['YouTube','▶','youtube']].map(([name,mark,color])=>{const s=input.socials.find(s=>s.name===name);if(!s)fail('Falta '+name);return {name,mark,color,url:url(s.url,name),description:text(s.description||'','descripción de red',200)}});
 return {agency,destinations,trips,socials};
}
export const revision=raw=>createHash('sha256').update(raw).digest('hex');
export class Store{
 constructor(dir){this.dir=dir;this.busy=false}
 async read(){const raw=await readFile(path.join(this.dir,'content.json'),'utf8');return {content:JSON.parse(raw),revision:revision(raw)}}
 async save(input,expected){if(this.busy)throw Object.assign(Error('Hay otro guardado en curso. Reintenta.'),{status:409});this.busy=true;try{const old=await this.read();if(old.revision!==expected)throw Object.assign(Error('Otra ventana guardó cambios. Recarga el panel antes de guardar.'),{status:409});const content=validate(input);for(const d of content.destinations)await readFile(path.join(this.dir,'src/assets',d.image+'.jpg'));for(const t of content.trips)for(const asset of [t.photo,t.poster])if(asset)await readFile(path.join(this.dir,'src/assets',asset));
 const folder=path.join(this.dir,'backups');await mkdir(folder,{recursive:true});const backup='backup-'+new Date().toISOString().replace(/[:.]/g,'-')+'-'+randomUUID().slice(0,8)+'.json';await writeFile(path.join(folder,backup),JSON.stringify(old.content,null,2));
 const p=path.join(this.dir,'content.json');await writeFile(p+'.tmp',JSON.stringify(content,null,2));await rename(p+'.tmp',p);
 try{await exec(process.execPath,['build.mjs'],{cwd:this.dir,timeout:60000,windowsHide:true});for(const t of old.content.trips)if(!content.trips.some(n=>n.id===t.id&&n.active!==false))await unlink(path.join(this.dir,'dist/viajes',t.id,'index.html')).catch(()=>{});}catch{await writeFile(p,JSON.stringify(old.content,null,2));await exec(process.execPath,['build.mjs'],{cwd:this.dir,timeout:60000,windowsHide:true}).catch(()=>{});throw Object.assign(Error('No se pudo actualizar la página. Se restauraron los datos anteriores.'),{status:500})}
 return {...await this.read(),backup};}finally{this.busy=false}}
 async backups(){await mkdir(path.join(this.dir,'backups'),{recursive:true});return (await readdir(path.join(this.dir,'backups'))).filter(n=>/^backup-[\w-]+\.json$/.test(n)).sort().reverse()}
 async restore(name,expected){if(!/^backup-[\w-]+\.json$/.test(name))fail('Respaldo inválido');return this.save(JSON.parse(await readFile(path.join(this.dir,'backups',name),'utf8')),expected)}
}
