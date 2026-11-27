import { LANES, LOOK_AHEAD, POWERS } from './love-surfers-engine.js';

const PALETTES = [
  ['#d98491', '#a24f71', '#ffe1b5'], ['#78b7be', '#457a9b', '#e1f6ee'],
  ['#c093c9', '#785f9e', '#f7d6e0'], ['#ffc59d', '#c47c7e', '#fff1d3']
];

export function createRenderer(ctx) {
  let width, height, horizon, focal, sky, sea;
  function resize(w, h) {
    width = w; height = h;
    horizon = height * .29;
    focal = Math.min(width * .046, height * .074) * 12;
    sky = gradient(0, 0, 0, horizon * 1.3, '#594c94', '#ea91aa', '#ffdcaa');
    sea = gradient(0, horizon, 0, height, '#74b8bc', '#416c91', '#413f69');
  }
  function gradient(x, y, x2, y2, ...colors) {
    const result = ctx.createLinearGradient(x, y, x2, y2);
    colors.forEach((color, index) => result.addColorStop(index / (colors.length - 1), color));
    return result;
  }
  function poly(color, ...points) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(...points[0]);
    for (const p of points.slice(1)) ctx.lineTo(...p);
    ctx.closePath();
    ctx.fill();
  }
  function line(color, weight, ...points) {
    ctx.strokeStyle = color;
    ctx.lineWidth = weight;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(...points[0]);
    for (const p of points.slice(1)) ctx.lineTo(...p);
    ctx.stroke();
  }
  function ellipse(x, y, rx, ry, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  function box(x, y, w, h, radius, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, radius);
    ctx.fill();
  }
  function heart(x, y, size, color = '#ff5185') {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(size, size);
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(0, .52);
    ctx.bezierCurveTo(-1, -.06, -.66, -.79, 0, -.37);
    ctx.bezierCurveTo(.66, -.79, 1, -.06, 0, .52);
    ctx.fill();
    ctx.restore();
  }
  function project(x, depth, elevation = 0) {
    const scale = focal / (12 + depth);
    return [width / 2 + x * scale, horizon + height * .53 * 12 / (12 + depth) - elevation * scale];
  }
  function strip(color, x1, x2, near, far) {
    poly(color, project(x1, near), project(x2, near), project(x2, far), project(x1, far));
  }
  function background(distance) {
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, width, height);
    const sun = Math.min(width, height) * .085;
    ellipse(width * .75, horizon * .59, sun * 1.23, sun * 1.23, '#ffcfaa44');
    ellipse(width * .75, horizon * .59, sun, sun, '#ffe0ae');
    for (let i = 0; i < 8; i++) {
      const span = width + 150;
      const x = ((span + i * span / 8 - distance * .21 % span) % span) - 75;
      ellipse(x, horizon * (.31 + i % 3 * .17), 36 + i % 3 * 17, 4 + i % 2 * 4, '#ffdcca42');
    }
    const ridge = Array.from({ length: 22 }, (_, i) => [i * width / 21,
      horizon - 8 - Math.sin(i * 1.71) * 10 - (i % 3) * 7]);
    poly('#8a668a', [0, horizon + 30], ...ridge, [width, horizon + 30]);
    ctx.fillStyle = sea;
    ctx.fillRect(0, horizon + 8, width, height - horizon);
  }
  function track(distance) {
    const far = LOOK_AHEAD + 20, near = -7;
    strip('#e5aaa5', -9.4, 9.4, near, far);
    strip('#5a455f', -6.5, 6.5, near, far);
    strip('#695269', -6, 6, near, far);
    strip('#ffd0b1', -6.4, -6.18, near, far);
    strip('#ffd0b1', 6.18, 6.4, near, far);
    for (let at = Math.ceil((distance + near) / 6) * 6; at < distance + far; at += 6) {
      const z = at - distance;
      if (Math.floor(at / 6) % 2 === 0) {
        strip('#c78b99', -7.3, -6.5, z, z + 6);
        strip('#c78b99', 6.5, 7.3, z, z + 6);
      }
      strip('#edd3bb', -2.04, -1.96, z, z + 2.3);
      strip('#edd3bb', 1.96, 2.04, z, z + 2.3);
    }
  }
  function building(x, z, index, side) {
    const [front, flank, light] = PALETTES[index % PALETTES.length];
    const floors = 3 + index % 5, top = floors * 1.7 + .8;
    const a = x - 3.6, b = x + 3.6, back = z + 7;
    const edge = side < 0 ? b : a;
    poly(flank, project(edge, z), project(edge, back), project(edge, back, top), project(edge, z, top));
    poly(light, project(a, z, top), project(b, z, top), project(b, back, top), project(a, back, top));
    poly(front, project(a, z), project(b, z), project(b, z, top), project(a, z, top));
    for (let floor = 0; floor < floors; floor++) {
      const base = floor * 1.7 + .6;
      for (let column = 0; column < 3; column += z > 85 ? 2 : 1) {
        const left = a + .55 + column * 2.15, right = left + 1.48;
        poly(light, project(left, z, base), project(right, z, base),
          project(right, z, base + .94), project(left, z, base + .94));
        line(flank, Math.max(.5, focal / (12 + z) * .045),
          project(left + .73, z, base), project(left + .73, z, base + .94));
      }
      line(flank, Math.max(.5, focal / (12 + z) * .09),
        project(a, z, base - .25), project(b, z, base - .25));
    }
  }
  function roadside(x, z, index) {
    const [px, py] = project(x, z);
    const scale = focal / (12 + z);
    ctx.save();
    ctx.translate(px, py);
    ctx.scale(scale, scale);
    ellipse(.6, -.02, 1.5, .17, '#412c5544');
    if (index % 2 === 0) {
      line('#604a60', .24, [0,0], [0,-4], [.15,-4.25], [.83,-4.25]);
      ellipse(.83,-4.16,.48,.14,'#ffe4b0');
      ellipse(.83,-4.15,.53,.32,'#ffcf7840');
    } else {
      line('#84565e', .37, [0,0], [-.2,-1.8], [-.13,-3.4], [.26,-5]);
      line('#c08672', .085, [.12,-.15], [-.03,-2], [.35,-4.9]);
      for (let j = 0; j < 7; j++) {
        const spread = (j - 3) * .56;
        ctx.fillStyle = j % 2 ? '#327d7b' : '#3d9690';
        ctx.beginPath();
        ctx.moveTo(.24,-5);
        ctx.quadraticCurveTo(spread * .65,-6.9 + Math.abs(spread) * .32,spread,-5.8 + Math.abs(spread) * .77);
        ctx.quadraticCurveTo(spread * .7,-5.6,.24,-5);
        ctx.fill();
      }
      ellipse(.25,-4.92,.29,.21,'#945a64');
    }
    ctx.restore();
  }
  function obstacle(type) {
    ellipse(.15, 0, 1.6, .29, '#30203966');
    if (type === 'car') {
      box(-1.3,-.55,.38,.69,.12,'#31293d');
      box(.92,-.55,.38,.69,.12,'#31293d');
      poly('#623651', [-1.38,-.17], [-1.5,-.67], [-1.1,-1.02], [-.74,-1.64],
        [.75,-1.64], [1.13,-1.02], [1.5,-.67], [1.37,-.17]);
      poly('#ec789e', [-1.38,-.59], [-1,-1.07], [1,-1.07], [1.38,-.59], [1.2,-.35], [-1.2,-.35]);
      poly('#6a95a9', [-.89,-1.03], [-.65,-1.5], [.65,-1.5], [.89,-1.03]);
      box(-1.15,-.57,.52,.17,.06,'#ffb491');
      box(.63,-.57,.52,.17,.06,'#ffb491');
      box(-.32,-.38,.64,.21,.04,'#fff1d5');
    } else if (type === 'cones') {
      for (const x of [-.68,.68]) {
        box(x-.46,-.1,.92,.2,.07,'#67415b');
        poly('#ef805f',[x-.35,-.1],[x-.09,-.64],[x+.09,-.64],[x+.35,-.1]);
        poly('#ffe6c1',[x-.24,-.32],[x-.16,-.47],[x+.16,-.47],[x+.24,-.32]);
      }
    } else {
      const high = type === 'high', top = high ? 2.37 : type === 'works' ? 1.44 : .64;
      const plank = high ? 1.46 : type === 'works' ? .71 : .43;
      for (const x of [-1.23,1.09]) box(x,-top,.18,top,.05,'#7b526e');
      box(-1.48,-top,2.96,plank,.09, high ? '#654878' : type === 'works' ? '#dd8a54' : '#d75279');
      if (high) {
        for (const x of [-.85,0,.85]) {
          line('#ffe0ad',.11,[x,-2.05],[x,-1.45]);
          line('#ffe0ad',.11,[x-.24,-1.69],[x,-1.45],[x+.24,-1.69]);
        }
      } else {
        for (const x of [-.77,.07,.91]) {
          line('#ffdbac',.14,[x-.13,-top+.36],[x+.14,-top+.075]);
        }
        if (type === 'works') for (const x of [-1.16,1.16]) ellipse(x,-top-.12,.13,.14,'#ffd287');
      }
    }
  }
  function pickup(type, phase) {
    const y = -1.28 + .12 * Math.sin(phase);
    ellipse(0,0,.68,.12,'#40233e45');
    ellipse(0,y,.77,.76,'#ffe3ad42');
    if (type === 'heart') {
      heart(0,y+.065,.94,'#a93469');
      heart(0,y,.89);
      ellipse(-.31,y-.23,.14,.076,'#ffe1e9');
    } else {
      box(-.59,y-.57,1.18,1.14,.28,'#fff0ca');
      box(-.48,y-.46,.96,.92,.19,'#764878');
      ctx.fillStyle = '#fff0ca'; ctx.textAlign = 'center'; ctx.font = 'bold .59px sans-serif';
      ctx.fillText({magnet:'M',shield:'S',double:'×2'}[type],0,y+.19);
    }
  }
  function runner(run) {
    const scale = focal / 12, [x, ground] = project(run.x, 0);
    const jump = run.height > 0, slide = run.slide > 0;
    const tuck = slide ? Math.min(1, (1 - run.slide) * 16, run.slide * 13) : 0;
    const phase = run.distance * 1.12;
    ellipse(x,ground,.66 * scale,.15 * scale,'#30223e66');
    ctx.save();
    ctx.translate(x,ground - run.height * scale);
    ctx.scale(scale,scale);
    const land = run.landing / .18;
    const bob = slide ? 0 : jump ? -.08 : -.07 * Math.abs(Math.sin(phase)) + land * .13;
    ctx.translate(0,bob);
    ctx.scale(1 + .12 * tuck, 1 - .61 * tuck);
    ctx.rotate((LANES[run.lane] - run.x) * .045);
    for (const side of [-1,1]) {
      const stride = side * Math.sin(phase);
      const knee = slide ? -.37 : jump ? -.69 : -.53 + stride * .19;
      const foot = slide ? -.09 : jump ? -.31 - side * .15 : -.09 - Math.max(0,stride) * .38;
      line('#423858',.32,[side*.23,-.91],[side*.36,knee],[side*.31,foot]);
      line('#63547e',.08,[side*.25,-.88],[side*.37,knee]);
      box(side*.31-.2,foot-.09,.4,.18,.07,'#f8e5d6');
      box(side*.31-.17,foot+.045,.34,.065,.032,'#d57a9f');
      const swing = slide ? .39 : jump ? .46 : stride * .22;
      line('#d76e93',.25,[side*.43,-1.63],[side*.61,-1.36+swing],[side*.55,-1.15+swing]);
      ellipse(side*.55,-1.12+swing,.115,.13,'#eab09a');
    }
    poly('#9c426e',[-.47,-1.68],[-.26,-1.86],[.28,-1.86],[.47,-1.68],[.39,-.89],[-.38,-.89]);
    box(-.36,-1.75,.72,.64,.16,'#eb91a6');
    box(-.26,-1.27,.52,.16,.05,'#c56387');
    heart(0,-1.49,.23,'#fff0cf');
    ellipse(0,-1.88,.19,.16,'#eab09a');
    ellipse(0,-2.1,.36,.37,'#5a374d');
    ellipse(.08,-2.31,.25,.19,'#6b4056');
    line('#966172',.055,[-.25,-2.21],[-.08,-2.35],[.13,-2.34]);
    line('#efadb2',.08,[-.14,-2.35],[.22,-2.38]);
    if (run.shield) ellipse(0,-1.17,.86,1.34,'#aedff746');
    ctx.restore();
    for (const effect of run.effects) {
      const [px, py] = project(effect.x, 0, 2.7 + (1-effect.life/.55)*.6);
      ctx.globalAlpha = Math.min(1, effect.life * 5);
      ctx.textAlign = 'center'; ctx.fillStyle = '#fff0c5';
      ctx.font = '700 17px system-ui';
      ctx.fillText(effect.type === 'heart' ? '+' + effect.points : POWERS[effect.type],px,py);
      heart(px + 29,py - 5,9,'#ffc1d4');
      ctx.globalAlpha = 1;
    }
  }
  function draw(run) {
    background(run.distance);
    track(run.distance);
    const scene = [];
    const first = Math.max(0, Math.floor(run.distance / 12));
    for (let i = first; i * 12 < run.distance + LOOK_AHEAD; i++) {
      const z = i * 12 - run.distance;
      if (z <= -5) continue;
      scene.push({ z, scenery: i });
    }
    for (const item of run.items) {
      const z = item.at - run.distance;
      if (z >= -3 && z < LOOK_AHEAD) scene.push({ z, item });
    }
    scene.push({ z: 0, player: true });
    scene.sort((a,b) => b.z - a.z);
    for (const { z, item, scenery, player } of scene) {
      if (player) runner(run);
      else if (item) {
        ctx.save();
        ctx.translate(...project(LANES[item.lane], z));
        const scale = focal / (12 + z);
        ctx.scale(scale,scale);
        if (item.type === 'heart' || item.type in POWERS) pickup(item.type, run.elapsed * 5 + item.at);
        else obstacle(item.type);
        ctx.restore();
      } else {
        if (z > 2) {
          building(-13.2,z,scenery,-1);
          building(13.2,z+2,scenery+2,1);
        }
        roadside(-7.8,z,scenery);
        roadside(7.8,z+2,scenery+1);
      }
    }
  }
  return { resize, draw };
}
