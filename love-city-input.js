const MOVEMENT = new Set(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight',
  'KeyW','KeyA','KeyS','KeyD','ShiftLeft','ShiftRight','Space']);

export function createCityInput() {
  const keys=new Set(), held=new Map();
  let x=0,y=0;
  return {
    keys, held,
    stick(horizontal,vertical) { x=horizontal; y=vertical; },
    clear() { keys.clear(); held.clear(); x=y=0; },
    sample(driving) {
      const down=(...codes)=>codes.some(code=>keys.has(code));
      const touch=action=>[...held.values()].includes(action);
      const left=down('KeyA','ArrowLeft') || touch('left');
      const right=down('KeyD','ArrowRight') || touch('right');
      const up=down('KeyW','ArrowUp'), reverse=down('KeyS','ArrowDown');
      const axis=Math.max(-1,Math.min(1,Number(right)-Number(left)+x));
      return {
        x:axis, y:driving ? 0 : Math.max(-1,Math.min(1,Number(reverse)-Number(up)+y)),
        accelerate:up || touch('accelerate'), brake:reverse || touch('brake'),
        handbrake:down('Space'), sprint:down('ShiftLeft','ShiftRight') || touch('sprint')
      };
    }
  };
}

export function bindCityInput({ listen, stage, joystick, state, actions }) {
  const input=createCityInput();
  let pointer=null;
  const knob=joystick.firstElementChild;
  function position(event) {
    const rect=joystick.getBoundingClientRect(), half=rect.width/2;
    let x=(event.clientX-rect.left-half)/(half*.76);
    let y=(event.clientY-rect.top-rect.height/2)/(half*.76);
    const n=Math.max(1,Math.hypot(x,y));
    x/=n; y/=n;
    const live=Math.hypot(x,y)>.09;
    input.stick(live?x:0,live?y:0);
    knob.style.transform='translate('+x*half*.52+'px,'+y*half*.52+'px)';
  }
  const release=event=>{
    if (event.pointerId!==pointer) return;
    pointer=null;
    input.stick(0,0);
    knob.style.transform='';
  };

  listen(joystick,'pointerdown',event=>{
    if (!state().controlling || pointer!==null) return;
    event.preventDefault();
    pointer=event.pointerId;
    joystick.setPointerCapture(pointer);
    position(event);
  });
  listen(joystick,'pointermove',event=>{ if (event.pointerId===pointer) position(event); });
  for (const name of ['pointerup','pointercancel','lostpointercapture']) listen(joystick,name,release);

  for (const button of stage.querySelectorAll('[data-city-hold]')) {
    listen(button,'pointerdown',event=>{
      if (!state().controlling) return;
      event.preventDefault();
      button.setPointerCapture(event.pointerId);
      input.held.set(event.pointerId,button.dataset.cityHold);
    });
    for (const name of ['pointerup','pointercancel','lostpointercapture']) {
      listen(button,name,event=>input.held.delete(event.pointerId));
    }
  }

  listen(document,'keydown',event=>{
    const {controlling,canPlay}=state();
    if (event.code==='Escape' || event.code==='KeyP') {
      if (!event.repeat) actions.pause();
      event.preventDefault();
      return;
    }
    if (event.code==='Space' && canPlay && !event.target.closest('button:not([data-city-default])')) {
      event.preventDefault();
      if (!event.repeat) actions.play();
      return;
    }
    if (!controlling) return;
    if (event.code==='KeyE') {
      if (!event.repeat) actions.interact();
      event.preventDefault();
    }
    if (event.code==='KeyM' && !event.repeat) actions.map();
    if (!MOVEMENT.has(event.code)) return;
    if (event.code==='Space' && event.target.closest('button')) return;
    event.preventDefault();
    input.keys.add(event.code);
  });
  listen(document,'keyup',event=>input.keys.delete(event.code));

  return {
    sample:input.sample,
    reset() { pointer=null; input.clear(); knob.style.transform=''; }
  };
}
