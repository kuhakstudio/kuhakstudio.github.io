import { animate } from 'motion';
import dictionary from "../data/translations.json";
(() => {
  "use strict";
  const translations = dictionary;
  const nodes = [...document.querySelectorAll('[data-i18n]')];
  const originals = new Map(nodes.map(node => [node, node.innerHTML]));
  let language = 'en';
  try { language = localStorage.getItem('kuhak-language') === 'bn' ? 'bn' : 'en'; } catch {}
  function applyLanguage(next) {
    language = next;
    document.documentElement.lang = language;
    nodes.forEach(node => {
      node.innerHTML = language === 'bn' ? (translations[node.dataset.i18n] ?? originals.get(node)) : originals.get(node);
    });
    document.querySelectorAll('.language-toggle').forEach(button => {
      button.textContent = language === 'en' ? 'বাংলা' : 'English';
      button.setAttribute('aria-label', language === 'en' ? 'Switch to Bangla' : 'Switch to English');
    });
    try { localStorage.setItem('kuhak-language', language); } catch {}
  }
  document.querySelectorAll('.language-toggle').forEach(button => button.addEventListener('click', () => applyLanguage(language === 'en' ? 'bn' : 'en')));
  applyLanguage(language);
})();

// Motion handles section entrances; styling stays in Tailwind utilities.
(() => {
  const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (preference.matches || !('IntersectionObserver' in window)) return;
  const targets = [...document.querySelectorAll('.section-heading, .game-showcase, .future-note, .studio-layout > div, .values > div, .contact-section .wrap, .game-page .card, .ghost, .shots figure, .faq')];
  const running = new Set();
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      const element = entry.target;
      observer.unobserve(element);
      const index = [...element.parentElement.children].indexOf(element);
      const stagger = element.matches('.card, .ghost, .shots figure, .values > div');
      const animation = animate(element, { opacity: [0, 1], y: [22, 0] }, { duration: .65, delay: stagger ? (index % 3) * .07 : 0, ease: [0.22, 1, 0.36, 1] });
      running.add(animation);
      animation.then(() => running.delete(animation));
    }
  }, { threshold: .05 });
  targets.forEach(element => observer.observe(element));
  const finish = () => { observer.disconnect(); running.forEach(animation => animation.complete()); running.clear(); };
  preference.addEventListener('change', event => { if (event.matches) finish(); });
  window.addEventListener('beforeprint', finish);
})();

// Native modal screenshot viewer, with ordinary image links as the no-JS fallback.
(() => {
  const links = [...document.querySelectorAll('.shots .screenshot-open')];
  if (!links.length || typeof HTMLDialogElement === 'undefined') return;
  const dialog = document.createElement('dialog');
  dialog.className = 'screenshot-viewer fixed inset-0 m-0 h-dvh max-h-none w-full max-w-none border-0 bg-transparent p-3 text-[#efe8da] backdrop:bg-[#05090b]/95 md:p-8';
  dialog.innerHTML = `<div class="viewer-panel mx-auto flex h-full w-full max-w-[1100px] flex-col overflow-hidden rounded-xl border border-[#fceed2]/15 bg-[#0a1416]"><div class="viewer-toolbar flex shrink-0 items-center gap-3 border-b border-[#fceed2]/10 p-3 text-xs"><span class="viewer-count mr-auto text-[#92948b]"></span><a class="viewer-original text-xs text-[#f59a3c]" target="_blank" rel="noopener noreferrer"></a><button class="viewer-close grid min-h-11 min-w-11 cursor-pointer place-items-center rounded-full border border-[#fceed2]/15 bg-[#0d1a1d] text-3xl text-[#efe8da] hover:bg-[#f04f06]/30" type="button">×</button></div><div class="viewer-stage flex min-h-0 flex-1 items-center justify-between gap-2 p-2 md:gap-4 md:p-4"><button class="viewer-prev grid min-h-11 min-w-11 cursor-pointer place-items-center rounded-full border border-[#fceed2]/15 bg-[#0d1a1d] text-3xl text-[#efe8da] hover:bg-[#f04f06]/30" type="button">‹</button><img class="viewer-image h-full min-h-0 w-auto min-w-0 max-w-[calc(100%-100px)] flex-1 object-contain md:max-w-[calc(100%-120px)]" alt=""><button class="viewer-next grid min-h-11 min-w-11 cursor-pointer place-items-center rounded-full border border-[#fceed2]/15 bg-[#0d1a1d] text-3xl text-[#efe8da] hover:bg-[#f04f06]/30" type="button">›</button></div><p class="viewer-caption shrink-0 px-4 pt-3 pb-5 text-center text-sm" id="screenshot-caption" aria-live="polite"></p></div>`;
  dialog.setAttribute('aria-labelledby', 'screenshot-caption');
  document.body.append(dialog);
  const image = dialog.querySelector('.viewer-image');
  const original = dialog.querySelector('.viewer-original');
  const close = dialog.querySelector('.viewer-close');
  let index = 0;
  let trigger;
  let wasScrollLocked;
  const bangla = () => document.documentElement.lang === 'bn';
  function display(next) {
    index = (next + links.length) % links.length;
    const thumb = links[index].querySelector('img');
    image.src = links[index].href;
    image.alt = thumb.alt;
    dialog.querySelector('.viewer-caption').textContent = links[index].closest('figure').querySelector('figcaption').textContent;
    dialog.querySelector('.viewer-count').textContent = `${index + 1} / ${links.length}`;
    original.href = links[index].href;
    original.textContent = bangla() ? 'মূল ছবি খুলুন ↗︎' : 'Open original ↗︎';
    close.setAttribute('aria-label', bangla() ? 'বন্ধ করুন' : 'Close screenshot');
    dialog.querySelector('.viewer-prev').setAttribute('aria-label', bangla() ? 'আগের ছবি' : 'Previous screenshot');
    dialog.querySelector('.viewer-next').setAttribute('aria-label', bangla() ? 'পরের ছবি' : 'Next screenshot');
  }
  links.forEach((link, position) => link.addEventListener('click', event => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    trigger = link;
    display(position);
    wasScrollLocked = document.body.classList.contains('overflow-hidden');
    dialog.showModal();
    document.body.classList.add('overflow-hidden');
    close.focus();
  }));
  function restorePage() {
    if (!wasScrollLocked) document.body.classList.remove('overflow-hidden');
    trigger?.focus({ preventScroll: true });
  }
  function closeViewer() { dialog.close(); restorePage(); }
  close.addEventListener('click', closeViewer);
  dialog.addEventListener('cancel', event => { event.preventDefault(); closeViewer(); });
  dialog.querySelector('.viewer-prev').addEventListener('click', () => display(index - 1));
  dialog.querySelector('.viewer-next').addEventListener('click', () => display(index + 1));
  dialog.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      display(index + (event.key === 'ArrowRight' ? 1 : -1));
    }
  });
  dialog.addEventListener('click', event => {
    if (event.target === dialog) closeViewer();
  });
  dialog.addEventListener('close', restorePage);
  let touchStart;
  image.addEventListener('touchstart', event => {
    touchStart = event.touches.length === 1 ? { x: event.touches[0].clientX, y: event.touches[0].clientY } : null;
  }, { passive: true });
  image.addEventListener('touchend', event => {
    if (!touchStart || event.touches.length) return;
    const dx = event.changedTouches[0].clientX - touchStart.x;
    const dy = event.changedTouches[0].clientY - touchStart.y;
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) display(index + (dx < 0 ? 1 : -1));
    touchStart = null;
  }, { passive: true });
})();

for (const menu of document.querySelectorAll('header details')) {
  menu.addEventListener('click', event => { if (event.target.closest('a')) menu.removeAttribute('open'); });
  menu.addEventListener('keydown', event => { if (event.key === 'Escape') { menu.removeAttribute('open'); menu.querySelector('summary')?.focus(); } });
}

// Resizable navbar (adapted from Aceternity UI Resizable Navbar): past 80 px the header
// becomes a floating pill; the styles hang off data-scrolled.
(() => {
  const header = document.querySelector('header[data-resizable]');
  if (!header) return;
  let scrolled = null;
  const update = () => {
    const next = scrollY > 80;
    if (next === scrolled) return;
    scrolled = next;
    header.toggleAttribute('data-scrolled', next);
  };
  addEventListener('scroll', update, { passive: true });
  update();
})();

// Dark / light theme: dark unless the visitor chose light (the system setting is ignored).
// The <head> script applies a saved choice before the first paint; this wires the buttons.
(() => {
  const root = document.documentElement;
  const meta = document.querySelector('meta[name="theme-color"]');
  const buttons = [...document.querySelectorAll('.theme-toggle')];
  const sync = () => {
    const light = root.dataset.theme === 'light';
    const bangla = root.lang === 'bn';
    const label = light ? (bangla ? 'ডার্ক থিম চালু করুন' : 'Switch to dark theme') : (bangla ? 'লাইট থিম চালু করুন' : 'Switch to light theme');
    buttons.forEach(button => { button.setAttribute('aria-label', label); button.title = label; });
    if (meta) meta.content = light ? '#e6d8c0' : '#05090b';
  };
  buttons.forEach(button => button.addEventListener('click', () => {
    const light = root.dataset.theme !== 'light';
    if (light) root.dataset.theme = 'light'; else delete root.dataset.theme;
    try { localStorage.setItem('kuhak-theme', light ? 'light' : 'dark'); } catch {}
    sync();
  }));
  new MutationObserver(sync).observe(root, { attributes: true, attributeFilter: ['lang'] });
  sync();
})();
