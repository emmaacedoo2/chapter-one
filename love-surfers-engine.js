export const SAVE_KEY = 'chapterOne.loveSurfers.v1';
export const LANES = [-4, 0, 4];
export const STEP = 1 / 120;
export const LOOK_AHEAD = 180;
export const OBSTACLES = ['low', 'high', 'car', 'works', 'cones'];
export const POWERS = { magnet: 'Heart Magnet', shield: 'Shield', double: 'Double Score' };
export const ACHIEVEMENTS = {
  hearts10: 'First 10 hearts', hearts50: '50 hearts collected',
  distance500: '500 meters traveled', dodged20: '20 obstacles avoided'
};

const toward = (value, target, amount) =>
  value + Math.sign(target - value) * Math.min(Math.abs(target - value), amount);
const count = value => Number.isFinite(Number(value)) ? Math.max(0, Math.floor(Number(value))) : 0;
const object = value => value && typeof value === 'object' && !Array.isArray(value) ? value : {};
export function loadProgress(storage) {
  try {
    const saved = object(JSON.parse(storage().getItem(SAVE_KEY)));
    const lifetime = object(saved.lifetime);
    return {
      ...saved, best: count(saved.best), achievements: { ...object(saved.achievements) },
      lifetime: Object.fromEntries(['runs', 'hearts', 'distance', 'dodged'].map(key => [key, count(lifetime[key])]))
    };
  } catch {
    return { best: 0, achievements: {}, lifetime: { runs: 0, hearts: 0, distance: 0, dodged: 0 } };
  }
}

export function saveProgress(storage, progress) {
  try { storage().setItem(SAVE_KEY, JSON.stringify(progress)); } catch { /* Play remains available. */ }
}

const row = (at, lane, type) => ({ at, lane, type });
const trail = (at, lane, length) => Array.from({ length }, (_, i) => row(at + i * 12, lane, 'heart'));

// At 14 m/s, these rows arrive at roughly 1–5, 6–9, 12–18 and 22–27 seconds.
const opening = [
  ...trail(17, 1, 5), ...trail(83, 0, 4),
  row(165, 1, 'cones'), ...trail(174, 2, 3),
  row(224, 2, 'car'), ...trail(229, 1, 4),
  row(304, 1, 'low'), ...trail(319, 1, 2),
  row(373, 1, 'high'), ...trail(389, 1, 2)
];

export function createRun(random = Math.random, tutorial = true) {
  return {
    mode: 'title', distance: 0, elapsed: 0, speed: 14, accumulator: 0,
    lane: 1, x: 0, height: 0, verticalSpeed: 0, slide: 0, landing: 0,
    hearts: 0, dodged: 0, points: 0, events: [], effects: [],
    magnet: 0, shield: false, double: 0,
    items: tutorial ? opening.map(item => ({ ...item })) : [],
    nextRow: tutorial ? 458 : Infinity, waves: 0, random, recorded: false
  };
}

export const score = run => Math.floor(run.points + 1e-7);

export function start(run) {
  if (run.mode === 'title' || run.mode === 'paused') run.mode = 'running';
}

export function pause(run) {
  if (run.mode === 'running') {
    run.mode = 'paused';
    run.accumulator = 0;
  }
}

export function act(run, action) {
  if (run.mode !== 'running') return;
  if (action === 'left') run.lane = Math.max(0, run.lane - 1);
  if (action === 'right') run.lane = Math.min(2, run.lane + 1);
  if (action === 'jump' && run.height === 0) {
    run.slide = 0;
    run.verticalSpeed = 7.8;
  }
  if (action === 'slide' && run.height === 0) run.slide = 1;
}

function generate(run) {
  while (run.nextRow <= run.distance + LOOK_AHEAD) {
    const at = run.nextRow;
    const safe = Math.floor(run.random() * 3);
    const occupied = [0, 1, 2].filter(lane => lane !== safe);
    if (at < 930) occupied.splice(Math.floor(run.random() * 2), 1);
    for (const lane of occupied) {
      run.items.push(row(at, lane, OBSTACLES[Math.floor(run.random() * OBSTACLES.length)]));
    }
    run.items.push(...trail(at - 22, safe, 4));
    if (run.waves++ % 3 === 0) {
      const types = Object.keys(POWERS);
      run.items.push(row(at + 28, safe, types[Math.floor(run.random() * types.length)]));
    }
    // Even at top speed this leaves over two seconds between obstacle rows.
    run.nextRow += 76 - Math.min(20, (at - 458) / 50);
  }
}

function collect(run, item) {
  item.done = true;
  run.events.push(item.type);
  const points = run.double > 0 ? 50 : 25;
  run.effects.push({ x: run.x, life: .55, type: item.type, points });
  if (item.type === 'heart') {
    run.hearts++;
    run.points += points;
  } else if (item.type === 'shield') {
    run.shield = true;
  } else {
    run[item.type] = item.type === 'magnet' ? 12 : 10;
  }
}

function tick(run) {
  const previous = run.distance;
  run.elapsed += STEP;
  run.speed = Math.min(25, 14 + Math.max(0, run.elapsed - 30) * .12);
  run.distance += STEP * run.speed;
  run.points += (run.distance - previous) * (run.double > 0 ? 2 : 1);
  run.x = toward(run.x, LANES[run.lane], 24 * STEP);
  run.slide = Math.max(0, run.slide - STEP);
  run.landing = Math.max(0, run.landing - STEP);
  run.magnet = Math.max(0, run.magnet - STEP);
  run.double = Math.max(0, run.double - STEP);
  if (run.height > 0 || run.verticalSpeed > 0) {
    run.height += run.verticalSpeed * STEP;
    run.verticalSpeed -= 16 * STEP;
    if (run.height <= 0) {
      run.height = 0;
      run.verticalSpeed = 0;
      run.landing = .18;
    }
  }
  for (const effect of run.effects) effect.life -= STEP;
  run.effects = run.effects.filter(effect => effect.life > 0);

  generate(run);
  for (const item of run.items) {
    if (item.done || item.passed) continue;
    const offset = Math.abs(LANES[item.lane] - run.x);
    const obstacle = OBSTACLES.includes(item.type);
    if (!obstacle) {
      // The step's entire depth interval is checked. Hearts are tall pickup columns:
      // passing through one in the air, on foot or in a slide always counts.
      const magnet = item.type === 'heart' && run.magnet > 0;
      const reach = magnet ? 11 : 2.3;
      if (item.at + reach >= previous && item.at - reach <= run.distance &&
          offset <= (magnet ? 9 : 1.65)) collect(run, item);
      continue;
    }

    if (item.at + .9 < previous || item.at - .9 > run.distance || offset > 1.55) continue;
    if (['low', 'cones'].includes(item.type) && run.height >= .65) continue;
    if (item.type === 'high' && run.slide > 0) continue;
    if (run.shield) {
      run.shield = false;
      item.done = true;
      run.events.push('shieldHit');
    } else {
      run.mode = 'over';
      run.events.push('crash');
      break;
    }
  }
  for (const item of run.items) {
    if (!item.done && !item.passed && OBSTACLES.includes(item.type) &&
        item.at + .9 < run.distance && run.mode !== 'over') {
      item.passed = true;
      run.dodged++;
    }
  }
  run.items = run.items.filter(item => !item.done && item.at + 3 >= run.distance);
}

export function advance(run, seconds) {
  if (run.mode !== 'running' || !Number.isFinite(seconds)) return;
  run.accumulator += Math.max(0, Math.min(seconds, .25));
  while (run.accumulator + 1e-10 >= STEP && run.mode === 'running') {
    run.accumulator -= STEP;
    tick(run);
  }
}

export function recordRun(run, progress) {
  if (run.recorded || run.elapsed === 0) return;
  run.recorded = true;
  const total = progress.lifetime;
  total.runs++;
  total.distance += Math.floor(run.distance);
  total.hearts += run.hearts;
  total.dodged += run.dodged;
  progress.best = Math.max(progress.best, score(run));
  if (total.hearts >= 10) progress.achievements.hearts10 = true;
  if (total.hearts >= 50) progress.achievements.hearts50 = true;
  if (total.distance >= 500) progress.achievements.distance500 = true;
  if (total.dodged >= 20) progress.achievements.dodged20 = true;
}

export function coaching(run) {
  const distance = run.distance;
  if (distance < 74) return 'Follow the center-lane hearts.';
  if (distance < 139) return 'Move left for the next trail. Use ← / A or swipe left.';
  if (distance < 200) return 'Go around the cones. Use → / D or swipe right.';
  if (distance < 270) return 'Switch lanes to pass the parked car.';
  if (distance < 300) return 'Pink barrier ahead. Jump with Space, ↑, W or swipe up.';
  if (distance < 317) return 'Jump at the pink barrier, or go around.';
  if (distance < 368) return 'Overhead sign ahead. Use ↓, S or swipe down to slide.';
  if (distance < 386) return 'Slide at the overhead sign, or go around.';
  return '';
}
