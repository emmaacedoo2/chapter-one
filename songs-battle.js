(() => {
  const modes = {
    song: 'Guess the Song',
    artist: 'Guess the Artist',
    trivia: 'Music Trivia',
    ultimate: 'Ultimate Battle'
  };
  const historyModes = {
    ...modes, album: 'Guess the Album', year: 'Guess the Year',
    personal: 'Who Knows Who Better?', speed: 'Speed Round'
  };
  const find = id => document.getElementById('music-' + id);
  const form = find('settings');
  const setup = find('setup');
  const play = find('play');
  const finish = find('finish');
  const answers = find('answers');
  const next = find('next');
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
  const custom = read(customKey, []);
  let seen = read(seenKey, []);
  let mode = 'song';
  let game, audio;
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
    return { mode, duo: fields.get('players') === 'duo',
      length: fields.get('length') === '20' ? 20 : 10 };
  }
  function pool(settings) {
    return [...globalThis.MusicQuestions, ...custom].filter(question =>
      settings.mode === 'ultimate' || question.category === settings.mode ||
      (settings.mode === 'trivia' && ['album', 'year'].includes(question.category)));
  }
  function choose(settings) {
    const played = new Map(seen.map((id, index) => [id, index]));
    const groups = new Map();
    for (const question of shuffle(pool(settings))) {
      if (!groups.has(question.category)) groups.set(question.category, []);
      groups.get(question.category).push(question);
    }
    const queues = [...groups.values()];
    for (const queue of queues) {
      queue.sort((a, b) => (played.get(a.id) ?? -1) - (played.get(b.id) ?? -1));
    }
    const questions = [];
    while (questions.length < settings.length && queues.some(queue => queue.length)) {
      for (const queue of shuffle(queues)) {
        if (queue.length) questions.push(queue.shift());
        if (questions.length === settings.length) break;
      }
    }
    return questions;
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
      new Date(item.date).toLocaleDateString() + ' · ' + (historyModes[item.mode] || item.mode) + ' · ' +
      (item.difficulty ? item.difficulty + ' · ' : '') + item.result + ' · ' + item.scores.join('–'))));
  }
  function dashboard() {
    game = undefined;
    setup.hidden = false;
    play.hidden = finish.hidden = true;
    board();
    records();
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
    game.player = settings.duo ? index % 2 : 0;
    game.question = game.questions[index];
    const name = ['Dom', 'Emma'][game.player];
    board();
    find('progress').max = game.questions.length;
    find('progress').value = index + 1;
    find('game-mode').textContent = modes[settings.mode];
    find('round').textContent = 'Question ' + (index + 1) + ' of ' + game.questions.length;
    find('turn').textContent = settings.duo ? name + '’s turn' : 'Solo round';
    find('feedback').replaceChildren();
    next.hidden = true;
    answers.replaceChildren();
    game.phase = 'answer';
    const { question } = game;
    seen = [...seen.filter(id => id !== question.id), question.id];
    save(seenKey, seen);
    find('question').textContent = question.question;
    for (const value of shuffle([question.answer, ...question.incorrect])) {
      const choice = button(value, () => answer(value, choice), 'music-answer');
      answers.append(choice);
    }
    find('question').focus();
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
    game.phase = 'answered';
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
    const feedback = find('feedback');
    feedback.textContent = (correct ? 'Correct! ' : 'Incorrect. ') +
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
    stats.history.push({ date: new Date().toISOString(), mode: settings.mode,
      length: settings.length, scores, result: titles[winner] });
    save(statsKey, stats);
    play.hidden = true;
    finish.hidden = false;
    finish.dataset.winner = winner;
    find('result').textContent = titles[winner];
    find('result-detail').textContent = names.map((name, index) =>
      name + ' · ' + scores[index] + '/' + (settings.length / scores.length) + ' correct'
    ).join('  |  ');
    find('result').focus();
  }
  Object.entries(modes).forEach(([id, title]) => {
    const card = button(title, () => {
      mode = id;
      find('modes').querySelectorAll('button').forEach(el => {
        el.setAttribute('aria-pressed', String(el === card));
      });
    }, 'music-mode');
    card.setAttribute('aria-pressed', String(mode === id));
    find('modes').append(card);
  });
  form.addEventListener('submit', event => { event.preventDefault(); start(config()); });
  sound.addEventListener('change', () => {
    save(prefix + 'sound_v1', sound.checked);
    unlockSound();
  });
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
  board();
  records();
})();
