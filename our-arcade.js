(() => {
  'use strict';

  const WIDTH = 960;
  const HEIGHT = 600;
  const canvas = document.getElementById('arcade-canvas');
  const ctx = canvas.getContext('2d');
  const lobby = document.getElementById('arcade-lobby');
  const stage = document.getElementById('arcade-stage');
  const title = document.getElementById('arcade-current-title');
  const scoreElement = document.getElementById('arcade-score');
  const bestElement = document.getElementById('arcade-best');
  const extraElement = document.getElementById('arcade-extra');
  const instructionsElement = document.getElementById('arcade-instructions');
  const statusElement = document.getElementById('arcade-status');
  const pauseButton = document.getElementById('arcade-pause');
  const restartButton = document.getElementById('arcade-restart');
  const returnButton = document.getElementById('arcade-return');

  if (!ctx) {
    statusElement.textContent = 'This browser could not create the arcade canvas.';
    document.querySelectorAll('[data-launch-game]').forEach(button => {
      button.disabled = true;
    });
    return;
  }

  const gameInfo = {
    snake: {
      name: 'Snake',
      instructions: 'Use the arrow keys or WASD to steer. Eat the glowing dots, avoid the walls and your tail. Press P or Space to pause.',
      bestKey: 'chapterOneArcadeSnakeBest'
    },
    'brick-breaker': {
      name: 'Brick Breaker',
      instructions: 'Move the paddle with the left/right arrows or A/D. You can also move it with your pointer. Clear three levels; P or Space pauses.',
      bestKey: 'chapterOneArcadeBrickBreakerBest'
    },
    'fire-water': {
      name: 'Fire & Water',
      instructions: 'Fire: A/D to move, W to jump. Water: ←/→ to move, ↑ to jump. Stand on each switch to open the gate. Fire can cross lava, Water can cross water; both avoid the dark pools. Both explorers must reach their matching doors.',
      bestKey: 'chapterOneArcadeFireWaterBest'
    }
  };

  let activeGame = null;
  let activeId = null;
  let animationId = null;
  let previousFrame = 0;
  let paused = false;
  let finished = false;
  let keysDown = new Set();
  let storageWarning = '';

  function loadBest(id) {
    try {
      return Number(window.localStorage.getItem(gameInfo[id].bestKey)) || 0;
    } catch (error) {
      storageWarning = 'Local storage is unavailable; this high score will not persist.';
      return 0;
    }
  }

  function persistBest(id, score) {
    try {
      window.localStorage.setItem(gameInfo[id].bestKey, String(score));
      storageWarning = '';
    } catch (error) {
      storageWarning = 'Local storage is unavailable; this high score will not persist.';
    }
  }

  function stopLoop() {
    if (animationId !== null) {
      window.cancelAnimationFrame(animationId);
      animationId = null;
    }
    previousFrame = 0;
  }

  function updateHud() {
    if (!activeGame) return;
    const stats = activeGame.stats();
    scoreElement.textContent = stats.score;
    bestElement.textContent = stats.best;
    extraElement.textContent = stats.extra;
    statusElement.textContent = [stats.status, storageWarning].filter(Boolean).join(' ');
  }

  function drawOverlay(heading, message) {
    ctx.fillStyle = 'rgba(9, 12, 18, 0.76)';
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    ctx.textAlign = 'center';
    ctx.fillStyle = '#ffffff';
    ctx.font = '600 38px Montserrat, sans-serif';
    ctx.fillText(heading, WIDTH / 2, HEIGHT / 2 - 8);
    ctx.fillStyle = '#cbd3df';
    ctx.font = '500 16px Montserrat, sans-serif';
    ctx.fillText(message, WIDTH / 2, HEIGHT / 2 + 28);
  }

  function paint() {
    if (!activeGame) return;
    activeGame.draw(ctx);
    if (paused) drawOverlay('PAUSED', 'Press Resume or P to continue');
    else if (finished) {
      const state = activeGame.state();
      drawOverlay(state.won ? 'NICE RUN!' : 'GAME OVER', 'Restart or return to the arcade');
    }
  }

  function frame(timestamp) {
    animationId = null;
    if (!activeGame || paused || finished) return;

    const dt = previousFrame ? Math.min((timestamp - previousFrame) / 1000, 0.05) : 0;
    previousFrame = timestamp;
    activeGame.update(dt, keysDown);
    finished = activeGame.state().ended;
    paint();
    updateHud();

    if (!finished && !paused) {
      animationId = window.requestAnimationFrame(frame);
    }
  }

  function startLoop() {
    stopLoop();
    if (activeGame && !paused && !finished) {
      animationId = window.requestAnimationFrame(frame);
    }
  }

  function createSnake(best) {
    const cell = 30;
    const columns = WIDTH / cell;
    const rows = HEIGHT / cell;
    let snake;
    let direction;
    let nextDirection;
    let food;
    let score;
    let accumulator;
    let elapsed;
    let turnLocked;
    let ended;
    let won;
    let status;

    function placeFood() {
      const empty = [];
      for (let y = 0; y < rows; y += 1) {
        for (let x = 0; x < columns; x += 1) {
          if (!snake.some(segment => segment.x === x && segment.y === y)) {
            empty.push({ x, y });
          }
        }
      }
      food = empty.length ? empty[Math.floor(Math.random() * empty.length)] : null;
    }

    function reset() {
      snake = [
        { x: 15, y: 10 },
        { x: 14, y: 10 },
        { x: 13, y: 10 },
        { x: 12, y: 10 }
      ];
      direction = { x: 1, y: 0 };
      nextDirection = direction;
      food = null;
      score = 0;
      accumulator = 0;
      elapsed = 0;
      turnLocked = false;
      ended = false;
      won = false;
      status = 'Collect dots and keep your tail clear.';
      placeFood();
    }

    function step() {
      direction = nextDirection;
      const head = {
        x: snake[0].x + direction.x,
        y: snake[0].y + direction.y
      };
      const eating = food && head.x === food.x && head.y === food.y;
      const body = eating ? snake : snake.slice(0, -1);
      if (
        head.x < 0 || head.x >= columns || head.y < 0 || head.y >= rows ||
        body.some(segment => segment.x === head.x && segment.y === head.y)
      ) {
        ended = true;
        status = 'The run ended. Restart to try again.';
        return;
      }

      snake.unshift(head);
      if (eating) {
        score += 10;
        if (score > best) {
          best = score;
          persistBest('snake', best);
        }
        placeFood();
        if (!food) {
          ended = true;
          won = true;
          status = 'You filled the board!';
        }
      } else {
        snake.pop();
      }
      turnLocked = false;
    }

    reset();
    return {
      reset,
      handleKey(code) {
        const turns = {
          ArrowUp: { x: 0, y: -1 }, KeyW: { x: 0, y: -1 },
          ArrowDown: { x: 0, y: 1 }, KeyS: { x: 0, y: 1 },
          ArrowLeft: { x: -1, y: 0 }, KeyA: { x: -1, y: 0 },
          ArrowRight: { x: 1, y: 0 }, KeyD: { x: 1, y: 0 }
        };
        const turn = turns[code];
        if (!turn || turnLocked) return;
        if (turn.x === -direction.x && turn.y === -direction.y) return;
        nextDirection = turn;
        turnLocked = true;
      },
      update(dt) {
        if (ended) return;
        elapsed += dt;
        accumulator += dt;
        const interval = Math.max(0.058, 0.145 - Math.floor(score / 50) * 0.009);
        while (accumulator >= interval && !ended) {
          accumulator -= interval;
          step();
        }
      },
      draw(context) {
        context.fillStyle = '#111720';
        context.fillRect(0, 0, WIDTH, HEIGHT);
        context.strokeStyle = 'rgba(145, 169, 197, 0.07)';
        context.lineWidth = 1;
        for (let x = 0; x <= WIDTH; x += cell) {
          context.beginPath();
          context.moveTo(x, 0);
          context.lineTo(x, HEIGHT);
          context.stroke();
        }
        for (let y = 0; y <= HEIGHT; y += cell) {
          context.beginPath();
          context.moveTo(0, y);
          context.lineTo(WIDTH, y);
          context.stroke();
        }
        if (food) {
          context.fillStyle = '#f47968';
          context.beginPath();
          context.arc((food.x + 0.5) * cell, (food.y + 0.5) * cell, 9, 0, Math.PI * 2);
          context.fill();
          context.fillStyle = 'rgba(244, 121, 104, 0.22)';
          context.beginPath();
          context.arc((food.x + 0.5) * cell, (food.y + 0.5) * cell, 15, 0, Math.PI * 2);
          context.fill();
        }
        snake.forEach((segment, index) => {
          const inset = index === 0 ? 3 : 4;
          context.fillStyle = index === 0 ? '#90f2d0' : `rgba(83, 207, 171, ${Math.max(0.36, 0.92 - index * 0.025)})`;
          context.fillRect(segment.x * cell + inset, segment.y * cell + inset, cell - inset * 2, cell - inset * 2);
        });
        context.fillStyle = '#d9e3ed';
        context.textAlign = 'left';
        context.font = '500 15px Montserrat, sans-serif';
        context.fillText('SCORE  ' + score, 22, 30);
      },
      state: () => ({ ended, won }),
      stats: () => ({
        score,
        best,
        extra: 'Level ' + (1 + Math.floor(score / 50)),
        status
      })
    };
  }

  function createBrickBreaker(best) {
    const columns = 9;
    const brickWidth = 86;
    const brickHeight = 24;
    const gap = 10;
    const left = (WIDTH - (columns * brickWidth + (columns - 1) * gap)) / 2;
    let paddle;
    let ball;
    let bricks;
    let score;
    let lives;
    let level;
    let ended;
    let won;
    let status;

    function makeBricks() {
      const rows = 3 + level;
      bricks = [];
      for (let row = 0; row < rows; row += 1) {
        for (let column = 0; column < columns; column += 1) {
          bricks.push({
            x: left + column * (brickWidth + gap),
            y: 76 + row * (brickHeight + gap),
            w: brickWidth,
            h: brickHeight,
            color: ['#e66f67', '#e79b59', '#ddc567', '#60c6aa', '#65a9d8', '#9c8ce0'][(row + level) % 6]
          });
        }
      }
    }

    function resetBall() {
      paddle = { x: WIDTH / 2 - 66, y: HEIGHT - 44, w: 132, h: 14 };
      ball = { x: WIDTH / 2, y: HEIGHT - 72, r: 10, vx: 230, vy: -330 };
    }

    function reset() {
      score = 0;
      lives = 3;
      level = 1;
      ended = false;
      won = false;
      status = 'Keep the ball above the paddle.';
      makeBricks();
      resetBall();
    }

    reset();
    return {
      reset,
      handleKey() {},
      update(dt, keys) {
        if (ended) return;
        const paddleSpeed = 520;
        if (keys.has('ArrowLeft') || keys.has('KeyA')) paddle.x -= paddleSpeed * dt;
        if (keys.has('ArrowRight') || keys.has('KeyD')) paddle.x += paddleSpeed * dt;
        paddle.x = Math.max(8, Math.min(WIDTH - paddle.w - 8, paddle.x));

        const speedScale = 1 + (level - 1) * 0.1;
        const oldX = ball.x;
        const oldY = ball.y;
        ball.x += ball.vx * speedScale * dt;
        ball.y += ball.vy * speedScale * dt;

        if (ball.x - ball.r < 0) {
          ball.x = ball.r;
          ball.vx = Math.abs(ball.vx);
        } else if (ball.x + ball.r > WIDTH) {
          ball.x = WIDTH - ball.r;
          ball.vx = -Math.abs(ball.vx);
        }
        if (ball.y - ball.r < 0) {
          ball.y = ball.r;
          ball.vy = Math.abs(ball.vy);
        }

        if (
          ball.vy > 0 &&
          ball.y + ball.r >= paddle.y &&
          ball.y - ball.r <= paddle.y + paddle.h &&
          ball.x >= paddle.x - ball.r &&
          ball.x <= paddle.x + paddle.w + ball.r
        ) {
          const offset = (ball.x - (paddle.x + paddle.w / 2)) / (paddle.w / 2);
          const bounceOffset = Math.abs(offset) < 0.18
            ? (ball.vx >= 0 ? 0.18 : -0.18)
            : offset;
          ball.y = paddle.y - ball.r;
          ball.vx = bounceOffset * 360;
          ball.vy = -Math.max(270, Math.sqrt(230 * 230 + 330 * 330 - ball.vx * ball.vx));
        }

        const brick = bricks.find(candidate => {
          const closestX = Math.max(candidate.x, Math.min(ball.x, candidate.x + candidate.w));
          const closestY = Math.max(candidate.y, Math.min(ball.y, candidate.y + candidate.h));
          const dx = ball.x - closestX;
          const dy = ball.y - closestY;
          return dx * dx + dy * dy <= ball.r * ball.r;
        });
        if (brick) {
          if (oldY + ball.r <= brick.y || oldY - ball.r >= brick.y + brick.h) {
            ball.vy *= -1;
          } else if (oldX + ball.r <= brick.x || oldX - ball.r >= brick.x + brick.w) {
            ball.vx *= -1;
          } else {
            ball.vy *= -1;
          }
          bricks.splice(bricks.indexOf(brick), 1);
          score += 10 * level;
          if (score > best) {
            best = score;
            persistBest('brick-breaker', best);
          }
          if (bricks.length === 0) {
            level += 1;
            if (level > 3) {
              ended = true;
              won = true;
              status = 'All three levels cleared!';
            } else {
              makeBricks();
              resetBall();
              status = 'Level ' + level + ' — keep it going!';
            }
          }
        }

        if (ball.y - ball.r > HEIGHT) {
          lives -= 1;
          if (lives <= 0) {
            ended = true;
            status = 'Out of lives. Restart for another run.';
          } else {
            resetBall();
            status = lives + ' ' + (lives === 1 ? 'life' : 'lives') + ' left — keep going!';
          }
        }
      },
      setPointer(x) {
        paddle.x = Math.max(8, Math.min(WIDTH - paddle.w - 8, x - paddle.w / 2));
      },
      draw(context) {
        context.fillStyle = '#111720';
        context.fillRect(0, 0, WIDTH, HEIGHT);
        context.fillStyle = 'rgba(255, 255, 255, 0.06)';
        context.fillRect(0, 0, WIDTH, 48);
        context.textAlign = 'left';
        context.fillStyle = '#d9e3ed';
        context.font = '500 15px Montserrat, sans-serif';
        context.fillText('LEVEL ' + level + '     LIVES ' + lives, 22, 30);

        bricks.forEach(brick => {
          context.fillStyle = brick.color;
          context.fillRect(brick.x, brick.y, brick.w, brick.h);
          context.fillStyle = 'rgba(255, 255, 255, 0.2)';
          context.fillRect(brick.x, brick.y, brick.w, 4);
        });
        context.fillStyle = '#97dafa';
        context.fillRect(paddle.x, paddle.y, paddle.w, paddle.h);
        context.fillStyle = '#ffffff';
        context.beginPath();
        context.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
        context.fill();
      },
      state: () => ({ ended, won }),
      stats: () => ({ score, best, extra: Math.min(level, 3) + ' / 3 · ' + lives + ' lives', status })
    };
  }

  function rectanglesOverlap(a, b) {
    return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
  }

  const fireWaterLevels = [
    {
      solids: [
        { x: 0, y: 548, w: 960, h: 52 },
        { x: 95, y: 455, w: 100, h: 18, oneWay: true },
        { x: 365, y: 395, w: 100, h: 18, oneWay: true },
        { x: 620, y: 335, w: 100, h: 18, oneWay: true }
      ],
      hazards: [
        { x: 250, y: 520, w: 82, h: 28, type: 'water' },
        { x: 465, y: 520, w: 82, h: 28, type: 'lava' }
      ],
      switch: { x: 730, y: 516, w: 30, h: 32 },
      gate: { x: 830, y: 310, w: 22, h: 238 }
    },
    {
      solids: [
        { x: 0, y: 548, w: 250, h: 52 },
        { x: 340, y: 548, w: 620, h: 52 },
        { x: 80, y: 474, w: 110, h: 18, oneWay: true },
        { x: 625, y: 474, w: 110, h: 18, oneWay: true }
      ],
      hazards: [
        { x: 480, y: 520, w: 72, h: 28, type: 'water' },
        { x: 585, y: 520, w: 72, h: 28, type: 'lava' }
      ],
      switch: { x: 665, y: 442, w: 30, h: 32 },
      gate: { x: 830, y: 310, w: 22, h: 238 }
    },
    {
      solids: [
        { x: 0, y: 548, w: 960, h: 52 },
        { x: 80, y: 470, w: 100, h: 18, oneWay: true },
        { x: 700, y: 440, w: 110, h: 18, oneWay: true }
      ],
      hazards: [
        { x: 268, y: 520, w: 78, h: 28, type: 'water' },
        { x: 444, y: 520, w: 78, h: 28, type: 'lava' },
        { x: 660, y: 520, w: 72, h: 28, type: 'acid' }
      ],
      switch: { x: 758, y: 408, w: 30, h: 32 },
      gate: { x: 830, y: 310, w: 22, h: 238 }
    }
  ];

  function createFireWater(best) {
    const playerWidth = 25;
    const playerHeight = 34;
    const gravity = 1450;
    const moveSpeed = 260;
    const jumpSpeed = 595;
    let levelNumber;
    let level;
    let players;
    let score;
    let ended;
    let won;
    let switchActive;
    let jumpQueued;
    let status;

    function spawnPlayers() {
      players = [
        { kind: 'fire', x: 44, y: 514, w: playerWidth, h: playerHeight, vx: 0, vy: 0, grounded: false, spawnX: 44, spawnY: 514 },
        { kind: 'water', x: 84, y: 514, w: playerWidth, h: playerHeight, vx: 0, vy: 0, grounded: false, spawnX: 84, spawnY: 514 }
      ];
    }

    function reset() {
      levelNumber = 0;
      level = fireWaterLevels[levelNumber];
      score = 0;
      ended = false;
      won = false;
      switchActive = false;
      jumpQueued = { fire: false, water: false };
      status = 'Both explorers are ready. Reach the switch, then the matching doors.';
      spawnPlayers();
    }

    function allSolids() {
      return switchActive ? level.solids : level.solids.concat(level.gate);
    }

    function movePlayer(player, horizontal, jump, dt) {
      player.vx = horizontal * moveSpeed;
      if (jump && player.grounded) {
        player.vy = -jumpSpeed;
        player.grounded = false;
      }
      const solids = allSolids();
      player.x += player.vx * dt;
      player.x = Math.max(4, Math.min(WIDTH - playerWidth - 4, player.x));
      for (const solid of solids) {
        if (!solid.oneWay && rectanglesOverlap(player, solid)) {
          if (player.vx > 0) player.x = solid.x - playerWidth;
          else if (player.vx < 0) player.x = solid.x + solid.w;
        }
      }

      const previousY = player.y;
      player.vy = Math.min(900, player.vy + gravity * dt);
      player.y += player.vy * dt;
      player.grounded = false;
      for (const solid of solids) {
        if (!rectanglesOverlap(player, solid)) continue;
        if (player.vy > 0 && previousY + playerHeight <= solid.y + 2) {
          player.y = solid.y - playerHeight;
          player.vy = 0;
          player.grounded = true;
        } else if (player.vy < 0 && !solid.oneWay && previousY >= solid.y + solid.h - 2) {
          player.y = solid.y + solid.h;
          player.vy = 0;
        }
      }
    }

    function checkHazards(player) {
      const hazard = level.hazards.find(item => rectanglesOverlap(player, item));
      const wrongHazard = hazard && (
        hazard.type === 'acid' ||
        (hazard.type === 'water' && player.kind === 'fire') ||
        (hazard.type === 'lava' && player.kind === 'water')
      );
      if (player.y > HEIGHT + 20 || wrongHazard) {
        player.x = player.spawnX;
        player.y = player.spawnY;
        player.vx = 0;
        player.vy = 0;
        player.grounded = false;
        status = hazard ? 'Wrong element — that explorer respawned.' : 'Watch the gaps — that explorer respawned.';
      }
    }

    function exitFor(kind) {
      return kind === 'fire'
        ? { x: 858, y: 510, w: 42, h: 38 }
        : { x: 910, y: 510, w: 42, h: 38 };
    }

    function advanceLevel() {
      score += 100;
      levelNumber += 1;
      if (levelNumber >= fireWaterLevels.length) {
        ended = true;
        won = true;
        status = 'All three doors opened. You both made it!';
        if (fireWaterLevels.length > best) {
          best = fireWaterLevels.length;
          persistBest('fire-water', best);
        }
        return;
      }
      if (levelNumber > best) {
        best = levelNumber;
        persistBest('fire-water', best);
      }
      level = fireWaterLevels[levelNumber];
      switchActive = false;
      spawnPlayers();
      status = 'Level ' + (levelNumber + 1) + ' — find the switch and both doors.';
    }

    reset();
    return {
      reset,
      handleKey(code) {
        if (code === 'KeyW') jumpQueued.fire = true;
        if (code === 'ArrowUp') jumpQueued.water = true;
      },
      update(dt, keys) {
        if (ended) return;
        const fireHorizontal = Number(keys.has('KeyD')) - Number(keys.has('KeyA'));
        const waterHorizontal = Number(keys.has('ArrowRight')) - Number(keys.has('ArrowLeft'));
        movePlayer(players[0], fireHorizontal, jumpQueued.fire, dt);
        movePlayer(players[1], waterHorizontal, jumpQueued.water, dt);
        jumpQueued.fire = false;
        jumpQueued.water = false;
        players.forEach(checkHazards);

        if (!switchActive && players.some(player => rectanglesOverlap(player, level.switch))) {
          switchActive = true;
          status = 'Switch active — the gate is open!';
        }
        if (
          switchActive &&
          players.every(player => rectanglesOverlap(player, exitFor(player.kind)))
        ) {
          advanceLevel();
        }
      },
      draw(context) {
        context.fillStyle = '#111720';
        context.fillRect(0, 0, WIDTH, HEIGHT);
        context.fillStyle = '#182431';
        context.fillRect(0, 548, WIDTH, 52);

        level.solids.forEach(solid => {
          context.fillStyle = solid.y === 548 ? '#34404d' : '#596575';
          context.fillRect(solid.x, solid.y, solid.w, solid.h);
          context.fillStyle = 'rgba(255,255,255,0.2)';
          context.fillRect(solid.x, solid.y, solid.w, 4);
        });

        level.hazards.forEach(hazard => {
          context.fillStyle = hazard.type === 'water'
            ? '#247eb0'
            : hazard.type === 'lava'
              ? '#d96848'
              : '#7662a9';
          context.fillRect(hazard.x, hazard.y, hazard.w, hazard.h);
          context.fillStyle = 'rgba(255,255,255,0.2)';
          context.fillRect(hazard.x, hazard.y, hazard.w, 3);
        });

        if (!switchActive) {
          context.fillStyle = '#c79854';
          context.fillRect(level.switch.x, level.switch.y, level.switch.w, level.switch.h);
          context.fillStyle = '#ffe4a8';
          context.fillRect(level.switch.x + 5, level.switch.y + 5, level.switch.w - 10, 5);
          context.fillStyle = '#8B1E2D';
          context.fillRect(level.gate.x, level.gate.y, level.gate.w, level.gate.h);
        }

        [{ kind: 'fire', color: '#f17b54' }, { kind: 'water', color: '#62c7e8' }].forEach(({ kind, color }) => {
          const door = exitFor(kind);
          context.strokeStyle = switchActive ? color : 'rgba(210,220,235,0.4)';
          context.lineWidth = 4;
          context.strokeRect(door.x, door.y, door.w, door.h);
          context.fillStyle = color;
          context.textAlign = 'center';
          context.font = '600 11px Montserrat, sans-serif';
          context.fillText(kind.toUpperCase(), door.x + door.w / 2, door.y - 7);
        });

        players.forEach(player => {
          context.fillStyle = player.kind === 'fire' ? '#f17b54' : '#62c7e8';
          context.fillRect(player.x, player.y, playerWidth, playerHeight);
          context.fillStyle = '#151922';
          context.fillRect(player.x + 6, player.y + 9, 4, 4);
          context.fillRect(player.x + 15, player.y + 9, 4, 4);
          context.fillStyle = '#fff';
          context.textAlign = 'left';
          context.font = '500 12px Montserrat, sans-serif';
          context.fillText(player.kind === 'fire' ? '1' : '2', player.x + 9, player.y + 29);
        });

        context.textAlign = 'left';
        context.fillStyle = '#d9e3ed';
        context.font = '500 15px Montserrat, sans-serif';
        context.fillText('LEVEL ' + (levelNumber + 1) + ' / 3', 22, 30);
      },
      state: () => ({ ended, won }),
      stats: () => ({
        score,
        best: best ? 'Level ' + best : '—',
        extra: Math.min(levelNumber + 1, fireWaterLevels.length) + ' / 3',
        status
      })
    };
  }

  function launch(id) {
    if (!gameInfo[id]) return;
    stopLoop();
    activeId = id;
    activeGame = id === 'snake'
      ? createSnake(loadBest(id))
      : id === 'brick-breaker'
        ? createBrickBreaker(loadBest(id))
        : createFireWater(loadBest(id));
    paused = false;
    finished = false;
    keysDown.clear();
    lobby.hidden = true;
    stage.hidden = false;
    title.textContent = gameInfo[id].name;
    instructionsElement.textContent = gameInfo[id].instructions;
    pauseButton.textContent = 'Pause';
    updateHud();
    paint();
    startLoop();
    canvas.focus({ preventScroll: true });
  }

  function restart() {
    if (!activeId) return;
    launch(activeId);
  }

  function returnToArcade() {
    stopLoop();
    activeGame = null;
    activeId = null;
    paused = false;
    finished = false;
    keysDown.clear();
    stage.hidden = true;
    lobby.hidden = false;
    pauseButton.textContent = 'Pause';
    statusElement.textContent = 'Choose a game to play.';
  }

  function togglePause() {
    if (!activeGame || finished) return;
    paused = !paused;
    pauseButton.textContent = paused ? 'Resume' : 'Pause';
    if (paused) {
      stopLoop();
      paint();
    } else {
      keysDown.clear();
      startLoop();
    }
    updateHud();
  }

  document.querySelectorAll('[data-launch-game]').forEach(button => {
    button.addEventListener('click', () => launch(button.dataset.launchGame));
  });
  pauseButton.addEventListener('click', togglePause);
  restartButton.addEventListener('click', restart);
  returnButton.addEventListener('click', returnToArcade);

  document.addEventListener('keydown', event => {
    if (!activeGame) return;
    if (event.code.startsWith('Arrow') || event.code === 'Space') event.preventDefault();
    if (event.repeat) return;
    if (event.code === 'KeyP' || event.code === 'Space') {
      togglePause();
      return;
    }
    keysDown.add(event.code);
    activeGame.handleKey(event.code);
  });
  document.addEventListener('keyup', event => {
    keysDown.delete(event.code);
  });
  window.addEventListener('blur', () => keysDown.clear());
  canvas.addEventListener('pointermove', event => {
    if (!activeGame || activeId !== 'brick-breaker' || paused || finished) return;
    const rect = canvas.getBoundingClientRect();
    const x = (event.clientX - rect.left) * (WIDTH / rect.width);
    activeGame.setPointer(x);
  });

  window.ArcadeApp = {
    launch,
    restart,
    togglePause,
    returnToArcade,
    getSnapshot() {
      const state = activeGame ? activeGame.state() : { ended: false, won: false };
      const stats = activeGame ? activeGame.stats() : {};
      return {
        game: activeId,
        active: Boolean(activeGame),
        paused,
        finished,
        score: stats.score ?? null,
        extra: stats.extra ?? null,
        ended: state.ended,
        won: state.won,
        animationRunning: animationId !== null
      };
    }
  };
})();
