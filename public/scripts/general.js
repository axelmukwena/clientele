/* eslint-disable no-unused-vars */

// This allows changing the navigation links' active status
window.addEventListener('load', () => {
  const { pathname } = document.location;
  const active = document.querySelector('.active');
  if (active !== null) {
    active.className = 'nav-link';
  }

  const element = document.getElementById(`${pathname}-link`);
  element.className = 'active nav-link';
});
