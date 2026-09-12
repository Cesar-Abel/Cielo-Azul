import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,readdir,stat} from 'node:fs/promises';
import path from 'node:path';
import {trips,destinations} from '../src/data.mjs';
import {filterTrips,quoteText,range,money} from '../src/shared.mjs';
import {socials,experiences,flyers} from '../src/brand.mjs';
test('Redes, categorías y carteles enlazan a destinos concretos',async()=>{
 assert.equal(socials.length,4);assert.equal(experiences.length,6);
 for(const s of socials)assert.equal(new URL(s.url).protocol,'https:');
 for(const x of experiences){assert.ok(x.href.startsWith('/viajes/')||x.href.startsWith('/contacto/'));await stat('dist/assets/'+x.image)}
 for(const [id,f] of Object.entries(flyers)){assert.ok(trips.some(t=>t.id===id));await stat('dist/assets/'+f.file);const html=await readFile('dist/viajes/'+id+'/index.html','utf8');assert.ok(html.includes('id="cartel"'));assert.ok(html.includes(f.text))}
 const html=await readFile('dist/index.html','utf8');assert.ok(html.includes('id="redes"'));assert.ok(html.includes('id="experiencias"'));assert.ok(html.includes('id="carteles"'));
});
test('Filtros combinados, límite inclusivo y orden cronológico',()=>{
 assert.deepEqual(filterTrips(trips,{destination:'mazatlan',budget:'7500'}).map(t=>t.id),['oceano-palace-marzo-2027']);
 assert.equal(filterTrips(trips,{destination:'mazatlan',budget:'7500',month:'2026-09'}).length,0);
 assert.equal(filterTrips(trips,{budget:'10000'}).some(t=>t.price===10000),true);
 assert.equal(filterTrips(trips,{type:'air'}).length,2);
 const dates=filterTrips(trips).map(t=>t.start);assert.deepEqual(dates,[...dates].sort());
 const prices=filterTrips(trips,{sort:'price'}).map(t=>t.price);assert.deepEqual(prices,[...prices].sort((a,b)=>a-b));
});
test('Registros únicos y duración consistente; ningún dato pendiente se afirma',()=>{
 assert.equal(new Set(trips.map(t=>t.id)).size,trips.length);assert.equal(new Set(destinations.map(t=>t.id)).size,destinations.length);
 for(const t of trips){assert.ok(destinations.some(d=>d.id===t.destination));assert.equal(t.nights,(Date.parse(t.end)-Date.parse(t.start))/86400000);if(['oceano-palace-marzo-2027','grand-decameron-mayo-2027'].includes(t.id)){assert.equal(t.occupancy,'Doble (dos adultos)');assert.equal(t.priceBasis,'Por adulto')}else{assert.equal(t.occupancy,null);assert.equal(t.priceBasis,null)}assert.equal(t.taxes,null)}
});
test('Cotización deriva fechas, destino y precio del registro',()=>{for(const t of trips){const d=destinations.find(d=>d.id===t.destination);const text=quoteText(t,d,{name:'Prueba'});for(const value of [t.id,t.hotel,d.name,range(t),money(t.price),'por confirmar'])assert.ok(text.includes(value))}});
async function files(dir){let out=[];for(const name of await readdir(dir)){const f=path.join(dir,name);if((await stat(f)).isDirectory())out.push(...await files(f));else out.push(f)}return out}
test('Todas las rutas y recursos locales resuelven; HTML y SEO presentes',async()=>{
 const pages=(await files('dist')).filter(f=>f.endsWith('.html'));assert.equal(pages.length,21);const titles=new Set();
 for(const file of pages){const html=await readFile(file,'utf8');assert.equal((html.match(/<h1[ >]/g)||[]).length,1,file);const title=html.match(/<title>(.*?)<\/title>/)[1];assert.ok(!titles.has(title),title);titles.add(title);for(const token of ['name="description"','rel="canonical"','property="og:title"','property="og:description"','property="og:image"','name="robots" content="noindex,nofollow"','lang="es-MX"'])assert.ok(html.includes(token),file+': '+token);
 for(const [,url] of html.matchAll(/(?:href|src)="(\/[^"?]*)[^\"]*"/g)){const clean=url.split('#')[0];if(clean==='/admin/')continue;await stat(path.join('dist',clean,clean.endsWith('/')?'index.html':''))}
 for(const [,json] of html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/g))assert.doesNotThrow(()=>JSON.parse(json));
 }
});
const luminance=hex=>{const c=hex.match(/\w\w/g).map(v=>parseInt(v,16)/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4);return c[0]*.2126+c[1]*.7152+c[2]*.0722};
test('Contraste AA de los pares de texto e interfaz principales',()=>{for(const [fg,bg] of [['0759c7','ffffff'],['092d50','ffffff'],['526576','ffffff'],['526576','eef5fc'],['ffffff','0759c7'],['a12d22','ffffff'],['17344c','ffffff']]){const a=luminance(fg),b=luminance(bg);assert.ok((Math.max(a,b)+.05)/(Math.min(a,b)+.05)>=4.5,fg+'/'+bg)}});
