const test=require("node:test");
const assert=require("node:assert/strict");
const fs=require("node:fs");
const vm=require("node:vm");

function workerHarness(fetchImpl){
 const listeners={};const data=new Map([["pave-static-v1",new Map([["https://pave.test/old",new Response("old")]])],["unrelated-cache",new Map([["https://pave.test/private",new Response("keep")]])]]);
 const caches={
  async open(name){if(!data.has(name))data.set(name,new Map());const store=data.get(name);return{
   async addAll(paths){for(const path of paths)store.set(new URL(path,"https://pave.test").href,new Response("precache:"+path))},
   async match(request){return store.get(typeof request==="string"?new URL(request,"https://pave.test").href:request.url)},
   async keys(){return [...store.keys()].map(url=>({url}))},
   async put(request,response){store.set(request.url,response)},
  }},
  async match(request){for(const cache of data.values()){const value=cache.get(new URL(request,"https://pave.test").href);if(value)return value}},
  async keys(){return [...data.keys()]},async delete(name){return data.delete(name)},
 };
 const self={location:new URL("https://pave.test/service-worker.js"),clients:{claim:async()=>{}},skipWaiting:async()=>{},addEventListener(name,fn){listeners[name]=fn}};
 vm.runInNewContext(fs.readFileSync("public/service-worker.js","utf8"),{self,caches,fetch:fetchImpl,URL,Response,Promise});
 return {listeners,caches,data};
}
function sendFetch(listeners,path,mode="cors",method="GET"){
 let responsePromise,responded=false;
 listeners.fetch({request:{url:new URL(path,"https://pave.test").href,method,mode},respondWith(value){responded=true;responsePromise=value}});
 return {responded,get response(){return responsePromise}};
}

test("worker migrates old static assets then removes only obsolete PAVEPADI caches",async()=>{
 const h=workerHarness(async()=>new Response("online"));
 let installWait;h.listeners.install({waitUntil(value){installWait=value}});await installWait;
 const cache=h.data.get("pave-static-v2");
 assert.ok(cache.has("https://pave.test/offline.html"));
 assert.ok(cache.has("https://pave.test/icons/pave-192.png"));assert.ok(cache.has("https://pave.test/icons/pave-512-maskable.png"));
 let activation;h.listeners.activate({waitUntil(value){activation=value}});await activation;
 assert.deepEqual([...h.data.keys()].sort(),["pave-static-v2","unrelated-cache"]);
 assert.equal(await (await h.caches.match("https://pave.test/old")).text(),"old");
 assert.equal(await (await h.caches.match("https://pave.test/private")).text(),"keep");
});

test("network navigation passes through; failed navigation gets the offline fallback",async()=>{
 let online=true;const h=workerHarness(async()=>{if(!online)throw new Error("offline");return new Response("fresh app")});let installWait;h.listeners.install({waitUntil(value){installWait=value}});await installWait;
 const nav=sendFetch(h.listeners,"/wallet","navigate");
 assert.equal((await nav.response).status,200);assert.equal(await (await nav.response).text(),"fresh app");
 online=false;const offline=sendFetch(h.listeners,"/wallet","navigate");
 const offlineResponse=await offline.response;assert.equal(await offlineResponse.text(),"precache:/offline.html");
});

test("only same-origin static build assets enter Cache Storage",async()=>{
 const h=workerHarness(async request=>{const r=new Response("asset:"+request.url);Object.defineProperty(r,"type",{value:"basic"});return r});
 const asset=sendFetch(h.listeners,"/assets/app-hash.js");
 assert.equal(asset.responded,true);assert.equal(await (await asset.response).text(),"asset:https://pave.test/assets/app-hash.js");
 assert.ok(h.data.get("pave-static-v2").has("https://pave.test/assets/app-hash.js"));
 for(const path of ["/api/wallet","/api/transactions","https://api.pave.test/private"]){
  const request={url:path.startsWith("https:")?path:new URL(path,"https://pave.test").href,method:"GET",mode:"cors"};
  let responded=false;h.listeners.fetch({request,respondWith(){responded=true}});assert.equal(responded,false,path);
 }
 const post=sendFetch(h.listeners,"/assets/write.js","cors","POST");assert.equal(post.responded,false);
});
