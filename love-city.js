import {
  actor, advanceCity, chooseVehicle, createCity, finishTutorial, garageNearby, interactCar,
  nearestCar, notify, pauseCity, playCity, resetPosition, spawnVehicle, toPoint
} from './love-city-engine.js';
import { bindCityInput } from './love-city-input.js';
import { EMMA_MESSAGE, MISSIONS, failMission, missionStatus, objective, startMission, updateMission } from './love-city-missions.js';
import { createCityRenderer, drawCityMap } from './love-city-render.js';
import { loadCity, saveCity } from './love-city-save.js';
import { district, GARAGE, TUTORIAL_STOP, VEHICLES } from './love-city-world.js';

const get=id=>document.getElementById(id);
const launch=get('city-launch'), stage=get('city-stage'), lobby=get('arcade-lobby'), canvas=get('city-canvas');
const context=canvas.getContext('2d'), minimap=get('city-minimap');
const overlay=get('city-overlay'), panelBody=get('city-panel-content'), panelActions=get('city-panel-actions');
const positionReset=get('city-footer').querySelector('[data-city="reset"]');
const skip=stage.querySelector('[data-city="skip"]'), interact=stage.querySelector('[data-city="interact"]');
const mapButton=minimap.parentElement;
const holdButtons=stage.querySelectorAll('[data-city-hold]');
const storage=()=>window.localStorage;
if(context) launch.addEventListener('click',openCity);
else { launch.disabled=true; launch.textContent='Canvas unavailable'; }

function openCity() {
  const scope=new AbortController();
  const listen=(target,event,fn)=>target.addEventListener(event,fn,{signal:scope.signal});
  const progress=loadCity(storage);
  const renderer=createCityRenderer(context);
  let sim=createCity(progress), panel='title', frameId=null, last=null, lastMap=-1, lastRevision=-1;
  let zoom=.76, audio=null;
  lobby.hidden=true;
  lobby.classList.add('city-lobby-hidden');
  stage.hidden=false;
  stage.scrollIntoView({block:'nearest'});

  const actions={
    play, pause:togglePause, interact:useContext, map:()=>showMenu('map'),
    missions:()=>showMenu('missions'), garage:()=>showMenu('garage'), controls:()=>showMenu('controls')
  };
  const input=bindCityInput({
    listen, stage, joystick:get('city-joystick'),
    state:()=>({controlling:panel===null,canPlay:panel==='title'||panel==='pause'}),
    actions
  });

  function save() { saveCity(storage,progress); }
  function text(element,value) { if(element.textContent!==value)element.textContent=value; }
  function markerNearby() {return !sim.mission&&sim.tutorial>=4&&MISSIONS.find(m=>toPoint(sim.player,m.marker)<78);}
  function useContext() {
    if(panel!==null)return;
    if(sim.car||nearestCar(sim)){interactCar(sim);refreshHud();return;}
    const marker=markerNearby();
    if(marker){startMission(sim,marker.id);renderer.draw(sim);refreshHud();}
    else if(garageNearby(sim))showMenu('garage');
  }
  function target() {return objective(sim)??(sim.tutorial===3?TUTORIAL_STOP:null);}
  function refreshHud() {
    const a=actor(sim), car=sim.car, m=sim.mission, p=target();
    const stats=[district(a.x,a.y),progress.coins+' hearts',progress.hearts.length+'/10 hidden hearts'];
    if(car)stats.push(Math.round(Math.abs(car.speed)*.235)+' km/h'+(car.speed<-.2?' · R':''),VEHICLES[car.type].name);
    text(get('city-hud'),stats.join(' · '));
    const nearby=!car&&nearestCar(sim), marker=!car&&!nearby&&markerNearby();
    let prompt='';
    if(car)prompt=Math.abs(car.speed)>40 ? 'Brake to exit' : 'Exit car';
    else if(nearby)prompt='Enter car';
    else if(marker)prompt='Start '+marker.name;
    else if(garageNearby(sim))prompt='Open garage';
    interact.hidden=!prompt;
    interact.disabled=car!==null&&Math.abs(car.speed)>40;
    text(interact,prompt);
    for(const button of holdButtons){
      button.hidden=button.dataset.cityHold==='sprint'?Boolean(car):!car;
    }
    skip.hidden=sim.tutorial>=5||Boolean(m);
    text(skip,sim.tutorial===4?'Continue exploring':'Skip tutorial');
    positionReset.hidden=panel!==null;
    const guide=[
      'YOUR FIRST CAR IS RIGHT HERE!\nPRESS E TO ENTER CAR or tap Enter car.',
      'Step 2 of 5 · Accelerate with W, ↑, or the Accelerate pedal.',
      'Step 3 of 5 · While moving, steer with A / D, arrows, or the joystick.',
      'Step 4 of 5 · Follow the gold route to the highlighted overlook.',
      'Step 5 of 5 · You arrived! Continue exploring or open Missions.'
    ];
    const chase=m?.pursuers.length&&m.elapsed<10?' · Stay ahead '+Math.ceil(10-m.elapsed)+'s':'';
    const remaining=m?.remaining!=null?' · '+Math.ceil(m.remaining)+'s':'';
    const detail=m?m.spec.name+' · Objective '+(m.index+1)+'/'+m.spec.stages.length+remaining+chase+'\n'+
      m.spec.stages[m.index].text:guide[sim.tutorial]??(prompt?prompt+' · E or tap':'Free roam · Explore the city or open Missions.');
    text(get('city-objective'),detail+(p?' · '+Math.round(toPoint(a,p))+' m':''));
    text(get('city-notice'),sim.notice);
    if(sim.revision!==lastRevision) {
      lastRevision=sim.revision;
      save();
    }
  }

  function resize() {
    const {width,height}=canvas.getBoundingClientRect();
    if(!width||!height)return;
    const dpr=Math.min(window.devicePixelRatio||1,2);
    canvas.width=Math.round(width*dpr);
    canvas.height=Math.round(height*dpr);
    context.setTransform(canvas.width/width,0,0,canvas.height/height,0,0);
    renderer.resize(width,height);
    renderer.draw(sim);
    drawCityMap(minimap,sim);
  }

  function sound(frequency=480) {
    if(!progress.sound)return;
    try{
      const Audio=window.AudioContext||window.webkitAudioContext;
      if(!audio&&Audio)audio=new Audio();
      if(!audio)return;
      if(audio.state==='suspended')audio.resume().catch(()=>{});
      if(audio.state!=='running')return;
      const now=audio.currentTime, tone=audio.createOscillator(), gain=audio.createGain();
      tone.type='sine';
      tone.frequency.setValueAtTime(frequency,now);
      tone.frequency.exponentialRampToValueAtTime(frequency*1.45,now+.16);
      gain.gain.setValueAtTime(.055,now);
      gain.gain.exponentialRampToValueAtTime(.001,now+.20);
      tone.connect(gain).connect(audio.destination);
      tone.start(now);tone.stop(now+.22);
    }catch{ /* Audio remains optional. */ }
  }

  function stop() {
    if(frameId!==null)cancelAnimationFrame(frameId);
    frameId=last=null;
    input.reset();
  }
  function frame(time) {
    frameId=null;
    const dt=last===null?0:Math.min(.25,Math.max(0,(time-last)/1000));
    last=time;
    const notice=sim.notice, coins=progress.coins, bump=sim.bump;
    advanceCity(sim,dt,input.sample(Boolean(sim.car)),updateMission,objective);
    renderer.draw(sim,dt);
    if(sim.time-lastMap>.13||sim.notice!==notice){drawCityMap(minimap,sim);lastMap=sim.time;}
    if(progress.coins>coins)sound(620);
    else if(!bump&&sim.bump)sound(145);
    refreshHud();
    if(sim.notice===EMMA_MESSAGE&&notice!==sim.notice)showMenu('ending');
    if(panel===null)frameId=requestAnimationFrame(frame);
  }
  function play() {
    if(panel===null)return;
    panel=null;
    playCity(sim);
    drawPanel();
    refreshHud();
    renderer.draw(sim);
    drawCityMap(minimap,sim);
    canvas.focus({preventScroll:true});
    sound(390);
    frameId=requestAnimationFrame(frame);
  }
  function showMenu(name) {
    if(panel==='title')return;
    if(panel===null) {
      pauseCity(sim);
      stop();
    }
    panel=name;
    drawPanel();
  }
  function togglePause() {
    if(panel===null)showMenu('pause');
    else if(panel!=='title')play();
  }
  function leave() {
    stop();save();scope.abort();
    if(audio&&audio.state!=='closed')audio.close().catch(()=>{});
    stage.hidden=true;
    lobby.hidden=false;
    lobby.classList.remove('city-lobby-hidden');
    launch.focus();
  }
  function restart() {
    sim=createCity(progress);
    lastMap=lastRevision=-1;
    renderer.reset();
    play();
  }

  function paragraph(value,parent=panelBody) {
    const p=document.createElement('p');p.textContent=value;parent.append(p);
  }
  function button(label,onClick,{primary=false,disabled=false,parent=panelActions}={}) {
    const el=document.createElement('button');
    el.type='button';el.textContent=label;el.disabled=disabled;
    if(primary){el.className='city-primary';el.dataset.cityDefault='';}
    // Dynamic panel nodes are replaced as a group and own their short-lived handlers.
    el.addEventListener('click',onClick);
    parent.append(el);
    return el;
  }
  function menuRow(title,caption) {
    const row=document.createElement('div'), details=document.createElement('div'), heading=document.createElement('strong');
    row.className='city-menu-row';heading.textContent=title;
    details.append(heading);paragraph(caption,details);
    row.append(details);panelBody.append(row);
    return row;
  }
  function missionsPanel() {
    for(const spec of MISSIONS){
      const status=missionStatus(sim,spec);
      const race=spec.id==='race'&&progress.bestRace?' · Best '+progress.bestRace.toFixed(1)+'s':'';
      const row=menuRow(spec.name+' · '+status,spec.description+' Reward: '+spec.reward+' hearts'+race+'.');
      const label={AVAILABLE:'Start',ACTIVE:'Restart',COMPLETED:'Replay',FAILED:'Retry'}[status];
      const start=button(label,()=>{startMission(sim,spec.id);play();},{parent:row});
      start.setAttribute('aria-label',label+' '+spec.name);
    }
  }
  function garagePanel() {
    const nearby=garageNearby(sim);
    paragraph(progress.coins+' hearts available. Unlocks are saved. Park and exit your car to spawn a selected vehicle.');
    for(const [id,spec] of Object.entries(VEHICLES)){
      const unlocked=progress.unlocked.includes(id), selected=progress.selected===id;
      const row=menuRow(spec.name+(selected?' · Selected':''),spec.shape+' · '+Math.round(spec.max*.235)+
        ' km/h · Accel '+spec.accel+' · Handling '+spec.steer.toFixed(2)+(unlocked?' · Unlocked':' · '+spec.price+' hearts'));
      button(selected?'Selected':unlocked?'Select':'Unlock',()=>{
        if(chooseVehicle(sim,id)){save();sound();drawPanel();}
      },{parent:row,disabled:selected||!nearby||(!unlocked&&progress.coins<spec.price)});
    }
    if(nearby)button('Spawn selected car',()=>{
      if(spawnVehicle(sim)){save();sound();play();}
      else drawPanel();
    },{disabled:Boolean(sim.car)});
    else button('Route to garage',()=>{
      if(sim.mission){notify(sim,'Finish or reset your mission before routing to the garage.');drawPanel();return;}
      sim.freeWaypoint=GARAGE;sim.routeClock=0;play();
    });
    if(sim.notice)paragraph(sim.notice);
  }
  function mapPanel() {
    const map=document.createElement('canvas');
    map.className='city-large-map';map.width=540;map.height=540;
    map.setAttribute('aria-label','Love City district map with roads and waypoint');
    panelBody.append(map);drawCityMap(map,sim,true);
    paragraph('Cream: you · mauve: mission stops and parked cars · gold: waypoint and route.');
    for(const [name,change] of [['Zoom out',-.12],['Zoom in',.12]]){
      button(name,()=>{zoom=Math.max(.5,Math.min(1.24,zoom+change));renderer.setZoom(zoom);renderer.draw(sim);});
    }
  }
  function drawPanel() {
    const active=panel===null;
    overlay.hidden=active;
    mapButton.hidden=!active;
    for(const id of ['city-controls','city-footer','city-objective','city-hud','city-tools'])get(id).hidden=!active;
    panelBody.replaceChildren();panelActions.replaceChildren();
    if(active)return;
    const titles={title:'LOVE CITY\nOPEN WORLD',pause:'Paused',missions:'Missions',garage:'Rose Motor Club',map:'City map',controls:'Controls',ending:'You found Emma'};
    text(get('city-panel-title'),titles[panel]);
    if(panel==='title'){
      paragraph('Your city. Your adventure. Our story.\nPress SPACE or tap to play.');
      button('Play',play,{primary:true}).focus({preventScroll:true});
      button('Exit to Arcade',leave);
      return;
    }
    if(panel==='missions')missionsPanel();
    if(panel==='garage')garagePanel();
    if(panel==='map')mapPanel();
    if(panel==='ending')paragraph(EMMA_MESSAGE);
    if(panel==='controls'){
      paragraph('Desktop\nWASD or arrows to walk, Shift to sprint, E to enter or exit. In a car, W accelerates, S brakes or reverses, A/D steer, and Space is the handbrake. P or Escape pauses. M opens the map.');
      paragraph('Touch\nUse the joystick to walk or steer. Hold Accelerate or Brake / reverse with a second finger. Tap Enter car or Exit car when prompted.');
    }
    const resume=button('Resume',play,{primary:true});
    if(panel==='pause') resume.focus({preventScroll:true});
    else (panelBody.querySelector('button:not(:disabled)')??resume).focus({preventScroll:true});
    if(panel==='pause'){
      button('Restart city',restart);
      button('Controls',actions.controls);
      const toggle=button(progress.sound?'Sound on':'Sound off',()=>{
        progress.sound=!progress.sound;toggle.setAttribute('aria-pressed',String(progress.sound));
        toggle.textContent=progress.sound?'Sound on':'Sound off';save();sound();
      });
      toggle.setAttribute('aria-pressed',String(progress.sound));
      button('Exit to Arcade',leave);
    }
  }

  listen(stage,'click',event=>{
    const value=event.target.closest('[data-city]')?.dataset.city;
    if(value==='reset'){if(sim.mission)failMission(sim,'You reset your position.');resetPosition(sim);renderer.reset();refreshHud();}
    else if(value==='skip'){finishTutorial(sim);sim.routeClock=0;refreshHud();}
    else actions[value]?.();
  });
  listen(overlay,'click',event=>{if(panel==='title'&&!event.target.closest('button'))play();});
  listen(window,'resize',resize);
  listen(window,'blur',()=>{if(panel===null)showMenu('pause');});
  listen(window,'pagehide',()=>{if(panel===null)showMenu('pause');save();});
  listen(document,'visibilitychange',()=>{if(document.hidden&&panel===null)showMenu('pause');});

  drawPanel();resize();
}
