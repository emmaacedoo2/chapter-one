(() => {
  const storageKey = 'chapter_one_bucket_list_v1';
  const storageVersion = 2;
  const normalize = title => title.normalize('NFKD').toLowerCase()
    .replace(/\p{M}/gu, '').replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
  const defaults = [
    ['new-york', 'Travel to New York together', 'Travel & Adventures'],
    ['greece', 'Spend a summer in Greece', 'Travel & Adventures', 'Travel to Greece together'],
    ['california', 'Explore California together', 'Travel & Adventures'],
    ['steelers', 'Go to a Pittsburgh Steelers game', 'Sports', 'Go to a Pittsburgh Steelers game together'],
    ['real-madrid', 'Watch Real Madrid play at the Santiago Bernabéu', 'Sports'],
    ['cruise', 'Go on a cruise together', 'Travel & Adventures', 'Take a cruise together'],
    ['disney-world', 'Spend a day at Disney World', 'Fun & Random', 'Go to Disney World'],
    ['universal-studios', 'Go to Universal Studios together', 'Fun & Random', 'Go to Universal Studios'],
    ['formula-one', 'Go to a Formula 1 race', 'Sports', 'Attend a Formula 1 race'],
    ['concert', 'Go to a concert together', 'Music'],
    ['american-road-trip', 'Go on an American road trip', 'Travel & Adventures'],
    ['bahamas', 'Visit the Bahamas together', 'Travel & Adventures', 'Visit the Bahamas'],
    ['northern-lights', 'See the Northern Lights', 'Travel & Adventures'],
    ['cabin', 'Spend a weekend in a cabin', 'Travel & Adventures'],
    ['new-country', 'Visit a new country together', 'Travel & Adventures']
  ].map(([id, title, category, ...aliases]) => ({ id, title, category, aliases }));
  const defaultById = new Map(defaults.map(entry => [entry.id, entry]));
  const defaultByTitle = new Map(defaults.flatMap(entry =>
    [entry.title, ...entry.aliases].map(title => [normalize(title), entry])));
  const firstRelease = new Set(['new-york', 'greece', 'california', 'steelers', 'real-madrid']);
  const identity = title => defaultByTitle.get(normalize(title))?.title ?? normalize(title);
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
        localStorage.setItem(storageKey, JSON.stringify({ version: storageVersion, experiences, nextId }));
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
    if (legacy || (saved.version ?? 1) < storageVersion) {
      for (const item of experiences) {
        if (legacy && !item.id) {
          const match = defaultByTitle.get(normalize(item.title));
          item.id = match && !experiences.some(other => other.id === match.id) ? match.id : personalId();
        }
        const match = defaultById.get(item.id);
        if (match?.aliases.some(title => normalize(title) === normalize(item.title)) &&
            !experiences.some(other => other !== item && normalize(other.title) === normalize(match.title))) {
          item.title = match.title;
        }
      }
      for (const { id, title, category } of defaults) {
        // The previous release already seeded these IDs. An absent one was deleted.
        if (!legacy && firstRelease.has(id)) continue;
        if (!experiences.some(item => item.id === id) && !alreadyAdded(title)) {
          experiences.push({ id, title, category, completed: false });
        }
      }
      save();
    }
  } catch {
    canSave = false;
    feedback.textContent = 'Saved adventures could not be read. Changes will last until this page closes.';
  }

  function alreadyAdded(title, except) {
    return experiences.some(item => item !== except && identity(item.title) === identity(title));
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
      const artwork = defaultById.get(item.id) ?? defaultByTitle.get(normalize(item.title));
      if (artwork) {
        const image = document.createElement('img');
        image.src = 'images/bucket-list/' + artwork.id + '.svg';
        image.alt = '';
        image.width = 96;
        image.height = 72;
        image.decoding = 'async';
        illustration.append(image);
      }
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

  function renderIdeas(shuffle = false) {
    const owned = new Set(experiences.map(item => identity(item.title)));
    const available = ideas.filter(idea => !owned.has(identity(idea.title)));
    const previous = new Set(lineup);
    const next = shuffle ? [] : lineup.filter(idea => available.includes(idea));
    deck = deck.filter(idea => available.includes(idea));
    while (next.length < Math.min(6, available.length)) {
      if (!deck.length) {
        deck = available.filter(idea => !next.includes(idea));
        for (let index = deck.length - 1; index > 0; index--) {
          const other = Math.floor(Math.random() * (index + 1));
          [deck[index], deck[other]] = [deck[other], deck[index]];
        }
      }
      let index = deck.findIndex(idea => !previous.has(idea) && !next.includes(idea));
      if (index === -1) {
        index = deck.findIndex(idea => !next.includes(idea));
        if (index === -1) {
          deck = [];
          continue;
        }
      }
      next.push(deck.splice(index, 1)[0]);
    }
    lineup = next;
    const shuffleButton = get('shuffle');
    shuffleButton.disabled = available.length <= 6;
    get('idea-empty').hidden = available.length > 0;
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
      button.textContent = '+';
      button.setAttribute('aria-label', 'Add ' + idea.title);
      button.addEventListener('click', () => {
        if (addAdventure(idea.title, idea.category, ideaFeedback)) {
          renderIdeas();
          const nextButton = ideasList.querySelector('button');
          (nextButton ?? get('form-toggle')).focus();
        }
      });
      row.append(copy, button);
      return row;
    }));
  }

  filters.forEach(button => button.addEventListener('click', () => selectFilter(button.dataset.filter)));
  categoryFilter.addEventListener('change', render);
  get('shuffle').addEventListener('click', () => renderIdeas(true));
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
  renderIdeas();
})();
