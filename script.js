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


const photoModal = document.querySelector('#photoModal');
const photoModalImg = document.querySelector('#photoModalImg');
const photoModalCaption = document.querySelector('#photoModalCaption');
const closePhotoModal = () => { photoModal?.classList.remove('open'); photoModal?.setAttribute('aria-hidden','true'); };
document.querySelectorAll('.work-photo').forEach(btn => btn.addEventListener('click', () => {
  if (!photoModal) return;
  photoModalImg.src = btn.dataset.full;
  photoModalImg.alt = btn.dataset.caption || 'Trabajo SR INNOVACION';
  photoModalCaption.textContent = btn.dataset.caption || '';
  photoModal.classList.add('open');
  photoModal.setAttribute('aria-hidden','false');
}));
document.querySelector('.photo-modal-close')?.addEventListener('click', closePhotoModal);
photoModal?.addEventListener('click', e => { if (e.target === photoModal) closePhotoModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closePhotoModal(); });
