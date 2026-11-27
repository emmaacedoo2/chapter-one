import { actor, angleDelta, gap, makeCar, notify, toPoint } from './love-city-engine.js';
import { blocked, GARAGE, route } from './love-city-world.js';

export const MISSIONS = [
  {
    id:'delivery', name:'Delivery Run', reward:120, marker:[493,2790], limit:105,
    description:'Pick up a parcel at the garage and deliver it to the marina.',
    stages:[
      { point:[493,2790], radius:48, mode:'foot', text:'On foot, collect the parcel beside the garage.' },
      { mode:'car', text:'Enter a vehicle to start the delivery clock.' },
      { point:[2550,3210], radius:67, mode:'car', text:'Deliver the parcel to the marina entrance.' }
    ]
  },
  {
    id:'race', name:'Street Race', reward:160, marker:[1050,2700], limit:80,
    description:'Drive the coastal circuit through five ordered checkpoints.',
    stages:[
      { point:[1050,2700], radius:67, mode:'car', text:'Drive to the starting line in City Park.' },
      { point:[1800,2700], radius:67, mode:'car', text:'Checkpoint 1 · Park Boulevard' },
      { point:[1800,3500], radius:67, mode:'car', text:'Checkpoint 2 · Coast Road' },
      { point:[2550,3500], radius:67, mode:'car', text:'Checkpoint 3 · Marina junction' },
      { point:[2550,2700], radius:67, mode:'car', text:'Checkpoint 4 · Marina Boulevard' },
      { point:[3400,2700], radius:67, mode:'car', text:'Checkpoint 5 · Beachfront finish' }
    ]
  },
  {
    id:'escape', name:'City Escape', reward:185, marker:[1800,1900], limit:85,
    description:'Trigger a friendly arcade pursuit, open a gap, then reach the safe zone.',
    stages:[
      { point:[1800,1900], radius:70, mode:'car', text:'Drive to the downtown rendezvous to begin the pursuit.' },
      { point:[3400,3500], radius:80, mode:'car', text:'Stay ahead for 10 seconds, then reach the coastal safe zone with a 175 m lead.' }
    ]
  },
  {
    id:'emma', name:'Find Emma', reward:200, marker:[1502,2290],
    description:'Follow three clues from the park to a special meeting on the beach.',
    stages:[
      { point:[1502,2290], radius:58, text:'Find a note at the center of City Park.' },
      { point:[2550,3210], radius:65, text:'“Where the boats come home.” Follow the clue to the marina.' },
      { point:[3400,3500], radius:65, text:'“Where the road meets the sea.” Find the promenade entrance.' },
      { point:[3490,3670], radius:60, text:'Follow the sunset to Emma on the beachfront.' }
    ]
  }
];
export const EMMA_MESSAGE = "No matter where life takes us, I'll always find my way back to you.\nMission completed. Love you, Dom.";

export function missionStatus(s,spec) {
  return s.missionStates[spec.id] ?? (s.progress.completed.includes(spec.name) ? 'COMPLETED' : 'AVAILABLE');
}

export function objective(s) {
  const m=s.mission;
  return m ? (m.spec.stages[m.index]?.point ?? null) : (s.freeWaypoint ?? null);
}

export function startMission(s,id) {
  const spec=MISSIONS.find(m=>m.id===id);
  if (!spec || s.mode==='title') return false;
  if (s.mission) delete s.missionStates[s.mission.spec.id];
  s.freeWaypoint=null;
  s.mission={spec,index:0,elapsed:0,remaining:null,pursuers:[],countdown:0};
  s.missionStates[id]='ACTIVE';
  const a=actor(s);
  s.route=route([a.x,a.y],spec.stages[0].point);
  s.routeClock=.35;
  notify(s,spec.name+' started. '+spec.stages[0].text);
  return true;
}

export function failMission(s,reason) {
  if (!s.mission) return;
  const {spec}=s.mission;
  s.missionStates[spec.id]='FAILED';
  s.mission=null;
  s.route=[];
  s.routeClock=0;
  notify(s,spec.name+' failed. '+reason+' Use Missions to try again.');
}

function complete(s) {
  const {spec,elapsed}=s.mission;
  const p=s.progress;
  p.coins+=spec.reward;
  if (!p.completed.includes(spec.name)) p.completed.push(spec.name);
  if (spec.id==='race' && (!p.bestRace || elapsed<p.bestRace)) p.bestRace=elapsed;
  s.missionStates[spec.id]='COMPLETED';
  s.mission=null;
  s.route=[];
  s.routeClock=0;
  notify(s,spec.id==='emma' ? EMMA_MESSAGE : spec.name+' completed · +'+spec.reward+' hearts.');
}

function movePursuer(car,target,dt) {
  car.refresh-=dt;
  if (car.refresh<=0) {
    car.path=route([car.x,car.y],[target.x,target.y]).slice(1);
    car.refresh=1.2;
  }
  while (car.path.length && toPoint(car,car.path[0])<23) car.path.shift();
  const p=car.path[0];
  if (!p) return;
  const a=Math.atan2(p[1]-car.y,p[0]-car.x);
  car.angle+=angleDelta(a,car.angle)*Math.min(1,dt*10);
  const x=car.x+Math.cos(a)*car.pace*dt,y=car.y+Math.sin(a)*car.pace*dt;
  if (!blocked(x,y,23)) { car.x=x; car.y=y; }
}

export function updateMission(s,dt) {
  const m=s.mission;
  if (!m) return;
  const {spec,index}=m;
  const stage=spec.stages[index];
  const a=actor(s);
  if (m.remaining!==null) {
    m.elapsed+=dt;
    m.remaining-=dt;
    if (m.remaining<=0) return failMission(s,'Time ran out.');
  }
  if (m.pursuers.length) {
    for (const car of m.pursuers) movePursuer(car,a,dt);
    if (m.pursuers.some(car=>gap(car,a)<53)) m.countdown+=dt;
    else m.countdown=Math.max(0,m.countdown-dt*2);
    if (m.countdown>1.4) return failMission(s,'The pursuit cars boxed you in.');
    if (m.elapsed<10 || m.pursuers.some(car=>gap(car,a)<175)) return;
  }
  if ((stage.mode==='car' && !s.car) || (stage.mode==='foot' && s.car)) return;
  if (stage.point && toPoint(a,stage.point)>stage.radius) return;

  m.index++;
  if (m.index===spec.stages.length) return complete(s);
  if ((spec.id==='delivery' && m.index===2) || (spec.id!=='delivery' && spec.limit && m.index===1)) {
    m.remaining=spec.limit;
  }
  if (spec.id==='escape') {
    m.pursuers=[
      {...makeCar('suv',1800,1515,Math.PI/2),pace:188,refresh:0,path:[],pursuit:true},
      {...makeCar('muscle',1420,1900),pace:200,refresh:0,path:[],pursuit:true}
    ];
  }
  s.routeClock=0;
  notify(s,spec.name+' · '+spec.stages[m.index].text);
}

// Markers use walkable access points, including the garage away from the driving lane.
export const LANDMARKS = [{name:'Garage',point:GARAGE}, ...MISSIONS.map(m=>({name:m.name,point:m.marker}))];
