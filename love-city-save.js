import { VEHICLES } from './love-city-world.js';
export const SAVE_KEY = 'chapterOne.loveCity.v1';
const object = value => value && typeof value === 'object' && !Array.isArray(value) ? value : {};
export function loadCity(storage) {
  let saved = {};
  try { saved = object(JSON.parse(storage().getItem(SAVE_KEY))); } catch { /* Storage can be unavailable. */ }
  const unlocked = ['sports', ...Object.keys(VEHICLES).filter(key => key !== 'sports' && Array.isArray(saved.unlocked) && saved.unlocked.includes(key))];
  return {
    ...saved,
    coins: Number.isFinite(saved.coins) ? Math.max(0, Math.floor(saved.coins)) : 0,
    completed: Array.isArray(saved.completed) ? saved.completed.filter(name => typeof name === 'string') : [],
    unlocked, selected: unlocked.includes(saved.selected) ? saved.selected : 'sports',
    bestRace: Number.isFinite(saved.bestRace) && saved.bestRace > 0 ? saved.bestRace : null,
    hearts: Array.isArray(saved.hearts) ? saved.hearts.filter(Number.isInteger) : [],
    sound: saved.sound === true,
    tutorialDone: saved.tutorialDone === true
  };
}
export function saveCity(storage, progress) {
  try { storage().setItem(SAVE_KEY, JSON.stringify(progress)); } catch { /* In-memory progress remains usable. */ }
}
