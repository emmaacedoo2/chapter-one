const menuButton = document.querySelector('.site-menu-toggle');
const siteMenu = document.querySelector('.site-menu');

function setMenuOpen(open) {
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
}

menuButton.addEventListener('click', () => {
  setMenuOpen(menuButton.getAttribute('aria-expanded') !== 'true');
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
    setMenuOpen(false);
    menuButton.focus();
  }
});

siteMenu.addEventListener('click', (event) => {
  if (event.target.closest('a')) setMenuOpen(false);
});
