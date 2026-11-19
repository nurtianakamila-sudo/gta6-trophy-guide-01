// Leonida Trophy Guide — tracker logic.
// Loads app/data/trophies.json, renders the checklist, and keeps progress in
// localStorage. No network: the only fetch is the local data file.
const DATA_URL = 'data/trophies.json';
const STORE_KEY = 'leonida-trophy-guide-v1';

const SOURCES = {
  powerpyx: { label: 'PowerPyx', url: 'https://www.powerpyx.com/gta-6-grand-theft-auto-vi-trophy-guide-roadmap/' },
  keengamer: { label: 'KeenGamer', url: 'https://www.keengamer.com/articles/guides/gta-6-trophy-guide-platinum-roadmap-all-55-trophies/' },
  outputlag: { label: 'OutputLag', url: 'https://outputlag.com/guides/gta-6-trophy-list/' },
  gtazone: { label: 'GTA Zone', url: 'https://gta-zone.com/news/gta-6-trophies-achievements/' },
  egamers: { label: 'EGamers', url: 'https://egamers.io/gta-6-trophy-list-all-55-trophies-and-achievements-plus-the-hardest-ones/' },
};

const GRADE_LABEL = { platinum: 'Platinum', gold: 'Gold', silver: 'Silver', bronze: 'Bronze' };
const KIND_LABEL = { story: 'Story', missable: 'Missable', collectibles: 'Collectibles', activities: 'Activities', platinum: 'Platinum' };

const $ = (sel) => document.querySelector(sel);
const listEl = $('#trophy-list');
const detailEl = $('#detail');
const resultLine = $('#result-line');
const listCount = $('#list-count');

let trophies = [];
let earned = new Set();
let selectedId = null;
let spoilerOn = false;

function loadSaved() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return;
    const saved = JSON.parse(raw);
    if (Array.isArray(saved.earned)) earned = new Set(saved.earned.filter((n) => Number.isInteger(n)));
    if (typeof saved.spoiler === 'boolean') spoilerOn = saved.spoiler;
  } catch {
    earned = new Set();
  }
}

function save() {
  localStorage.setItem(STORE_KEY, JSON.stringify({ earned: [...earned].sort((a, b) => a - b), spoiler: spoilerOn }));
}

function isMasked(t) {
  return spoilerOn && t.kind === 'story' && !earned.has(t.id);
}

function escapeHtml(text) {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function pill(text, cls) {
  return `<span class="pill ${cls}">${escapeHtml(text)}</span>`;
}

function visibleTrophies() {
  const q = $('#search').value.trim().toLowerCase();
  const grade = $('#grade-filter').value;
  const kind = $('#kind-filter').value;
  const status = $('#status-filter').value;
  if (kind === 'online') return [];
  return trophies.filter((t) => {
    if (grade && t.grade !== grade) return false;
    if (kind && t.kind !== kind) return false;
    if (status === 'earned' && !earned.has(t.id)) return false;
    if (status === 'remaining' && earned.has(t.id)) return false;
    if (q && !(t.name + ' ' + t.description + ' ' + t.guide).toLowerCase().includes(q)) return false;
    return true;
  });
}

function renderProgress() {
  const done = earned.size;
  const total = trophies.length || 55;
  $('#progress-text').textContent = `${done} / ${total} earned`;
  $('#progress-pct').textContent = `${Math.round((done / total) * 100)}%`;
  $('#progress-fill').style.width = `${(done / total) * 100}%`;
  const counts = $('#grade-counts');
  counts.innerHTML = ['platinum', 'gold', 'silver', 'bronze']
    .map((g) => {
      const have = trophies.filter((t) => t.grade === g && earned.has(t.id)).length;
      const all = trophies.filter((t) => t.grade === g).length;
      return `<li><b>${GRADE_LABEL[g]}</b> ${have}/${all}</li>`;
    })
    .join('');
}

function renderList() {
  const shown = visibleTrophies();
  const kind = $('#kind-filter').value;
  listCount.textContent = `(${shown.length} of ${trophies.length})`;
  if (kind === 'online') {
    resultLine.textContent = 'No online trophies — every GTA VI trophy unlocks in single-player.';
  } else if (shown.length === 0) {
    resultLine.textContent = 'Nothing matches these filters. Clear the search or pick a different filter.';
  } else {
    resultLine.textContent = `Showing ${shown.length} of ${trophies.length} trophies. Tick a box when you earn one — progress saves in this browser.`;
  }
  listEl.innerHTML = shown
    .map((t) => {
      const got = earned.has(t.id);
      const masked = isMasked(t);
      const name = masked ? 'Hidden story trophy' : t.name;
      const desc = masked ? 'Complete the story to reveal this trophy.' : t.description;
      const hiddenTag = t.hidden && !masked ? '<span class="hidden-tag">Hidden</span>' : '';
      const missable = t.missable ? pill('Missable', 'missable') : '';
      const kindPill = (t.kind === 'story' || t.kind === 'collectibles') ? pill(KIND_LABEL[t.kind], `kind-${t.kind}`) : '';
      return `<li data-id="${t.id}" class="${got ? 'earned' : ''} ${selectedId === t.id ? 'selected' : ''}">
        <input type="checkbox" ${got ? 'checked' : ''} aria-label="Earned: ${escapeHtml(name)}">
        <span>
          <span class="trophy-name">${masked ? '<span class="spoiler-mask">Hidden story trophy</span>' : escapeHtml(name)}${hiddenTag}</span>
          <span class="trophy-desc">${masked ? '<span class="spoiler-mask">Complete the story to reveal this trophy.</span>' : escapeHtml(desc)}</span>
          <span class="trophy-meta">${pill(GRADE_LABEL[t.grade], 'grade-' + t.grade)}${kindPill}${missable}</span>
        </span>
        <span aria-hidden="true">${got ? '✓' : ''}</span>
      </li>`;
    })
    .join('');
}

function renderDetail() {
  const t = trophies.find((x) => x.id === selectedId);
  if (!t) {
    detailEl.innerHTML = '<p class="detail-empty">Pick a trophy from the list to see its guide and sources.</p>';
    return;
  }
  const got = earned.has(t.id);
  const masked = isMasked(t);
  const links = (t.sources || [])
    .filter((key) => SOURCES[key])
    .map((key) => `<li><a href="${SOURCES[key].url}" target="_blank" rel="noopener">${SOURCES[key].label}</a></li>`)
    .join('');
  detailEl.innerHTML = `
    <h3>${masked ? '<span class="spoiler-mask">Hidden story trophy</span>' : escapeHtml(t.name)}</h3>
    <p class="detail-desc">${masked ? 'Complete the story to reveal this trophy.' : escapeHtml(t.description)}</p>
    <p class="trophy-meta">${pill(GRADE_LABEL[t.grade], 'grade-' + t.grade)}${(t.kind === 'story' || t.kind === 'collectibles') ? pill(KIND_LABEL[t.kind], 'kind-' + t.kind) : ''}${t.hidden ? pill('Hidden on PSN', '') : ''}${t.missable ? pill('Missable', 'missable') : ''}</p>
    ${t.missable ? '<p class="detail-warning"><strong>Missable.</strong> The Chapter 1 balcony meditation disappears after the chapter. Do it before you leave Chapter 1 — there is no mission replay.</p>' : ''}
    ${masked
      ? '<p class="detail-guide">This story trophy stays hidden until you earn it. Tick it off once it pops and its guide will appear here.</p>'
      : `<p class="detail-guide">${escapeHtml(t.guide)}</p>`}
    ${links ? `<div class="detail-sources"><h4>Sources</h4><ul>${links}</ul></div>` : ''}
    <div class="detail-actions">
      <button type="button" id="detail-toggle">${got ? 'Mark as not earned' : 'Mark as earned'}</button>
    </div>`;
  $('#detail-toggle').addEventListener('click', () => {
    toggleEarned(t.id);
    renderDetail();
  });
}

function toggleEarned(id) {
  if (earned.has(id)) earned.delete(id);
  else earned.add(id);
  save();
  renderProgress();
  renderList();
}

function renderAll() {
  renderProgress();
  renderList();
  renderDetail();
}

function exportProgress() {
  const blob = new Blob([JSON.stringify({ app: 'leonida-trophy-guide', earned: [...earned].sort((a, b) => a - b), exportedAt: new Date().toISOString() }, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'leonida-trophy-progress.json';
  a.click();
  URL.revokeObjectURL(a.href);
}

function importProgress(file) {
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const data = JSON.parse(reader.result);
      const ids = Array.isArray(data.earned) ? data.earned : data;
      const valid = new Set(trophies.map((t) => t.id));
      earned = new Set(ids.filter((n) => valid.has(n)));
      save();
      renderAll();
      resultLine.textContent = `Imported ${earned.size} earned trophies.`;
    } catch {
      resultLine.textContent = 'That file could not be read as a progress export. Try exporting again from this guide.';
    }
  };
  reader.readAsText(file);
}

async function init() {
  loadSaved();
  $('#spoiler').checked = spoilerOn;
  const res = await fetch(DATA_URL);
  const data = await res.json();
  trophies = data.trophies || data;
  trophies.sort((a, b) => a.id - b.id);

  ['search', 'grade-filter', 'kind-filter', 'status-filter'].forEach((id) => {
    document.getElementById(id).addEventListener('input', renderList);
  });
  $('#spoiler').addEventListener('change', (e) => {
    spoilerOn = e.target.checked;
    save();
    renderAll();
  });
  $('#export-btn').addEventListener('click', exportProgress);
  $('#import-btn').addEventListener('click', () => $('#import-file').click());
  $('#import-file').addEventListener('change', (e) => {
    if (e.target.files[0]) importProgress(e.target.files[0]);
    e.target.value = '';
  });
  $('#reset-btn').addEventListener('click', () => {
    if (window.confirm('Clear all earned trophies? This cannot be undone.')) {
      earned = new Set();
      save();
      renderAll();
    }
  });

  listEl.addEventListener('click', (e) => {
    const li = e.target.closest('li[data-id]');
    if (!li) return;
    const id = Number(li.dataset.id);
    if (e.target.matches('input[type="checkbox"]')) {
      toggleEarned(id);
      return;
    }
    selectedId = id;
    renderList();
    renderDetail();
  });

  document.addEventListener('click', (e) => {
    const opener = e.target.closest('[data-open-trophy]');
    if (!opener) return;
    selectedId = Number(opener.dataset.openTrophy);
    renderList();
    renderDetail();
    detailEl.focus();
  });

  renderAll();
}

init();
