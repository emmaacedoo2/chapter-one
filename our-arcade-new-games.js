/* The three cabinets share the arcade's canvas and animation loop. */
window.createChapterArcadeGame = (id, best, saveBest) => {
  const W = 960, H = 600;
  let score, ended, player, platforms, camera, maxHeight, obstacles, distance, timer, ball, aim, shot, scored, resetDelay;
  const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
  function record() { if (score > best) { best = score; saveBest(best); } }
  function resetBall() { ball = { x: 180, y: 440, vx: 0, vy: 0, r: 20 }; shot = false; scored = false; resetDelay = 0; aim = null; }
  function launchVelocity(x, y) {
    const dx = ball.x - x, dy = ball.y - y, length = Math.hypot(dx, dy);
    if (length < 8) return null;
    const power = clamp(length * 7, 300, 950);
    return { x: dx / length * power, y: dy / length * power };
  }
  function reset() {
    score = 0; ended = false;
    if (id === 'jump-heart') {
      player = { x: 480, y: 480, vy: -690, r: 20 };
      platforms = [{ x: 410, y: 520, w: 140 }];
      camera = 0; maxHeight = 0;
      while (platforms[platforms.length - 1].y > -300) addPlatform();
    } else if (id === 'runner') {
      player = { x: 150, y: 500, vy: 0, w: 44, h: 50 };
      obstacles = []; distance = 0; resetDelay = 1.8;
    } else { timer = 60; resetBall(); }
  }
  function addPlatform() {
    const last = platforms[platforms.length - 1];
    // At this jump speed even the highest gap is comfortably reachable.
    const gap = 85 + Math.random() * 25;
    const width = Math.max(100, 145 - maxHeight / 150);
    platforms.push({ x: clamp(last.x + (Math.random() - 0.5) * 240, 20, W - width - 20), y: last.y - gap, w: width });
  }
  function jump() { if (id === 'runner' && player.y >= 500 && !ended) player.vy = -720; }
  function update(dt, keys, elapsed = dt) {
    if (ended) return;
    if (id === 'jump-heart') {
      player.x = clamp(player.x + (Number(keys.has('ArrowRight') || keys.has('KeyD')) - Number(keys.has('ArrowLeft') || keys.has('KeyA'))) * 330 * dt, player.r, W - player.r);
      const oldBottom = player.y + player.r;
      player.vy += 1200 * dt; player.y += player.vy * dt;
      if (player.vy > 0) {
        const landing = platforms.find(p => oldBottom <= p.y && player.y + player.r >= p.y && player.x + player.r > p.x && player.x - player.r < p.x + p.w);
        if (landing) { player.y = landing.y - player.r; player.vy = -690; }
      }
      camera = Math.min(camera, player.y - 240);
      maxHeight = Math.max(maxHeight, 480 - player.y); score = Math.floor(maxHeight / 10); record();
      while (platforms[platforms.length - 1].y > camera - 150) addPlatform();
      platforms = platforms.filter(p => p.y < camera + H + 50);
      if (player.y - camera > H + 30) ended = true;
    } else if (id === 'runner') {
      const speed = Math.min(520, 300 + distance / 180);
      distance += speed * dt; score = Math.floor(distance / 10); record();
      player.vy += 1700 * dt; player.y = Math.min(500, player.y + player.vy * dt);
      if (player.y === 500) player.vy = 0;
      resetDelay -= dt;
      if (resetDelay <= 0) { obstacles.push({ x: W + 30, w: 30 + Math.random() * 18, h: 42 + Math.random() * 22 }); resetDelay = 1.5 + Math.random() * 0.6; }
      obstacles.forEach(o => { o.x -= speed * dt; if (player.x + player.w - 6 > o.x && player.x + 6 < o.x + o.w && player.y + player.h > 550 - o.h + 5) ended = true; });
      obstacles = obstacles.filter(o => o.x + o.w > 0);
    } else {
      timer = Math.max(0, timer - elapsed);
      if (!timer) { ended = true; return; }
      if (shot) {
        const oldY = ball.y, oldX = ball.x;
        resetDelay += dt;
        ball.vy += 700 * dt; ball.x += ball.vx * dt; ball.y += ball.vy * dt;
        // Score only when the ball crosses the rim downwards between its posts.
        if (!scored && ball.vy > 0 && oldY < 300 && ball.y >= 300) {
          const crossingX = oldX + (ball.x - oldX) * (300 - oldY) / (ball.y - oldY);
          if (crossingX >= 700 && crossingX <= 760) { score += 2; record(); scored = true; resetDelay = 0; }
        }
        // The rim posts and backboard can deflect the ball.
        for (const x of [680, 780]) {
          const dx = ball.x - x, dy = ball.y - 300, d = Math.hypot(dx, dy);
          if (d < ball.r + 5 && d > 0) { const nx = dx / d, ny = dy / d, dot = ball.vx * nx + ball.vy * ny; if (dot < 0) { ball.vx -= 1.5 * dot * nx; ball.vy -= 1.5 * dot * ny; } ball.x = x + nx * (ball.r + 5); ball.y = 300 + ny * (ball.r + 5); }
        }
        if (ball.x + ball.r > 810 && ball.x < 830 && ball.y > 190 && ball.y < 300 && ball.vx > 0) { ball.x = 810 - ball.r; ball.vx *= -0.65; }
        if (ball.y > 620 || ball.x < -50 || ball.x > 1000 || (scored && resetDelay > 1.8) || resetDelay > 5) resetBall();
      }
    }
  }
  function background(c) {
    c.fillStyle = '#faf8f5'; c.fillRect(0, 0, W, H);
    c.strokeStyle = '#f1dce0'; c.lineWidth = 2;
    for (let i = 0; i < 5; i++) { c.beginPath(); c.moveTo(0, 0); c.lineTo(150, i * 40); c.stroke(); }
    c.fillStyle = '#efcbd1'; c.font = '28px sans-serif'; c.fillText('♥', 900, 55);
  }
  function heart(c, x, y) { c.fillStyle = '#8b1e2d'; c.beginPath(); c.moveTo(x, y + 18); c.bezierCurveTo(x - 42, y - 8, x - 18, y - 30, x, y - 10); c.bezierCurveTo(x + 18, y - 30, x + 42, y - 8, x, y + 18); c.fill(); }
  function draw(c) {
    background(c);
    if (id === 'jump-heart') {
      platforms.forEach(p => { c.fillStyle = '#242126'; c.fillRect(p.x + 4, p.y - camera + 5, p.w, 16); c.fillStyle = '#e8aab6'; c.fillRect(p.x, p.y - camera, p.w, 16); });
      heart(c, player.x, player.y - camera);
    } else if (id === 'runner') {
      c.fillStyle = '#242126'; c.fillRect(0, 550, W, 5);
      obstacles.forEach(o => { c.fillStyle = '#8b1e2d'; c.fillRect(o.x, 550 - o.h, o.w, o.h); c.fillStyle = '#efcbd1'; c.fillRect(o.x + 6, 556 - o.h, o.w - 12, 5); });
      heart(c, player.x + 22, player.y + 20); c.fillStyle = '#242126'; c.fillRect(player.x + 9, player.y + 37, 8, 13); c.fillRect(player.x + 28, player.y + 37, 8, 13);
    } else {
      c.fillStyle = '#242126'; c.fillRect(810, 185, 12, 155); c.fillStyle = '#fff'; c.fillRect(814, 190, 50, 100);
      c.strokeStyle = '#8b1e2d'; c.lineWidth = 8; c.beginPath(); c.moveTo(680, 300); c.lineTo(780, 300); c.stroke();
      c.strokeStyle = '#d7a7af'; c.lineWidth = 3; c.beginPath(); c.moveTo(685, 305); c.lineTo(700, 350); c.lineTo(760, 350); c.lineTo(775, 305); c.moveTo(710, 305); c.lineTo(720, 350); c.moveTo(750, 305); c.lineTo(740, 350); c.stroke();
      if (aim && !shot) {
        const velocity = launchVelocity(aim.x, aim.y);
        if (velocity) {
          c.fillStyle = '#8b1e2d';
          for (let t = 0.1; t <= 1.5; t += 0.1) {
            const x = ball.x + velocity.x * t, y = ball.y + velocity.y * t + 350 * t * t;
            if (x > W || y > H) break;
            c.beginPath(); c.arc(x, y, 4, 0, Math.PI * 2); c.fill();
          }
        }
      }
      if (scored) { c.fillStyle = '#8b1e2d'; c.font = 'bold 34px sans-serif'; c.fillText('NICE SHOT! +2 ♥', 570, 155); }
      c.fillStyle = '#dc844e'; c.beginPath(); c.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2); c.fill(); c.strokeStyle = '#603329'; c.lineWidth = 2; c.beginPath(); c.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2); c.moveTo(ball.x - 20, ball.y); c.lineTo(ball.x + 20, ball.y); c.moveTo(ball.x, ball.y - 20); c.lineTo(ball.x, ball.y + 20); c.stroke();
    }
  }
  reset();
  return { reset, update, draw, handleKey(code) { if (code === 'Space' || code === 'ArrowUp') jump(); }, jump,
    pointerDown(x, y) { if (id === 'basketball' && !shot && Math.hypot(x - ball.x, y - ball.y) < 65) { aim = { x: ball.x, y: ball.y, startX: x, startY: y }; return true; } return false; },
    pointerMove(x, y) { if (aim) { aim.x = ball.x + x - aim.startX; aim.y = ball.y + y - aim.startY; } },
    pointerUp(x, y) { if (!aim) return; const velocity = launchVelocity(ball.x + x - aim.startX, ball.y + y - aim.startY); if (velocity) { ball.vx = velocity.x; ball.vy = velocity.y; shot = true; } aim = null; },
    cancelPointer() { aim = null; },
    canAim() { return id === 'basketball' && !shot && !ended; },
    state: () => ({ ended, won: false }),
    stats: () => ({ score, best, extra: id === 'basketball' ? Math.ceil(timer) + ' sec' : '♥', status: id === 'basketball' ? 'Drag back from the ball and release to shoot. Each basket is worth 2 points.' : id === 'runner' ? 'Jump over the obstacles!' : 'Keep climbing!' })
  };
};
