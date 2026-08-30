import {transform} from "esbuild";
import {readFile} from "node:fs/promises";
import assert from "node:assert/strict";
const {code}=await transform(await readFile(new URL("../lib/program.ts",import.meta.url),"utf8"),{loader:"ts",format:"esm"});
const {program,embedURL}=await import("data:text/javascript;base64,"+Buffer.from(code).toString("base64"));
assert.equal(program.length,4);
assert.equal(new Set(program.map(x=>x.title)).size,4);
for(const p of program){
 assert.ok(p.year>=1980&&p.year<=1989);
 assert.ok(p.albumYear>=1990&&p.albumYear<=1999);
 assert.match(p.video,/^[a-zA-Z0-9_-]{11}$/);
 for(const muted of [true,false]){
  const u=new URL(embedURL(p.albumList,undefined,"https://example.com",muted));
  assert.equal(u.searchParams.get("origin"),"https://example.com");
  assert.equal(u.searchParams.get("loop"),"1");
  assert.equal(u.searchParams.get("autoplay"),"0");
  assert.equal(u.searchParams.get("mute"),muted?"1":"0");
  assert.equal(u.searchParams.get("list"),p.albumList);
 }
 const one=new URL(embedURL(undefined,p.video,"https://example.com",true));
 assert.equal(one.searchParams.get("playlist"),p.video);
 assert.ok(one.pathname.endsWith(p.video));
}
console.log("PASS: four unique pairings, decade ranges, looping playlists, muted cartoons, explicit start, and single-video fallback URLs.");

for(const p of program.slice(1,3)){
 assert.ok(p.cartoonVideos.length>=2);
 assert.equal(p.cartoonList,undefined);
 const u=new URL(embedURL(undefined,p.video,"https://example.com",true,p.cartoonVideos));
 assert.equal(u.searchParams.get("list"),null);
 assert.equal(u.searchParams.get("playlist"),p.cartoonVideos.join(","));
 assert.ok(p.albumBackup&&p.albumBackup!==p.albumList);
}
console.log("PASS: pairings 2 and 3 use explicit full-episode queues and alternative album sources.");
