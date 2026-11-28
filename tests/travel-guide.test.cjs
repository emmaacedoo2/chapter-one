'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

class Element {
  children = [];
  attributes = {};
  listeners = {};
  style = {};
  dataset = {};
  classList = { add() {}, toggle() {} };
  addEventListener(type, listener) { this.listeners[type] = listener; }
  setAttribute(key, value) { this.attributes[key] = value; }
  append(...nodes) { this.children.push(...nodes); }
  replaceChildren(...nodes) { this.children = nodes; }
  querySelectorAll() { return this.children; }
  querySelector() { return new Element(); }
  focus() {}
  set innerHTML(value) { this.html = value; this.children = []; }
  get innerHTML() { return this.html; }
}

function page() {
  const elements = new Map();
  const data = new Map();
  const get = id => {
    if (!elements.has(id)) elements.set(id, new Element());
    return elements.get(id);
  };
  const context = vm.createContext({
    document: { createElement: () => new Element(), getElementById: get,
      querySelector: get, querySelectorAll: () => [], addEventListener() {} },
    Option: class { constructor(text, value) { Object.assign(this, { text, value }); } },
    localStorage: { getItem: key => data.get(key), setItem: (key, value) => data.set(key, value) }
  });
  const run = code => vm.runInContext(code, context);
  const load = path => run(fs.readFileSync(path, 'utf8'));
  return { get, data, run, load };
}

test('Spain and Pittsburgh mount, preserve independent progress and run ten-question quizzes', () => {
  const pgh = page();
  const spain = page();
  const oldKey = 'chapter_one_pittsburgh_bucket_v1';
  const spainKey = 'chapter_one_spain_checklist_v1';
  pgh.data.set(oldKey, '[0,11]');
  spain.data.set(oldKey, '[0,11]');
  for (const guide of [pgh, spain]) guide.load('travel-guide.js');
  pgh.load('pittsburgh-photos.js');
  pgh.load('pittsburgh.js');
  spain.load('spain-photos.js');
  spain.load('spain.js');
  assert.equal(pgh.run('activities.length'), 16);
  assert.equal(spain.run('spainActivities.length'), 22);
  assert.equal(pgh.get('#pgh-progress-bar').value, 2);
  assert.equal(spain.get('#spain-progress-bar').value, 0);
  assert.equal(pgh.get('#bucket-list').children[11].children[0].checked, true);
  const input = spain.get('#spain-list').children[0].children[0];
  input.checked = true;
  input.listeners.change();
  assert.equal(spain.data.get(spainKey), '[0]');
  assert.equal(spain.data.get(oldKey), '[0,11]');
  input.checked = false;
  input.listeners.change();
  assert.equal(spain.data.get(spainKey), '[]');
  const sameDevice = page();
  sameDevice.data.set(spainKey, '[3]');
  sameDevice.load('travel-guide.js');
  sameDevice.load('spain-photos.js');
  sameDevice.load('spain.js');
  assert.equal(sameDevice.get('#spain-list').children[3].children[0].checked, true);

  const scenarios = [
    [pgh, '#pittsburgh-quiz .quiz-content', '[...pittsburghQuestions,...steelersQuestions,...cityQuestions]', 34],
    [spain, '#spain-quiz', 'spainQuestions', 42]
  ];
  for (const [guide, selector, bank, count] of scenarios) {
    const answers = new Map(guide.run(bank).map(([prompt, options, correct = 0]) => [prompt, options[correct]]));
    assert.equal(answers.size, count);
    const root = guide.get(selector);
    root.children[0].listeners.click();
    const visited = new Set();
    for (let index = 0; index < 10; index++) {
      const [heading, choices, feedback] = root.children;
      const prompt = heading.textContent.split(' · ')[1];
      assert.ok(!visited.has(prompt));
      visited.add(prompt);
      const choice = choices.children.find(button => button.textContent === answers.get(prompt));
      assert.ok(choice);
      choice.listeners.click();
      choice.listeners.click();
      assert.equal(feedback.textContent, 'Correct!');
      assert.ok(choices.children.every(button => button.disabled));
      root.children[3].listeners.click();
    }
    assert.equal(root.children[1].textContent, '10 of 10 correct.');
    root.children[2].listeners.click();
    assert.match(root.children[0].textContent, /^Question 1 of 10/);
  }
});

test('custom map keeps 24 starter places, filtered ownership and proportionate markers', () => {
  const map = page();
  map.load('our-travels.js');
  map.run('TravelApp.places = TravelApp.makeSeedPlaces(); TravelApp.renderMap()');
  assert.equal(map.run('TravelApp.places.length'), 24);
  const picker = map.get('map-place-picker');
  assert.equal(picker.children.length, 25);
  assert.equal(map.get('outline-pins').children.length, 7);
  for (const pin of map.get('outline-pins').children) {
    assert.ok(parseFloat(pin.style.left) > 0 && parseFloat(pin.style.left) < 100);
    assert.ok(parseFloat(pin.style.top) > 0 && parseFloat(pin.style.top) < 100);
  }
  map.run('TravelApp.mapFilter = "both"; TravelApp.renderMap()');
  assert.deepEqual(picker.children.slice(1).map(option => option.text.split(',')[0]).sort(),
    ['Florida', 'Madrid', 'Naples', 'Pittsburgh']);
  assert.ok(map.get('outline-pins').children.every(pin => pin.className === 'outline-pin both'));
  map.get('outline-pins').children[0].listeners.click();
  assert.match(map.get('map-details').innerHTML, /visited separately/);
  map.run('TravelApp.mapFilter = "dom"; TravelApp.renderMap()');
  assert.equal(picker.children.length, 2);
  assert.match(picker.children[1].text, /Saint Petersburg, Russia/);
  map.run('TravelApp.mapFilter = "all"; TravelApp.destinations = [{id:"future",name:"Future",status:"dreaming"}]; TravelApp.renderDestinations();');
  assert.match(map.get('destination-list').innerHTML, /Future/);
  assert.equal(map.run('TravelApp.places.length'), 24);
});
