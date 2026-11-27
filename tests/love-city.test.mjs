import test from 'node:test';
import assert from 'node:assert/strict';
import {
  actor, advanceCity, angleDelta, createCity, gap, interactCar, nearestCar, pauseCity, playCity, resetPosition
} from '../love-city-engine.js';
import { blocked, HOME, NODES, route, solids } from '../love-city-world.js';
import { loadCity } from '../love-city-save.js';

const progress = () => loadCity(() => ({getItem: () => null}));
const city = () => { const s=createCity(progress()); playCity(s); return s; };
function tick(s,seconds,input={},fps=60, update, target) {
  for (let i=0;i<Math.round(seconds*fps);i++) advanceCity(s,1/fps,input,update,target);
}

test('safe sidewalk spawn, nearby starter entry, no interaction when far away',()=>{
  const s=city();
  assert.deepEqual([s.player.x,s.player.y],HOME);
  assert.equal(blocked(...HOME,12),false);
  assert.equal(nearestCar(s),s.cars[0]);
  assert.ok(gap(s.player,s.cars[0])<65);
  assert.equal(interactCar(s),true);
  assert.equal(actor(s),s.cars[0]);
  assert.equal(s.tutorial,1);
  assert.equal(interactCar(s),true);
  assert.equal(s.car,null);
  Object.assign(s.player,{x:1800,y:1900});
  assert.equal(interactCar(s),false);
});

test('drive, steer, handbrake, reverse and safe exit at multiple frame rates',()=>{
  for (const fps of [30,60,120]) {
    const s=city();
    interactCar(s);
    const car=s.car;
    tick(s,1,{accelerate:true},fps);
    assert.ok(car.speed>200);
    assert.ok(car.x>450);
    assert.equal(s.tutorial,2);
    tick(s,.35,{accelerate:true,x:-1},fps);
    assert.ok(car.angle<-.3);
    assert.equal(s.tutorial,3);
    assert.equal(interactCar(s),false);
    tick(s,1,{handbrake:true},fps);
    assert.equal(car.speed,0);
    tick(s,.45,{brake:true},fps);
    assert.ok(car.speed<0);
    tick(s,.6,{handbrake:true},fps);
    const {x,y}=car;
    assert.equal(interactCar(s),true);
    assert.equal(blocked(s.player.x,s.player.y,12),false);
    assert.deepEqual([car.x,car.y],[x,y]);
  }
});

test('walking respects building collision, pause freezes motion, reset is safe',()=>{
  const s=city();
  const b=solids[0];
  Object.assign(s.player,{x:b.x-30,y:b.y+b.h/2});
  tick(s,1,{x:1,sprint:true});
  assert.ok(s.player.x<=b.x-12);
  const x=s.player.x;
  pauseCity(s);
  tick(s,2,{x:-1});
  assert.equal(s.player.x,x);
  playCity(s);
  tick(s,.6,{x:-1});
  assert.ok(s.player.x<x-30);
  resetPosition(s);
  assert.equal(blocked(s.player.x,s.player.y,12),false);
  assert.ok(nearestCar(s));
});

test('every intersection connects on drivable segments',()=>{
  for (const goal of NODES) {
    const points=route(NODES[0],goal);
    for (let i=1;i<points.length;i++) {
      const a=points[i-1], b=points[i], d=Math.hypot(a[0]-b[0],a[1]-b[1]);
      for (let t=0;t<=1;t+=1/Math.max(1,Math.ceil(d/40))) {
        assert.equal(blocked(a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t,24),false);
      }
    }
  }
});

import { MISSIONS, EMMA_MESSAGE, missionStatus, objective, startMission, updateMission } from '../love-city-missions.js';
import { chooseVehicle, spawnVehicle } from '../love-city-engine.js';
import { GARAGE, HEARTS, VEHICLES } from '../love-city-world.js';
import { SAVE_KEY, saveCity } from '../love-city-save.js';

const missionTick = (s,seconds,input={}) => tick(s,seconds,input,60,updateMission,objective);
function place(a,[x,y]) { Object.assign(a,{x,y,speed:0,vx:0,vy:0}); }

test('all four missions start with active objectives and usable navigable destinations',()=>{
  for (const spec of MISSIONS) {
    const s=city();
    assert.equal(missionStatus(s,spec),'AVAILABLE');
    assert.equal(startMission(s,spec.id),true);
    assert.equal(missionStatus(s,spec),'ACTIVE');
    assert.deepEqual(objective(s),spec.stages[0].point);
    assert.deepEqual(s.route.at(-1),objective(s));
    for (const stage of spec.stages.filter(stage=>stage.point)) {
      assert.equal(blocked(...stage.point,24),false, spec.name+' '+stage.text);
      const path=route(stage.point,NODES[0]);
      for (let i=1;i<path.length;i++) {
        for(let t=0;t<=1;t+=.025) {
          const [x,y]=path[i-1], [tx,ty]=path[i];
          assert.equal(blocked(x+(tx-x)*t,y+(ty-y)*t,16),false, spec.name+' '+stage.text);
        }
      }
    }
  }
  for (const point of HEARTS) assert.equal(blocked(...point,12),false);
});

test('delivery requires collecting on foot, entering a car and driving to the marina',()=>{
  const s=city();
  const [spec]=MISSIONS;
  startMission(s,'delivery');
  interactCar(s);
  place(s.car,spec.stages[0].point);
  missionTick(s,.1);
  assert.equal(s.mission.index,0);
  interactCar(s);
  place(s.player,[450,2790]);
  missionTick(s,.7,{x:1});
  assert.equal(s.mission.index,1);
  place(s.player,HOME);
  s.cars[0].x=357; s.cars[0].y=2734;
  interactCar(s);
  missionTick(s,.1);
  assert.equal(s.mission.index,2);
  assert.ok(s.mission.remaining>100);
  place(s.car,[2550,3060]);
  s.car.angle=Math.PI/2;
  missionTick(s,1.1,{accelerate:true});
  assert.equal(missionStatus(s,spec),'COMPLETED');
  assert.equal(s.progress.coins,spec.reward);
});

test('race checkpoints are ordered, timer failure is replayable, and best race is saved',()=>{
  const s=city(), spec=MISSIONS[1];
  interactCar(s);
  startMission(s,'race');
  place(s.car,spec.stages[2].point);
  missionTick(s,.1);
  assert.equal(s.mission.index,0);
  place(s.car,spec.stages[0].point);
  missionTick(s,.1);
  assert.equal(s.mission.index,1);
  s.mission.remaining=.03;
  missionTick(s,.1);
  assert.equal(missionStatus(s,spec),'FAILED');
  assert.equal(s.progress.coins,0);
  startMission(s,'race');
  for (const stage of spec.stages) {
    place(s.car,stage.point);
    missionTick(s,.18);
  }
  assert.equal(missionStatus(s,spec),'COMPLETED');
  assert.ok(s.progress.bestRace>0);
  assert.equal(s.progress.coins,spec.reward);
});

test('pursuit cars move, enforce capture and escape conditions, and pay a reward',()=>{
  const s=city(), spec=MISSIONS[2];
  interactCar(s);
  startMission(s,'escape');
  place(s.car,spec.stages[0].point);
  missionTick(s,.05);
  const p=s.mission.pursuers[0], y=p.y;
  missionTick(s,.5);
  assert.ok(p.y>y);
  place(s.car,spec.stages[1].point);
  missionTick(s,.2);
  assert.equal(missionStatus(s,spec),'ACTIVE');
  missionTick(s,10);
  assert.equal(missionStatus(s,spec),'COMPLETED');
  assert.equal(s.progress.coins,spec.reward);

  startMission(s,'escape');
  place(s.car,spec.stages[0].point);
  missionTick(s,5);
  assert.equal(missionStatus(s,spec),'FAILED');
});

test('Find Emma supports walking, requires clues in order, and shows the requested ending',()=>{
  const s=city(), spec=MISSIONS[3];
  startMission(s,'emma');
  place(s.player,spec.stages.at(-1).point);
  missionTick(s,.1);
  assert.equal(s.mission.index,0);
  for (const stage of spec.stages) {
    place(s.player,stage.point);
    missionTick(s,.1);
  }
  assert.equal(s.notice,EMMA_MESSAGE);
  assert.equal(missionStatus(s,spec),'COMPLETED');
  assert.ok(s.progress.coins>=spec.reward);
});

test('garage purchase, spawn, collectibles and legacy progress persist safely',()=>{
  const values=new Map([[SAVE_KEY,JSON.stringify({coins:145,completed:['Find Emma'],legacy:true})]]);
  const storage=()=>({getItem:k=>values.get(k),setItem:(k,v)=>values.set(k,v)});
  const s=createCity(loadCity(storage));
  playCity(s);
  assert.equal(chooseVehicle(s,'super'),false);
  assert.equal(chooseVehicle(s,'suv'),true);
  assert.equal(s.progress.coins,145-VEHICLES.suv.price);
  assert.equal(chooseVehicle(s,'suv'),true);
  assert.equal(spawnVehicle(s),true);
  assert.equal(s.cars.at(-1).type,'suv');
  place(s.player,HEARTS[0]);
  missionTick(s,1);
  assert.equal(s.progress.coins,50);
  assert.equal(chooseVehicle(s,'sports'),false);
  saveCity(storage,s.progress);
  const next=loadCity(storage);
  assert.equal(next.selected,'suv');
  assert.deepEqual(next.unlocked,['sports','suv']);
  assert.deepEqual(next.completed,['Find Emma']);
  assert.equal(next.legacy,true);
  assert.equal(createCity(next).cars[0].type,'suv');
  assert.doesNotThrow(()=>saveCity(()=>{throw Error('denied');},next));
});

import { createCityInput } from '../love-city-input.js';
test('independent touch pointers allow steering and acceleration together',()=>{
  const input=createCityInput(), s=city();
  interactCar(s);
  input.stick(-.65,0);
  input.held.set(2,'accelerate');
  tick(s,.65,input.sample(true));
  assert.ok(s.car.speed>100);
  assert.ok(s.car.angle<-.35);
  input.held.delete(2);
  input.held.set(3,'brake');
  tick(s,.6,input.sample(true));
  assert.ok(s.car.speed<0);
  input.clear();
  assert.equal(input.sample(true).x,0);
  assert.equal(input.sample(true).brake,false);
});

test('continuous physics inputs can complete the full race circuit',()=>{
  const s=city();
  s.traffic.length=0; // Isolate track geometry and steering from traffic scheduling tests.
  interactCar(s);
  const c=s.car;
  startMission(s,'race');

  for(let frame=0;frame<60*85&&s.mission;frame++){
    const p=objective(s);
    const range=Math.hypot(p[0]-c.x,p[1]-c.y);
    const error=angleDelta(Math.atan2(p[1]-c.y,p[0]-c.x),c.angle);
    const desiredSpeed=Math.abs(error)>.35 ? 62 : range<150 ? 108 : 255;
    const steer=Math.max(-1,Math.min(1,error*3));
    advanceCity(s,1/60,{
      accelerate:c.speed<desiredSpeed-5,
      handbrake:c.speed>desiredSpeed+13,
      x:steer
    },updateMission,objective);
  }

  assert.equal(missionStatus(s,MISSIONS[1]),'COMPLETED');
  assert.ok(s.progress.bestRace<80);
  assert.equal(s.progress.coins,MISSIONS[1].reward);
});

test('road traffic follows moving lanes, including turns, without blocking mission stops',()=>{
  const s=city();
  const before=s.traffic.map(car=>[car.x,car.y,car.index]);
  tick(s,45,{},30);
  assert.ok(s.traffic.filter((car,i)=>Math.hypot(car.x-before[i][0],car.y-before[i][1])>200).length>=8);
  assert.ok(s.traffic.some((car,i)=>car.index!==before[i][2]));
  for(const car of s.traffic)assert.equal(blocked(car.x,car.y,17),false);
});

import { createCityRenderer, drawCityMap } from '../love-city-render.js';
import { finishTutorial } from '../love-city-engine.js';
import { TUTORIAL_STOP } from '../love-city-world.js';

test('tutorial only advances after entry, acceleration, steering and arrival',()=>{
  const s=city();
  tick(s,1,{accelerate:true});
  assert.equal(s.tutorial,0);
  interactCar(s);
  tick(s,1,{x:1});
  assert.equal(s.tutorial,1);
  tick(s,1,{accelerate:true});
  assert.equal(s.tutorial,2);
  tick(s,.24,{accelerate:true,x:-1});
  assert.equal(s.tutorial,3);
  assert.equal(s.progress.tutorialDone,false);
  for(let frame=0;frame<400 && s.tutorial<4;frame++){
    const c=s.car;
    const error=angleDelta(Math.atan2(TUTORIAL_STOP[1]-c.y,TUTORIAL_STOP[0]-c.x),c.angle);
    advanceCity(s,1/60,{x:Math.max(-1,Math.min(1,error*3)),accelerate:c.speed<125,handbrake:c.speed>144});
  }
  assert.equal(s.tutorial,4);
  finishTutorial(s);
  assert.equal(s.progress.tutorialDone,true);
  assert.equal(createCity(s.progress).tutorial,5);
});

test('Canvas drawing passes work at portrait and landscape sizes and map renders its route',()=>{
  const calls=new Map();
  const ctx=new Proxy({},{
    get(target,key) {
      return target[key]??(()=>{
        calls.set(key,(calls.get(key)??0)+1);
      });
    }
  });
  const canvas={width:540,height:540,getContext:()=>ctx}, s=city();
  const renderer=createCityRenderer(ctx);
  renderer.resize(390,480);
  renderer.draw(s,1/60);
  startMission(s,'emma');
  renderer.resize(780,230);
  renderer.setZoom(.88);
  renderer.draw(s,1/60);
  drawCityMap(canvas,s,true);
  assert.ok(calls.get('roundRect')>20);
  assert.ok(calls.get('fillText')>=6);
  assert.ok(calls.get('setLineDash')>=2);
  assert.ok(calls.get('ellipse')>20);
});

import { bindCityInput } from '../love-city-input.js';
test('controller event wiring captures two touch pointers and consumes Space without a handbrake',()=>{
  const handlers=new Map();
  const documentStub={};
  const listen=(target,name,fn)=>{
    if(!handlers.has(target))handlers.set(target,{});
    handlers.get(target)[name]=fn;
  };
  const held=[];
  const joystick={
    firstElementChild:{style:{}},
    getBoundingClientRect:()=>({left:10,top:20,width:100,height:100}),
    setPointerCapture:id=>held.push(id)
  };
  const pedal={dataset:{cityHold:'accelerate'},setPointerCapture:id=>held.push(id)};
  let controlling=false, played=0, interacted=0;
  const before=globalThis.document;
  globalThis.document=documentStub;
  try{
    const input=bindCityInput({
      listen,stage:{querySelectorAll:()=>[pedal]},joystick,
      state:()=>({controlling,canPlay:!controlling}),
      actions:{play(){played++;controlling=true;},interact(){interacted++;}}
    });
    const key=code=>({code,repeat:false,target:{closest:()=>null},preventDefault(){}});
    const event=handlers.get(documentStub);
    event.keydown(key('Space'));
    assert.equal(played,1);
    assert.equal(input.sample(true).handbrake,false);
    event.keydown(key('KeyE'));
    event.keydown({...key('KeyE'),repeat:true});
    assert.equal(interacted,1);
    handlers.get(joystick).pointerdown({pointerId:10,clientX:22,clientY:70,preventDefault(){}});
    handlers.get(pedal).pointerdown({pointerId:11,preventDefault(){}});
    assert.deepEqual(held,[10,11]);
    assert.equal(input.sample(true).x,-1);
    assert.equal(input.sample(true).accelerate,true);
    handlers.get(joystick).lostpointercapture({pointerId:10});
    assert.equal(input.sample(true).x,0);
    assert.equal(input.sample(true).accelerate,true);
    handlers.get(pedal).pointercancel({pointerId:11});
    assert.equal(input.sample(true).accelerate,false);
  }finally{
    if(before===undefined)delete globalThis.document;
    else globalThis.document=before;
  }
});
