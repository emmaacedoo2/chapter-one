import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';
import test from 'node:test';
import vm from 'node:vm';

const scripts = ['our-arcade-new-games.js', 'our-arcade.js'].map(file =>
  new vm.Script(readFileSync(new URL('../'+file,import.meta.url),'utf8'),{filename:file}));
const cases = [
  ['fire-water','chapterOneArcadeFireWaterBest'], ['snake','chapterOneArcadeSnakeBest'],
  ['brick-breaker','chapterOneArcadeBrickBreakerBest'], ['jump-heart','chapterOne.arcade.jumpHeart.best'],
  ['basketball','chapterOne.arcade.basketball.best'], ['runner','chapterOne.arcade.runner.best']
];

function cabinet(savedKey) {
  const nodes=new Map(), captures=[], draws=[], writes=new Map([[savedKey,'99']]), frames=new Map();
  let frameId=0, now=100;
  const fakeContext=new Proxy({},{
    get(target,key) { return target[key]??((...coords)=>{
      draws.push([key,target.fillStyle,...coords]);
      return {addColorStop(){}};
    }); }
  });
  class Element {
    constructor() { this.handlers={}; this.dataset={}; this.classList={toggle(){},remove(){}}; }
    addEventListener(name,fn){(this.handlers[name]??=[]).push(fn);}
    dispatch(type,props={}){
      const event={type,button:0,pointerId:1,clientX:0,clientY:0,detail:1,
        target:this,preventDefault(){this.defaultPrevented=true;},...props};
      for(const fn of this.handlers[type]??[])fn(event);
      return event;
    }
    closest(){return null;}
    focus(){}
    appendChild(){}
    getContext(){return fakeContext;}
    getBoundingClientRect(){return {width:320,height:200,left:12,top:24};}
    setPointerCapture(id){captures.push(id);}
    querySelectorAll(){return [];}
  }
  const get=id=>{if(!nodes.has(id))nodes.set(id,new Element());return nodes.get(id);};
  const canvas=get('arcade-canvas');
  canvas.parentElement=get('frame');
  const touch=get('arcade-touch-controls');
  const controls={};
  for(const code of ['KeyD','KeyW','ArrowLeft','ArrowUp','ArrowRight','jump']){
    controls[code]=new Element();
    controls[code].dataset.control=code;
  }
  touch.querySelectorAll=selector=>selector==='button'?Object.values(controls):[];
  const document=Object.assign(new Element(),{
    createElement:()=>new Element(),getElementById:get,querySelector(){return null;}
  });
  const window=Object.assign(new Element(),{
    devicePixelRatio:3,requestAnimationFrame(fn){frames.set(++frameId,fn);return frameId;},
    cancelAnimationFrame:id=>frames.delete(id),
    localStorage:{getItem:key=>writes.get(key),setItem:(key,value)=>writes.set(key,value)}
  });
  const sandbox=vm.createContext({document,window});
  scripts.forEach(script=>script.runInContext(sandbox));
  const app=window.ArcadeApp;
  return {
    app,document,window,canvas,captures,controls,get,writes,frames,
    draw:(op,color)=>draws.findLast(item=>item[0]===op&&item[1]===color)?.slice(2),
    key:code=>document.dispatch('keydown',{code,target:canvas}),
    point(type,x,y,props={}){return canvas.dispatch(type,{clientX:12+x/3,clientY:24+y/3,pointerType:'touch',...props});},
    tick(count){for(let i=0;i<count&&frames.size;i++){
      const [id,fn]=frames.entries().next().value;frames.delete(id);now+=1000/60;draws.length=0;fn(now);
    }}
  };
}

for(const [id,key] of cases)test(id+' lifecycle, saved score, and capped canvas DPR',()=>{
  const c=cabinet(key);
  c.app.launch(id);
  assert.equal(c.app.getSnapshot().animationRunning,false);
  assert.match(String(c.get('arcade-best').textContent),/99/);
  assert.equal(c.canvas.width,640);
  assert.equal(c.canvas.height,400);
  c.point('pointerdown',470,340);
  assert.equal(c.frames.size,1);
  c.tick(3);
  c.document.hidden=true;
  c.document.dispatch('visibilitychange');
  assert.equal(c.app.getSnapshot().paused,true);
  assert.equal(c.frames.size,0);
  c.document.hidden=false;
  c.get('arcade-pause').dispatch('click');
  assert.equal(c.frames.size,1);
  c.get('arcade-restart').dispatch('click');
  assert.equal(c.frames.size,0);
  c.key('Space');
  assert.equal(c.frames.size,1);
  c.get('arcade-return').dispatch('click');
  assert.equal(c.frames.size,0);
  assert.equal(c.document.hidden,false);
  assert.equal(c.writes.get(key),'99');
  c.app.launch(id);
  assert.match(String(c.get('arcade-best').textContent),/99/);
  assert.equal(c.frames.size,0);
});

test('Fire & Water: four captured touches move and jump with both explorers',()=>{
  const c=cabinet(cases[0][1]);
  c.app.launch('fire-water');
  c.key('Space');c.tick(5);
  const fire=c.draw('fillRect','#f17b54'),water=c.draw('fillRect','#62c7e8');
  c.controls.KeyD.dispatch('pointerdown',{pointerId:1});
  c.controls.ArrowRight.dispatch('pointerdown',{pointerId:2});
  c.controls.KeyW.dispatch('pointerdown',{pointerId:3});
  c.controls.ArrowUp.dispatch('pointerdown',{pointerId:4});
  c.tick(7);
  assert.deepEqual(c.captures,[1,2,3,4]);
  assert.ok(c.draw('fillRect','#f17b54')[0]>fire[0]+15);
  assert.ok(c.draw('fillRect','#62c7e8')[0]>water[0]+15);
  assert.ok(c.draw('fillRect','#f17b54')[1]<fire[1]-30);
  assert.ok(c.draw('fillRect','#62c7e8')[1]<water[1]-30);
  c.controls.KeyD.dispatch('pointercancel',{pointerId:1});
  c.controls.ArrowRight.dispatch('lostpointercapture',{pointerId:2});
  const x=c.draw('fillRect','#f17b54')[0];
  c.tick(5);assert.equal(c.draw('fillRect','#f17b54')[0],x);
});

test('Snake: reverse swipe is ignored and vertical swipe takes effect',()=>{
  const c=cabinet(cases[1][1]);c.app.launch('snake');c.key('Space');c.tick(2);
  c.point('pointerdown',460,300);
  c.point('pointermove',330,300);
  c.point('pointerup',310,300);
  c.tick(9);
  const [x,y]=c.draw('fillRect','#90f2d0');
  assert.ok(x>=483);
  c.point('pointerdown',460,300);
  c.point('pointermove',460,170);
  c.point('pointerup',460,160);
  c.tick(9);
  const up=c.draw('fillRect','#90f2d0');
  assert.deepEqual(up.slice(0,2),[x,y-30]);
});

test('Brick Breaker: initial start tap leaves ball at rest, next touch serves and captures paddle',()=>{
  const c=cabinet(cases[2][1]);c.app.launch('brick-breaker');
  c.point('pointerdown',480,400);c.tick(12);
  const [,initialY]=c.draw('arc','#ffffff');
  assert.equal(initialY,528);
  c.point('pointerdown',300,410,{pointerId:11});
  c.point('pointermove',690,420,{pointerId:11});
  c.tick(8);
  assert.ok(c.draw('arc','#ffffff')[1]<initialY);
  assert.ok(Math.abs(c.draw('fillRect','#97dafa')[0]-624)<1e-6);
  assert.deepEqual(c.captures,[11]);
});

test('Basketball: aim and trajectory use board coordinates, then release outside the initial target',()=>{
  const c=cabinet(cases[4][1]);c.app.launch('basketball');c.key('Space');
  c.point('pointerdown',180,440,{pointerId:6});
  c.point('pointermove',88,520,{pointerId:6});
  c.tick(2);
  const dot=c.draw('arc','#8b1e2d');
  assert.ok(dot&&dot[0]>180);
  c.point('pointerup',88,520,{pointerId:6});
  c.tick(10);
  assert.ok(c.draw('arc','#dc844e')[0]>240);
  assert.ok(c.draw('arc','#dc844e')[1]<440);
  assert.deepEqual(c.captures,[6]);
});

test('Jump to My Heart and Endless Runner accept directional controls and isolated jump taps',()=>{
  const heart=cabinet(cases[3][1]);heart.app.launch('jump-heart');heart.key('Space');
  heart.controls.ArrowRight.dispatch('pointerdown',{pointerId:2});
  heart.controls.jump.dispatch('pointerdown',{pointerId:3});
  heart.tick(9);
  assert.ok(heart.draw('fillRect','#e8aab6'));
  assert.deepEqual(heart.captures,[2,3]);

  const runner=cabinet(cases[5][1]);runner.app.launch('runner');
  runner.point('pointerdown',500,380);runner.tick(6);
  assert.equal(runner.draw('fillRect','#242126')[1],537);
  runner.point('pointerdown',500,380);runner.tick(6);
  assert.ok(runner.draw('fillRect','#242126')[1]<500);
});

test('shared expanded mode restores the scroll lock, size and exit after changing stages',()=>{
  const create=()=>{
    const callbacks=new Map(),classes=new Set(),values=new Map();
    return {callbacks, classes, classList:{add:v=>classes.add(v),remove:v=>classes.delete(v)},
      addEventListener:(name,fn)=>callbacks.set(name,fn),
      style:{setProperty:(name,value)=>values.set(name,value),removeProperty:name=>values.delete(name)},
      setAttribute:(name,value)=>values.set(name,value)};
  };
  const stageNames=['arcade-stage','surfers-stage','city-stage'];
  const stages=Object.fromEntries(stageNames.map(id=>{
    const stage=create(),button=create();
    return [id,Object.assign(stage,{button,querySelector:()=>button})];
  }));
  const document=Object.assign(create(),{body:create(),getElementById:id=>stages[id],fullscreenEnabled:false});
  let resized=0, restored=0;
  const window={scrollY:512,matchMedia:()=>({matches:false}),scrollTo:(_,y)=>{restored=y;},dispatchEvent(){resized++;}};
  class MutationObserver {
    constructor(callback){this.callback=callback;}
    observe(stage){stage.mutate=this.callback;}
  }
  vm.runInNewContext(readFileSync(new URL('../arcade-mobile.js',import.meta.url),'utf8'),
    {document,window,MutationObserver,Event});
  for(const id of stageNames){
    const stage=stages[id];
    stage.button.callbacks.get('click')();
    assert.ok(stage.classes.has('arcade-expanded'));
    assert.ok(document.body.classes.has('arcade-scroll-locked'));
    assert.equal(stage.button.textContent,'Exit expanded mode');
    stage.hidden=true;
    stage.mutate();
    assert.equal(stage.classes.has('arcade-expanded'),false);
    assert.equal(document.body.classes.has('arcade-scroll-locked'),false);
    assert.equal(stage.button.textContent,'Expand Game');
  }
  assert.equal(resized,6);
  assert.equal(restored,512);
});
