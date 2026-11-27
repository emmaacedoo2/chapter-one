(() => {
  'use strict';
  const $ = id => document.getElementById(id), canvas = $('love-canvas'), ctx = canvas.getContext('2d');
  const stage = $('love-stage'), lobby = $('arcade-lobby'), controls = $('love-controls');
  const keys = new Set(); let game, running = false, paused = false, last = 0, raf = 0, state;
  const read = key => { try { return JSON.parse(localStorage.getItem(key)) || {}; } catch { return {}; } };
  const write = (key, value) => { try { localStorage.setItem(key, JSON.stringify(value)); } catch {} };
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  const rect = (x, y, w, h, color) => { ctx.fillStyle = color; ctx.fillRect(x, y, w, h); };
  function text(value, x, y, size = 24, color = '#fff') { ctx.fillStyle = color; ctx.font = `700 ${size}px sans-serif`; ctx.textAlign = 'center'; ctx.fillText(value, x, y); }
  function heart(x, y, size, color = '#ff557c') { ctx.fillStyle = color; ctx.beginPath(); ctx.moveTo(x, y + size * .45); ctx.bezierCurveTo(x - size, y - size * .1, x - size * .45, y - size * .8, x, y - size * .3); ctx.bezierCurveTo(x + size * .45, y - size * .8, x + size, y - size * .1, x, y + size * .45); ctx.fill(); }
  function reset() {
    keys.clear(); paused = false; running = false; $('love-play').hidden = false; $('love-pause').textContent = 'Pause';
    if (game === 'surfers') state = { dodged: 0, achievements: read('chapterOne.loveSurfers.v1').achievements || {}, savedAchievements: Object.keys(read('chapterOne.loveSurfers.v1').achievements || {}).length, lane: 1, shown: 1, jump: 0, slide: 0, distance: 0, hearts: 0, items: [], spawn: 0, elapsed: 0, sequence: 0, flash: 0, ended: false, best: read('chapterOne.loveSurfers.v1').best || 0 };
    else resetCity();
    draw(); updateHud();
  }
  function surfAction(action) {
    if (!running || paused || state.ended) return;
    if (action === 'left') state.lane = Math.max(0, state.lane - 1);
    if (action === 'right') state.lane = Math.min(2, state.lane + 1);
    if (action === 'up' && !state.jump && !state.slide) state.jump = .85;
    if (action === 'down' && !state.jump && !state.slide) state.slide = .75;
  }
  // Objects travel in metres; projection in drawSurfers never affects collision.
  function updateSurfers(dt) {
    const s = state, previous = s.distance;
    const speed = Math.min(30, 18 + s.elapsed * .08);
    s.elapsed += dt; s.distance += dt * speed;
    s.shown += (s.lane - s.shown) * Math.min(1, dt * 12);
    s.flash = Math.max(0, s.flash - dt);
    s.jump = Math.max(0, s.jump - dt); s.slide = Math.max(0, s.slide - dt);
    // Distances correspond to arrival times, not spawn times. The opening is fixed.
    const opening = [[100,1,'heart'],[115,1,'heart'],[130,1,'heart'],
      [190,0,'heart'],[205,0,'heart'],[220,0,'heart'],[300,2,'block']];
    while (s.sequence < opening.length && opening[s.sequence][0] < s.distance + 110) {
      const [at,lane,type] = opening[s.sequence++]; s.items.push({at,lane,type});
    }
    if (s.sequence === opening.length) { s.nextSpawn = 400; s.sequence++; }
    while (s.sequence > opening.length && s.nextSpawn < s.distance + 110) {
      const n = s.sequence++, type = n % 3 ? 'heart' : (n % 2 ? 'low' : 'high');
      s.items.push({at:s.nextSpawn, lane:Math.floor(Math.random()*3), type});
      s.nextSpawn += type === 'heart' ? 30 : 55;
    }
    for (const item of s.items) {
      // Swept intervals prevent a long frame from skipping the pickup window.
      if (item.at + (item.type === 'heart' ? 8 : 3) < previous ||
          item.at - (item.type === 'heart' ? 8 : 3) > s.distance) continue;
      if (item.lane !== s.lane) continue;
      if (item.type === 'heart') { item.collected = true; s.hearts++; s.flash = .3; }
      else if (item.type === 'block' || (item.type === 'low' && !s.jump) || (item.type === 'high' && !s.slide)) {
        s.ended = true; running = false;
        s.best = Math.max(s.best, Math.floor(s.distance) + s.hearts * 25);
      } else { item.collected = true; s.dodged++; }
    }
    // Count obstacles passed in a different lane too.
    for (const item of s.items) if (item.type !== 'heart' && !item.collected && item.at + 3 < s.distance) { item.collected = true; s.dodged++; }
    s.items = s.items.filter(item => !item.collected && item.at + 8 >= s.distance);
    const unlocked = s.achievements;
    if (s.hearts >= 10) unlocked.hearts10 = true;
    if (s.hearts >= 50) unlocked.hearts50 = true;
    if (s.distance >= 500) unlocked.distance500 = true;
    if (s.dodged >= 20) unlocked.dodged20 = true;
    if (s.ended || Object.keys(unlocked).length !== s.savedAchievements) {
      const progress = read('chapterOne.loveSurfers.v1');
      write('chapterOne.loveSurfers.v1', {...progress, best: Math.max(progress.best || 0, s.best), achievements: unlocked});
      s.savedAchievements = Object.keys(unlocked).length;
    }
  }

  function drawSurfers() {
    const s = state; rect(0, 0, 960, 600, '#f7bdaf'); rect(0, 0, 960, 240, '#b7d9e5');
    ctx.fillStyle = '#ffdfaa'; ctx.beginPath(); ctx.arc(740, 90, 52, 0, Math.PI * 2); ctx.fill();
    for (let i = 0; i < 12; i++) { const x = i * 90 - (s.distance * .12 % 90), h = 75 + (i % 4) * 30; rect(x, 230 - h, 72, h, ['#d58387','#edaaa0','#b77f89'][i % 3]); for (let y = 245 - h; y < 210; y += 25) for (let xx = x + 12; xx < x + 65; xx += 25) rect(xx, y, 9, 12, '#ffe1aa'); }
    // Roadside lights move toward the viewer with the track.
    for (let i=0;i<6;i++) { const z=((i/6+s.distance*.0015)%1), y=230+z*z*370, spread=100+z*z*400; for (const side of [-1,1]) { const x=480+side*spread; rect(x-2,y-35*z,4,35*z,'#64536b'); ctx.fillStyle='#fff0bd';ctx.beginPath();ctx.arc(x,y-35*z,2+4*z,0,7);ctx.fill(); } }
    ctx.fillStyle = '#867d88'; ctx.beginPath(); ctx.moveTo(390, 230); ctx.lineTo(570, 230); ctx.lineTo(920, 600); ctx.lineTo(40, 600); ctx.fill();
    for (let lane = 1; lane < 3; lane++) { ctx.strokeStyle = '#f7d8bf'; ctx.lineWidth = 3; ctx.setLineDash([18, 20]); ctx.lineDashOffset = s.distance * 2; ctx.beginPath(); ctx.moveTo(390 + lane * 60, 230); ctx.lineTo(40 + lane * 880 / 3, 600); ctx.stroke(); } ctx.setLineDash([]);
    ctx.strokeStyle='#f7b0a1';ctx.lineWidth=7;ctx.beginPath();ctx.moveTo(390,230);ctx.lineTo(40,600);ctx.moveTo(570,230);ctx.lineTo(920,600);ctx.stroke();
    for (const o of [...s.items].sort((a,b) => b.at - a.at)) { const z = clamp(1 - (o.at - s.distance) / 110, 0, 1), scale = .25 + z * .85, y = 230 + z * 305, x = 480 + (o.lane - 1) * (60 + z * 205); if (o.type === 'heart') heart(x, y - 25 * scale, 28 * scale); else if (o.type === 'low' || o.type === 'block') { rect(x - 35 * scale, y - 55 * scale, 70 * scale, (o.type === 'block' ? 105 : 55) * scale, '#e67c70'); rect(x - 35 * scale, y - 44 * scale, 70 * scale, 8 * scale, '#ffe4ba'); } else { rect(x - 40 * scale, y - 100 * scale, 8 * scale, 100 * scale, '#795763'); rect(x + 32 * scale, y - 100 * scale, 8 * scale, 100 * scale, '#795763'); rect(x - 40 * scale, y - 100 * scale, 80 * scale, 32 * scale, '#eab070'); } }
    const px = 480 + (s.shown - 1) * 265, lift = s.jump ? Math.sin((.85 - s.jump) / .85 * Math.PI) * 115 : 0, py = 535 - lift;
    ctx.fillStyle = 'rgba(40,30,40,.2)'; ctx.beginPath(); ctx.ellipse(px, 550, 42, 12, 0, 0, Math.PI * 2); ctx.fill();
    const stride = Math.sin(s.distance * .32) * 13; ctx.strokeStyle = '#40334b'; ctx.lineWidth = 10; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(px-9, py-15); ctx.lineTo(px-12+stride, py+12); ctx.moveTo(px+9, py-15); ctx.lineTo(px+12-stride, py+12); ctx.stroke(); rect(px - 20, py - (s.slide ? 30 : 65), 40, s.slide ? 25 : 55, '#be536d'); rect(px-15, py-(s.slide?27:61),30,5,'#f4a3ae'); ctx.fillStyle = '#f6c4a7'; ctx.beginPath(); ctx.arc(px, py - (s.slide ? 38 : 78), 19, 0, 7); ctx.fill();
    if (s.flash) { rect(0, 0, 960, 600, `rgba(255,220,230,${s.flash * .5})`); text('+25 ♡', px, py - 115, 24, '#fff4d8'); }
    if (s.ended) { rect(0, 0, 960, 600, 'rgba(30,20,40,.65)'); text('RUN COMPLETE ♡', 480, 275, 42); text('PRESS SPACE TO PLAY AGAIN  ·  TAP TO PLAY AGAIN', 480, 320, 20); }
  }
  const buildings = [];
  for (let x = 0; x < 5; x++) for (let y = 0; y < 4; y++) { if ((x === 3 && y === 2) || y === 3) continue; buildings.push({ x: x * 400 + 95, y: y * 400 + 95, w: 210, h: 210, district: x < 2 ? 'downtown' : 'residential' }); }
  const missions = [
    { name: 'Delivery Run', start: [200,400], description: 'Drive a delivery to the coast.', points: [[1200,1050]], time: 75, instruction: 'Drive to the pink destination.' },
    { name: 'Street Race', start: [400,400], description: 'Drive through ordered checkpoints.', points: [[400,200],[800,200],[1200,600],[800,1000],[400,1000]], time: 100, instruction: 'Drive through each checkpoint in order.' },
    { name: 'City Escape', start: [800,400], description: 'Escape the pursuing car.', points: [[1200,1050]], time: 65, instruction: 'Drive to the safe spot; avoid the pursuing car.' },
    { name: 'Find Emma', start: [1200,400], description: 'Follow clues to Emma on foot.', points: [[400,600],[800,600],[1200,1050]], time: 110, instruction: 'Find the two clues, then meet Emma by the coast.' }
  ];
  function resetCity() {
    const progress = read('chapterOne.loveCity.v1');
    state = { x: 200, y: 325, angle: 0, cameraX: 200, cameraY: 325, car: null, tutorial: 0, cars: [
      { x: 235, y: 350, angle: 0, speed: 0, type: 'Sports', color: '#ed657b', max: 200, acceleration: 200, steering: 1.5 },
      { x: 300, y: 400, angle: 0, speed: 0, type: 'Compact', color: '#f4b35d', max: 190, acceleration: 200, steering: 1.5 },
      { x: 350, y: 400, angle: 0, speed: 0, type: 'SUV', color: '#6e92a0', max: 165, acceleration: 190, steering: 1.8 }
    ], progress: { coins: progress.coins || 0, completed: progress.completed || [] }, mission: null, statuses: missions.map(() => 'AVAILABLE'), choice: 0, ended: false, touchX: 0, touchY: 0, sprint: false, brake: false, accelerate: false, chase: null, traffic: [{x: 0, y: 365, speed: 70, color: '#e4bb6f'}, {x: 1200, y: 835, speed: -85, color: '#8fb6be'}] };
  }
  function blocked(x,y,r) { return x < r || y < r || x > 2000-r || y > 1600-r || buildings.some(b => x+r > b.x && x-r < b.x+b.w && y+r > b.y && y-r < b.y+b.h); }
  function cityInteract() {
    const s = state; if (!running || paused) return;
    if (s.car) { const c = s.car; for (const side of [1,-1]) { const x = c.x + Math.cos(c.angle + Math.PI/2) * 38 * side, y = c.y + Math.sin(c.angle + Math.PI/2) * 38 * side; if (!blocked(x,y,12)) { s.x=x; s.y=y; s.car=null; return; } } $('love-message').textContent = 'No room to exit here.'; return; }
    const car = [...s.cars].sort((a,b) => Math.hypot(a.x-s.x,a.y-s.y)-Math.hypot(b.x-s.x,b.y-s.y))[0];
    if (car && Math.hypot(car.x-s.x,car.y-s.y) < 100) { s.car = car; if (s.tutorial < 2) s.tutorial = 2; $('love-message').textContent = `Driving ${car.type}.`; return; }
    $('love-message').textContent = 'Walk toward the arrow above the car, then press E.';

  }
  function startMission(index = state.choice) {
    const s = state; if (paused) return;
    if (!running) start();
    if (s.mission && s.mission.status === 'ACTIVE') s.statuses[s.mission.id] = 'AVAILABLE';
    const m = missions[index]; s.choice = index;
    s.mission = { ...m, id: index, status: 'ACTIVE', index: 0, remaining: m.time, elapsed: 0 };
    s.statuses[index] = 'ACTIVE'; s.notice = null;
    s.chase = index === 2 ? { x: s.x-100, y: s.y } : null;
    $('love-message').textContent = `${m.name}: ${m.instruction}`;
    updateMissionPanel(); updateHud();
  }
  function updateMissionPanel() {
    const panel = $('love-missions'); if (!panel || game !== 'city') return;
    panel.querySelectorAll('button').forEach((button, i) => {
      button.nextElementSibling.textContent = state.statuses[i];
    });
  }
  function updateCity(dt) {
    const s = state; if (s.notice) { s.notice.time -= dt; if (s.notice.time <= 0) s.notice = null; }
    const horizontal = Number(keys.has('ArrowRight') || keys.has('KeyD')) - Number(keys.has('ArrowLeft') || keys.has('KeyA')) + s.touchX, vertical = Number(keys.has('ArrowDown') || keys.has('KeyS')) - Number(keys.has('ArrowUp') || keys.has('KeyW')) + s.touchY;
    if (s.car) { const c = s.car; const throttle = s.accelerate ? 1 : -vertical; c.speed += (throttle * c.acceleration - c.speed * .8) * dt; if (s.tutorial === 2 && c.speed > 30) s.tutorial = 3; if (keys.has('Space') || s.brake) { c.speed += (c.speed > 10 ? -450 : -180) * dt; } c.speed = clamp(c.speed,-100,c.max); c.angle += horizontal * dt * c.steering * clamp(Math.abs(c.speed)/80,0,1) * Math.sign(c.speed || 1); const nx=c.x+Math.cos(c.angle)*c.speed*dt, ny=c.y+Math.sin(c.angle)*c.speed*dt; if (!blocked(nx,ny,19) && !s.traffic.some(t => Math.hypot(nx-t.x, ny-t.y)<38)) { c.x=nx; c.y=ny; } else c.speed *= -.25; s.x=c.x; s.y=c.y; }
    else { const len = Math.hypot(horizontal,vertical); if (len > .1) { const speed = (keys.has('ShiftLeft') || keys.has('ShiftRight') || s.sprint) ? 190 : 125, dx=horizontal/Math.max(1,len)*speed*dt, dy=vertical/Math.max(1,len)*speed*dt; if (!blocked(s.x+dx,s.y,12)) s.x+=dx; if (!blocked(s.x,s.y+dy,12)) s.y+=dy; s.angle=Math.atan2(dy,dx); } }
    for (const t of s.traffic) { t.x += t.speed * dt; if (t.x > 1650) t.x = -50; if (t.x < -50) t.x = 1650; }
    if (s.tutorial === 0 && Math.hypot(s.x-s.cars[0].x,s.y-s.cars[0].y) < 100) s.tutorial = 1;
    if (s.tutorial === 3 && Math.hypot(s.x-400,s.y-400) < 65) { s.tutorial = 4; $('love-message').textContent = 'Destination reached! Choose a mission to explore.'; }
    const interact = $('love-interact'); if (interact) { interact.hidden = !s.car && !s.cars.some(c => Math.hypot(c.x-s.x,c.y-s.y)<100); interact.textContent = s.car ? 'EXIT CAR' : 'ENTER CAR'; }
    s.walkPhase = (s.walkPhase || 0) + (Math.hypot(horizontal, vertical) > .1 ? dt * 12 : 0); s.cameraX += (s.x-s.cameraX)*Math.min(1,dt*5); s.cameraY += (s.y-s.cameraY)*Math.min(1,dt*5);
    if (s.mission) { const m=s.mission; m.remaining-=dt; m.elapsed+=dt; if (s.chase) { const dx=s.x-s.chase.x, dy=s.y-s.chase.y, len=Math.hypot(dx,dy)||1; s.chase.x+=dx/len*115*dt; s.chase.y+=dy/len*115*dt; if (len<30) m.remaining=0; }
      const p=m.points[m.index]; if (Math.hypot(s.x-p[0],s.y-p[1])<55 && (m.id===3 || s.car)) { m.index++; if (m.index===m.points.length) { s.progress.coins+=100; if (!s.progress.completed.includes(m.name)) s.progress.completed.push(m.name); write('chapterOne.loveCity.v1',s.progress); m.status='COMPLETED'; s.statuses[m.id]='COMPLETED'; $('love-message').textContent=m.id===3 ? 'You found Emma! Every adventure is better together. +100 hearts ♡' : `${m.name} complete! +100 hearts. Start again to replay.`; s.notice = { text: `${m.name.toUpperCase()} COMPLETE!  +100 ♡`, time: 3 }; s.mission=null; s.chase=null; updateMissionPanel(); } }
      if (s.mission && m.remaining<=0) { m.status='FAILED'; s.statuses[m.id]='FAILED'; $('love-message').textContent=`${m.name} failed. Start again to retry.`; s.mission=null; s.chase=null; updateMissionPanel(); }
    }
  }
  function drawCity() {
    const s=state; rect(0,0,960,600,'#75c9c6'); ctx.save(); ctx.translate(480-s.cameraX,300-s.cameraY);
    rect(0,0,2000,1600,'#e8c99a'); rect(0,0,2000,1380,'#9fc995'); rect(1295,895,210,210,'#78b982'); rect(0,1500,2000,100,'#65bec9');
    for(let x=0;x<=2000;x+=400) rect(x-75,0,150,1600,'#687d7d'); for(let y=0;y<=1600;y+=400) rect(0,y-75,2000,150,'#687d7d');
    ctx.strokeStyle='#eddab1'; ctx.setLineDash([20,18]); ctx.lineWidth=3; for(let x=0;x<=2000;x+=400){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,1600);ctx.stroke();} for(let y=0;y<=1600;y+=400){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(2000,y);ctx.stroke();} ctx.setLineDash([]);
    // Sidewalks and coastal details make the road grid easier to read.
    for (const b of buildings) { rect(b.x-18,b.y-18,b.w+36,b.h+36,'#d9cdb4'); }
    for (let x=120; x<2000; x+=180) { ctx.fillStyle='#6f9874'; ctx.beginPath(); ctx.arc(x,1120,18,0,7); ctx.fill(); ctx.strokeStyle='#9b775b'; ctx.lineWidth=5; ctx.beginPath(); ctx.moveTo(x,1130); ctx.lineTo(x,1105); ctx.stroke(); }
    buildings.forEach((b,i)=>{ rect(b.x-8,b.y+12,b.w+16,b.h,'#688b76'); rect(b.x,b.y,b.w,b.h,'#f1c3a7'); rect(b.x+8,b.y-12,b.w-16,55,['#c87879','#d78f7e','#b67f87'][i%3]); for(let x=b.x+25;x<b.x+b.w-15;x+=45) for(let y=b.y+65;y<b.y+b.h-15;y+=50) rect(x,y,22,26,'#9ac7c4'); });
    missions.forEach((m,i)=>{heart(m.start[0],m.start[1],25,'#e85e7e'); text(String(i+1),m.start[0],m.start[1]+8,18);});
    if(s.tutorial < 2 && !s.car){text('▼',s.cars[0].x,s.cars[0].y-35,30,'#fff36b');} if(s.tutorial === 3){heart(400,400,28,'#ffe44f');} if(s.mission){const p=s.mission.points[s.mission.index]; ctx.strokeStyle='#f74678';ctx.lineWidth=6;ctx.beginPath();ctx.arc(p[0],p[1],35,0,7);ctx.stroke();heart(p[0],p[1],22);}
    for(const c of [...s.cars, ...s.traffic.map(t => ({...t, angle: t.speed > 0 ? 0 : Math.PI}))]){ctx.save();ctx.translate(c.x,c.y);ctx.rotate(c.angle);rect(-24,-11,54,32,'rgba(20,30,40,.25)');rect(-25,-15,50,30,c.color);rect(-10,-12,22,24,'#bce0df');rect(-20,-19,11,5,'#35434d');rect(10,-19,11,5,'#35434d');rect(-20,14,11,5,'#35434d');rect(10,14,11,5,'#35434d');rect(19,-10,5,6,'#fff2c4');rect(19,4,5,6,'#fff2c4');rect(-24,-10,4,6,'#ed7d80');rect(-24,4,4,6,'#ed7d80');ctx.restore();}
    if(s.chase){rect(s.chase.x-20,s.chase.y-13,40,26,'#8e668d');}
    if(!s.car){ctx.strokeStyle='#41374b';ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(s.x-5,s.y+5);ctx.lineTo(s.x-7+Math.sin(s.walkPhase || 0)*5,s.y+15);ctx.moveTo(s.x+5,s.y+5);ctx.lineTo(s.x+7-Math.sin(s.walkPhase || 0)*5,s.y+15);ctx.stroke();ctx.fillStyle='#a94e68';ctx.beginPath();ctx.arc(s.x,s.y,13,0,7);ctx.fill();ctx.fillStyle='#f6c4a7';ctx.beginPath();ctx.arc(s.x+Math.cos(s.angle)*5,s.y+Math.sin(s.angle)*5,7,0,7);ctx.fill();}
    ctx.restore(); if (s.notice) { rect(180,245,600,90,'rgba(35,25,45,.88)'); text(s.notice.text,480,298,25); } if (s.tutorial < 4) text(['YOUR CAR IS RIGHT HERE!','PRESS E TO ENTER','ACCELERATE TO DRIVE FORWARD','FOLLOW THE YELLOW HEART'][s.tutorial],480,65,22,'#fff'); if (s.car) text(`${Math.round(Math.abs(s.car.speed))} MPH`, 85, 575, 22); if (s.mission) { const p=s.mission.points[s.mission.index]; const a=Math.atan2(p[1]-s.y,p[0]-s.x); text(`➤ ${Math.round(Math.hypot(p[0]-s.x,p[1]-s.y))}m`, 480, 35, 20); ctx.save();ctx.translate(405,28);ctx.rotate(a);text('➤',0,0,24);ctx.restore(); } rect(788,15,155,116,'rgba(34,54,58,.75)'); ctx.fillStyle='#d6d3a5';ctx.fillRect(795,22,141,102);ctx.fillStyle='#718786';for(let x=0;x<=5;x++)ctx.fillRect(795+x*28.2-3,22,6,102);for(let y=0;y<=4;y++)ctx.fillRect(795,22+y*25.5-3,141,6);if(s.mission || s.tutorial === 3){const p=s.mission ? s.mission.points[s.mission.index] : [400,400];ctx.fillStyle='#ffdd40';ctx.beginPath();ctx.arc(795+p[0]/2000*141,22+p[1]/1600*102,5,0,7);ctx.fill();} ctx.fillStyle='#ef4b70';ctx.beginPath();ctx.arc(795+s.x/2000*141,22+s.y/1600*102,4,0,7);ctx.fill();
  }
  function draw() { if (!state) return; if(game==='surfers')drawSurfers();else drawCity(); if(!running && !state.ended){rect(0,0,960,600,'rgba(30,20,40,.55)');text(game==='surfers'?'LOVE SURFERS':'LOVE CITY',480,270,44);text('PRESS SPACE TO START  ·  TAP TO START',480,315,22);} if(paused){rect(0,0,960,600,'rgba(30,20,40,.6)');text('PAUSED',480,300,42);} }
  function updateHud() { if(game==='surfers'){const score=Math.floor(state.distance)+state.hearts*25;$('love-hud').textContent=`Score ${score} · Hearts ${state.hearts} · Best ${Math.max(score,state.best)}`;}else{const m=state.mission;$('love-hud').textContent=`♡ ${state.progress.coins} · Missions completed ${state.progress.completed.length}/4 · ${m ? `${m.name}: ${m.index+1}/${m.points.length} · ${Math.ceil(m.remaining)}s` : `Hub selection: ${missions[state.choice].name}`}`;} }
  function frame(t){if(!running || paused)return;const dt=last?Math.min((t-last)/1000,.05):0;last=t;if(game==='surfers')updateSurfers(dt);else updateCity(dt);draw();updateHud();if(running)raf=requestAnimationFrame(frame);}
  function start(){if(state.ended)return;running=true;paused=false;last=0;$('love-play').hidden=true;$('love-pause').textContent='Pause';cancelAnimationFrame(raf);raf=requestAnimationFrame(frame);canvas.focus({preventScroll:true});}
  function togglePause(){if(!running)return;paused=!paused;last=0;keys.clear(); if (game === 'city') { state.touchX=state.touchY=0; state.accelerate=state.brake=state.sprint=false; } $('love-pause').textContent=paused?'Resume':'Pause';if(!paused)raf=requestAnimationFrame(frame);else {cancelAnimationFrame(raf);draw();}}
  function button(label, action, hold=false){const b=document.createElement('button');b.type='button';b.textContent=label;controls.appendChild(b);b.addEventListener('pointerdown',e=>{e.preventDefault();b.setPointerCapture(e.pointerId);action(true);});if(hold){const release=()=>action(false);b.addEventListener('pointerup',release);b.addEventListener('pointercancel',release);b.addEventListener('lostpointercapture',release);}}
  function setupControls(){controls.replaceChildren(); $('love-missions')?.remove(); if(game==='city'){const panel=document.createElement('section');panel.id='love-missions';panel.className='love-missions';const title=document.createElement('h3');title.textContent='MISSIONS';panel.appendChild(title);missions.forEach((m,i)=>{const row=document.createElement('div');const label=document.createElement('span');label.textContent=`${m.name} — ${m.description} `;const startButton=document.createElement('button');startButton.type='button';startButton.textContent='Start';startButton.addEventListener('click',()=>startMission(i));const status=document.createElement('strong');row.append(label,startButton,status);panel.appendChild(row);});controls.before(panel);updateMissionPanel();}if(game==='surfers'){for(const [label,action] of [['←','left'],['→','right'],['Jump','up'],['Slide','down']])button(label,()=>surfAction(action));}else{const joy=document.createElement('div');joy.className='love-joystick';joy.textContent='MOVE';joy.setAttribute('aria-label','Movement joystick');controls.appendChild(joy);let pointer=null;function move(e){const r=joy.getBoundingClientRect();state.touchX=clamp((e.clientX-(r.left+r.width/2))/(r.width/2),-1,1);state.touchY=clamp((e.clientY-(r.top+r.height/2))/(r.height/2),-1,1);}joy.addEventListener('pointerdown',e=>{e.preventDefault();if(pointer!==null)return;pointer=e.pointerId;joy.setPointerCapture(pointer);move(e);});joy.addEventListener('pointermove',e=>{if(e.pointerId===pointer)move(e);});const release=e=>{if(e.pointerId===pointer){pointer=null;state.touchX=state.touchY=0;}};joy.addEventListener('pointerup',release);joy.addEventListener('pointercancel',release);joy.addEventListener('lostpointercapture',release);button('ENTER CAR',cityInteract); controls.lastChild.id='love-interact'; button('Sprint',on=>state.sprint=on,true);button('Accelerate',on=>state.accelerate=on,true);button('Brake / reverse',on=>state.brake=on,true);}}
  document.querySelectorAll('[data-love-game]').forEach(b=>b.addEventListener('click',()=>{game=b.dataset.loveGame;lobby.hidden=true;stage.hidden=false;$('love-title').textContent=game==='surfers'?'Love Surfers':'Love City: Open World';$('love-guide').textContent=game==='surfers'?'Swipe or use arrows / WASD: left, right, jump up, slide down. Space jumps; P pauses.':'WASD / arrows to walk or drive; Shift sprints; E enters or exits a car, or starts a mission at a numbered heart; Space brakes; P pauses. Touch: use the joystick and buttons below.';$('love-message').textContent=game==='city'?'YOUR CAR IS RIGHT HERE! Press E or tap ENTER CAR.':'Dodge low obstacles by jumping and high signs by sliding.';reset();setupControls();}));
  $('love-play').addEventListener('click',start);$('love-pause').addEventListener('click',togglePause);$('love-restart').addEventListener('click',()=>{cancelAnimationFrame(raf);reset();});$('love-back').addEventListener('click',()=>{cancelAnimationFrame(raf);running=false;keys.clear();stage.hidden=true;lobby.hidden=false;});
  document.addEventListener('keydown',e=>{if(stage.hidden || e.target.closest('input, textarea, select, [contenteditable]:not([contenteditable="false"])'))return;if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Space'].includes(e.code))e.preventDefault();if(e.repeat)return;if(e.code==='Space' && (!running && !paused)){if(state.ended)reset();start();return;}if(e.code==='KeyP'||e.code==='Escape'){togglePause();return;}keys.add(e.code);if(game==='surfers'){const a={ArrowLeft:'left',KeyA:'left',ArrowRight:'right',KeyD:'right',ArrowUp:'up',KeyW:'up',Space:'up',ArrowDown:'down',KeyS:'down'}[e.code];if(a)surfAction(a);}else if(e.code==='KeyE')cityInteract();else if(e.code==='KeyM')startMission(state.choice);});document.addEventListener('keyup',e=>keys.delete(e.code));window.addEventListener('blur',()=>{keys.clear();if(running&&!paused)togglePause();});document.addEventListener('visibilitychange',()=>{if(document.hidden&&running&&!paused)togglePause();});
  let swipe=null;canvas.addEventListener('pointerdown',e=>{if(!running && !paused){e.preventDefault();if(state.ended)reset();start();return;}if(game!=='surfers')return;e.preventDefault();swipe={id:e.pointerId,x:e.clientX,y:e.clientY};canvas.setPointerCapture(e.pointerId);});canvas.addEventListener('pointerup',e=>{if(!swipe||swipe.id!==e.pointerId)return;const dx=e.clientX-swipe.x,dy=e.clientY-swipe.y;if(Math.max(Math.abs(dx),Math.abs(dy))>25)surfAction(Math.abs(dx)>Math.abs(dy)?(dx>0?'right':'left'):(dy>0?'down':'up'));swipe=null;});canvas.addEventListener('pointercancel',()=>swipe=null);
  // Explicit test interface: inactive during normal browser play.
  if (globalThis.LOVE_GAMES_TEST) globalThis.LOVE_GAMES_TEST_API = {
    setGame: value => { game = value; }, reset, updateSurfers, updateCity,
    surfAction, cityInteract, startMission, getState: () => state,
    setRunning: value => { running = value; }, missions, blocked, keys
  };
})();
