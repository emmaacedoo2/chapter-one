'use strict';

const TravelGuide = (() => {
  function node(tag, text, className) {
    const el = document.createElement(tag);
    if (text) el.textContent = text;
    if (className) el.className = className;
    return el;
  }

  function shuffled(items, random = Math.random) {
    const copy = [...items];
    for (let index = copy.length - 1; index > 0; index--) {
      const other = Math.floor(random() * (index + 1));
      [copy[index], copy[other]] = [copy[other], copy[index]];
    }
    return copy;
  }

  function round(bank, length, random = Math.random) {
    return shuffled(bank, random).slice(0, length).map(([question, options, correct = 0]) => ({
      question, answer: options[correct], options: shuffled(options, random)
    }));
  }

  function button(label, action, style) {
    const el = node('button', label, style);
    el.type = 'button';
    el.addEventListener('click', action);
    return el;
  }

  function quiz(root, bank, { length = 10, title = () => 'Round complete' } = {}) {
    let active, index, score;
    function start() {
      active = round(bank, length);
      index = 0;
      score = 0;
      render(true);
    }
    function render(focus) {
      root.replaceChildren();
      const question = active[index];
      if (!question) {
        const heading = node('p', title(score, active.length), 'guide-quiz-title');
        heading.tabIndex = -1;
        root.append(heading, node('p', score + ' of ' + active.length + ' correct.'), button('Play again', start, 'pill'));
        heading.focus();
        return;
      }
      const heading = node('p', 'Question ' + (index + 1) + ' of ' + active.length + ' · ' + question.question, 'guide-quiz-title');
      heading.tabIndex = -1;
      const choices = node('div', '', 'answers');
      const feedback = node('p', '', 'quiz-feedback');
      feedback.setAttribute('aria-live', 'polite');
      let answered = false;
      question.options.forEach(option => {
        choices.append(button(option, () => {
          if (answered) return;
          answered = true;
          const correct = option === question.answer;
          if (correct) score++;
          for (const choice of choices.children) {
            choice.disabled = true;
            if (choice.textContent === question.answer) choice.classList.add('guide-correct');
          }
          feedback.textContent = correct ? 'Correct!' : 'The answer is ' + question.answer + '.';
          const next = button(index + 1 === active.length ? 'See results' : 'Next question', () => {
            index++;
            render(true);
          }, 'pill');
          root.append(next);
          next.focus();
        }));
      });
      root.append(heading, choices, feedback);
      if (focus) heading.focus();
    }
    root.replaceChildren(button('Start quiz', start, 'pill'));
  }

  function savedChecks(storage, key, length) {
    const raw = storage.getItem(key);
    const saved = JSON.parse(raw ?? '[]');
    if (!Array.isArray(saved)) throw new Error('Unrecognized checklist format');
    return new Set(saved.filter(index => Number.isInteger(index) && index >= 0 && index < length));
  }

  function checklist({ list, label, bar, activities, key }) {
    let checked = new Set();
    let readable = true;
    try { checked = savedChecks(localStorage, key, activities.length); }
    catch { readable = false; }
    function update(message = '') {
      label.textContent = checked.size + ' of ' + activities.length + ' complete.' + (message ? ' ' + message : '');
      bar.max = activities.length;
      bar.value = checked.size;
    }
    activities.forEach((activity, index) => {
      const row = node('label');
      const input = node('input');
      input.type = 'checkbox';
      input.checked = checked.has(index);
      input.addEventListener('change', () => {
        if (input.checked) checked.add(index);
        else checked.delete(index);
        try {
          if (!readable) throw new Error('Existing progress could not be read');
          localStorage.setItem(key, JSON.stringify([...checked]));
          update();
        } catch {
          update('Progress could not be saved on this device.');
        }
      });
      row.append(input, node('span', activity));
      list.append(row);
    });
    update(readable ? '' : 'Saved progress could not be read.');
  }

  return { node, round, quiz, checklist, savedChecks };
})();

if (typeof module !== 'undefined') module.exports = TravelGuide;
