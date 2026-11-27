import {
  ACHIEVEMENTS, POWERS, act, advance, coaching, createRun, loadProgress,
  pause, recordRun, saveProgress, score, start
} from './love-surfers-engine.js';
import { createRenderer } from './love-surfers-render.js';

const get = id => document.getElementById(id);
const launch = get('surfers-launch');
const stage = get('surfers-stage');
const lobby = get('arcade-lobby');
const canvas = get('surfers-canvas');
const overlay = get('surfers-overlay');
const controls = get('surfers-controls');
const buttons = Object.fromEntries([...stage.querySelectorAll('[data-surf]')].map(button => [button.dataset.surf, button]));
const ctx = canvas.getContext('2d');
const storage = () => window.localStorage;

const keys = {
  ArrowLeft: 'left', KeyA: 'left', ArrowRight: 'right', KeyD: 'right',
  ArrowUp: 'jump', KeyW: 'jump', Space: 'jump', ArrowDown: 'slide', KeyS: 'slide'
};

if (ctx) launch.addEventListener('click', open);
else {
  launch.disabled = true;
  launch.textContent = 'Canvas unavailable';
}

function open() {
  const scope = new AbortController();
  const listen = (target, event, handler) => target.addEventListener(event, handler, { signal: scope.signal });
  const renderer = createRenderer(ctx);
  const progress = loadProgress(storage);
  let run = createRun(), frameId = null, last = null, gesture = null;
  let audio = null, sound = Boolean(progress.sound);
  let lastHud = '', lastHint = '';

  lobby.hidden = true;
  lobby.classList.add('surfers-lobby-hidden');
  stage.hidden = false;
  stage.scrollIntoView({ block: 'nearest' });

  function resize() {
    const { width, height } = canvas.getBoundingClientRect();
    if (!width || !height) return;
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    ctx.setTransform(canvas.width / width, 0, 0, canvas.height / height, 0, 0);
    renderer.resize(width, height);
    renderer.draw(run);
  }

  function stopClock() {
    if (frameId !== null) cancelAnimationFrame(frameId);
    frameId = last = null;
    gesture = null;
  }

  function persistRun() {
    recordRun(run, progress);
    saveProgress(storage, progress);
  }

  function updateHud() {
    const powers = [];
    for (const key of ['magnet', 'double']) {
      if (run[key] > 0) powers.push(POWERS[key] + ' ' + Math.ceil(run[key]) + 's');
    }
    if (run.shield) powers.push('Shield · one hit');
    const hud = [Math.floor(run.distance) + ' m', run.hearts + ' hearts', score(run) + ' pts',
      'Best ' + Math.max(score(run), progress.best), ...powers].join(' · ');
    if (hud !== lastHud) {
      lastHud = hud;
      get('surfers-hud').textContent = hud;
    }
    const hint = run.mode === 'running' ? coaching(run) : '';
    if (hint !== lastHint) {
      lastHint = hint;
      get('surfers-coaching').textContent = hint;
    }
  }

  function screen() {
    const { mode } = run;
    const playing = mode === 'running';
    overlay.hidden = playing;
    controls.hidden = buttons.pause.hidden = !playing;
    updateHud();
    if (playing) return;
    get('surfers-screen').textContent = { title: 'LOVE SURFERS', paused: 'Paused', over: 'Run complete' }[mode];
    get('surfers-summary').textContent = mode === 'title'
      ? 'Run, collect hearts & beat your record.\nPress SPACE or tap to play'
      : mode === 'paused' ? 'Pick up where you left off.'
        : score(run) + ' points · ' + Math.floor(run.distance) + ' m · ' + run.hearts +
          ' hearts\nPersonal best: ' + progress.best;
    buttons.play.textContent = { title: 'Play', paused: 'Resume', over: 'Play again' }[mode];
    buttons.restart.hidden = mode !== 'paused';
    buttons.sound.textContent = sound ? 'Sound on' : 'Sound off';
    buttons.sound.setAttribute('aria-pressed', String(sound));
    const total = progress.lifetime;
    const earned = Object.entries(ACHIEVEMENTS).filter(([key]) => progress.achievements[key]).map(([, label]) => label);
    get('surfers-records').textContent = 'Lifetime: ' + total.runs + ' runs · ' + total.distance + ' m · ' +
      total.hearts + ' hearts · ' + total.dodged + ' avoided. Achievements ' +
      earned.length + '/4' + (earned.length ? ' · ' + earned.join(' · ') : '');
    buttons.play.focus({ preventScroll: true });
  }

  function armSound() {
    if (!sound) return;
    try {
      const Audio = window.AudioContext || window.webkitAudioContext;
      if (!audio && Audio) audio = new Audio();
      if (audio?.state === 'suspended') audio.resume().catch(() => {});
    } catch { /* Sound is optional. */ }
  }

  function chime(event) {
    if (!sound || audio?.state !== 'running') return;
    const now = audio.currentTime;
    const tone = audio.createOscillator(), volume = audio.createGain();
    tone.type = 'sine';
    tone.frequency.setValueAtTime(event === 'heart' ? 740 : 440, now);
    tone.frequency.exponentialRampToValueAtTime(event === 'heart' ? 1040 : 660, now + .14);
    volume.gain.setValueAtTime(.055, now);
    volume.gain.exponentialRampToValueAtTime(.001, now + .17);
    tone.connect(volume).connect(audio.destination);
    tone.start(now);
    tone.stop(now + .18);
  }

  function frame(time) {
    frameId = null;
    if (last !== null) advance(run, (time - last) / 1000);
    last = time;
    for (const event of run.events.splice(0)) {
      if (event !== 'crash') chime(event);
    }
    renderer.draw(run);
    updateHud();
    if (run.mode === 'running') frameId = requestAnimationFrame(frame);
    else {
      stopClock();
      persistRun();
      screen();
    }
  }

  function play() {
    if (run.mode === 'running') return;
    if (run.mode === 'over') run = createRun();
    armSound();
    start(run);
    screen();
    canvas.focus({ preventScroll: true });
    frameId = requestAnimationFrame(frame);
  }

  function hold() {
    if (run.mode !== 'running') return;
    pause(run);
    stopClock();
    screen();
  }

  function exit() {
    stopClock();
    persistRun();
    scope.abort();
    if (audio && audio.state !== 'closed') audio.close().catch(() => {});
    stage.hidden = true;
    lobby.hidden = false;
    lobby.classList.remove('surfers-lobby-hidden');
    launch.focus();
  }

  listen(buttons.play, 'click', play);
  listen(buttons.pause, 'click', hold);
  listen(buttons.exit, 'click', exit);
  listen(buttons.restart, 'click', () => {
    persistRun();
    run = createRun();
    play();
  });
  listen(buttons.sound, 'click', () => {
    sound = !sound;
    progress.sound = sound;
    armSound();
    saveProgress(storage, progress);
    buttons.sound.textContent = sound ? 'Sound on' : 'Sound off';
    buttons.sound.setAttribute('aria-pressed', String(sound));
  });

  for (const direction of ['left', 'right', 'jump', 'slide']) {
    listen(buttons[direction], 'pointerdown', event => {
      if (event.button !== 0) return;
      event.preventDefault();
      act(run, direction);
    });
    listen(buttons[direction], 'click', event => {
      if (event.detail === 0) act(run, direction);
    });
  }
  listen(overlay, 'click', event => {
    if (run.mode !== 'title' || event.target.closest('button')) return;
    play();
  });
  listen(document, 'keydown', event => {
    const button = event.target.closest('button');
    if (event.code === 'Space' && button && button !== buttons.play && !controls.contains(button)) return;
    const action = keys[event.code];
    const pauseKey = event.code === 'KeyP' || event.code === 'Escape';
    if (!action && !pauseKey) return;
    event.preventDefault();
    if (event.repeat) return;
    if (pauseKey) {
      if (run.mode === 'paused') play();
      else hold();
      return;
    }
    if (run.mode !== 'running') {
      if (event.code === 'Space') play();
      return;
    }
    act(run, action);
  });
  listen(canvas, 'pointerdown', event => {
    if (run.mode !== 'running' || gesture || !event.isPrimary) return;
    gesture = { id: event.pointerId, x: event.clientX, y: event.clientY, handled: false };
    canvas.setPointerCapture(event.pointerId);
  });
  function swipe(event) {
    if (!gesture || event.pointerId !== gesture.id || gesture.handled) return;
    const dx = event.clientX - gesture.x, dy = event.clientY - gesture.y;
    if (Math.max(Math.abs(dx), Math.abs(dy)) < 19) return;
    gesture.handled = true;
    act(run, Math.abs(dx) >= Math.abs(dy) ? (dx < 0 ? 'left' : 'right') : (dy < 0 ? 'jump' : 'slide'));
  }
  listen(canvas, 'pointermove', swipe);
  listen(canvas, 'pointerup', event => {
    swipe(event);
    if (event.pointerId === gesture?.id) gesture = null;
  });
  const cancelSwipe = event => { if (event.pointerId === gesture?.id) gesture = null; };
  listen(canvas, 'pointercancel', cancelSwipe);
  listen(canvas, 'lostpointercapture', cancelSwipe);
  listen(window, 'resize', resize);
  if ('ResizeObserver' in window) {
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    scope.signal.addEventListener('abort', () => observer.disconnect(), { once: true });
  }
  listen(window, 'blur', hold);
  listen(window, 'pagehide', event => {
    hold();
    if (!event.persisted) persistRun();
  });
  listen(document, 'visibilitychange', () => { if (document.hidden) hold(); });
  resize();
  screen();
}
