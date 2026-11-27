export const SIZE = 4200;
export const SHORE = 3780;
export const ROAD = 132;
export const COLS = [310, 1050, 1800, 2550, 3400];
export const ROWS = [310, 1100, 1900, 2700, 3500];
export const HOME = [392, 2779];
export const GARAGE = [465, 2810];
export const TUTORIAL_STOP = [850, 2731];
export const DISTRICTS = [
  { name: 'Downtown', x: 870, y: 695 },
  { name: 'Residential', x: 2730, y: 720 },
  { name: 'City Park', x: 1420, y: 2280 },
  { name: 'Garage District', x: 590, y: 3050 },
  { name: 'Marina', x: 2780, y: 3150 },
  { name: 'Beachfront', x: 3500, y: 3670 }
];
export const HEARTS = [[540,3650],[945,1340],[1410,2370],[2090,2010],[2980,3650],
  [3210,1420],[3450,2450],[2615,3240],[850,2910],[1760,745]];

export const VEHICLES = {
  sports: { name: 'Rose GT', shape: 'Starter sports car', color: '#d94b76', max: 340, accel: 265, steer: 2.5, price: 0, length: 66, width: 36 },
  muscle: { name: 'Sunset V8', shape: 'Classic muscle car', color: '#d7864f', max: 385, accel: 295, steer: 2.03, price: 180, length: 72, width: 39 },
  luxury: { name: 'Pearl Touring', shape: 'Luxury sports car', color: '#e6ddd0', max: 410, accel: 288, steer: 2.58, price: 270, length: 72, width: 37 },
  suv: { name: 'Marina Cruiser', shape: 'SUV', color: '#458e92', max: 310, accel: 253, steer: 2.25, price: 120, length: 76, width: 44 },
  super: { name: 'Boulevard R', shape: 'Supercar', color: '#8b69bf', max: 490, accel: 380, steer: 2.72, price: 440, length: 69, width: 41 }
};

export function district(x, y) {
  if (x > 3500 || y > 3570) return 'Beachfront';
  if (x > 1940 && x < 3300 && y > 2775) return 'Marina';
  if (x < 970 && y > 2580) return 'Garage District';
  if (x > 1120 && x < 1740 && y > 1980 && y < 2625) return 'City Park';
  return x < 1800 ? 'Downtown' : 'Residential';
}

export const solids = [];
const landmarksColliders = [{x:1382,y:2270,w:82,h:63}];
export const gardens = [];
for (let i = 0; i < COLS.length - 1; i++) {
  for (let j = 0; j < ROWS.length - 1; j++) {
    const x = COLS[i] + 116, y = ROWS[j] + 120;
    const plot = district(x + 190, y + 200);
    if (plot === 'City Park' || plot === 'Marina' || plot === 'Garage District') continue;
    const downtown = plot === 'Downtown';
    for (let a = 0; a < 2; a++) {
      for (let b = 0; b < 2; b++) {
        const seed = i * 13 + j * 7 + a * 3 + b;
        const bx = x + a * 310 + (seed % 3) * 13, by = y + b * 330 + (seed % 4) * 9;
        const w = downtown ? 164 + seed % 5 * 15 : 111 + seed % 3 * 15;
        const h = downtown ? 129 + seed % 4 * 12 : 92 + seed % 4 * 9;
        solids.push({ x: bx, y: by, w, h, height: downtown ? 34 + seed % 6 * 16 : 24, kind: downtown ? 'tower' : 'house', seed });
        gardens.push({ x: bx - 27, y: by - 23, w: w + 54, h: h + 61, kind: downtown ? 'plaza' : 'garden' });
      }
    }
  }
}
solids.push(
  { x: 495, y: 2925, w: 275, h: 145, height: 38, kind: 'garage', seed: 3 },
  { x: 770, y: 3200, w: 137, h: 84, height: 29, kind: 'gas', seed: 1 },
  { x: 2680, y: 3015, w: 210, h: 112, height: 35, kind: 'marina', seed: 4 },
  { x: 2890, y: 3350, w: 155, h: 82, height: 24, kind: 'marina', seed: 2 }
);
gardens.push(
  { x: 1145, y: 2010, w: 558, h: 590, kind: 'park' },
  { x: 400, y: 2790, w: 505, h: 610, kind: 'parking' },
  { x: 2640, y: 2810, w: 650, h: 602, kind: 'marina' }
);

const CELL = 400;
const cells = new Map();
for (const b of [...solids,...landmarksColliders]) {
  for (let x = Math.floor(b.x / CELL); x <= Math.floor((b.x + b.w) / CELL); x++) {
    for (let y = Math.floor(b.y / CELL); y <= Math.floor((b.y + b.h) / CELL); y++) {
      const key = y * 20 + x;
      if (!cells.has(key)) cells.set(key, []);
      cells.get(key).push(b);
    }
  }
}
export function blocked(x, y, r) {
  if (x < 36 + r || y < 36 + r || x > SHORE - r || y > SHORE - r) return true;
  for (let col = Math.floor((x-r)/CELL); col <= Math.floor((x+r)/CELL); col++) {
    for (let row = Math.floor((y-r)/CELL); row <= Math.floor((y+r)/CELL); row++) {
      for (const b of cells.get(row * 20 + col) ?? []) {
        const nx = Math.max(b.x, Math.min(x, b.x+b.w));
        const ny = Math.max(b.y, Math.min(y, b.y+b.h));
        if ((nx-x)**2 + (ny-y)**2 < r*r) return true;
      }
    }
  }
  return false;
}

export const NODES = ROWS.flatMap(y => COLS.map(x => [x,y]));
const segments = [];
for (let i = 0; i < NODES.length; i++) {
  if (i % COLS.length + 1 < COLS.length) segments.push([NODES[i], NODES[i+1]]);
  if (i + COLS.length < NODES.length) segments.push([NODES[i], NODES[i+COLS.length]]);
}
const distance = (a,b) => Math.hypot(a[0]-b[0], a[1]-b[1]);

function roadAccess(point) {
  let best, fallback, cost = Infinity, fallbackCost = Infinity;
  for (const [a,b] of segments) {
    const p = [Math.max(a[0],Math.min(b[0],point[0])), Math.max(a[1],Math.min(b[1],point[1]))];
    const d = distance(point,p);
    if (d < fallbackCost) { fallback = {p,a,b}; fallbackCost = d; }
    if (d >= cost) continue;
    const steps = Math.ceil(d/26);
    let clear = true;
    for (let i = 1; i <= steps; i++) {
      const t = i/steps;
      if (blocked(point[0]+(p[0]-point[0])*t,point[1]+(p[1]-point[1])*t,14)) { clear=false; break; }
    }
    if (clear) { best={p,a,b}; cost=d; }
  }
  return best ?? fallback;
}

// Weighted grid routing includes projections onto the closest actual road segments.
export function route(start, goal) {
  const from = roadAccess(start), to = roadAccess(goal);
  if (from.a === to.a && from.b === to.b) return [start, from.p, to.p, goal];
  const costs = NODES.map(() => Infinity), previous = NODES.map(() => -1);
  const visited = new Set();
  for (const n of [from.a, from.b]) costs[NODES.indexOf(n)] = distance(from.p,n);
  while (visited.size < NODES.length) {
    let i = -1;
    for (let j = 0; j < NODES.length; j++) if (!visited.has(j) && (i < 0 || costs[j] < costs[i])) i = j;
    visited.add(i);
    const neighbors = [
      i % COLS.length > 0 ? i-1 : -1,
      i % COLS.length < COLS.length-1 ? i+1 : -1,
      i-COLS.length, i+COLS.length
    ];
    for (const n of neighbors) {
      if (!NODES[n]) continue;
      const cost = costs[i] + distance(NODES[i],NODES[n]);
      if (cost < costs[n]) { costs[n] = cost; previous[n] = i; }
    }
  }
  let i = [to.a,to.b].map(node => NODES.indexOf(node)).reduce((a,b) =>
    costs[a]+distance(to.p,NODES[a]) <= costs[b]+distance(to.p,NODES[b]) ? a : b);
  const path = [];
  for (; i >= 0; i = previous[i]) path.unshift(NODES[i]);
  return [start, from.p, ...path, to.p, goal];
}

const loop = (left, top, right, bottom) => [
  [left+28,top+28],[right-28,top+28],[right-28,bottom-28],[left+28,bottom-28]
];
export const TRAFFIC_LOOPS = [
  loop(310,310,1800,1100), loop(1800,310,3400,1100),
  loop(1050,1100,2550,1900), loop(2550,1100,3400,2700),
  loop(310,1900,1050,3500), loop(1800,2700,3400,3500)
];

export const props = [];
for (const y of ROWS) {
  for (let x = 200; x < 3570; x += 178) {
    if (COLS.some(col => Math.abs(x-col) < 106)) continue;
    props.push({x,y:y-82,kind:'lamp'}, {x:x+34,y:y+88,kind:x%3 ? 'palm' : 'tree'});
  }
}
for (let y = 240; y < 3720; y += 155) props.push({x:3610,y,kind:'palm'});
for (let x = 220; x < 3710; x += 164) props.push({x,y:3650+x%49,kind:'palm'});
for (let i = 0; i < 24; i++) props.push({x:1190+i%6*91,y:2050+Math.floor(i/6)*146,kind:'tree'});
