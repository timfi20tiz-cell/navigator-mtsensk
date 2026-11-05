const byId = (id) => document.getElementById(id);

// Меню на мобильных
const toggle = document.querySelector('.menu-toggle');
const nav = byId('site-nav');
if (toggle && nav) {
  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!open));
    toggle.querySelector('span').textContent = open ? '+' : '−';
    nav.classList.toggle('is-open', !open);
  });
  nav.addEventListener('click', (event) => {
    if (event.target.closest('a')) {
      toggle.setAttribute('aria-expanded', 'false');
      toggle.querySelector('span').textContent = '+';
      nav.classList.remove('is-open');
    }
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      toggle.setAttribute('aria-expanded', 'false');
      toggle.querySelector('span').textContent = '+';
      nav.classList.remove('is-open');
    }
  });
}

// Форма описания симптомов
const problemForm = byId('problem-form');
if (problemForm) {
  problemForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const symptoms = byId('symptoms').value.trim();
    const car = byId('car-details').value.trim();
    if (!symptoms && !car) {
      byId('form-status').textContent = 'Сначала напишите симптомы или модель авто.';
      byId('symptoms').focus();
      return;
    }
    const text = `Здравствуйте! Хочу проконсультироваться по ремонту в сервисе «Навигатор».\nАвтомобиль: ${car || 'не указан'}\nСимптомы: ${symptoms || 'не указано'}`;
    try {
      await navigator.clipboard.writeText(text);
      byId('form-status').textContent = 'Текст скопирован! Можете вставить в сообщение или мессенджер.';
    } catch {
      byId('form-status').textContent = 'Скопируйте: ' + text;
    }
  });

  const waBtn = byId('send-whatsapp-btn');
  if (waBtn) {
    waBtn.addEventListener('click', () => {
      const symptoms = byId('symptoms').value.trim();
      const car = byId('car-details').value.trim();
      let text = 'Здравствуйте! Хочу проконсультироваться по ремонту в автосервисе «Навигатор».';
      if (car) text += `\nАвтомобиль: ${car}`;
      if (symptoms) text += `\nСимптомы: ${symptoms}`;
      const url = `https://wa.me/79208010451?text=${encodeURIComponent(text)}`;
      window.open(url, '_blank');
    });
  }
}

// Слайдер галереи
const slider = byId('gallery-slider');
const prevBtn = byId('slider-prev');
const nextBtn = byId('slider-next');
const counter = byId('slider-counter');

if (slider && prevBtn && nextBtn && counter) {
  const slides = slider.querySelectorAll('.slide-card');
  const total = slides.length;

  const getStep = () => {
    const card = slides[0];
    return card ? card.offsetWidth + 16 : 300;
  };

  const updateCounter = () => {
    const step = getStep();
    const current = Math.min(total, Math.max(1, Math.round(slider.scrollLeft / step) + 1));
    counter.textContent = `${current} / ${total}`;
  };

  prevBtn.addEventListener('click', () => {
    slider.scrollBy({ left: -getStep(), behavior: 'smooth' });
  });

  nextBtn.addEventListener('click', () => {
    slider.scrollBy({ left: getStep(), behavior: 'smooth' });
  });

  slider.addEventListener('scroll', () => {
    window.requestAnimationFrame(updateCounter);
  }, { passive: true });
}
