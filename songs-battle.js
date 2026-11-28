(() => {
  const modes = {
    song: ['Guess the Song', 'Follow the clues to the track.'],
    artist: ['Guess the Artist', 'Connect tracks, albums and careers.'],
    album: ['Guess the Album', 'Find the record behind the track.'],
    year: ['Guess the Year', 'Place releases on the timeline.'],
    trivia: ['Music Trivia', 'Test your knowledge across genres.'],
    personal: ['Who Knows Who Better?', 'Play questions about your music memories.'],
    speed: ['Speed Round', 'Beat the 12-second clock.'],
    ultimate: ['The Ultimate Battle', 'Mix all the categories.']
  };
  const find = id => document.getElementById('music-' + id);
  const form = find('settings');
  const setup = find('setup');
  const play = find('play');
  const finish = find('finish');
  const answers = find('answers');
  const next = find('next');
  const clock = find('clock');
  const sound = find('sound');
  const prefix = 'chapter_one_music_';
  const read = (key, fallback) => {
    try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
    catch { return fallback; }
  };
  const save = (key, value) => {
    try { localStorage.setItem(key, JSON.stringify(value)); return true; }
    catch {
      find('storage').textContent = 'This browser could not save your latest changes.';
      return false;
    }
  };
  const blank = () => ({ domWins: 0, emmaWins: 0, ties: 0, total: 0, high: {}, streak: {}, history: [] });
  const statsKey = prefix + 'battle_v1';
  const customKey = prefix + 'questions_v1';
  const seenKey = prefix + 'seen_v1';
  let stats = read(statsKey, null);
  if (!stats) {
    const old = read('chapter_one_battle_stats', {});
    stats = { ...blank(), domWins: old.domWins || 0, emmaWins: old.emmaWins || 0, ties: old.ties || 0 };
    stats.total = stats.domWins + stats.emmaWins + stats.ties;
  }
  let custom = read(customKey, []);
  let seen = read(seenKey, []);
  let mode = 'song';
  let game, timer, audio;
  sound.checked = read(prefix + 'sound_v1', false);

  function node(tag, text, className) {
    const el = document.createElement(tag);
    el.textContent = text;
    if (className) el.className = className;
    return el;
  }
  function button(text, action, className) {
    const el = node('button', text, className);
    el.type = 'button';
    el.addEventListener('click', action);
    return el;
  }
  function shuffle(items) {
    const copy = [...items];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }
  function config() {
    const fields = new FormData(form);
    return { mode, difficulty: fields.get('difficulty'), duo: fields.get('players') === 'duo',
      length: Number(fields.get('length')), timed: mode === 'speed' || fields.has('timed') };
  }
  function pool(settings) {
    return [...globalThis.MusicQuestions, ...custom].filter(q => q.difficulty === settings.difficulty &&
      (q.category === settings.mode || settings.mode === 'ultimate' ||
        (settings.mode === 'speed' && q.category !== 'personal')));
  }
  function choose(settings) {
    const eligible = pool(settings);
    const byId = new Map(eligible.map(q => [q.id, q]));
    const played = new Set(seen);
    const fresh = shuffle(eligible.filter(q => !played.has(q.id)));
    if (settings.mode === 'speed' || settings.mode === 'ultimate') {
      const groups = new Map();
      for (const question of fresh) {
        if (!groups.has(question.category)) groups.set(question.category, []);
        groups.get(question.category).push(question);
      }
      fresh.length = 0;
      const queues = [...groups.values()];
      for (let index = 0; queues.some(queue => index < queue.length); index++) {
        fresh.push(...shuffle(queues).flatMap(queue => queue[index] ? [queue[index]] : []));
      }
    }
    return [...fresh, ...seen.filter(id => byId.has(id)).map(id => byId.get(id))].slice(0, settings.length);
  }
  function updateLengths() {
    const settings = config();
    const total = pool(settings).length;
    const sizes = [10, 20, 30].filter(n => n <= total);
    const short = settings.duo ? total - total % 2 : total;
    if (!sizes.length && short) sizes.push(short);
    form.elements.namedItem('length').replaceChildren(...sizes.map(n => new Option(n + (n === 1 ? ' question' : ' questions'), n)));
    if (sizes.includes(settings.length)) form.elements.namedItem('length').value = settings.length;
    find('start').disabled = !sizes.length;
    find('pool').textContent = total + ' available at this difficulty.' +
      (!sizes.length ? ' Choose another difficulty or add personal questions.' :
        total < 30 ? ' Round lengths reflect the available questions.' : '');
    find('timer-label').hidden = mode === 'speed';
  }
  function board() {
    const scoreboard = find('scoreboard');
    if (game && !game.settings.duo) {
      scoreboard.replaceChildren(node('span', 'SOLO  ' + game.scores[0], 'music-emma'));
      return;
    }
    scoreboard.replaceChildren(
      node('span', 'DOM  ' + (game ? game.scores[0] : stats.domWins + ' wins'), 'music-dom'),
      node('span', 'VS', 'music-versus'),
      node('span', 'EMMA  ' + (game ? game.scores[1] : stats.emmaWins + ' wins'), 'music-emma')
    );
  }
  function records() {
    const format = values => Object.entries(values).map(([name, count]) => name + ' ' + count).join(' · ') || '—';
    find('totals').textContent = stats.total + ' games · ' + stats.ties + ' ties';
    find('records').textContent = 'High scores ' + format(stats.high) + ' | Best streaks ' + format(stats.streak);
    find('history').replaceChildren(...stats.history.slice().reverse().map(item => node('li',
      new Date(item.date).toLocaleDateString() + ' · ' + modes[item.mode][0] + ' · ' +
      item.difficulty + ' · ' + item.result + ' · ' + item.scores.join('–'))));
  }
  function dashboard() {
    clearInterval(timer);
    game = undefined;
    setup.hidden = false;
    play.hidden = finish.hidden = true;
    board();
    records();
    updateLengths();
    find('dashboard-title').focus();
  }
  function start(settings) {
    const questions = choose(settings);
    if (!questions.length || questions.length !== settings.length) return;
    unlockSound();
    game = { settings, questions, index: 0, scores: settings.duo ? [0, 0] : [0],
      streaks: [0, 0], best: [0, 0] };
    setup.hidden = finish.hidden = true;
    play.hidden = false;
    prepare();
  }
  function prepare() {
    const { index, settings } = game;
    game.phase = 'handoff';
    game.player = settings.duo ? index % 2 : 0;
    game.question = game.questions[index];
    const name = ['Dom', 'Emma'][game.player];
    board();
    find('progress').max = game.questions.length;
    find('progress').value = index + 1;
    find('game-mode').textContent = modes[settings.mode][0];
    find('round').textContent = 'Question ' + (index + 1) + ' of ' + game.questions.length;
    find('turn').textContent = settings.duo ? name + '’s turn' : 'Solo round';
    find('streak').textContent = 'Streak ' + game.streaks[game.player];
    find('feedback').replaceChildren();
    next.hidden = clock.hidden = true;
    answers.replaceChildren();
    if (!settings.duo) {
      openQuestion();
      return;
    }
    find('question').textContent = 'Pass to ' + name;
    find('ready').hidden = false;
    find('ready').textContent = name + ' is ready';
    find('question').focus();
  }
  function openQuestion() {
    if (game?.phase !== 'handoff') return;
    game.phase = 'answer';
    const { question } = game;
    seen = [...seen.filter(id => id !== question.id), question.id];
    save(seenKey, seen);
    find('ready').hidden = true;
    find('question').textContent = question.question;
    for (const value of shuffle([question.answer, ...question.incorrect])) {
      const choice = button(value, () => answer(value, choice), 'music-answer');
      answers.append(choice);
    }
    find('question').focus();
    if (game.settings.timed) {
      game.remaining = game.settings.mode === 'speed' ? 12000 : 25000;
      clock.hidden = false;
      clock.textContent = Math.ceil(game.remaining / 1000) + ' seconds';
      resume();
    }
  }
  function resume() {
    if (!game?.settings.timed || game.phase !== 'answer' || document.hidden || game.deadline != null) return;
    game.deadline = performance.now() + game.remaining;
    timer = setInterval(() => {
      const seconds = Math.max(0, Math.ceil((game.deadline - performance.now()) / 1000));
      clock.textContent = seconds + ' seconds';
      if (!seconds) answer(null);
    }, 100);
  }
  function unlockSound() {
    const Context = window.AudioContext || window.webkitAudioContext;
    if (!sound.checked || !Context) return;
    try {
      audio ||= new Context();
      audio.resume().catch(() => {});
    } catch { /* Audio is optional. */ }
  }
  function tone(correct) {
    if (!sound.checked || audio?.state !== 'running') return;
    const oscillator = audio.createOscillator();
    const gain = audio.createGain();
    oscillator.connect(gain).connect(audio.destination);
    oscillator.frequency.setValueAtTime(correct ? 523 : 220, audio.currentTime);
    oscillator.frequency.setValueAtTime(correct ? 659 : 175, audio.currentTime + .08);
    gain.gain.setValueAtTime(.04, audio.currentTime);
    gain.gain.exponentialRampToValueAtTime(.001, audio.currentTime + .23);
    oscillator.start();
    oscillator.stop(audio.currentTime + .24);
  }
  function answer(value, selected) {
    if (game?.phase !== 'answer' || document.hidden) return;
    if (game.deadline != null && performance.now() >= game.deadline) {
      value = null;
      selected = null;
      clock.textContent = 'Time’s up';
    }
    game.phase = 'answered';
    clearInterval(timer);
    game.deadline = null;
    const { question, player } = game;
    const correct = value === question.answer;
    for (const choice of answers.children) {
      choice.disabled = true;
      if (choice.textContent === question.answer) choice.classList.add('music-correct');
    }
    if (!correct) selected?.classList.add('music-incorrect');
    if (correct) {
      game.scores[player]++;
      game.streaks[player]++;
      game.best[player] = Math.max(game.best[player], game.streaks[player]);
    } else game.streaks[player] = 0;
    board();
    if (correct) find('scoreboard').children[player ? 2 : 0]?.classList.add('music-pop');
    find('streak').textContent = 'Streak ' + game.streaks[player];
    const feedback = find('feedback');
    feedback.textContent = (correct ? 'Correct! ' : value === null ? 'Time’s up. ' : 'Incorrect. ') +
      (correct ? '' : 'Answer: ' + question.answer + '. ') + question.explanation;
    if (/^https:\/\//.test(question.source || '') ||
        /^(?:our-songs\.html)?#section-[a-z-]+$/.test(question.source || '')) {
      const source = node('a', 'Source');
      source.href = question.source;
      if (question.source.startsWith('https://')) {
        source.target = '_blank';
        source.rel = 'noopener noreferrer';
      }
      feedback.append(' ', source);
    }
    next.hidden = false;
    next.textContent = game.index + 1 === game.questions.length ? 'See results' : 'Next turn';
    next.focus();
    tone(correct);
  }
  function results() {
    game.phase = 'finished';
    const { scores, best, settings } = game;
    const [dom, emma] = scores;
    const winner = !settings.duo ? 'solo' : dom === emma ? 'tie' : dom > emma ? 'dom' : 'emma';
    const titles = { solo: 'Round complete', tie: 'It’s a tie ♡', dom: 'Dom wins!', emma: 'Emma wins!' };
    if (winner === 'tie') stats.ties++;
    if (winner === 'dom') stats.domWins++;
    if (winner === 'emma') stats.emmaWins++;
    const names = settings.duo ? ['Dom', 'Emma'] : ['Solo'];
    names.forEach((name, index) => {
      stats.high[name] = Math.max(stats.high[name] || 0, scores[index]);
      stats.streak[name] = Math.max(stats.streak[name] || 0, best[index]);
    });
    stats.total++;
    stats.history.push({ date: new Date().toISOString(), mode: settings.mode, difficulty: settings.difficulty,
      length: settings.length, scores, result: titles[winner] });
    save(statsKey, stats);
    play.hidden = true;
    finish.hidden = false;
    finish.dataset.winner = winner;
    find('result').textContent = titles[winner];
    find('result-detail').textContent = names.map((name, index) =>
      name + ' · ' + scores[index] + '/' + (settings.length / scores.length) + ' correct · best streak ' + best[index]
    ).join('  |  ');
    find('result').focus();
  }
  function renderCustom() {
    const list = find('custom-list');
    list.replaceChildren();
    for (const question of custom) {
      const item = node('li', question.question + ' ');
      item.append(button('Remove', () => {
        const updated = custom.filter(entry => entry.id !== question.id);
        if (!save(customKey, updated)) return;
        custom = updated;
        renderCustom();
        updateLengths();
        find('custom').querySelector('input').focus();
      }));
      list.append(item);
    }
  }

  Object.entries(modes).forEach(([id, [title, description]]) => {
    const card = button('', () => {
      mode = id;
      find('modes').querySelectorAll('button').forEach(el => {
        el.setAttribute('aria-pressed', String(el === card));
      });
      updateLengths();
    }, 'music-mode');
    card.setAttribute('aria-pressed', String(mode === id));
    card.dataset.mode = id;
    card.append(node('strong', title), node('span', description));
    find('modes').append(card);
  });
  form.addEventListener('change', updateLengths);
  form.addEventListener('submit', event => { event.preventDefault(); start(config()); });
  sound.addEventListener('change', () => {
    save(prefix + 'sound_v1', sound.checked);
    unlockSound();
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      clearInterval(timer);
      if (game?.deadline != null) {
        game.remaining = Math.max(0, game.deadline - performance.now());
        game.deadline = null;
      }
    } else resume();
  });
  find('ready').addEventListener('click', openQuestion);
  next.addEventListener('click', () => {
    if (game?.phase !== 'answered') return;
    game.index++;
    if (game.index === game.questions.length) results();
    else prepare();
  });
  find('exit').addEventListener('click', () => {
    if (confirm('Leave this game and return to game selection?')) dashboard();
  });
  find('again').addEventListener('click', () => {
    if (game?.phase === 'finished') start(game.settings);
  });
  find('menu').addEventListener('click', dashboard);
  find('reset').addEventListener('click', () => {
    if (!confirm('Reset the Music Battle statistics and history in this browser?')) return;
    const reset = blank();
    if (save(statsKey, reset)) {
      stats = reset;
      board();
      records();
    }
  });
  find('custom').addEventListener('submit', event => {
    event.preventDefault();
    const fields = new FormData(event.target);
    const field = name => String(fields.get(name)).trim();
    const question = field('question');
    const correct = field('answer');
    const incorrect = ['wrong1', 'wrong2', 'wrong3'].map(field);
    const explanation = field('explanation');
    const difficulty = field('difficulty');
    const status = find('custom-status');
    const choices = [correct, ...incorrect];
    if (!question || !explanation || choices.some(value => !value) ||
        new Set(choices.map(value => value.toLowerCase())).size !== choices.length ||
        [...globalThis.MusicQuestions, ...custom].some(entry => entry.question.toLowerCase() === question.toLowerCase())) {
      status.textContent = 'Enter a new question, four different choices and an explanation.';
      return;
    }
    const id = 'personal-' + Date.now() + '-' + Math.random().toString(36).slice(2);
    const updated = [...custom, { id, category: 'personal', difficulty, question, answer: correct, incorrect, explanation }];
    if (!save(customKey, updated)) return;
    custom = updated;
    event.target.reset();
    status.textContent = 'Question saved in this browser.';
    renderCustom();
    updateLengths();
  });

  board();
  records();
  updateLengths();
  renderCustom();
})();
