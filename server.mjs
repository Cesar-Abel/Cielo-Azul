import http from 'node:http';
import {readFile,writeFile} from 'node:fs/promises';
import {randomBytes,randomUUID} from 'node:crypto';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {Store} from './admin-store.mjs';
export function createServer(dir){
 const root=path.join(dir,'dist'),store=new Store(dir),token=randomBytes(32).toString('hex');
 const json=(res,code,obj)=>{res.writeHead(code,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'});res.end(JSON.stringify(obj))};
 async function body(req,max=2*1024*1024){let size=0,chunks=[];for await(const chunk of req){size+=chunk.length;if(size>max)throw Object.assign(Error('Archivo demasiado grande.'),{status:413});chunks.push(chunk)}return Buffer.concat(chunks)}
 const server=http.createServer(async(req,res)=>{try{
 const port=server.address().port,allowed=['127.0.0.1:'+port,'localhost:'+port];
 if(!allowed.includes(req.headers.host))return json(res,403,{error:'Acceso local únicamente.'});
 const url=new URL(req.url,'http://'+req.headers.host);res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('X-Robots-Tag','noindex, nofollow');res.setHeader('Cache-Control','no-store');res.setHeader('Referrer-Policy','same-origin');
 if(url.pathname.startsWith('/api/admin/')){
 if(req.headers['sec-fetch-site']==='cross-site')return json(res,403,{error:'Origen no permitido.'});
 if(req.method!=='GET'&&(req.headers.origin!==url.origin||req.headers['x-csrf-token']!==token))return json(res,403,{error:'Recarga el panel para volver a guardar.'});
 if(url.pathname==='/api/admin/content'&&req.method==='GET')return json(res,200,{...await store.read(),token});
 if(url.pathname==='/api/admin/content'&&req.method==='PUT'){const input=JSON.parse(await body(req));return json(res,200,await store.save(input.content,input.revision))}
 if(url.pathname==='/api/admin/backups'&&req.method==='GET')return json(res,200,{backups:await store.backups()});
 if(url.pathname==='/api/admin/restore'&&req.method==='POST'){const input=JSON.parse(await body(req));return json(res,200,await store.restore(input.name,input.revision))}
 if(url.pathname==='/api/admin/upload'&&req.method==='POST'){
 const bytes=await body(req,5*1024*1024);let ext;
 if(bytes[0]===255&&bytes[1]===216&&bytes[2]===255)ext='jpg';else if(bytes.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])))ext='png';else if(bytes.subarray(0,4).toString()==='RIFF'&&bytes.subarray(8,12).toString()==='WEBP')ext='webp';else return json(res,422,{error:'Selecciona una imagen JPG, PNG o WebP válida (máximo 5 MB).'});
 const filename='foto-'+randomUUID()+'.'+ext;await writeFile(path.join(dir,'src/assets',filename),bytes);await writeFile(path.join(root,'assets',filename),bytes);return json(res,201,{file:filename})}
 return json(res,404,{error:'Acción no encontrada.'});}
 if(!['GET','HEAD'].includes(req.method)){res.writeHead(405);return res.end()}
 let pathname=decodeURIComponent(url.pathname),file;if(pathname==='/admin/'||pathname==='/admin')file=path.join(dir,'admin/index.html');else if(['/admin/admin.mjs','/admin/admin.css'].includes(pathname))file=path.join(dir,pathname.slice(1));else file=path.resolve(root,'.'+pathname+(pathname.endsWith('/')?'index.html':''));
 if(!file.startsWith(root+path.sep)&&!file.startsWith(path.join(dir,'admin')+path.sep)){res.writeHead(403);return res.end()}
 let data;try{data=await readFile(file)}catch{res.statusCode=404;data=await readFile(path.join(root,'404.html'));file='404.html'}
 res.setHeader('Content-Type',({'.html':'text/html; charset=utf-8','.css':'text/css','.mjs':'text/javascript','.json':'application/json','.svg':'image/svg+xml','.jpg':'image/jpeg','.png':'image/png','.webp':'image/webp','.avif':'image/avif','.xml':'application/xml','.txt':'text/plain'})[path.extname(file)]||'application/octet-stream');res.end(req.method==='HEAD'?undefined:data);
 }catch(error){json(res,error.status||500,{error:error.status?error.message:'No se pudo completar la operación. Revisa los datos e inténtalo de nuevo.'})}});
 return server;
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))createServer(path.dirname(fileURLToPath(import.meta.url))).listen(Number(process.env.PORT)||4173,'127.0.0.1',()=>console.log('CieloAzul: http://127.0.0.1:'+(process.env.PORT||4173)+' · Panel: /admin/'));
