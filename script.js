const menuBtn = document.querySelector('.menu-btn');
const menu = document.querySelector('.menu');

menuBtn?.addEventListener('click', () => {
  const open = menu.classList.toggle('open');
  menuBtn.setAttribute('aria-expanded', String(open));
});

document.querySelectorAll('.menu a').forEach(link => {
  link.addEventListener('click', () => {
    menu.classList.remove('open');
    menuBtn?.setAttribute('aria-expanded', 'false');
  });
});
