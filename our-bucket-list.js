(() => {
  const storageKey = 'chapter_one_bucket_list_v1';
  const get = id => document.getElementById('bucket-' + id);
  const list = get('list');
  const empty = get('empty');
  const template = get('card');
  const feedback = get('feedback');
  const form = get('form');
  const filters = [...document.querySelectorAll('.bucket-filters button')];
  let filter = 'all';
  let experiences = [];
  let canSave = true;

  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) ?? '[]');
    if (!Array.isArray(saved)) throw new Error('Invalid Bucket List data');
    experiences = saved.filter(item =>
      typeof item?.title === 'string' && typeof item.category === 'string');
  } catch {
    canSave = false;
    feedback.textContent = 'Saved adventures could not be read. Changes will last until this page closes.';
  }

  function save(message) {
    if (canSave) {
      try {
        localStorage.setItem(storageKey, JSON.stringify(experiences));
        feedback.textContent = message;
        return;
      } catch {
        canSave = false;
      }
    }
    feedback.textContent = message + ' This browser could not save the change.';
  }

  function updateProgress() {
    const completed = experiences.filter(item => item.completed === true).length;
    get('total').textContent = experiences.length;
    get('completed').textContent = completed;
    get('remaining').textContent = experiences.length - completed;
    get('meter').max = Math.max(1, experiences.length);
    get('meter').value = completed;
  }

  function matchesFilter(item) {
    return filter === 'all' || (item.completed === true) === (filter === 'completed');
  }

  function updateCard(card, item) {
    const completed = item.completed === true;
    card.classList.toggle('is-complete', completed);
    card.querySelector('.bucket-stamp').hidden = !completed;
    card.querySelector('input').checked = completed;
    card.querySelector('.bucket-check span').textContent = completed ? 'Mark as to do' : 'Mark complete';
  }

  function render() {
    updateProgress();
    const cards = experiences.filter(matchesFilter).map(item => {
      const card = template.content.firstElementChild.cloneNode(true);
      card.querySelector('h3').textContent = item.title;
      card.querySelector('.bucket-category').textContent = item.category;
      const checkbox = card.querySelector('input');
      checkbox.setAttribute('aria-label', 'Completed: ' + item.title);
      updateCard(card, item);
      checkbox.addEventListener('change', () => {
        item.completed = checkbox.checked;
        save(item.completed ? 'Adventure completed.' : 'Adventure marked as to do.');
        if (matchesFilter(item)) {
          updateCard(card, item);
          updateProgress();
        } else {
          render();
          filters.find(button => button.dataset.filter === filter).focus();
        }
      });
      return card;
    });
    list.replaceChildren(...cards);
    empty.hidden = cards.length > 0;
    empty.textContent = !experiences.length ? 'Add an adventure to start your list.' :
      filter === 'completed' ? 'No completed adventures yet.' : 'No adventures left to do.';
  }

  function selectFilter(value) {
    filter = value;
    filters.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.filter === value)));
    render();
  }

  filters.forEach(button => button.addEventListener('click', () => selectFilter(button.dataset.filter)));
  const titleInput = get('title');
  titleInput.addEventListener('input', () => titleInput.setCustomValidity(''));
  form.addEventListener('submit', event => {
    event.preventDefault();
    const title = titleInput.value.trim();
    if (!title) {
      titleInput.setCustomValidity('Enter an experience title.');
      titleInput.reportValidity();
      return;
    }
    experiences.push({ title, category: get('category').value, completed: false });
    save('Adventure added.');
    form.reset();
    const add = get('add');
    add.open = false;
    selectFilter(filter === 'completed' ? 'todo' : filter);
    add.querySelector('summary').focus();
  });

  render();
})();
