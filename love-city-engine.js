import {
  blocked, GARAGE, HEARTS, HOME, route, TRAFFIC_LOOPS, TUTORIAL_STOP, VEHICLES
} from './love-city-world.js';

export const STEP = 1/120;
export const clamp = (n, min, max) => Math.max(min, Math.min(n, max));
export const gap = (a,b) => Math.hypot(a.x-b.x,a.y-b.y);
export const toPoint = (a,p) => Math.hypot(a.x-p[0],a.y-p[1]);
export const angleDelta = (a,b) => Math.atan2(Math.sin(a-b),Math.cos(a-b));
const toward = (from,to,step) => from + clamp(to-from,-step,step);

export function makeCar(type, x, y, angle = 0) {
  return { type,x,y,angle,speed:0 };
}
export function createCity(progress) {
  const s = {
    mode:'title', progress, time:0, accumulator:0,
    player:{ x:HOME[0],y:HOME[1],vx:0,vy:0,angle:-Math.PI/2,stride:0 },
    cars:[makeCar(progress.selected,357,2734), makeCar('muscle',650,2872),
      makeCar('suv',2780,2915), makeCar('luxury',1280,1164), makeCar('super',3210,3432)],
    traffic:TRAFFIC_LOOPS.flatMap((loop,i) => {
      const type = ['sports','muscle','suv','luxury'][i%4];
      return [
        {...makeCar(type, ...loop[0]), loop, index:1, pace:96+i*7, yield:0},
        {...makeCar(type, ...loop[2],Math.PI), loop, index:3, pace:105+i*6, yield:0}
      ];
    }),
    car:null, tutorial:progress.tutorialDone ? 5 : 0, turnTravel:0,
    notice:'', bump:0, mission:null, missionStates:{}, revision:0, route:[], routeClock:0
  };
  return s;
}
export const actor = s => s.car ?? s.player;
export function playCity(s) {
  if (s.mode === 'title' || s.mode === 'paused') s.mode = 'playing';
}
export function pauseCity(s) {
  if (s.mode === 'playing') {
    s.mode = 'paused';
    s.accumulator = 0;
  }
}
export function notify(s,message) { s.notice = message; s.revision++; }

export function nearestCar(s, radius = 108) {
  let nearest = null, distance = radius;
  for (const car of s.cars) {
    const d = gap(s.player,car);
    if (d < distance) { nearest = car; distance = d; }
  }
  return nearest;
}
function overlapsVehicle(s, x,y,r, ignored) {
  for (const group of [s.cars,s.traffic]) {
    for (const car of group) {
      if (car === ignored) continue;
      if (Math.abs(car.x-x) > 80 || Math.abs(car.y-y) > 80) continue;
      const dx=x-car.x, dy=y-car.y;
      const spec = VEHICLES[car.type], radius = spec.width/2;
      const along = clamp(dx*Math.cos(car.angle)+dy*Math.sin(car.angle),-(spec.length/2-radius),spec.length/2-radius);
      if ((dx-along*Math.cos(car.angle))**2+(dy-along*Math.sin(car.angle))**2 < (radius+r)**2) return true;
    }
  }
  return false;
}

export function interactCar(s) {
  if (s.mode !== 'playing') return false;
  if (!s.car) {
    const car = nearestCar(s);
    if (!car) return false;
    s.car = car;
    s.player.vx = s.player.vy = 0;
    if (s.tutorial === 0) s.tutorial = 1;
    notify(s,'Driving '+VEHICLES[car.type].name+'.');
    return true;
  }
  const car = s.car;
  if (Math.abs(car.speed) > 40) {
    notify(s,'Brake to a stop before exiting.');
    return false;
  }
  for (const offset of [Math.PI/2,-Math.PI/2,Math.PI,0,Math.PI*.75,-Math.PI*.75]) {
    const a=car.angle+offset, x=car.x+Math.cos(a)*57, y=car.y+Math.sin(a)*57;
    if (blocked(x,y,12) || overlapsVehicle(s,x,y,12)) continue;
    Object.assign(s.player,{x,y,angle:a,vx:0,vy:0});
    car.speed = 0;
    s.car = null;
    notify(s,'On foot.');
    return true;
  }
  notify(s,'Move the car into open space before exiting.');
  return false;
}

function walk(s,input) {
  const p=s.player, x=clamp(input.x ?? 0,-1,1), y=clamp(input.y ?? 0,-1,1);
  const length=Math.max(1,Math.hypot(x,y)), speed=input.sprint ? 205 : 137;
  p.vx=toward(p.vx,x*speed/length,980*STEP);
  p.vy=toward(p.vy,y*speed/length,980*STEP);
  const nx=p.x+p.vx*STEP, ny=p.y+p.vy*STEP;
  if (!blocked(nx,p.y,12) && !overlapsVehicle(s,nx,p.y,12)) p.x=nx;
  if (!blocked(p.x,ny,12) && !overlapsVehicle(s,p.x,ny,12)) p.y=ny;
  if (Math.hypot(x,y) > .08) p.angle+=angleDelta(Math.atan2(y,x),p.angle)*Math.min(1,STEP*22);
  p.stride+=Math.hypot(p.vx,p.vy)*STEP*.083;
}

function drive(s,input) {
  const c=s.car, spec=VEHICLES[c.type];
  if (input.handbrake) c.speed=toward(c.speed,0,540*STEP);
  else if (input.brake) c.speed=toward(c.speed,-spec.max*.28,(c.speed>0?570:spec.accel*.6)*STEP);
  else if (input.accelerate) c.speed=toward(c.speed,spec.max,spec.accel*STEP);
  else c.speed=toward(c.speed,0,(57+Math.abs(c.speed)*.09)*STEP);
  const steer=clamp(input.x ?? 0,-1,1);
  const turn=steer*spec.steer*clamp(Math.abs(c.speed)/72,0,1)*
    (1-.4*Math.abs(c.speed)/spec.max)*Math.sign(c.speed)*STEP;
  const a=c.angle+turn, dx=Math.cos(a), dy=Math.sin(a);
  const x=c.x+dx*c.speed*STEP, y=c.y+dy*c.speed*STEP;
  const r=spec.width/2, axis=spec.length/2-r;
  let clear=true;
  for (const offset of [-axis,0,axis]) {
    const px=x+offset*dx, py=y+offset*dy;
    if (blocked(px,py,r) || overlapsVehicle(s,px,py,r,c)) { clear=false; break; }
  }
  if (clear) Object.assign(c,{x,y,angle:a});
  else {
    if (Math.abs(c.speed)>50 && s.bump===0) s.bump=.32;
    c.speed *= -.16;
  }

  if (s.tutorial===1 && input.accelerate && c.speed>55) s.tutorial=2;
  else if (s.tutorial===2 && clear) {
    s.turnTravel+=Math.abs(turn);
    if (s.turnTravel>.30) s.tutorial=3;
  } else if (s.tutorial===3 && toPoint(c,TUTORIAL_STOP)<75) s.tutorial=4;
}

function advanceTraffic(s) {
  for (const car of s.traffic) {
    if (car.yield>0) car.yield=Math.max(0,car.yield-STEP);
    const p=car.loop[car.index], d=toPoint(car,p);
    if (d < 14) car.index=(car.index+1)%car.loop.length;
    const next=car.loop[car.index];
    const angle=Math.atan2(next[1]-car.y,next[0]-car.x);
    const nextX=car.x+Math.cos(angle)*car.pace*STEP;
    const nextY=car.y+Math.sin(angle)*car.pace*STEP;
    const near=gap(car,actor(s));
    // Yield briefly at cross traffic, then proceed once the intersection clears.
    const conflict=s.traffic.some(other=>other!==car && Math.abs(other.x-nextX)<58 &&
      Math.abs(other.y-nextY)<58 && gap(car,other)<58 &&
      Math.cos(angle)*(other.x-car.x)+Math.sin(angle)*(other.y-car.y)>16 &&
      (other.yield===0 || s.traffic.indexOf(other)<s.traffic.indexOf(car)));
    if (conflict) car.yield=.18;
    const pace=car.yield>0 ? 0 : near<88 ? .34 : 1;
    if (!overlapsVehicle(s,nextX,nextY,17,car)) {
      car.angle+=angleDelta(angle,car.angle)*STEP*11;
      car.x+=(nextX-car.x)*pace;
      car.y+=(nextY-car.y)*pace;
    } else if (near>150) {
      // Recover from a prolonged parked-car obstruction at the previous loop junction.
      car.stall=(car.stall??0)+STEP;
      if (car.stall>5) {
        const previous=car.loop[(car.index+car.loop.length-1)%car.loop.length];
        [car.x,car.y]=previous;
        car.stall=0;
      }
    }
  }
}

export function resetPosition(s) {
  if (s.car) s.car.speed=0;
  s.car=null;
  const safe = [HOME,[450,2779],[480,2769],[405,2805]]
    .find(([x,y])=>!blocked(x,y,12)&&!overlapsVehicle(s,x,y,12));
  Object.assign(s.player,{ x:(safe??HOME)[0],y:(safe??HOME)[1],vx:0,vy:0 });
  if (s.tutorial<4) {
    const starter=s.cars[0];
    Object.assign(starter,makeCar(starter.type,357,2734));
    s.tutorial=0;
    s.turnTravel=0;
  }
  notify(s,'Returned to the garage sidewalk.');
}
export function finishTutorial(s) {
  s.tutorial=5;
  s.progress.tutorialDone=true;
  notify(s,'Free roam unlocked. Open Missions whenever you’re ready.');
}
export function garageNearby(s) { return toPoint(actor(s),GARAGE)<210; }
export function chooseVehicle(s,type) {
  const spec=VEHICLES[type];
  if (!spec || !garageNearby(s)) return false;
  const p=s.progress;
  if (!p.unlocked.includes(type)) {
    if (p.coins<spec.price) return false;
    p.coins-=spec.price;
    p.unlocked.push(type);
  }
  p.selected=type;
  notify(s,spec.name+' selected. Use Spawn selected car at the garage.');
  return true;
}
export function spawnVehicle(s) {
  if (!garageNearby(s) || s.car) return false;
  const slots=[[545,2829],[605,2829],[665,2829],[725,2829],[785,2829]];
  const free=slots.find(([x,y])=>!overlapsVehicle(s,x,y,34) && toPoint(s.player,[x,y])>42);
  if (!free) { notify(s,'Garage bays are full. Move a vehicle out first.'); return false; }
  const prior=s.cars.find(car=>car.garageSpawn);
  if (prior) s.cars.splice(s.cars.indexOf(prior),1);
  s.cars.push({...makeCar(s.progress.selected,...free,-Math.PI/2),garageSpawn:true});
  notify(s,VEHICLES[s.progress.selected].name+' is ready in the garage bays.');
  return true;
}

export function advanceCity(s, seconds, input={}, updateMission=()=>{}, objective=()=>null) {
  if (s.mode!=='playing' || !Number.isFinite(seconds)) return;
  s.accumulator+=clamp(seconds,0,.25);
  while (s.accumulator+1e-10>=STEP) {
    s.accumulator-=STEP;
    s.time+=STEP;
    s.bump=Math.max(0,s.bump-STEP);
    if (s.car) drive(s,input); else walk(s,input);
    advanceTraffic(s);
    const a=actor(s);
    HEARTS.forEach((heart,i)=>{
      if (toPoint(a,heart)<28 && !s.progress.hearts.includes(i)) {
        s.progress.hearts.push(i);
        s.progress.coins+=25;
        notify(s,'Hidden heart found · +25 hearts');
      }
    });
    updateMission(s,STEP);
    if(s.freeWaypoint&&toPoint(a,s.freeWaypoint)<75){
      s.freeWaypoint=null;
      s.routeClock=0;
      notify(s,'Garage reached.');
    }
    s.routeClock-=STEP;
    if (s.routeClock<=0) {
      const target=objective(s) ?? (s.tutorial===3 ? TUTORIAL_STOP : null);
      s.route=target?route([a.x,a.y],target):[];
      s.routeClock=.35;
    }
  }
}
