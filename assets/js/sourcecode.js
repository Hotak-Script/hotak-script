const copyButtons = document.querySelectorAll('.copy-btn');
const txtButtons = document.querySelectorAll('.download-txt');
const zipButtons = document.querySelectorAll('.download-zip');
const sourceItems = document.querySelectorAll('.source-item');
const searchInput = document.getElementById('sourceSearch');
const searchMeta = document.getElementById('searchMeta');
const emptyState = document.getElementById('emptyState');

function getActivePanel(item) {
  return item.querySelector('.code-panel.active') || item.querySelector('.code-panel');
}

function downloadBlob(filename, content, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

async function copyText(text) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const temp = document.createElement('textarea');
  temp.value = text;
  temp.style.position = 'fixed';
  temp.style.left = '-9999px';
  document.body.appendChild(temp);
  temp.focus();
  temp.select();
  document.execCommand('copy');
  document.body.removeChild(temp);
}

function setDoneState(button, htmlText, className) {
  const original = button.innerHTML;
  button.classList.add(className);
  button.innerHTML = htmlText;

  setTimeout(() => {
    button.classList.remove(className);
    button.innerHTML = original;
  }, 1400);
}

sourceItems.forEach((item) => {
  const tabs = item.querySelectorAll('.code-tab');
  const panels = item.querySelectorAll('.code-panel');

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const target = tab.getAttribute('data-tab-target');
      tabs.forEach((t) => t.classList.remove('active'));
      panels.forEach((p) => p.classList.remove('active'));
      tab.classList.add('active');
      const panel = item.querySelector(`.code-panel[data-tab="${target}"]`);
      if (panel) panel.classList.add('active');
    });
  });
});

copyButtons.forEach((button) => {
  button.addEventListener('click', async () => {
    const item = button.closest('.source-item');
    if (!item) return;
    const panel = getActivePanel(item);
    if (!panel) return;

    try {
      await copyText(panel.textContent || '');
      setDoneState(button, '<i class="fa-solid fa-check"></i> Copied', 'copied');
    } catch (error) {
      button.innerHTML = '<i class="fa-solid fa-xmark"></i> Failed';
      setTimeout(() => {
        button.innerHTML = '<i class="fa-regular fa-copy"></i> Copy Current';
      }, 1400);
    }
  });
});

txtButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const item = button.closest('.source-item');
    if (!item) return;
    const panel = getActivePanel(item);
    if (!panel) return;

    const filename = panel.getAttribute('data-filename') || 'source-code.txt';
    const content = panel.textContent || '';
    downloadBlob(filename, content, 'text/plain;charset=utf-8');
    setDoneState(button, '<i class="fa-solid fa-check"></i> Downloaded', 'done');
  });
});

zipButtons.forEach((button) => {
  button.addEventListener('click', async () => {
    const item = button.closest('.source-item');
    if (!item) return;

    if (typeof window.JSZip === 'undefined') {
      button.innerHTML = '<i class="fa-solid fa-xmark"></i> ZIP N/A';
      setTimeout(() => {
        button.innerHTML = '<i class="fa-solid fa-file-zipper"></i> Download ZIP';
      }, 1400);
      return;
    }

    const zip = new window.JSZip();
    const title = item.querySelector('.source-meta h3')?.textContent?.trim() || 'source-code';
    const safeFolder = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'source-code';
    const folder = zip.folder(safeFolder);

    const panels = item.querySelectorAll('.code-panel');
    panels.forEach((panel) => {
      const filename = panel.getAttribute('data-filename') || 'code.txt';
      folder.file(filename, panel.textContent || '');
    });

    try {
      const blob = await zip.generateAsync({ type: 'blob' });
      const zipName = `${safeFolder}.zip`;
      downloadBlob(zipName, blob, 'application/zip');
      setDoneState(button, '<i class="fa-solid fa-check"></i> ZIP Ready', 'done');
    } catch (error) {
      button.innerHTML = '<i class="fa-solid fa-xmark"></i> ZIP Failed';
      setTimeout(() => {
        button.innerHTML = '<i class="fa-solid fa-file-zipper"></i> Download ZIP';
      }, 1400);
    }
  });
});

function runSearch() {
  if (!searchInput || !searchMeta || !emptyState) return;

  const term = searchInput.value.trim().toLowerCase();
  const list = document.getElementById('sourceList');
  if (!list) return;

  // Rank cards by relevance so closest matches float to top.
  const scored = Array.from(sourceItems).map((item, index) => {
    const title = (item.querySelector('.source-meta h3')?.textContent || '').toLowerCase();
    const haystack = ((item.getAttribute('data-search') || '') + ' ' + title).toLowerCase();

    if (!term) {
      return { item, score: 0, matched: true, index };
    }

    let score = 0;
    if (title.includes(term)) score += 8;
    if (haystack.startsWith(term)) score += 5;

    const occurrences = haystack.split(term).length - 1;
    score += occurrences * 2;

    if (haystack.includes(term)) score += 1;

    return { item, score, matched: score > 0, index };
  });

  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.index - b.index;
  });

  let matchedCount = 0;
  scored.forEach(({ item, matched }) => {
    list.appendChild(item);
    item.style.display = '';
    item.classList.toggle('is-strong', matched || !term);
    item.classList.toggle('is-faded', !!term && !matched);
    if (matched) matchedCount += 1;
  });

  if (!term) {
    searchMeta.textContent = 'Showing all source cards.';
    emptyState.hidden = true;
    return;
  }

  emptyState.hidden = true;
  if (matchedCount === 0) {
    searchMeta.textContent = `No close match for "${term}". Showing all cards dimmed.`;
  } else {
    searchMeta.textContent = `${matchedCount} related result(s) are moved to top.`;
  }
}

if (searchInput) {
  searchInput.addEventListener('input', runSearch);
}

runSearch();
