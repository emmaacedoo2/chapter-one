(() => {
  const storageKey = 'chapter_one_bucket_list_v1';
  const defaults = [
    ['new-york', 'Travel to New York together', 'Travel & Adventures'],
    ['greece', 'Travel to Greece together', 'Travel & Adventures'],
    ['california', 'Explore California together', 'Travel & Adventures'],
    ['steelers', 'Go to a Pittsburgh Steelers game together', 'Sports'],
    ['real-madrid', 'Watch Real Madrid play at the Santiago Bernabéu', 'Sports']
  ].map(([id, title, category]) => ({ id, title, category, completed: false }));
  const normalize = title => title.normalize('NFKD').toLowerCase()
    .replace(/\p{M}/gu, '').replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
  const get = id => document.getElementById('bucket-' + id);
  const list = get('list');
  const empty = get('empty');
  const template = get('card');
  const feedback = get('feedback');
  const ideaFeedback = get('idea-feedback');
  const ideasList = get('ideas');
  const form = get('form');
  const add = get('add');
  const titleInput = get('title');
  const categoryInput = get('category');
  const categoryFilter = get('filter-category');
  const filters = [...document.querySelectorAll('.bucket-filters button')];
  const formCategories = [...categoryInput.options].map(option => option.value);
  const ideas = Object.entries(bucketIdeas).flatMap(([category, titles]) =>
    titles.map(title => ({ title, category })));
  let filter = 'all';
  let editing;
  let lineup = [];
  let deck = [];
  let experiences = [];
  let canSave = true;
  let nextId = 1;

  function personalId() {
    return 'personal-' + nextId++;
  }

  function save(message = '', status = feedback) {
    if (canSave) {
      try {
        localStorage.setItem(storageKey, JSON.stringify({ experiences, nextId }));
        status.textContent = message;
        return;
      } catch {
        canSave = false;
      }
    }
    status.textContent = [message, 'This browser could not save the change.'].filter(Boolean).join(' ');
  }

  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) ?? '[]');
    const legacy = Array.isArray(saved);
    const items = legacy ? saved : saved?.experiences;
    if (!Array.isArray(items)) throw new Error('Invalid Bucket List data');
    experiences = items.filter(item => typeof item?.title === 'string' && typeof item.category === 'string');
    nextId = Math.max(1, saved.nextId || 1, ...experiences.map(item =>
      Number(/^personal-(\d+)$/.exec(item.id)?.[1] || 0) + 1));
    if (legacy) {
      for (const item of experiences) {
        const match = defaults.find(entry => normalize(entry.title) === normalize(item.title) &&
          !experiences.some(other => other.id === entry.id));
        item.id = match?.id ?? personalId();
      }
      experiences.push(...defaults.filter(entry => !experiences.some(item => item.id === entry.id)));
      save();
    }
  } catch {
    canSave = false;
    feedback.textContent = 'Saved adventures could not be read. Changes will last until this page closes.';
  }

  function alreadyAdded(title, except) {
    return experiences.some(item => item !== except && normalize(item.title) === normalize(title));
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
    return (!categoryFilter.value || categoryFilter.value === item.category) &&
      (filter === 'all' || (item.completed === true) === (filter === 'completed'));
  }

  function syncCategories() {
    const selected = categoryFilter.value;
    const categories = [...new Set([...formCategories, ...experiences.map(item => item.category)])];
    categoryFilter.replaceChildren(new Option('All categories', ''),
      ...categories.map(category => new Option(category)));
    categoryFilter.value = categories.includes(selected) ? selected : '';
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
      const illustration = card.querySelector('.bucket-illustration');
      illustration.dataset.art = item.category === 'Sports' ? 'sports' :
        item.category === 'Travel & Adventures' ? 'travel' : 'postcard';
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
      const edit = card.querySelector('.bucket-edit');
      const remove = card.querySelector('.bucket-remove');
      edit.setAttribute('aria-label', 'Edit ' + item.title);
      remove.setAttribute('aria-label', 'Delete ' + item.title);
      edit.addEventListener('click', () => editAdventure(item));
      remove.addEventListener('click', () => {
        if (!confirm('Delete “' + item.title + '”?')) return;
        if (editing === item) closeForm();
        experiences = experiences.filter(entry => entry !== item);
        save('Adventure deleted.');
        syncCategories();
        render();
        renderIdeas();
        get('form-toggle').focus();
      });
      return card;
    });
    list.replaceChildren(...cards);
    empty.hidden = cards.length > 0;
    empty.textContent = !experiences.length ? 'Add an adventure to start your list.' :
      'No adventures match these filters.';
  }

  function selectFilter(value) {
    filter = value;
    filters.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.filter === value)));
    render();
  }

  function closeForm() {
    editing = undefined;
    add.open = false;
    form.reset();
    titleInput.setCustomValidity('');
    get('form-toggle').textContent = 'Add an adventure +';
    get('submit').textContent = 'Add adventure';
    get('cancel').hidden = true;
  }

  function editAdventure(item) {
    editing = item;
    if (![...categoryInput.options].some(option => option.value === item.category)) {
      categoryInput.add(new Option(item.category));
    }
    titleInput.setCustomValidity('');
    titleInput.value = item.title;
    categoryInput.value = item.category;
    get('form-toggle').textContent = 'Edit adventure';
    get('submit').textContent = 'Save changes';
    get('cancel').hidden = false;
    add.open = true;
    titleInput.focus();
  }

  function addAdventure(title, category, status) {
    if (alreadyAdded(title)) return false;
    experiences.push({ id: personalId(), title, category, completed: false });
    save('Adventure added.', status);
    syncCategories();
    if (categoryFilter.value && categoryFilter.value !== category) categoryFilter.value = '';
    selectFilter(filter === 'completed' ? 'todo' : filter);
    return true;
  }

  function shuffleIdeas() {
    const previous = new Set(lineup);
    const next = [];
    while (next.length < 6) {
      if (!deck.length) {
        deck = [...ideas];
        for (let index = deck.length - 1; index > 0; index--) {
          const other = Math.floor(Math.random() * (index + 1));
          [deck[index], deck[other]] = [deck[other], deck[index]];
        }
      }
      const idea = deck.pop();
      if (!previous.has(idea) && !next.includes(idea)) next.push(idea);
    }
    lineup = next;
    renderIdeas();
  }

  function renderIdeas() {
    ideasList.replaceChildren(...lineup.map(idea => {
      const row = document.createElement('li');
      const copy = document.createElement('div');
      const category = document.createElement('small');
      category.textContent = idea.category;
      const title = document.createElement('span');
      title.textContent = idea.title;
      copy.append(category, title);
      const button = document.createElement('button');
      button.type = 'button';
      const added = alreadyAdded(idea.title);
      button.textContent = added ? '✓' : '+';
      button.disabled = added;
      button.setAttribute('aria-label', (added ? 'Already added: ' : 'Add ') + idea.title);
      button.addEventListener('click', () => {
        if (addAdventure(idea.title, idea.category, ideaFeedback)) {
          renderIdeas();
          get('shuffle').focus();
        }
      });
      row.append(copy, button);
      return row;
    }));
  }

  filters.forEach(button => button.addEventListener('click', () => selectFilter(button.dataset.filter)));
  categoryFilter.addEventListener('change', render);
  get('shuffle').addEventListener('click', shuffleIdeas);
  titleInput.addEventListener('input', () => titleInput.setCustomValidity(''));
  get('cancel').addEventListener('click', () => {
    closeForm();
    get('form-toggle').focus();
  });
  add.addEventListener('toggle', () => {
    if (!add.open && editing) closeForm();
  });

  form.addEventListener('submit', event => {
    event.preventDefault();
    const title = titleInput.value.trim();
    const category = categoryInput.value;
    const error = !normalize(title) ? 'Enter an experience title.' :
      alreadyAdded(title, editing) ? 'That adventure is already on the list.' : '';
    if (error) {
      titleInput.setCustomValidity(error);
      titleInput.reportValidity();
      return;
    }
    if (editing) {
      Object.assign(editing, { title, category });
      save('Adventure updated.');
      syncCategories();
      render();
    } else {
      addAdventure(title, category, feedback);
    }
    closeForm();
    renderIdeas();
    get('form-toggle').focus();
  });

  syncCategories();
  render();
  shuffleIdeas();
})();
