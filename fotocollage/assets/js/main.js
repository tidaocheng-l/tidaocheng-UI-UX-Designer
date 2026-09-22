/* FotoCollage UI Portfolio — v4 */
document.documentElement.classList.add('js');

/* ---------- scroll progress ---------- */
const bar = document.getElementById('bar');
const onScroll = () => {
  const h = document.documentElement;
  const p = h.scrollTop / Math.max(1, h.scrollHeight - h.clientHeight);
  bar.style.transform = 'scaleX(' + p + ')';
  navHighlight();
};
addEventListener('scroll', onScroll, { passive: true });

/* ---------- nav active highlight ---------- */
const navLinks = document.querySelectorAll('.nav-links a');
const secIds = ['overview', 'system', 'index', 'modules', 'states'];
function navHighlight() {
  let cur = '';
  for (const id of secIds) {
    const el = document.getElementById(id);
    if (el && el.getBoundingClientRect().top < innerHeight * 0.4) cur = id;
  }
  navLinks.forEach(a => a.classList.toggle('on', a.getAttribute('href') === '#' + cur));
}

/* ---------- reveal on scroll ---------- */
const io = new IntersectionObserver(es => {
  es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

/* ---------- tabs (design system / states) ---------- */
document.querySelectorAll('[data-tab-group]').forEach(group => {
  const btns = group.querySelectorAll('.tab-btn');
  const panels = group.querySelectorAll('.tab-panel');
  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.toggle('on', b === btn));
      panels.forEach(p => p.classList.toggle('on', p.id === btn.dataset.panel));
    });
  });
});

/* ---------- TOC hover preview ---------- */
const preview = document.getElementById('tocPreview');
const pImg = preview ? preview.querySelector('img') : null;
if (preview && pImg) {
  document.querySelectorAll('.toc-row').forEach(row => {
    row.addEventListener('mouseenter', () => {
      pImg.src = row.dataset.img || '';
      preview.classList.add('show');
    });
    row.addEventListener('mouseleave', () => preview.classList.remove('show'));
  });
  addEventListener('mousemove', e => {
    if (!preview.classList.contains('show')) return;
    const w = 148 + 26, x = Math.min(e.clientX + 26, innerWidth - w - 14);
    preview.style.left = x + 'px';
    preview.style.top = Math.max(14, e.clientY - 130) + 'px';
  }, { passive: true });
}

/* ---------- lightbox ---------- */
const lb = document.getElementById('lb');
const lbImg = document.getElementById('lbImg');
const lbName = document.getElementById('lbName');
const items = Array.from(document.querySelectorAll('[data-full]'));
let cur = -1;

function openLb(i) {
  cur = (i + items.length) % items.length;
  const it = items[cur];
  lbImg.src = it.dataset.full;
  lbName.textContent = it.dataset.name || '';
  lb.classList.add('on');
  document.body.style.overflow = 'hidden';
}
function closeLb() {
  lb.classList.remove('on');
  document.body.style.overflow = '';
}
items.forEach((it, i) => it.addEventListener('click', () => openLb(i)));
document.getElementById('lbClose').addEventListener('click', closeLb);
document.getElementById('lbPrev').addEventListener('click', e => { e.stopPropagation(); openLb(cur - 1); });
document.getElementById('lbNext').addEventListener('click', e => { e.stopPropagation(); openLb(cur + 1); });
lb.addEventListener('click', e => { if (e.target === lb) closeLb(); });
addEventListener('keydown', e => {
  if (!lb.classList.contains('on')) return;
  if (e.key === 'Escape') closeLb();
  if (e.key === 'ArrowLeft') openLb(cur - 1);
  if (e.key === 'ArrowRight') openLb(cur + 1);
});

/* ---------- init ---------- */
onScroll();
