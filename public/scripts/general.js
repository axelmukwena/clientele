/* eslint-disable no-unused-vars */
window.addEventListener('load', () => {
  const { pathname } = document.location;
  const active = document.querySelector('.active');
  if (active !== null) {
    active.className = 'nav-link';
  }

  const element = document.getElementById(`${pathname}-link`);
  element.className = 'active nav-link';
});

window.onload = function loadToast() {
  // eslint-disable-next-line no-undef
  /* vanillaToast.show(
    'Show 10 seconds.',
    {
      className: 'error',
      duration: 5000,
      fadeDuration: 100,
      closeButton: true,
    },
  ); */
};
