import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {validate} from '../admin-store.mjs';
import {createServer} from '../server.mjs';

test('El panel valida la fuente única y rechaza datos contradictorios',async()=>{
 const content=JSON.parse(await readFile('content.json','utf8'));
 const valid=validate(content);
 assert.equal(valid.trips.length,content.trips.length);
 const duplicate=structuredClone(content);duplicate.trips[1].id=duplicate.trips[0].id;
 assert.throws(()=>validate(duplicate),/repetidos/);
 const badDates=structuredClone(content);badDates.trips[0].end='2020-01-01';
 assert.throws(()=>validate(badDates),/fechas/);
});

test('La administración solo acepta cambios con token local',async t=>{
 const server=createServer(process.cwd());await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));t.after(()=>server.close());
 const address=server.address(),base=`http://127.0.0.1:${address.port}`;
 const read=await fetch(base+'/api/admin/content');assert.equal(read.status,200);const data=await read.json();assert.ok(data.token);assert.ok(data.revision);
 const denied=await fetch(base+'/api/admin/content',{method:'PUT',headers:{'Content-Type':'application/json'},body:'{}'});assert.equal(denied.status,403);
});
