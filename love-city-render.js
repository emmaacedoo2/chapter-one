import { actor, nearestCar } from './love-city-engine.js';
import { LANDMARKS, objective } from './love-city-missions.js';
import {
  COLS, DISTRICTS, HEARTS, ROAD, ROWS, SHORE, SIZE, TUTORIAL_STOP,
  VEHICLES, gardens, props, solids
} from './love-city-world.js';

const palettes=[
  ['#e7a8a1','#b57288','#f7ccc0'],['#86adb9','#628598','#c5dce0'],
  ['#b999bc','#8b7297','#dec3d5'],['#e4bd99','#ae8c82','#f6ded0'],
  ['#a0bcad','#6c9692','#d1ddd2']
];
const put=(ctx,color,x,y,w,h)=>{ctx.fillStyle=color;ctx.fillRect(x,y,w,h);};
function shape(ctx,color,...points) {
  ctx.fillStyle=color;ctx.beginPath();ctx.moveTo(...points[0]);
  for(let i=1;i<points.length;i++)ctx.lineTo(...points[i]);
  ctx.closePath();ctx.fill();
}
function line(ctx,color,width,...points) {
  ctx.strokeStyle=color;ctx.lineWidth=width;ctx.lineJoin='round';ctx.lineCap='round';
  ctx.beginPath();ctx.moveTo(...points[0]);
  for(let i=1;i<points.length;i++)ctx.lineTo(...points[i]);
  ctx.stroke();
}
function oval(ctx,color,x,y,rx,ry) {
  ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,Math.PI*2);ctx.fillStyle=color;ctx.fill();
}
function round(ctx,color,x,y,w,h,r) {
  ctx.beginPath();ctx.roundRect(x,y,w,h,r);ctx.fillStyle=color;ctx.fill();
}
function label(ctx,text,x,y,size=15,color='#fff5dd',align='center') {
  ctx.font='700 '+size+'px system-ui';ctx.fillStyle=color;ctx.textAlign=align;ctx.fillText(text,x,y);
}
function heart(ctx,x,y,r) {
  ctx.save();ctx.translate(x,y);ctx.scale(r,r);ctx.beginPath();ctx.moveTo(0,.64);
  ctx.bezierCurveTo(-1.25,0,-.84,-.92,0,-.46);
  ctx.bezierCurveTo(.84,-.92,1.25,0,0,.64);
  ctx.fillStyle='#ef6f9a';ctx.fill();ctx.restore();
}
function roads(ctx,bounds,minimap=false) {
  const [left,top,right,bottom]=bounds;
  for(const y of ROWS) {
    if(y+105<top||y-105>bottom)continue;
    put(ctx,minimap?'#bdb4c5':'#d4c5c8',195,y-86,SHORE-400,172);
    put(ctx,minimap?'#6d6980':'#59576a',195,y-ROAD/2,SHORE-400,ROAD);
  }
  for(const x of COLS) {
    if(x+105<left||x-105>right)continue;
    put(ctx,minimap?'#bdb4c5':'#d4c5c8',x-86,195,172,SHORE-400);
    put(ctx,minimap?'#6d6980':'#59576a',x-ROAD/2,195,ROAD,SHORE-400);
  }
  // Repaint all junctions so sidewalks never cross the asphalt.
  for(const x of COLS)for(const y of ROWS) {
    if(x+110<left||x-110>right||y+110<top||y-110>bottom)continue;
    put(ctx,minimap?'#6d6980':'#59576a',x-86,y-66,172,132);
    put(ctx,minimap?'#6d6980':'#59576a',x-66,y-86,132,172);
    if(minimap)continue;
    for(let d=-49;d<=49;d+=14) {
      for(const side of [-1,1]) {
        put(ctx,'#e0d2c8',x+d,y+side*81-5,7,10);
        put(ctx,'#e0d2c8',x+side*81-5,y+d,10,7);
      }
    }
  }
  if(minimap)return;
  for(const y of ROWS) {
    if(y+86<top||y-86>bottom)continue;
    for(let x=Math.max(218,Math.floor(left/46)*46);x<Math.min(right,SHORE-215);x+=46) {
      if(COLS.some(col=>Math.abs(x-col)<110))continue;
      put(ctx,'#dfa984',x,y-1,24,2);
      put(ctx,'#aca4ae',x,y-58,24,1.5);
      put(ctx,'#aca4ae',x,y+58,24,1.5);
    }
  }
  for(const x of COLS) {
    if(x+86<left||x-86>right)continue;
    for(let y=Math.max(218,Math.floor(top/46)*46);y<Math.min(bottom,SHORE-215);y+=46) {
      if(ROWS.some(row=>Math.abs(y-row)<110))continue;
      put(ctx,'#dfa984',x-1,y,2,24);
      put(ctx,'#aca4ae',x-58,y,1.5,24);
      put(ctx,'#aca4ae',x+58,y,1.5,24);
    }
  }
}

function building(ctx,b) {
  const {x,y,w,h,height,kind,seed}=b;
  const [wall,side,roof]=palettes[seed%palettes.length];
  const rx=x-height*.24, ry=y-height;
  shape(ctx,'#44364a35',[x,y+h],[x+w,y+h],[x+w+height*.95,y+h+height*.44],[x+height*.95,y+h+height*.44]);
  shape(ctx,side,[rx+w,ry],[x+w,y],[x+w,y+h],[rx+w,ry+h]);
  shape(ctx,wall,[rx,ry+h],[rx+w,ry+h],[x+w,y+h],[x,y+h]);
  round(ctx,roof,rx,ry,w,h,kind==='tower'?9:5);
  if(kind==='house'){
    shape(ctx,wall,[rx,ry+h*.6],[rx+w*.52,ry+6],[rx+w,ry+h*.6],[rx+w*.52,ry+h-5]);
    line(ctx,'#faf1dc80',3,[rx+w*.52,ry+6],[rx+w*.52,ry+h-5]);
    round(ctx,'#84667b',rx+w*.73,ry+h*.23,12,17,2);
  } else {
    round(ctx,'#fff5de75',rx+8,ry+8,w-16,h-16,6);
    round(ctx,'#748e9c',rx+w*.23,ry+h*.26,w*.40,h*.28,7);
    round(ctx,'#c8dbdc',rx+w*.24,ry+h*.25,w*.39,h*.21,8);
    for(let i=0;i<3;i++) {
      const wx=rx+w*.7+i*9;
      oval(ctx,side,wx,ry+h*.65,4,4);
    }
  }
  for(let row=0;row<(height>45?3:1);row++){
    for(let wx=rx+13;wx<rx+w-15;wx+=24){
      const t=(row+1)/(height>45?4:2);
      round(ctx,row%2?'#72879e':'#fbe1b0',wx+(x-rx)*t,ry+h+height*t-3,11,height>45?6:9,2);
    }
  }
  if(kind==='tower'){
    for(const offset of [.19,.34,.51]) line(ctx,'#f8e6d782',2,[rx+w-4,ry+h*offset],[rx+w+height*.24,ry+h*offset+height]);
  }
  if(kind==='garage'){
    for(let i=0;i<3;i++)round(ctx,'#6d5c6c',x+26+i*80,y+h-11,54,13,3);
  }
  if(kind==='gas'){
    round(ctx,'#799aa0',x-28,y+h+16,w+50,28,7);
    for(let i=0;i<3;i++)round(ctx,'#f6d3b3',x-10+i*52,y+h+36,15,9,3);
  }
  const sign={garage:'ROSE MOTOR CLUB',gas:'SUNSET FUEL',marina:'MARINA CLUB'}[kind];
  if(sign){
    round(ctx,'#5c3b57',rx+8,ry+h-26,w-16,21,4);
    label(ctx,sign,rx+w/2,ry+h-11,12);
  }
}
function tree(ctx,o) {
  const {x,y,kind}=o;
  line(ctx,'#473b5229',6,[x,y],[x+26,y+10]);
  if(kind==='lamp'){
    line(ctx,'#595063',3,[x,y],[x,y-27],[x+8,y-30]);
    oval(ctx,'#ffe2a45c',x+8,y-29,10,6);
    oval(ctx,'#fff3c5',x+8,y-29,5,2);
  }else if(kind==='palm'){
    line(ctx,'#886456',4,[x,y],[x-3,y-13],[x+1,y-35]);
    ctx.save();ctx.translate(x,y-34);
    for(let i=0;i<6;i++){
      ctx.rotate(Math.PI/3);
      ctx.beginPath();ctx.moveTo(0,0);ctx.quadraticCurveTo(11,-9,24,3);
      ctx.quadraticCurveTo(11,-1,0,0);ctx.fillStyle=i%2?'#388b76':'#4e9e83';ctx.fill();
    }
    oval(ctx,'#a47b64',0,0,3,3);ctx.restore();
  }else{
    line(ctx,'#85695f',5,[x,y],[x,y-17]);
    oval(ctx,'#458477',x-6,y-18,16,13);oval(ctx,'#5fa17d',x+6,y-22,14,14);
    oval(ctx,'#8ab68a',x-4,y-26,12,8);
  }
}
function carArt(ctx,car,driven) {
  const {x,y,angle,type}=car, spec=VEHICLES[type];
  ctx.save();ctx.translate(x,y);ctx.rotate(angle);
  const l=spec.length/2,w=spec.width/2, wide=type==='suv', classic=type==='muscle';
  const nose=wide?.79:classic?.83:.67;
  oval(ctx,'#28233747',3,5,l+5,w+3);
  for(const t of [-1,1]) for(const u of [-1,1]) {
    ctx.save();ctx.translate(t*l*.62,u*w);
    if(t===1)ctx.rotate((car.steering??0)*.31);
    round(ctx,'#30283b',-6,-4,13,8,2.5);
    ctx.restore();
  }
  shape(ctx,'#43384d',[-l,-w*.67],[-l*.83,-w],[l*.72,-w],[l,-w*nose],[l,w*nose],[l*.72,w],[-l*.83,w],[-l,w*.67]);
  shape(ctx,car.pursuit?'#856bb7':spec.color,[-l+2,-w*.64],[-l*.8,-w+2],[l*.72,-w+2],[l-2,-w*nose],[l-2,w*nose],[l*.72,w-2],[-l*.8,w-2],[-l+2,w*.64]);
  const cabin=wide?.52:.38;
  shape(ctx,'#38445d',[-l*cabin,-w*.72],[l*.31,-w*.68],[l*.47,-w*.5],[l*.47,w*.5],[l*.31,w*.68],[-l*cabin,w*.72],[-l*.63,w*.49],[-l*.63,-w*.49]);
  shape(ctx,'#9bb7c5',[l*.29,-w*.67],[l*.46,-w*.49],[l*.46,w*.49],[l*.29,w*.67]);
  round(ctx,car.pursuit?'#836cb0':spec.color,-l*cabin,-w*.47,l*(cabin+.23),w*.94,4);
  line(ctx,'#ffffff55',1.5,[l*.53,-w*.62],[l*.83,-w*.52]);
  for(const v of [-1,1]){
    round(ctx,'#fff1b9',l-6,v*w*.66-2,5,5,1.5);
    round(ctx,car.braking?'#ffb0b4':'#ff778a',-l+2,v*w*.58-2,car.braking?7:4,5,1.5);
  }
  if(driven||car.pursuit)shape(ctx,'#ffe9ab24',[l,0],[l+36,-w*1.45],[l+36,w*1.45]);
  if(car.pursuit){round(ctx,'#fabcaa',-5,-8,10,7,2);round(ctx,'#b7e3ed',-5,1,10,7,2);}
  ctx.restore();
}
function pedestrian(ctx,p,emma=false) {
  ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.angle);
  oval(ctx,'#45324c39',2,4,14,12);
  const step=Math.sin(p.stride)*Math.min(7,Math.hypot(p.vx,p.vy)*.055);
  for(const side of [-1,1]){
    round(ctx,'#494459',-6+step*side,side*6-3,12,6,3);
    oval(ctx,'#efbaab',2-step*side,side*12,4,3.5);
  }
  round(ctx,emma?'#d27d9d':'#a14e79',-10,-10,21,20,7);
  oval(ctx,emma?'#7b5261':'#4d3948',5,0,8,8);
  oval(ctx,'#f1c0aa',9,0,5,5);
  ctx.restore();
}
const emmaActor={x:3490,y:3670,angle:-2.1,vx:0,vy:0,stride:0};
function pin(ctx,x,y,time,color='#ffd696') {
  const bob=Math.sin(time*4)*4;
  oval(ctx,'#63395054',x,y,23,12);
  shape(ctx,color,[x-12,y-38+bob],[x+12,y-38+bob],[x,y-23+bob]);
}
function mapScene(ctx,s) {
  put(ctx,'#6eb3ba',0,0,SIZE,SIZE);
  put(ctx,'#ecd2ae',0,0,SHORE,SHORE);
  put(ctx,'#c4cab0',0,0,3540,3540);
  for(const b of gardens)put(ctx,b.kind==='park'?'#91b896':'#c6b7bd',b.x,b.y,b.w,b.h);
  roads(ctx,[0,0,SIZE,SIZE],true);
  for(const b of solids)put(ctx,'#a391a8',b.x,b.y,b.w,b.h);
  if(s.route.length>1)line(ctx,'#ffe1a2',29,...s.route);
  for(const d of DISTRICTS)oval(ctx,'#687f8d',d.x,d.y,34,34);
  for(const l of LANDMARKS)oval(ctx,l.name==='Garage'?'#fbe1ad':'#a9517c',...l.point,45,45);
  const target=objective(s)??(s.tutorial===3?TUTORIAL_STOP:null);
  if(target)oval(ctx,'#fff1aa',...target,69,69);
  for(const car of s.cars)oval(ctx,'#7d668d',car.x,car.y,30,30);
  const a=actor(s), c=s.car?'#ffe1fb':'#fff0df';
  oval(ctx,'#52344c',a.x,a.y,73,73);
  oval(ctx,c,a.x,a.y,48,48);
  line(ctx,c,29,[a.x,a.y],[a.x+Math.cos(a.angle)*107,a.y+Math.sin(a.angle)*107]);
}
export function drawCityMap(canvas,s,large=false) {
  const ctx=canvas.getContext('2d');
  if(!ctx)return;
  const scale=canvas.width/SIZE;
  ctx.setTransform(scale,0,0,canvas.height/SIZE,0,0);
  mapScene(ctx,s);
  if(large) for(const d of DISTRICTS){
    round(ctx,'#4e3957',d.x-265,d.y-45,530,81,30);
    label(ctx,d.name,d.x,d.y+13,48);
  }
}

export function createCityRenderer(ctx) {
  let width=960,height=540,zoom=.76,cameraX=null,cameraY=null,vehicleScale=1;
  function resize(w,h) {width=w;height=h;}
  function setZoom(value) { zoom=value; }
  function reset() { cameraX=cameraY=null; }
  function draw(s,dt=0) {
    const a=actor(s);
    const follow=1-Math.exp(-dt*7.5);
    const lead=s.car?Math.max(-32,Math.min(98,s.car.speed*.25)):0;
    const focusX=a.x+Math.cos(a.angle)*lead,focusY=a.y+Math.sin(a.angle)*lead;
    cameraX=cameraX===null?focusX:cameraX+(focusX-cameraX)*follow;
    cameraY=cameraY===null?focusY:cameraY+(focusY-cameraY)*follow;
    vehicleScale+=( (s.car ? .92 : 1)-vehicleScale)*(dt ? follow : 1);
    const scale=Math.min(1.1,width/710)*zoom*vehicleScale;
    const [left,top,right,bottom]=[cameraX-width/(2*scale),cameraY-height/(2*scale),cameraX+width/(2*scale),cameraY+height/(2*scale)];
    const visible=(x,y,m=80)=>x+m>left&&x-m<right&&y+m>top&&y-m<bottom;
    put(ctx,'#65acb6',0,0,width,height);
    ctx.save();ctx.translate(width/2-cameraX*scale,height/2-cameraY*scale);ctx.scale(scale,scale);
    if(right>SHORE-30||bottom>SHORE-30){
      for(let i=0;i<9;i++){
        const tide=Math.sin(s.time*1.5+i*.7)*12, offset=SHORE+i*46+tide;
        line(ctx,i%3===0?'#d3ede184':'#9bd2ce55',i%3===0?3:2,[offset,0],[offset,SHORE-76],[offset+48,offset],[0,offset]);
      }
    }
    round(ctx,'#efcfad',0,0,SHORE,SHORE,82);
    round(ctx,'#b8c6a8',10,12,3536,3542,52);
    round(ctx,'#e8bfae',3550,150,50,3490,17);
    round(ctx,'#e8bfae',155,3595,3445,45,16);
    line(ctx,'#ffe6c8',3,[160,3618],[3571,3618],[3571,155]);
    for(const b of gardens){
      if(!visible(b.x+b.w/2,b.y+b.h/2,Math.max(b.w,b.h)))continue;
      const color={park:'#88ae8c',garden:'#9eb69b',plaza:'#cec3be',parking:'#b5a6b0',marina:'#b2bdac'}[b.kind];
      round(ctx,color,b.x,b.y,b.w,b.h,17);
      if(b.kind==='park'){
        line(ctx,'#e7dbc2',22,[b.x,b.y+280],[b.x+170,b.y+280],[b.x+275,b.y+330],[b.x+b.w,b.y+330]);
        line(ctx,'#e7dbc2',15,[b.x+275,b.y],[b.x+275,b.y+b.h]);
        oval(ctx,'#d6dcc4',b.x+278,b.y+290,72,59);
        oval(ctx,'#77aeb5',b.x+278,b.y+290,60,47);
        oval(ctx,'#b9d8cd',b.x+278,b.y+290,31,26);
        oval(ctx,'#e2eed5',b.x+278,b.y+286,10,9);
      }
    }
    roads(ctx,[left,top,right,bottom]);
    for(const [x,y] of [[516,2830],[2690,2855],[2830,3250],[1240,1178]]) {
      if(!visible(x,y,380))continue;
      round(ctx,'#8f818f',x-15,y-24,312,54,10);
      for(let i=0;i<6;i++)line(ctx,'#edddcc',2,[x+i*49,y-18],[x+i*49,y+18]);
    }
    for(let i=0;i<5;i++){
      const x=2370+i*184;
      if(!visible(x,3790,210))continue;
      round(ctx,'#a68178',x-11,3690,24,179+i%2*36,6);
      for(let j=0;j<9;j++)put(ctx,'#d5ab8d',x-11,3697+j*18,24,2);
      const drift=Math.sin(s.time*1.7+i)*3, y=3775+i%2*45+drift;
      shape(ctx,'#ece3d6',[x+28,y-47],[x+43,y-21],[x+42,y+34],[x+20,y+37],[x+16,y-19]);
      shape(ctx,'#688eaa',[x+28,y-36],[x+37,y-16],[x+35,y+15],[x+23,y+16],[x+22,y-16]);
    }
    for(let i=0;i<11;i++){
      const x=170+i*332,y=3709+(i%2)*19;
      if(!visible(x,y))continue;
      oval(ctx,'#70576e2a',x+6,y+8,16,7);
      oval(ctx,i%2?'#e69bad':'#9a9ec9',x,y,17,12);
      line(ctx,'#fff0da',2,[x-12,y],[x+12,y]);
    }

    if(s.route.length>1){
      ctx.setLineDash([16,13]);line(ctx,'#ffe0a6b2',6,...s.route);ctx.setLineDash([]);
    }
    HEARTS.forEach(([x,y],i)=>{if(visible(x,y)&&!s.progress.hearts.includes(i))heart(ctx,x,y-6+Math.sin(s.time*3+i)*4,11);});
    for(const m of LANDMARKS){
      if(visible(...m.point))oval(ctx,m.name==='Garage'?'#f8d8999c':'#d38cac8a',...m.point,11,11);
    }
    const actors=[];
    for(const b of solids)if(visible(b.x+b.w/2,b.y+b.h/2,Math.max(b.w,b.h)+b.height))actors.push({y:b.y+b.h,building:b});
    for(const o of props)if(visible(o.x,o.y))actors.push({y:o.y,prop:o});
    for(const cars of [s.traffic,s.cars,s.mission?.pursuers??[]])
      for(const car of cars)if(visible(car.x,car.y))actors.push({y:car.y+10,car});
    if(!s.car)actors.push({y:s.player.y,player:s.player});
    if(s.mission?.spec.id==='emma'&&s.mission.index===3&&visible(3490,3670))actors.push({y:3670,player:emmaActor});
    actors.sort((a,b)=>a.y-b.y);
    for(const o of actors){
      if(o.building)building(ctx,o.building);
      else if(o.prop)tree(ctx,o.prop);
      else if(o.car)carArt(ctx,o.car,o.car===s.car);
      else pedestrian(ctx,o.player,o.player===emmaActor);
    }
    const nearby=!s.car&&nearestCar(s);
    if(nearby)pin(ctx,nearby.x,nearby.y,s.time);
    const waypoint=objective(s)??(s.tutorial===3?TUTORIAL_STOP:null);
    if(waypoint&&visible(...waypoint)){
      const [x,y]=waypoint;
      oval(ctx,'#ffe6a15c',x,y,36+Math.sin(s.time*4)*5,28);
      ctx.strokeStyle='#ffc878';ctx.lineWidth=4;
      ctx.beginPath();ctx.ellipse(x,y,38,29,0,0,Math.PI*2);ctx.stroke();
      pin(ctx,x,y-18,s.time);
      if(s.mission)label(ctx,(s.mission.index+1)+' / '+s.mission.spec.stages.length,x,y+6,16,'#553b52');
    }
    ctx.restore();

    if(s.bump>0){
      ctx.strokeStyle='rgba(241,154,167,'+s.bump*1.5+')';ctx.lineWidth=8;
      ctx.strokeRect(4,4,width-8,height-8);
    }
    if(waypoint){
      const next=s.route.find(p=>Math.hypot(p[0]-a.x,p[1]-a.y)>95)??waypoint;
      const angle=Math.atan2(next[1]-a.y,next[0]-a.x);
      ctx.save();ctx.translate(29,29);oval(ctx,'#432c4cda',0,0,19,19);ctx.rotate(angle);
      shape(ctx,'#ffe1a0',[12,0],[-7,-7],[-4,0],[-7,7]);ctx.restore();
    }
  }
  return {resize,setZoom,reset,draw};
}
