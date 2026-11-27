const fs=require('fs'),vm=require('vm'),assert=require('assert');
const elements={};function el(id){return elements[id] ||= {hidden:false,textContent:'',dataset:{},children:[],className:'',appendChild(x){this.children.push(x)},append(...x){this.children.push(...x)},replaceChildren(){this.children=[]},before(){},remove(){},querySelectorAll(){return []},addEventListener(){},getContext(){return new Proxy({},{get:(o,k)=>o[k]||(()=>{})})},focus(){},setAttribute(){}}}
const document={getElementById:el,querySelectorAll(){return []},createElement(){return el(Math.random())},addEventListener(){}};
const store={};const context={document,window:{addEventListener(){}},localStorage:{getItem:k=>store[k],setItem:(k,v)=>store[k]=v},requestAnimationFrame:()=>1,cancelAnimationFrame(){},Math,console};
context.LOVE_GAMES_TEST=true;
vm.runInNewContext(fs.readFileSync('love-games.js','utf8'),context); const t=context.LOVE_GAMES_TEST_API;
t.setGame('surfers');t.reset();t.setRunning(true);let s=t.getState();const pickup={lane:1,at:1,type:'heart'};s.items=[pickup];t.updateSurfers(.1);assert.equal(s.hearts,1);assert(s.distance+s.hearts*25>25);assert(!s.items.includes(pickup));
s.items=[{lane:1,at:s.distance+1,type:'low'}];s.jump=.8;t.updateSurfers(.1);assert(!s.ended);t.reset();assert.equal(t.getState().hearts,0);assert.equal(t.getState().items.length,0);
t.setGame('city');t.reset();t.setRunning(true);s=t.getState();for(let i=0;i<4;i++){t.startMission(i);assert.equal(s.mission.status,'ACTIVE');assert(el('love-message').textContent.includes(t.missions[i].name));const m=s.mission;assert(!t.blocked(...m.points[0],12));if(i!==3){s.car=s.cars[0]}else{s.car=null} for(const p of m.points){s.x=p[0];s.y=p[1];if(s.car){s.car.x=p[0];s.car.y=p[1];s.car.speed=0}t.updateCity(0)}assert.equal(s.mission,null);assert.equal(s.statuses[i],'COMPLETED');t.startMission(i);assert.equal(s.mission.status,'ACTIVE');s.mission=null;}
assert.equal(s.progress.coins,400);console.log('Runner collection, avoidance and reset; four mission progressions, rewards and replay: passed');

t.setGame('surfers'); t.reset(); t.setRunning(true); s=t.getState();
t.surfAction('left'); assert.equal(s.lane,0); t.surfAction('up'); assert(s.jump>0);
s.items=[{lane:0,at:s.distance+1,type:'low'}]; s.shown=0; t.updateSurfers(.01); assert(!s.ended);
s.jump=0; t.surfAction('down'); assert(s.slide>0); s.items=[{lane:0,at:s.distance+1,type:'high'}]; t.updateSurfers(.01); assert(!s.ended);
t.reset(); assert.equal(t.getState().lane,1);
t.setGame('city'); t.reset(); t.setRunning(true); s=t.getState();
assert(!t.blocked(s.x,s.y,12)); assert(Math.hypot(s.x-s.cars[0].x,s.y-s.cars[0].y)<100);
t.cityInteract(); assert.equal(s.car,s.cars[0]);
t.keys.add('KeyW'); t.updateCity(.1); assert(s.car.speed>0); t.keys.add('KeyD'); const angle=s.car.angle; t.updateCity(.1); assert(s.car.angle>angle);
t.keys.delete('KeyW'); t.keys.delete('KeyD'); t.keys.add('Space'); const speed=s.car.speed; t.updateCity(.1); assert(s.car.speed<speed); t.keys.clear();
const parked=s.car; t.cityInteract(); assert.equal(s.car,null); assert(!t.blocked(s.x,s.y,12)); assert(s.cars.includes(parked));
console.log('Lane, jump, slide, first car, driving, braking and safe exit: passed');

// Collision and achievements must depend on world position, not drawn pixels.
t.setGame('surfers'); t.reset(); t.setRunning(true); s=t.getState();
s.items=[{lane:1,at:1,type:'block'}]; t.updateSurfers(.1); assert(s.ended);
t.reset(); t.setRunning(true); s=t.getState(); s.hearts=9; s.items=[{lane:1,at:1,type:'heart'}]; t.updateSurfers(.1); assert(s.achievements.hearts10); assert(JSON.parse(store['chapterOne.loveSurfers.v1']).achievements.hearts10);
t.setGame('city'); t.reset(); t.setRunning(true); s=t.getState(); t.startMission(1); t.updateCity(0); assert.equal(s.mission.index,0); assert.equal(s.progress.coins,400);
console.log('World collision, persistent achievements and objective gating: passed');
