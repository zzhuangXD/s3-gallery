const $ = (selector) => document.querySelector(selector);
let sites = [];
let visibleSites = [];
let activeFilter = 'all';
const gallery = $('#gallery');
const search = $('#search');
const result = $('#result-note');
const escapeHTML = (value) => String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
const safeURL = (value) => { const url = new URL(value, location.href); if (url.protocol !== 'https:') throw new Error('Only HTTPS destinations are allowed'); return url.href; };
const storage = { get(key) { try { return localStorage.getItem(key); } catch { return null; } }, set(key, value) { try { localStorage.setItem(key, value); } catch { /* Private browsing still works. */ } } };

function setTheme(theme) {
  document.documentElement.dataset.theme = theme;
  $('.theme-toggle').setAttribute('aria-label', `切换为${theme === 'dark' ? '浅' : '深'}色外观`);
  $('meta[name="theme-color"]').content = theme === 'dark' ? '#191c19' : '#f4f1e9';
}
const systemDark = matchMedia('(prefers-color-scheme: dark)');
setTheme(storage.get('s3-theme') || (systemDark.matches ? 'dark' : 'light'));
systemDark.addEventListener('change', (event) => { if (!storage.get('s3-theme')) setTheme(event.matches ? 'dark' : 'light'); });
$('.theme-toggle').addEventListener('click', () => { const theme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'; storage.set('s3-theme', theme); setTheme(theme); });

function card(site, index) {
  const e = escapeHTML;
  const item = document.createElement('article');
  item.className = 'site-card';
  item.dataset.id = site.id;
  item.innerHTML = `<a class="poster-link" href="${e(safeURL(site.url))}" target="_blank" rel="noopener noreferrer" aria-label="${e(site.id)} · ${e(site.name)}，在新标签页打开"><div class="card-meta"><span>${e(site.id)}</span><span>${e(site.label)} / ${String(index + 1).padStart(2, '0')}</span></div><div class="poster"><img src="${e(site.poster)}" alt="${e(site.posterAlt)}" width="1024" height="1536" ${index < 3 ? 'loading="eager"' : 'loading="lazy"'} decoding="async"><span class="visit-badge" aria-hidden="true">↗</span></div><div class="caption"><div class="caption-title"><h3>${e(site.name)}${site.subtitle ? `<span class="subtitle">${e(site.subtitle)}</span>` : ''}</h3><span class="arrow" aria-hidden="true">↗</span></div><p class="description">${e(site.description)}</p><div class="tags">${site.tags.map((tag) => `<span class="tag">${e(tag)}</span>`).join('')}</div><div class="domain">${e(site.domain)}</div></div></a>`;
  return item;
}

function render() {
  const query = search.value.trim().toLocaleLowerCase();
  visibleSites = sites.filter((site) => (activeFilter === 'all' || site.category === activeFilter) && [site.id, site.name, site.subtitle || '', site.domain, site.description, ...site.tags].join(' ').toLocaleLowerCase().includes(query));
  gallery.replaceChildren(...visibleSites.map(card));
  $('#empty-state').hidden = visibleSites.length !== 0;
  result.textContent = query || activeFilter !== 'all' ? `找到 ${visibleSites.length} 个网站 · 共收藏 ${sites.length} 个` : `${String(sites.length).padStart(2, '0')} 个网站，${String(sites.length).padStart(2, '0')} 个值得打开的世界。`;
  updateRandomLink();
}
function updateRandomLink() {
  const random = $('.random-link');
  const pool = visibleSites.length ? visibleSites : sites;
  if (pool.length) random.href = safeURL(pool[Math.floor(Math.random() * pool.length)].url);
}
$('.random-link').addEventListener('click', updateRandomLink);
search.addEventListener('input', render);
document.querySelectorAll('.filter').forEach((button) => button.addEventListener('click', () => {
  activeFilter = button.dataset.filter;
  document.querySelectorAll('.filter').forEach((item) => { const active = item === button; item.classList.toggle('is-active', active); item.setAttribute('aria-pressed', String(active)); });
  render();
}));
$('#reset').addEventListener('click', () => { search.value = ''; document.querySelector('[data-filter="all"]').click(); search.focus(); });
function setView(view) {
  gallery.classList.toggle('is-list', view === 'list');
  document.querySelectorAll('.view-button').forEach((button) => { const active = button.dataset.view === view; button.classList.toggle('is-active', active); button.setAttribute('aria-pressed', String(active)); });
}
setView(storage.get('s3-view') || 'grid');
document.querySelectorAll('.view-button').forEach((button) => button.addEventListener('click', () => { const view = button.dataset.view; storage.set('s3-view', view); setView(view); }));
document.addEventListener('keydown', (event) => {
  if (event.key === '/' && !event.ctrlKey && !event.metaKey && !event.altKey && !['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName) && !document.activeElement?.isContentEditable) { event.preventDefault(); search.focus(); }
  if (event.key === 'Escape' && document.activeElement === search) { search.value = ''; render(); search.blur(); }
});

try {
  const response = await fetch(new URL('../data/sites.json', import.meta.url));
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const collection = await response.json();
  sites = collection.sites;
  if (!Array.isArray(sites) || !sites.length) throw new Error('Empty collection');
  for (const site of sites) safeURL(site.url);
  $('#total-count').textContent = String(sites.length).padStart(2, '0');
  document.querySelector('[data-filter="all"] span').textContent = String(sites.length).padStart(2, '0');
  $('#last-updated').dateTime = collection.updated;
  $('#last-updated').textContent = collection.updated.replaceAll('-', '.');
  render();
} catch (error) {
  result.textContent = '收藏暂时未能加载。';
  const note = document.createElement('p'); note.className = 'error-note';
  note.innerHTML = '请刷新页面重试，或先打开 <a href="https://github.com/zzhuangXD/s3-gallery/blob/main/SOURCE_LIST.md">完整网站清单 ↗</a>。';
  gallery.replaceChildren(note);
  console.error('S3 Gallery:', error);
}
