let DATA = null;

const $app = document.getElementById('app');
const $nav = document.getElementById('route-nav');

function slug(title) {
  return title.toLowerCase()
    .replace(/[àá]/g, 'a').replace(/[èé]/g, 'e').replace(/[ìí]/g, 'i')
    .replace(/[òó]/g, 'o').replace(/[ùú]/g, 'u')
    .replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function escapeHtml(s) {
  return (s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function linkify(runs) {
  // runs: [{text, url, bold, italic}]
  if (!runs) return '';
  return runs.map(r => {
    let t = escapeHtml(r.text);
    if (r.bold) t = `<strong>${t}</strong>`;
    if (r.italic) t = `<em>${t}</em>`;
    if (r.url) t = `<a href="${escapeHtml(r.url)}" target="_blank" rel="noopener">${t}</a>`;
    return t;
  }).join('');
}

function buildNav() {
  const items = [`<a href="#/" data-r="home">Home</a>`];
  DATA.routes.forEach((r, i) => {
    items.push(`<a href="#/rotta/${i+1}" data-r="r${i+1}">R${i+1} · ${escapeHtml(r.title)}</a>`);
  });
  items.push(`<a href="#/ponti" class="ponti-link" data-r="ponti">🌉 Ponti</a>`);
  items.push(`<a href="#/appendici" data-r="appendici">📎 Appendici</a>`);
  $nav.innerHTML = items.join('');
}

function setActive(key) {
  $nav.querySelectorAll('a').forEach(a => {
    a.classList.toggle('active', a.dataset.r === key);
  });
  $nav.classList.remove('open');
}

function renderHome() {
  setActive('home');
  const m = DATA.meta;
  const routeCards = DATA.routes.map((r, i) => `
    <a class="route-card" href="#/rotta/${i+1}" style="text-decoration:none;">
      <img class="route-card-icon" src="${escapeHtml(r.icon)}" alt="">
      <div class="num">Rotta ${i+1}</div>
      <h3>${escapeHtml(r.title)}</h3>
      <div class="q">${escapeHtml(r.question || '')}</div>
    </a>`).join('');

  $app.innerHTML = `
    <section class="hero">
      <div class="num" style="color:var(--gold); letter-spacing:.1em; font-size:.8rem;">${escapeHtml(m.tagline_it)}</div>
      <h1>${escapeHtml(m.title)}</h1>
      <h2>${escapeHtml(m.subtitle)}</h2>
      <img src="cover.jpg" alt="Copertina — un ragazzo legge seduto su un libro aperto, tra gru di carta dorate">
      <div class="stats">${escapeHtml(m.tagline_stats)}</div>
      <div class="author">a cura di ${escapeHtml(m.author)}</div>
      <div class="year">${escapeHtml(m.year)}</div>
      ${m.cover_credit ? `<div class="credit">${escapeHtml(m.cover_credit)}</div>` : ''}
    </section>

    <section class="intro-block">
      ${DATA.guida_intro.map(p => `<p>${escapeHtml(p)}</p>`).join('')}
    </section>

    <section class="poem">
      ${DATA.poem.lines.map(l => `<p>${escapeHtml(l)}</p>`).join('')}
      <div class="attrib">${escapeHtml(DATA.poem.author)}, <em>${escapeHtml(DATA.poem.source)}</em></div>
    </section>

    <h2 style="text-align:center; margin-top:40px;">Le 10 Rotte</h2>
    <div class="route-grid">${routeCards}</div>
  `;
  window.scrollTo(0,0);
}

function schedaHtml(s) {
  let cls = 'scheda';
  let title = s.heading.replace(/^▸\s*/, '');
  if (title.startsWith('🧭')) { cls += ' approdo'; title = title.replace(/^🧭\s*/, ''); }
  if (title.startsWith('🔭')) { cls += ' espansione'; }

  const paras = s.paras.map(p => {
    const html = linkify(p.runs);
    if (/^—/.test(p.text.trim())) {
      return `<blockquote>${html}</blockquote>`;
    }
    if (/^🎬/.test(p.text.trim())) {
      return `<p class="visione">${html}</p>`;
    }
    return `<p>${html}</p>`;
  }).join('');

  return `<div class="${cls}"><h3>${escapeHtml(title)}</h3>${paras}</div>`;
}

function renderRoute(idx) {
  const r = DATA.routes[idx - 1];
  if (!r) { location.hash = '#/'; return; }
  setActive('r' + idx);

  const rows = (r.table_rows || []).map(row => {
    const titleHtml = row.titolo_links.length
      ? row.titolo_links.map(l => l.url ? `<a href="${escapeHtml(l.url)}" target="_blank" rel="noopener">${escapeHtml(l.text)}</a>` : escapeHtml(l.text)).join('<br>')
      : escapeHtml(row.titolo_full);
    const statoClass = /guida/i.test(row.stato) ? 'guida' : 'conf';
    return `<tr>
      <td>${escapeHtml(row.n)}</td>
      <td>${titleHtml}</td>
      <td>${escapeHtml(row.autore)}</td>
      <td>${escapeHtml(row.genere)}</td>
      <td>${escapeHtml(row.chiave)}</td>
      <td><span class="badge ${statoClass}">${escapeHtml(row.stato.replace(/\*/g,''))}</span></td>
    </tr>`;
  }).join('');

  const heroImg = (idx === 10)
    ? `<div class="route-hero-img"><img src="interior.jpg" alt="Una ragazza legge seduta su un libro aperto, tra gru di carta"></div>`
    : '';

  $app.innerHTML = `
    <div class="route-header">
      <div class="kicker">Rotta ${idx} di 10</div>
      <div class="route-title-row">
        <img class="route-icon" src="${escapeHtml(r.icon)}" alt="">
        <h1>${escapeHtml(r.title)}</h1>
      </div>
      <div class="question">${escapeHtml(r.question || '')}</div>
      ${r.mix ? `<div class="mix">Mix di genere: ${escapeHtml(r.mix)}</div>` : ''}
    </div>
    ${heroImg}
    ${r.description.map(p => `<p>${escapeHtml(p)}</p>`).join('')}
    <table class="texts">
      <thead><tr><th>N°</th><th>Titolo</th><th>Autore</th><th>Genere</th><th>Chiave</th><th>Stato</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
    <h2>Schede di lettura</h2>
    ${r.schede.map(schedaHtml).join('')}
    <p style="text-align:center; margin-top:30px;">
      ${idx > 1 ? `<a href="#/rotta/${idx-1}">← Rotta ${idx-1}</a>` : `<a href="#/">← Home</a>`}
      &nbsp;·&nbsp;
      ${idx < 10 ? `<a href="#/rotta/${idx+1}">Rotta ${idx+1} →</a>` : `<a href="#/ponti">Ponti tra le Rotte →</a>`}
    </p>
  `;
  window.scrollTo(0,0);
}

function renderPonti() {
  setActive('ponti');
  const cards = DATA.ponti.map(p => {
    const [head, ...rest] = p.split(' — ');
    return `<div class="ponte-card"><h4>🌉 ${escapeHtml(head)}</h4><p>${escapeHtml(rest.join(' — '))}</p></div>`;
  }).join('');

  $app.innerHTML = `
    <div class="route-header">
      <div class="kicker">Costellazione</div>
      <h1>I ponti tra le Rotte</h1>
      <p>${escapeHtml(DATA.ponti_intro)}</p>
    </div>
    <div class="ponti-graph-wrap">
      <canvas id="ponti-canvas" width="820" height="480"></canvas>
    </div>
    <div class="ponti-list">${cards}</div>
  `;
  window.scrollTo(0,0);
  initPontiGraph();
}

function initPontiGraph() {
  const canvas = document.getElementById('ponti-canvas');
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;

  // Build nodes from ponti text (split on ↔), edges connect the two sides
  const nodes = [];
  const edges = [];
  const nodeIndex = {};
  function getNode(label, routeTag) {
    const key = label.trim();
    if (!(key in nodeIndex)) {
      nodeIndex[key] = nodes.length;
      nodes.push({
        label: key, route: routeTag,
        x: W/2 + (Math.random()-0.5)*300, y: H/2 + (Math.random()-0.5)*260,
        vx: 0, vy: 0
      });
    }
    return nodeIndex[key];
  }
  DATA.ponti.forEach(p => {
    const head = p.split(' — ')[0];
    const parts = head.split('↔');
    if (parts.length === 2) {
      const left = parts[0].trim();
      const right = parts[1].trim();
      const rTagL = (left.match(/\(R(\d+)\)/) || [,'?'])[1];
      const rTagR = (right.match(/\(R(\d+)\)/) || [,'?'])[1];
      const a = getNode(left, rTagL);
      const b = getNode(right, rTagR);
      edges.push([a, b, p]);
    }
  });

  const palette = ['#8c5a3c','#5f6f52','#b08d57','#a04a2f','#6b4429','#7d8c6a','#c99a4a','#4a5a3c','#9c6b45','#3c5a4a'];
  function colorFor(routeTag) {
    const n = parseInt(routeTag, 10);
    return isNaN(n) ? '#999' : palette[(n-1) % palette.length];
  }

  let dragging = null;
  let hover = null;

  function step() {
    // simple force layout: repulsion + edge spring + center gravity
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i+1; j < nodes.length; j++) {
        const A = nodes[i], B = nodes[j];
        let dx = A.x - B.x, dy = A.y - B.y;
        let d2 = dx*dx + dy*dy || 0.01;
        let d = Math.sqrt(d2);
        let force = 2600 / d2;
        dx /= d; dy /= d;
        A.vx += dx*force; A.vy += dy*force;
        B.vx -= dx*force; B.vy -= dy*force;
      }
    }
    edges.forEach(([a,b]) => {
      const A = nodes[a], B = nodes[b];
      let dx = B.x - A.x, dy = B.y - A.y;
      let d = Math.sqrt(dx*dx+dy*dy) || 0.01;
      let target = 190;
      let force = (d - target) * 0.02;
      dx /= d; dy /= d;
      A.vx += dx*force; A.vy += dy*force;
      B.vx -= dx*force; B.vy -= dy*force;
    });
    nodes.forEach(n => {
      n.vx += (W/2 - n.x) * 0.0008;
      n.vy += (H/2 - n.y) * 0.0008;
      n.vx *= 0.85; n.vy *= 0.85;
      if (n !== dragging) { n.x += n.vx; n.y += n.vy; }
      n.x = Math.max(60, Math.min(W-60, n.x));
      n.y = Math.max(30, Math.min(H-30, n.y));
    });
  }

  function draw() {
    ctx.clearRect(0,0,W,H);
    ctx.lineWidth = 2;
    edges.forEach(([a,b]) => {
      const A = nodes[a], B = nodes[b];
      ctx.strokeStyle = (hover===a||hover===b) ? '#b08d57' : '#ddceb2';
      ctx.beginPath(); ctx.moveTo(A.x, A.y); ctx.lineTo(B.x, B.y); ctx.stroke();
    });
    nodes.forEach((n, i) => {
      ctx.beginPath();
      ctx.arc(n.x, n.y, hover===i ? 9 : 7, 0, Math.PI*2);
      ctx.fillStyle = colorFor(n.route);
      ctx.fill();
      ctx.font = '11px Georgia, serif';
      ctx.fillStyle = '#2b2420';
      const label = n.label.length > 26 ? n.label.slice(0,24)+'…' : n.label;
      ctx.textAlign = n.x > W/2 ? 'right' : 'left';
      ctx.fillText(label, n.x + (n.x > W/2 ? -12 : 12), n.y+4);
    });
  }

  function loop() { step(); draw(); requestAnimationFrame(loop); }
  loop();

  function posFromEvent(e) {
    const rect = canvas.getBoundingClientRect();
    const cx = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
    const cy = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
    return { x: cx * (W/rect.width), y: cy * (H/rect.height) };
  }
  function nodeAt(pos) {
    for (let i=0;i<nodes.length;i++) {
      const n = nodes[i];
      if (Math.hypot(n.x-pos.x, n.y-pos.y) < 14) return i;
    }
    return null;
  }
  canvas.addEventListener('mousedown', e => {
    const pos = posFromEvent(e);
    const i = nodeAt(pos);
    if (i !== null) dragging = nodes[i];
  });
  canvas.addEventListener('mousemove', e => {
    const pos = posFromEvent(e);
    if (dragging) { dragging.x = pos.x; dragging.y = pos.y; }
    else hover = nodeAt(pos);
  });
  window.addEventListener('mouseup', () => dragging = null);
  canvas.addEventListener('touchstart', e => {
    const pos = posFromEvent(e);
    const i = nodeAt(pos);
    if (i !== null) { dragging = nodes[i]; e.preventDefault(); }
  }, {passive:false});
  canvas.addEventListener('touchmove', e => {
    if (dragging) { const pos = posFromEvent(e); dragging.x = pos.x; dragging.y = pos.y; e.preventDefault(); }
  }, {passive:false});
  canvas.addEventListener('touchend', () => dragging = null);
}

function renderAppendici() {
  setActive('appendici');
  const a = DATA.appendici.a;
  const b = DATA.appendici.b;

  const rowsA = a.table.map(([k,v]) => `<tr><th>${escapeHtml(k)}</th><td>${escapeHtml(v)}</td></tr>`).join('');
  const rowsB = b.table.map(([k,v]) => `<tr><th>${escapeHtml(k)}</th><td>${escapeHtml(v)}</td></tr>`).join('');
  const note = DATA.appendici.b.note_insegnante.map(n => {
    const clean = n.replace(/^—\s*/, '');
    const idx = clean.indexOf(':');
    if (idx === -1) {
      return `<div class="scheda"><p>${escapeHtml(clean)}</p></div>`;
    }
    const label = clean.slice(0, idx);
    const rest = clean.slice(idx + 1);
    return `<div class="scheda"><h3>${escapeHtml(label)}</h3><p>${escapeHtml(rest.trim())}</p></div>`;
  }).join('');

  $app.innerHTML = `
    <div class="route-header">
      <div class="kicker">Strumenti</div>
      <h1>Appendici</h1>
    </div>

    <h2>${escapeHtml(a.title)}</h2>
    <p>${escapeHtml(a.intro)}</p>
    <table class="texts appendix-table"><tbody>${rowsA}</tbody></table>

    <h2>${escapeHtml(b.title)}</h2>
    <p>${escapeHtml(b.intro)}</p>
    <table class="texts appendix-table"><tbody>${rowsB}</tbody></table>

    <h2>Note per l'insegnante</h2>
    ${note}

    <h2>L'autrice</h2>
    <div class="autrice">
      <img src="autrice.jpg" alt="Vincenzina Pace">
      <p>${escapeHtml(DATA.autrice_bio || '')}</p>
    </div>
  `;
  window.scrollTo(0,0);
}

function router() {
  const hash = location.hash || '#/';
  const m1 = hash.match(/^#\/rotta\/(\d+)/);
  if (hash === '#/' || hash === '') renderHome();
  else if (m1) renderRoute(parseInt(m1[1], 10));
  else if (hash === '#/ponti') renderPonti();
  else if (hash === '#/appendici') renderAppendici();
  else renderHome();
}

function boot() {
  DATA = window.PASSEPARTOUT_DATA;
  buildNav();
  router();
  window.addEventListener('hashchange', router);

  document.getElementById('menu-toggle').addEventListener('click', () => {
    $nav.classList.toggle('open');
  });

  // Il service worker richiede http/https (o localhost): su file:// (Documents/iPad) si salta,
  // ma la pagina funziona comunque perché i dati sono incorporati direttamente, non caricati via fetch.
  if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  }
  updateOfflinePill();
  window.addEventListener('online', updateOfflinePill);
  window.addEventListener('offline', updateOfflinePill);
}

function updateOfflinePill() {
  const pill = document.getElementById('offline-pill');
  if (!location.protocol.startsWith('http')) { pill.textContent = '○ file locale'; return; }
  if (navigator.onLine) { pill.textContent = '● online'; pill.classList.remove('offline'); }
  else { pill.textContent = '○ offline — contenuti salvati'; pill.classList.add('offline'); }
}

boot();
