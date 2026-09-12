const $=s=>document.querySelector(s);
let state={content:null,revision:'',token:'',selected:null,dirty:false};
const lines=v=>(v||'').split(/\r?\n/).map(x=>x.trim()).filter(Boolean);
const join=v=>Array.isArray(v)?v.join('\n'):v||'';
const slugify=v=>v.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,120)||'nuevo-viaje';
const uniqueId=base=>{let id=base,n=2;while(state.content.trips.some(t=>t.id===id))id=`${base}-${n++}`;return id};
const say=(message,error=false)=>{$('#status').textContent=error?'':message;$('#error').hidden=!error;$('#error').textContent=error?message:'';if(error)$('#error').focus()};
const changed=()=>{state.dirty=true;$('#save').disabled=false;say('Tienes cambios sin guardar.');};
const api=async(path,options={})=>{const r=await fetch(path,{...options,headers:{...(options.body?{'Content-Type':'application/json'}:{}),...(options.headers||{})}});const data=await r.json().catch(()=>({}));if(!r.ok)throw Error(data.error||'No se pudo completar la operación.');return data};
const field=(form,name,value)=>{const el=form.elements[name];if(!el)return;if(el.type==='checkbox')el.checked=!!value;else el.value=value??''};
const duration=t=>{if(!t.start||!t.end)return '';const nights=(Date.parse(t.end)-Date.parse(t.start))/86400000;return Number.isFinite(nights)&&nights>=0?`${nights+1} días / ${nights} noches`:''};

async function load(){
 try{const data=await api('/api/admin/content');state={...state,...data,selected:data.content.trips[0]?.id||null,dirty:false};$('#save').disabled=true;renderAll();say('Todo está listo para editar.');}
 catch(error){say(error.message,true);$('#retry').hidden=false;}
}
function renderAll(){renderTrips();renderDestinations();renderAgency();$('#total').textContent=state.content.trips.length;}
function renderTrips(){
 const query=$('#search').value.trim().toLowerCase(),list=$('#trip-list');list.replaceChildren();
 for(const trip of state.content.trips.filter(t=>`${t.hotel} ${t.destination}`.toLowerCase().includes(query))){
  const d=state.content.destinations.find(d=>d.id===trip.destination),button=document.createElement('button');button.className='trip-item';button.type='button';button.setAttribute('aria-pressed',String(trip.id===state.selected));
  const strong=document.createElement('strong'),meta=document.createElement('span'),status=document.createElement('span');strong.textContent=trip.hotel;meta.textContent=`${d?.name||'Sin destino'} · ${trip.start}`;status.className='state';status.textContent=trip.active===false?'Oculto':'Publicado';button.append(strong,meta,status);button.onclick=()=>{state.selected=trip.id;renderTrips();renderEditor();};list.append(button);
 }
 renderEditor();
}
function renderEditor(){
 const host=$('#editor-panel'),trip=state.content.trips.find(t=>t.id===state.selected);host.replaceChildren();if(!trip){const p=document.createElement('div');p.className='editor-empty';p.textContent='Selecciona un viaje para empezar.';host.append(p);return}
 const form=$('#trip-template').content.firstElementChild.cloneNode(true);form.querySelector('[name=destination]').innerHTML=state.content.destinations.map(d=>`<option value="${d.id}">${d.name}</option>`).join('');
 for(const name of ['id','hotel','destination','start','end','transport','origin','priceBasis','occupancy','taxes','itinerary','exclusions','conditions','photoAlt','posterText','source','active','posterApproved'])field(form,name,trip[name]);field(form,'price',trip.price);field(form,'includes',join(trip.includes));
 form.querySelector('#duration').textContent=duration(trip);form.querySelector('#view-trip').href=`/viajes/${trip.id}/`;
 setPreview(form.querySelector('#photo-preview'),trip.photo||destinationPhoto(trip.destination));setPreview(form.querySelector('#poster-preview'),trip.poster);
 const approveSensitive=new Set(['hotel','destination','start','end','transport','origin','price','priceBasis','occupancy','taxes','includes','posterText']);
 form.addEventListener('input',ev=>{updateTrip(trip,ev.target);if(approveSensitive.has(ev.target.name)){trip.posterApproved=false;field(form,'posterApproved',false)}form.querySelector('#duration').textContent=duration(trip);changed();renderTripsListOnly();});
 form.addEventListener('change',ev=>{if(ev.target.type==='file')return;updateTrip(trip,ev.target);changed();renderTripsListOnly();});
 form.querySelector('#duplicate').onclick=()=>{const copy=structuredClone(trip);copy.id=uniqueId(slugify(trip.hotel+'-'+trip.start));copy.hotel+=' (copia)';copy.active=false;state.content.trips.push(copy);state.selected=copy.id;changed();renderTrips();};
 form.querySelector('#remove-photo').onclick=()=>{trip.photo=null;trip.photoAlt='';setPreview(form.querySelector('#photo-preview'),destinationPhoto(trip.destination));changed();};
 form.querySelector('#photo-file').onchange=async ev=>upload(ev.target.files[0],file=>{trip.photo=file;trip.photoAlt ||= `Fotografía de ${trip.hotel}`;field(form,'photoAlt',trip.photoAlt);setPreview(form.querySelector('#photo-preview'),file);changed();});
 form.querySelector('#poster-file').onchange=async ev=>upload(ev.target.files[0],file=>{trip.poster=file;trip.posterApproved=false;field(form,'posterApproved',false);setPreview(form.querySelector('#poster-preview'),file);changed();});
 host.append(form);
}
function renderTripsListOnly(){const selected=state.selected;for(const button of $('#trip-list').children){const trip=state.content.trips.find(t=>t.id===selected);if(button.getAttribute('aria-pressed')==='true'&&trip){button.children[0].textContent=trip.hotel;button.children[1].textContent=`${state.content.destinations.find(d=>d.id===trip.destination)?.name||'Sin destino'} · ${trip.start}`;button.children[2].textContent=trip.active===false?'Oculto':'Publicado';}}}
function updateTrip(t,el){if(!el.name)return;if(el.name==='id'){t.id=el.value;state.selected=el.value}else if(el.name==='includes')t.includes=lines(el.value);else if(el.name==='price')t.price=el.value===''?null:Number(el.value);else if(el.type==='checkbox')t[el.name]=el.checked;else t[el.name]=el.value||null;}
function destinationPhoto(id){const d=state.content.destinations.find(d=>d.id===id);return d?`${d.image}.jpg`:null}
function setPreview(img,file){img.hidden=!file;if(file)img.src=`/assets/${file}`;else img.removeAttribute('src')}
async function upload(file,done){if(!file)return;try{say('Subiendo fotografía…');const r=await fetch('/api/admin/upload',{method:'POST',headers:{'X-CSRF-Token':state.token,'Content-Type':file.type},body:file});const data=await r.json();if(!r.ok)throw Error(data.error);done(data.file);say('Fotografía lista. Guarda para publicar el cambio.');}catch(error){say(error.message,true)}}

function renderDestinations(){
 const host=$('#destination-list');host.replaceChildren();
 for(const d of state.content.destinations){const form=document.createElement('form');form.className='panel destination-editor';form.innerHTML=`<img src="/assets/${d.image}.jpg" alt=""><div class="form-grid"><label>Nombre<input name="name" required maxlength="100"></label><label>Identificador del enlace<input name="id" required pattern="[a-z0-9]+(-[a-z0-9]+)*"></label></div><label>Frase breve<input name="intro" maxlength="300"></label><label>Descripción<textarea name="description" rows="3" maxlength="1000"></textarea></label><label>Descripción accesible de la foto<input name="alt" required maxlength="250"></label><label>Cambiar fotografía (JPG)<input name="imageFile" type="file" accept="image/jpeg"></label>`;
  for(const n of ['name','id','intro','description','alt'])field(form,n,d[n]);
  form.addEventListener('input',ev=>{if(ev.target.type==='file')return;const old=d[ev.target.name];d[ev.target.name]=ev.target.value;if(ev.target.name==='id')for(const trip of state.content.trips)if(trip.destination===old)trip.destination=d.id;changed();renderTripDestinationOptions();});
  form.elements.imageFile.onchange=async ev=>upload(ev.target.files[0],file=>{if(!file.endsWith('.jpg')){say('Para destinos utiliza una fotografía JPG.',true);return}d.image=file.slice(0,-4);form.querySelector('img').src=`/assets/${file}`;changed();});host.append(form);
 }
}
function renderTripDestinationOptions(){const select=$('#trip-form [name=destination]');if(!select)return;const value=select.value;select.innerHTML=state.content.destinations.map(d=>`<option value="${d.id}">${d.name}</option>`).join('');select.value=value;}
function renderAgency(){const form=$('#agency-form');for(const n of ['phone','whatsapp','email','address'])field(form,n,state.content.agency[n]);const host=$('#social-fields');host.replaceChildren();for(const social of state.content.socials){const label=document.createElement('label');label.textContent=social.name;const input=document.createElement('input');input.type='url';input.required=true;input.value=social.url;input.addEventListener('input',()=>{social.url=input.value;changed()});label.append(input);host.append(label)}}
$('#agency-form').addEventListener('input',ev=>{if(ev.target.name){state.content.agency[ev.target.name]=ev.target.value;changed()}});

async function save(){
 const invalid=document.querySelector('main :invalid');if(invalid){invalid.focus();say('Revisa el campo señalado antes de guardar.',true);return}
 try{$('#save').disabled=true;say('Guardando y actualizando tu página…');const data=await api('/api/admin/content',{method:'PUT',headers:{'X-CSRF-Token':state.token},body:JSON.stringify({content:state.content,revision:state.revision})});state.content=data.content;state.revision=data.revision;state.dirty=false;renderAll();say('Cambios guardados. La vista pública ya está actualizada.');}
 catch(error){$('#save').disabled=false;say(error.message,true)}
}
async function showBackups(){try{const {backups}=await api('/api/admin/backups'),host=$('#backups-list');host.replaceChildren();if(!backups.length){host.textContent='Todavía no hay respaldos.';return}for(const name of backups){const row=document.createElement('div');row.className='backup-row';const span=document.createElement('span');span.textContent=name;const button=document.createElement('button');button.className='secondary';button.textContent='Restaurar';button.onclick=()=>confirmRestore(name);row.append(span,button);host.append(row)}}catch(error){say(error.message,true)}}
function confirmRestore(name){const dialog=$('#confirm');$('#confirm-text').textContent=`Se guardará el estado actual y se restaurará ${name}.`;$('#confirm-action').onclick=async()=>{dialog.close();try{say('Restaurando respaldo…');const data=await api('/api/admin/restore',{method:'POST',headers:{'X-CSRF-Token':state.token},body:JSON.stringify({name,revision:state.revision})});state.content=data.content;state.revision=data.revision;state.dirty=false;renderAll();await showBackups();say('Respaldo restaurado y página actualizada.')}catch(error){say(error.message,true)}};dialog.showModal()}

for(const button of document.querySelectorAll('nav [data-section]'))button.onclick=()=>{for(const b of document.querySelectorAll('nav [data-section]'))b.removeAttribute('aria-current');button.setAttribute('aria-current','page');for(const section of document.querySelectorAll('main>section'))section.hidden=section.id!==`${button.dataset.section}-section`;if(button.dataset.section==='backups')showBackups();};
$('#search').addEventListener('input',renderTrips);$('#retry').onclick=load;$('#save').onclick=save;$('#new-trip').onclick=()=>{const today=new Date().toISOString().slice(0,10),id=uniqueId('nuevo-viaje');state.content.trips.unshift({id,destination:state.content.destinations[0].id,hotel:'Nuevo viaje',start:today,end:today,price:null,transport:'bus',type:'Todo incluido terrestre',origin:'San Luis Potosí',priceBasis:null,occupancy:null,taxes:null,itinerary:null,exclusions:null,conditions:null,includes:[],active:false,source:state.content.agency.source,checked:today,photo:null,photoAlt:'',poster:null,posterText:'',posterApproved:false});state.selected=id;changed();renderTrips();};
$('#new-destination').onclick=()=>{let n=state.content.destinations.length+1,id=`destino-${n}`;while(state.content.destinations.some(d=>d.id===id))id=`destino-${++n}`;state.content.destinations.push({id,name:'Nuevo destino',image:state.content.destinations[0].image,alt:'Fotografía del destino pendiente de describir',intro:'',description:''});changed();renderDestinations();renderTripDestinationOptions();};
$('#export').onclick=()=>{const blob=new Blob([JSON.stringify(state.content,null,2)],{type:'application/json'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=`cieloazul-datos-${new Date().toISOString().slice(0,10)}.json`;a.click();URL.revokeObjectURL(a.href)};
$('#import').onchange=async ev=>{try{state.content=JSON.parse(await ev.target.files[0].text());state.selected=state.content.trips?.[0]?.id||null;changed();renderAll();say('Respaldo cargado. Revisa los datos y pulsa Guardar.')}catch{say('El archivo no contiene datos JSON válidos.',true)}};
$('#cancel').onclick=()=>$('#confirm').close();window.addEventListener('beforeunload',ev=>{if(state.dirty){ev.preventDefault();ev.returnValue=''}});load();
