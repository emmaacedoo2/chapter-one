import test from 'node:test';
import assert from 'node:assert/strict';
import {
  OBSTACLES, POWERS, SAVE_KEY, STEP, act, advance, createRun,
  loadProgress, pause, recordRun, saveProgress, score, start
} from '../love-surfers-engine.js';

function practice(items = []) {
  const run = createRun(() => 0, false);
  run.items = items.map(([at, lane, type]) => ({ at, lane, type }));
  start(run);
  return run;
}

function travel(run, seconds, fps = 60) {
  const frames = Math.round(seconds * fps);
  for (let i = 0; i < frames; i++) advance(run, 1 / fps);
}

test('title, start, pause, resume and fresh restart', () => {
  const run = createRun();
  act(run, 'jump');
  advance(run, 1);
  assert.equal(run.distance, 0);
  start(run);
  travel(run, 2);
  assert.equal(run.height, 0);
  pause(run);
  const distance = run.distance;
  act(run, 'left');
  travel(run, 4);
  assert.equal(run.distance, distance);
  assert.equal(run.lane, 1);
  start(run);
  travel(run, 1);
  assert.ok(run.distance > distance);
  const restart = createRun();
  start(restart);
  assert.equal(restart.distance, 0);
  assert.equal(restart.hearts, 0);
});

test('known center heart, score, and removal', () => {
  const run = practice([[14, 1, 'heart']]);
  travel(run, 1);
  assert.equal(run.hearts, 1);
  assert.equal(score(run), 39);
  assert.equal(run.items.length, 0);
  assert.equal(run.effects[0].type, 'heart');
  travel(run, 1);
  assert.equal(run.hearts, 1);
});

test('all five opening hearts collect at 10, 30, 60 and 120 fps', () => {
  for (const fps of [10, 30, 60, 120]) {
    const run = createRun();
    start(run);
    travel(run, 5, fps);
    assert.equal(run.hearts, 5, String(fps));
    assert.equal(score(run), 195, String(fps));
  }
  const fast = practice([[25, 1, 'heart']]);
  fast.elapsed = 150;
  fast.distance = 20;
  advance(fast, .25);
  assert.equal(fast.hearts, 1);
});

test('lane changes follow physical position and collect consecutive side hearts', () => {
  const run = practice([[-2, 0, 'heart'], [15, 0, 'heart'], [28, 0, 'heart']]);
  act(run, 'left');
  advance(run, STEP);
  assert.equal(run.hearts, 0);
  travel(run, 2.5);
  assert.equal(run.x, -4);
  assert.equal(run.hearts, 2);
});

test('jump and slide work at the obstacle, with early actions and wrong poses failing', () => {
  for (const type of ['low', 'high', 'cones', 'car', 'works']) {
    const collision = practice([[14, 1, type]]);
    travel(collision, 1.4);
    assert.equal(collision.mode, 'over', type);
    const dodge = practice([[14, 1, type]]);
    act(dodge, 'right');
    travel(dodge, 1.4);
    assert.equal(dodge.mode, 'running', type);
    assert.equal(dodge.dodged, 1);
  }
  for (const [type, action] of [['low','jump'], ['high','slide'], ['cones','jump']]) {
    const run = practice([[21, 1, type]]);
    travel(run, 1.1);
    act(run, action);
    travel(run, .75);
    assert.equal(run.mode, 'running', type);
    assert.equal(run.dodged, 1);
    const early = practice([[21, 1, type]]);
    act(early, action);
    travel(early, 1.8);
    assert.equal(early.mode, 'over', type);
  }
  const wrongPose = practice([[14, 1, 'high']]);
  travel(wrongPose, .6);
  act(wrongPose, 'jump');
  travel(wrongPose, .6);
  assert.equal(wrongPose.mode, 'over');
});

function seeded(seed) {
  let state = seed;
  return () => ((state = (Math.imul(1664525, state) + 1013904223) >>> 0) / 2 ** 32);
}

test('opening reaches all tutorials and seeded waves always offer safe heart trails', () => {
  for (let seed = 1; seed <= 24; seed++) {
    const run = createRun(seeded(seed));
    start(run);
    const generated = new Map();
    for (let frame = 0; frame < 960; frame++) {
      const upcoming = run.items.filter(item => item.at > run.distance && OBSTACLES.includes(item.type));
      const next = upcoming.length ? Math.min(...upcoming.map(item => item.at)) : Infinity;
      if (next - run.distance < 30) {
        const blocked = upcoming.filter(item => item.at === next).map(item => item.lane);
        const safe = [0, 1, 2].find(lane => !blocked.includes(lane));
        if (blocked.includes(run.lane)) {
          while (run.lane !== safe) act(run, run.lane > safe ? 'left' : 'right');
        }
      }
      for (const item of run.items) generated.set([item.at,item.lane,item.type].join('/'), item);
      advance(run, .125);
      assert.equal(run.mode, 'running', String(seed));
    }
    const items = [...generated.values()];
    const rows = [...new Set(items.filter(item => item.at >= 458 && OBSTACLES.includes(item.type)).map(item => item.at))].sort((a,b) => a-b);
    assert.ok(rows.length > 20);
    for (const [index, at] of rows.entries()) {
      const blocked = items.filter(item => item.at === at && OBSTACLES.includes(item.type));
      assert.ok(blocked.length <= 2);
      if (index) assert.ok(at - rows[index - 1] >= 56);
      const hearts = items.filter(item => item.type === 'heart' && item.at >= at - 22 && item.at <= at + 14);
      assert.equal(hearts.length, 4);
      assert.ok(hearts.every(heart => blocked.every(obstacle => obstacle.lane !== heart.lane)));
    }
  }
});

test('magnet reaches neighboring lanes, double score expires, shield absorbs one collision', () => {
  const magnet = practice([[4, 1, 'magnet'], [16, 0, 'heart'], [19, 2, 'heart']]);
  travel(magnet, 1);
  assert.equal(magnet.hearts, 2);
  assert.ok(magnet.magnet > 10);
  travel(magnet, 13);
  assert.equal(magnet.magnet, 0);

  const double = practice([[4, 1, 'double'], [9, 1, 'heart']]);
  travel(double, 1);
  assert.ok(score(double) >= 75);
  assert.ok(double.double > 8);
  travel(double, 10);
  assert.equal(double.double, 0);

  const shield = practice([[4, 1, 'shield'], [12, 1, 'car'], [40, 1, 'car']]);
  travel(shield, 1);
  assert.ok(shield.events.includes('shieldHit'));
  assert.equal(shield.shield, false);
  assert.equal(shield.mode, 'running');
  travel(shield, 2);
  assert.equal(shield.mode, 'over');
  assert.equal(Object.keys(POWERS).length, 3);
});

test('compatible saved records survive, lifetime progress updates once, and storage failure is safe', () => {
  const values = new Map([[SAVE_KEY, JSON.stringify({best: 420, achievements: {hearts10: true}, legacy: 'keep'})]]);
  const storage = () => ({getItem: key => values.get(key), setItem: (key, value) => values.set(key, value)});
  const progress = loadProgress(storage);
  const run = practice([[12, 1, 'heart']]);
  travel(run, 1);
  recordRun(run, progress);
  recordRun(run, progress);
  assert.equal(progress.best, 420);
  assert.equal(progress.lifetime.hearts, 1);
  assert.equal(progress.lifetime.runs, 1);

  const personalBest = practice();
  travel(personalBest, 45);
  recordRun(personalBest, progress);
  saveProgress(storage, progress);
  const reloaded = loadProgress(storage);
  assert.equal(reloaded.best, score(personalBest));
  assert.equal(reloaded.achievements.hearts10, true);
  assert.equal(reloaded.achievements.distance500, true);
  assert.equal(reloaded.legacy, 'keep');
  const denied = () => { throw new Error('storage disabled'); };
  assert.equal(loadProgress(denied).best, 0);
  assert.doesNotThrow(() => saveProgress(denied, progress));
});

test('Arcade launch, keyboard and tap start, visibility pause, restart and exit wiring', async () => {
  // Real controller and renderer, with a minimal DOM and a recording frame clock.
  const elements = new Map();
  const frames = new Map();
  const stored = new Map();
  let nextFrame = 0, drawing = 0;
  const paint = new Proxy({}, {
    get(target, key) {
      return target[key] ?? (() => {
        drawing++;
        return { addColorStop() {} };
      });
    }
  });

  class Element extends EventTarget {
    constructor(name) {
      super();
      this.name = name;
      this.classes = new Set();
      this.classList = this.classes;
      this.classList.remove = this.classes.delete;
    }
    closest(selector) { return selector === 'button' && this.dataset ? this : null; }
    setAttribute() {}
    focus() {}
    scrollIntoView() {}
    getContext() { return paint; }
    setPointerCapture() {}
    getBoundingClientRect() { return {width: 390, height: 420}; }
  }

  const get = id => {
    if (!elements.has(id)) elements.set(id, new Element(id));
    return elements.get(id);
  };
  const buttons = Object.fromEntries(['play','pause','restart','sound','exit','left','right','jump','slide']
    .map(name => [name, Object.assign(new Element(name), { dataset: { surf: name } })]));
  get('surfers-stage').querySelectorAll = () => Object.values(buttons);
  get('surfers-controls').contains = button => ['left','right','jump','slide'].includes(button.name);

  const document = Object.assign(new EventTarget(), {getElementById: get, hidden: false, closest: () => null});
  const window = Object.assign(new EventTarget(), {
    devicePixelRatio: 3,
    localStorage: { getItem: key => stored.get(key), setItem: (key, value) => stored.set(key,value) }
  });
  const injected = { document, window, requestAnimationFrame: cb => {
    frames.set(++nextFrame, cb);
    return nextFrame;
  }, cancelAnimationFrame: id => frames.delete(id) };
  Object.assign(globalThis, injected);
  const fire = (target, type, props = {}) => {
    const event = Object.assign(new Event(type, {cancelable: true}), props);
    target.dispatchEvent(event);
    return event;
  };
  const key = code => fire(document, 'keydown', {code, repeat: false});
  const frame = time => {
    const [id, cb] = frames.entries().next().value;
    frames.delete(id);
    cb(time);
  };

  try {
    await import('../love-surfers.js');
    fire(get('surfers-launch'), 'click');
    assert.equal(get('arcade-lobby').hidden, true);
    assert.equal(get('surfers-screen').textContent, 'LOVE SURFERS');
    assert.equal(get('surfers-canvas').width, 780);
    assert.ok(drawing > 0);
    assert.equal(key('Space').defaultPrevented, true);
    assert.equal(frames.size, 1);
    for (let time = 0; time <= 5000; time += 50) frame(time);
    assert.match(get('surfers-hud').textContent, /5 hearts/);
    const canvas = get('surfers-canvas');
    canvas.getBoundingClientRect = () => ({width: 760, height: 240});
    fire(window, 'resize');
    assert.equal(canvas.width, 1520);
    assert.equal(canvas.height, 480);
    fire(canvas, 'pointerdown', {isPrimary: true, pointerId: 1, clientX: 240, clientY: 150});
    fire(canvas, 'pointermove', {pointerId: 1, clientX: 197, clientY: 152});
    fire(canvas, 'pointerup', {pointerId: 1, clientX: 184, clientY: 151});
    for (let time = 5050; time <= 9000; time += 50) frame(time);
    assert.match(get('surfers-hud').textContent, /9 hearts/);
    fire(document, 'visibilitychange');
    assert.equal(frames.size, 1);
    document.hidden = true;
    fire(document, 'visibilitychange');
    assert.equal(frames.size, 0);
    assert.equal(get('surfers-screen').textContent, 'Paused');
    document.hidden = false;
    fire(buttons.restart, 'click');
    assert.equal(frames.size, 1);
    assert.match(get('surfers-hud').textContent, /0 hearts/);
    key('Escape');
    fire(buttons.exit, 'click');
    assert.equal(get('arcade-lobby').hidden, false);
    assert.equal(frames.size, 0);
    assert.equal(key('Space').defaultPrevented, false);
    assert.equal(JSON.parse(stored.get(SAVE_KEY)).best, 351);

    fire(get('surfers-launch'), 'click');
    fire(get('surfers-overlay'), 'click');
    assert.equal(frames.size, 1);
    key('Escape');
    fire(buttons.exit, 'click');
    assert.equal(frames.size, 0);
  } finally {
    for (const key of Object.keys(injected)) delete globalThis[key];
  }
});
