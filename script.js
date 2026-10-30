/* =========================================================
   The Little Happiness Box: behaviour
   Vanilla JS, no libraries, no network requests.
   Want to change a message? Edit the MESSAGES list below.
   ========================================================= */
(() => {
  'use strict';

  /* ---------------------------------------------------------
     1. The messages (edit these freely)
     --------------------------------------------------------- */
  const MESSAGES = {
    love: [
      "Simran, you are loved more than you know.",
      "You make this world a little more beautiful just by being in it.",
      "You deserve all the kindness you so freely give to others.",
      "Never forget how special you are.",
      "You are someone’s favourite reason to smile.",
      "You deserve to feel loved, appreciated and celebrated.",
      "The world is lucky to have you in it."
    ],
    hug: [
      "If today feels heavy, remember that you don’t have to figure everything out right now.",
      "It’s okay not to be okay every single day.",
      "Take a deep breath. One little step at a time.",
      "You don’t always have to be strong. It’s okay to rest.",
      "Don’t be too hard on yourself. You’re doing better than you think.",
      "Some days, getting through the day is enough. Give yourself credit for that.",
      "Whatever today looks like, you deserve kindness, especially from yourself.",
      "Imagine the biggest, warmest hug coming your way!"
    ],
    reminder: [
      "You are enough, exactly as you are.",
      "Your feelings matter.",
      "You don’t need to compare your journey with anyone else’s.",
      "You deserve to be celebrated, not just on special occasions.",
      "Be proud of how far you’ve come.",
      "You are allowed to rest without feeling guilty.",
      "Never shrink yourself to make others comfortable.",
      "You deserve the same love you give to everyone else."
    ],
    sunshine: [
      "May something unexpectedly wonderful happen to you today.",
      "You deserve days filled with laughter and peace.",
      "Keep smiling. There are so many beautiful things waiting for you.",
      "You are capable of more than you realise.",
      "Never stop being your wonderful self.",
      "May your heart always find little reasons to be happy.",
      "Good things are allowed to happen to you.",
      "I hope today treats you gently and tomorrow brings something beautiful."
    ]
  };

  /* ---------------------------------------------------------
     2. Small helpers
     --------------------------------------------------------- */
  const $  = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const NS = 'http://www.w3.org/2000/svg';
  const mqReduce = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : { matches: false };
  const reduced = () => !!mqReduce.matches;
  const wait = (ms) => new Promise((res) => setTimeout(res, reduced() ? Math.min(ms, 40) : ms));
  const rand = (a, b) => a + Math.random() * (b - a);
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const reflow = (el) => void el.offsetWidth;
  const icon = (id) => `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><use href="#${id}"></use></svg>`;
  const PALETTE = ['#F9A8C4', '#F58FB4', '#C9B6F2', '#FFC9A8', '#FFD3E2', '#FFE08A'];

  function shuffle(list) {
    const a = list.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  /* A deck shows every message once (in random order) before any repeats */
  class Deck {
    constructor(items) { this.items = items; this.queue = []; this.last = -1; }
    next() {
      if (!this.queue.length) {
        this.queue = shuffle(this.items.map((_, i) => i));
        if (this.items.length > 1 && this.queue[0] === this.last) {
          const k = 1 + Math.floor(Math.random() * (this.queue.length - 1));
          [this.queue[0], this.queue[k]] = [this.queue[k], this.queue[0]];
        }
      }
      this.last = this.queue.shift();
      return this.items[this.last];
    }
  }

  const decks = {};
  Object.keys(MESSAGES).forEach((key) => { decks[key] = new Deck(MESSAGES[key]); });

  /* ---------------------------------------------------------
     3. Build the illustrations and the dreamy background
     --------------------------------------------------------- */
  function mountTemplates() {
    $$('[data-tpl]').forEach((slot) => {
      const tpl = document.getElementById('tpl-' + slot.dataset.tpl);
      if (tpl) slot.appendChild(tpl.content.cloneNode(true));
    });
    $$('.petals').forEach((g) => {
      for (let i = 0; i < 8; i++) {
        const e = document.createElementNS(NS, 'ellipse');
        e.setAttribute('cx', '0'); e.setAttribute('cy', '-15');
        e.setAttribute('rx', '8');  e.setAttribute('ry', '13');
        e.setAttribute('transform', `rotate(${i * 45})`);
        g.appendChild(e);
      }
    });
    $$('.sun-rays').forEach((g) => {
      for (let i = 0; i < 12; i++) {
        const r = document.createElementNS(NS, 'rect');
        r.setAttribute('x', '104'); r.setAttribute('y', '10');
        r.setAttribute('width', '12'); r.setAttribute('height', '30'); r.setAttribute('rx', '6');
        r.setAttribute('transform', `rotate(${i * 30} 110 110)`);
        g.appendChild(r);
      }
    });
  }

  mountTemplates();   // must run before the bear / flower / sun elements are looked up below

  function buildSky() {
    const sky = $('#sky');
    if (!sky) return;
    const small = window.innerWidth < 600;
    const frag = document.createDocumentFragment();

    const clouds = small ? 3 : 4;
    for (let i = 0; i < clouds; i++) {
      const c = document.createElement('div');
      c.className = 'cloud';
      c.style.cssText = `top:${6 + i * (small ? 24 : 20) + rand(-3, 3)}%;width:${rand(110, 190)}px;--dur:${rand(70, 120)}s;--delay:${rand(0, 110)}s;opacity:${rand(.6, .9).toFixed(2)}`;
      c.innerHTML = '<svg viewBox="0 0 120 64" aria-hidden="true"><use href="#i-cloud"></use></svg>';
      frag.appendChild(c);
    }

    const hearts = small ? 10 : 16;
    for (let i = 0; i < hearts; i++) {
      const el = document.createElement('div');
      el.className = 'float';
      const s = rand(14, 34);
      el.style.cssText = `--x:${rand(2, 96).toFixed(1)}%;--s:${s.toFixed(0)}px;--dur:${rand(15, 28).toFixed(1)}s;--delay:${rand(0, 28).toFixed(1)}s;--sway:${rand(-60, 60).toFixed(0)}px;--rot:${rand(-30, 30).toFixed(0)}deg;--o:${rand(.3, .65).toFixed(2)};color:${pick(PALETTE.slice(0, 5))}`;
      el.innerHTML = icon('i-heart');
      frag.appendChild(el);
    }

    const sparkles = small ? 12 : 20;
    for (let i = 0; i < sparkles; i++) {
      const el = document.createElement('div');
      el.className = 'twinkle';
      const s = rand(9, 20);
      el.style.cssText = `--x:${rand(2, 96).toFixed(1)}%;--y:${rand(3, 94).toFixed(1)}%;--s:${s.toFixed(0)}px;--dur:${rand(3, 6.5).toFixed(1)}s;--delay:${rand(0, 6).toFixed(1)}s;color:${pick(['#FFE08A', '#F9A8C4', '#C9B6F2', '#FFFFFF'])}`;
      el.innerHTML = icon(Math.random() < .35 ? 'i-star' : 'i-sparkle');
      frag.appendChild(el);
    }
    sky.appendChild(frag);
  }

  /* ---------------------------------------------------------
     4. Particle bursts (hearts, sparkles, petals)
     --------------------------------------------------------- */
  const fxLayer = $('#fx');
  function centerOf(el) {
    const r = el.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  }

  function burst(x, y, opts = {}) {
    if (reduced() || !fxLayer) return;
    if (fxLayer.childElementCount > 140) return;
    const {
      count = 16, kinds = ['i-heart', 'i-sparkle'], colors = PALETTE,
      spread = 170, up = 110, size = [14, 28], dur = [1100, 1900]
    } = opts;
    const n = window.innerWidth < 600 ? Math.ceil(count * 0.7) : count;
    for (let i = 0; i < n; i++) {
      const el = document.createElement('span');
      el.className = 'fx-p';
      const s = rand(size[0], size[1]);
      const ang = rand(0, Math.PI * 2);
      const dist = rand(spread * 0.35, spread);
      const d = rand(dur[0], dur[1]);
      el.style.cssText =
        `--s:${s.toFixed(0)}px;--x:${(x - s / 2).toFixed(0)}px;--y:${(y - s / 2).toFixed(0)}px;` +
        `--dx:${(Math.cos(ang) * dist).toFixed(0)}px;--dy:${(Math.sin(ang) * dist - up).toFixed(0)}px;` +
        `--rot:${rand(-90, 90).toFixed(0)}deg;--d:${d.toFixed(0)}ms;color:${pick(colors)}`;
      el.innerHTML = icon(pick(kinds));
      fxLayer.appendChild(el);
      setTimeout(() => el.remove(), d + 250);
    }
  }

  const burstAt = (el, opts, dy = 0) => { const c = centerOf(el); burst(c.x, c.y + dy, opts); };

  /* ---------------------------------------------------------
     5. Moving between screens (no page reloads)
     --------------------------------------------------------- */
  const views = {};
  $$('.view').forEach((v) => { views[v.dataset.view] = v; });

  let current = 'welcome';   // the screen that is showing
  let target = 'welcome';    // the screen we are heading to
  let token = 0;
  let unlocked = false;
  const opened = new Set();

  const hashName = () => location.hash.replace('#', '');

  function navigate(name) {
    if (!views[name]) return;
    try { if (hashName() !== name) location.hash = name; } catch (e) { /* ignore */ }
    render(name);
  }

  function goBack() {
    // Gifts and the letter are always opened from the "gifts" screen,
    // so the browser's back step is the right one (also fixes the phone back button).
    let moved = false;
    try { history.back(); moved = true; } catch (e) { /* ignore */ }
    setTimeout(() => { if (target !== 'box') render('box'); }, moved ? 400 : 0);
  }

  async function render(name) {
    if (!views[name] || name === target) return;
    if (!unlocked && name !== 'welcome') return;   // the box has to be opened first
    target = name;
    const my = ++token;
    const from = views[current];
    const to = views[name];

    if (from !== to) {
      from.classList.add('leaving');
      await wait(240);
      if (my !== token) return;
      from.hidden = true;
      from.classList.remove('is-active', 'leaving');
    }

    to.hidden = false;
    reflow(to);
    to.classList.add('is-active');
    current = name;
    document.body.dataset.view = name;
    window.scrollTo(0, 0);
    updateBuddy();
    const heading = $('[tabindex="-1"]', to);
    if (heading) heading.focus({ preventScroll: true });
    if (onEnter[name]) onEnter[name]();
  }

  window.addEventListener('hashchange', () => {
    const name = views[hashName()] ? hashName() : 'welcome';
    render(name);
  });

  /* ---------------------------------------------------------
     6. Teddy bear helpers (corner buddy, hug gift, finale)
     --------------------------------------------------------- */
  function setPose(svg, pose) {
    if (!svg) return;
    svg.classList.remove('pose-idle', 'pose-open', 'pose-hug', 'pose-wave');
    svg.classList.add('pose-' + pose);
  }

  const buddyBtn = $('#buddy');
  const buddyBear = buddyBtn ? $('.bear', buddyBtn) : null;
  let buddyBusy = false;
  let buddyTimer = null;

  async function buddyMove(forceHug) {
    if (!buddyBear || buddyBusy) return;
    buddyBusy = true;
    if (!forceHug && Math.random() < 0.65) {
      setPose(buddyBear, 'wave');
      await wait(2400);
    } else {
      setPose(buddyBear, 'open');
      await wait(700);
      setPose(buddyBear, 'hug');
      buddyBear.classList.add('squeeze');
      burstAt(buddyBear, { count: 9, kinds: ['i-heart'], spread: 90, up: 60, size: [12, 20] }, -30);
      await wait(950);
      buddyBear.classList.remove('squeeze');
    }
    setPose(buddyBear, 'idle');
    buddyBusy = false;
  }

  function updateBuddy() {
    if (!buddyBtn) return;
    const show = current === 'welcome' || current === 'box';
    buddyBtn.hidden = !show;
    clearTimeout(buddyTimer);
    if (show) buddyTimer = setTimeout(function tick() {
      if (!document.hidden && (current === 'welcome' || current === 'box')) buddyMove(false);
      buddyTimer = setTimeout(tick, rand(7000, 11000));
    }, rand(2500, 4000));
  }

  if (buddyBtn) buddyBtn.addEventListener('click', () => buddyMove(true));

  /* ---------------------------------------------------------
     7. Welcome screen: opening the gift box
     --------------------------------------------------------- */
  const giftboxBtn = $('#giftbox');
  const openBtn = $('#open-btn');
  let opening = false;

  async function openGiftBox() {
    if (opening) return;
    opening = true;
    openBtn.setAttribute('aria-disabled', 'true');
    giftboxBtn.classList.add('shake');
    await wait(620);
    giftboxBtn.classList.remove('shake');
    giftboxBtn.classList.add('is-open');
    await wait(250);
    burstAt(giftboxBtn, { count: 28, spread: 230, up: 150, size: [14, 32] }, -30);
    await wait(500);
    burstAt(giftboxBtn, { count: 16, kinds: ['i-sparkle', 'i-star'], spread: 200, up: 120, size: [10, 22] }, -30);
    await wait(950);
    unlocked = true;
    navigate('box');
  }

  function resetWelcome() {
    opening = false;
    giftboxBtn.classList.remove('is-open', 'shake');
    openBtn.removeAttribute('aria-disabled');
  }

  giftboxBtn.addEventListener('click', openGiftBox);
  openBtn.addEventListener('click', openGiftBox);

  /* ---------------------------------------------------------
     8. The four gifts
     --------------------------------------------------------- */
  function setMessage(g, text, animClass) {
    g.text.textContent = text;
    g.card.classList.remove('anim-love', 'anim-hug', 'anim-flip', 'anim-beam');
    reflow(g.card);
    g.card.classList.add(animClass);
  }

  const gifts = {
    love: {
      view: $('#view-love'), art: $('#love-art'), card: $('#love-card'), text: $('#love-text'), btn: $('#love-btn'),
      async play(msg) {
        this.art.classList.remove('pop'); reflow(this.art); this.art.classList.add('pop');
        burstAt(this.art, { count: 18, kinds: ['i-heart'], colors: ['#F58FB4', '#F9A8C4', '#FFC9A8', '#C9B6F2'], spread: 170, up: 70, size: [14, 30] });
        await wait(260);
        setMessage(this, msg, 'anim-love');
        await wait(700);
      }
    },
    hug: {
      view: $('#view-hug'), art: $('#hug-art'), card: $('#hug-card'), text: $('#hug-text'), btn: $('#hug-btn'),
      bear: null, relaxTimer: null,
      async play(msg, initial) {
        const bear = this.bear;
        clearTimeout(this.relaxTimer);
        this.card.classList.add('is-waiting');
        setPose(bear, 'open');
        await wait(initial ? 750 : 450);
        setPose(bear, 'hug');
        bear.classList.add('squeeze');
        burstAt(bear, { count: 16, kinds: ['i-heart'], colors: ['#F58FB4', '#F9A8C4', '#FFC9A8'], spread: 150, up: 90, size: [14, 28] }, -40);
        await wait(750);
        bear.classList.remove('squeeze');
        setMessage(this, msg, 'anim-hug');
        this.card.classList.remove('is-waiting');
        await wait(550);
        this.relaxTimer = setTimeout(() => setPose(bear, 'open'), 1800);
      }
    },
    reminder: {
      view: $('#view-reminder'), art: $('#reminder-art'), card: $('#reminder-card'), text: $('#reminder-text'), btn: $('#reminder-btn'),
      async play(msg, initial) {
        if (initial) {
          this.art.classList.remove('grow', 'wiggle'); reflow(this.art); this.art.classList.add('grow');
          await wait(900);
        } else {
          this.art.classList.remove('wiggle'); reflow(this.art); this.art.classList.add('wiggle');
        }
        burstAt(this.art, { count: 14, kinds: ['i-petal'], colors: ['#FFB3CB', '#D9C8FA', '#FFCDAE', '#FFD3E2'], spread: 120, up: -40, size: [14, 24], dur: [1500, 2400] }, -50);
        setMessage(this, msg, 'anim-flip');
        await wait(initial ? 900 : 760);
      }
    },
    sunshine: {
      view: $('#view-sunshine'), art: $('#sunshine-art'), card: $('#sunshine-card'), text: $('#sunshine-text'), btn: $('#sunshine-btn'),
      async play(msg, initial) {
        this.art.classList.remove('rise', 'glow'); reflow(this.art);
        this.art.classList.add(initial ? 'rise' : 'glow');
        await wait(initial ? 650 : 200);
        burstAt(this.art, { count: 16, kinds: ['i-sparkle', 'i-star'], colors: ['#FFE08A', '#FFCF7A', '#FFFFFF', '#FFC9A8'], spread: 170, up: 30, size: [10, 24] });
        setMessage(this, msg, 'anim-beam');
        await wait(850);
      }
    }
  };

  async function showGiftMessage(key, initial) {
    const g = gifts[key];
    if (g.busy) {
      if (initial && g.pending) await g.pending;   // opened again very quickly: wait, then show
      else return;
    }
    g.busy = true;
    g.btn.setAttribute('aria-disabled', 'true');
    g.pending = (async () => {
      try {
        await g.play(decks[key].next(), initial);
      } finally {
        g.busy = false;
        g.btn.removeAttribute('aria-disabled');
      }
    })();
    await g.pending;
  }

  Object.keys(gifts).forEach((key) => {
    gifts[key].btn.addEventListener('click', () => showGiftMessage(key, false));
  });
  gifts.hug.bear = $('.bear', gifts.hug.art);
  gifts.hug.art.addEventListener('click', () => showGiftMessage('hug', false));

  /* The four cards on the "gifts" screen */
  const card = {};
  $$('.card[data-gift]').forEach((btn) => {
    card[btn.dataset.gift] = btn;
    btn.addEventListener('click', () => {
      burstAt(btn, { count: 8, kinds: ['i-heart', 'i-sparkle'], spread: 90, up: 50, size: [10, 18] });
      navigate(btn.dataset.gift);
    });
  });

  const letterBtn = $('#letter-btn');
  const allDone = $('#all-done');

  function refreshBox() {
    Object.keys(card).forEach((k) => card[k].classList.toggle('is-opened', opened.has(k)));
    letterBtn.dataset.ready = opened.size > 0 ? 'true' : 'false';
    allDone.hidden = opened.size < Object.keys(card).length;
  }

  letterBtn.addEventListener('click', () => {
    burstAt(letterBtn, { count: 10, kinds: ['i-heart', 'i-sparkle'], spread: 100, up: 60, size: [10, 20] });
    navigate('letter');
  });

  /* Every "Back to my gifts" button */
  $$('[data-back]').forEach((b) => b.addEventListener('click', goBack));

  /* ---------------------------------------------------------
     9. The final letter
     --------------------------------------------------------- */
  const envWrap = $('#env-wrap');
  const envBtn = $('#env-btn');
  const envelope = $('#envelope');
  const letterEl = $('#letter');
  const closing = $('#closing');
  const rereadBtn = $('#reread-btn');
  const closingBear = $('.closing-bear .bear');
  let letterState = 'closed';   // closed -> opening -> writing -> done
  let finishTimer = null;
  let rainTimer = null;
  let totalWords = 0;

  /* Split each paragraph into words so they can appear one by one */
  function prepareLetter() {
    let i = 0;
    $$('[data-words]', letterEl).forEach((p) => {
      const words = p.textContent.trim().split(/\s+/);
      p.textContent = '';
      words.forEach((word, idx) => {
        const span = document.createElement('span');
        span.className = 'w';
        span.style.setProperty('--i', String(i++));
        span.textContent = word;
        p.appendChild(span);
        if (idx < words.length - 1) p.appendChild(document.createTextNode(' '));
      });
    });
    totalWords = i;
    // the signature starts writing after the last word
    letterEl.style.setProperty('--sig-delay', ((totalWords * 60 + 350 + 500) / 1000).toFixed(2) + 's');
  }

  function resetLetter() {
    clearTimeout(finishTimer);
    clearInterval(rainTimer);
    letterState = 'closed';
    envelope.classList.remove('is-open');
    envWrap.hidden = false;
    envWrap.classList.remove('leaving');
    letterEl.hidden = true;
    letterEl.classList.remove('writing', 'done');
    closing.hidden = true;
    setPose(closingBear, 'idle');
  }

  async function openEnvelope() {
    if (letterState !== 'closed') return;
    letterState = 'opening';
    envelope.classList.add('is-open');
    await wait(500);
    burstAt(envBtn, { count: 14, kinds: ['i-sparkle', 'i-heart'], spread: 160, up: 80, size: [10, 22] }, -40);
    await wait(1350);
    envWrap.classList.add('leaving');
    await wait(450);
    envWrap.hidden = true;
    letterEl.hidden = false;
    reflow(letterEl);
    startWriting();
  }

  function startWriting() {
    letterState = 'writing';
    letterEl.classList.remove('done');
    letterEl.classList.add('writing');
    const sigMs = totalWords * 60 + 350 + 500 + 2300;
    finishTimer = setTimeout(finale, reduced() ? 60 : sigMs);
  }

  function skipWriting() {
    if (letterState !== 'writing') return;
    clearTimeout(finishTimer);
    letterEl.classList.add('done');
    finale();
  }

  function finale() {
    if (letterState === 'done') return;
    letterState = 'done';
    letterEl.classList.add('done');
    closing.hidden = false;
    reflow(closing);
    const c = centerOf(letterEl);
    burst(c.x, c.y, { count: 22, kinds: ['i-heart', 'i-sparkle'], spread: 260, up: 160, size: [14, 30], dur: [1600, 2600] });
    // a gentle rain of hearts floating up the screen
    let ticks = 0;
    clearInterval(rainTimer);
    rainTimer = setInterval(() => {
      if (++ticks > 22 || current !== 'letter') { clearInterval(rainTimer); return; }
      burst(rand(20, window.innerWidth - 20), window.innerHeight - 10, {
        count: 2, kinds: ['i-heart'], spread: 30, up: window.innerHeight * 0.7, size: [14, 30], dur: [2400, 3800]
      });
    }, 260);
    setTimeout(() => {
      setPose(closingBear, 'open');
      setTimeout(() => {
        setPose(closingBear, 'hug');
        closingBear.classList.add('squeeze');
        burstAt(closingBear, { count: 10, kinds: ['i-heart'], spread: 110, up: 70, size: [12, 22] }, -30);
        setTimeout(() => closingBear.classList.remove('squeeze'), 1000);
      }, 800);
    }, 700);
    if (closing.scrollIntoView) closing.scrollIntoView({ behavior: reduced() ? 'auto' : 'smooth', block: 'nearest' });
  }

  envBtn.addEventListener('click', openEnvelope);
  letterEl.addEventListener('click', skipWriting);
  rereadBtn.addEventListener('click', () => {
    resetLetter();
    window.scrollTo(0, 0);
    openEnvelope();
  });

  /* ---------------------------------------------------------
     10. What happens when each screen appears
     --------------------------------------------------------- */
  const onEnter = {
    welcome() { resetWelcome(); },
    box() { refreshBox(); },
    love()     { opened.add('love');     showGiftMessage('love', true); },
    hug()      { opened.add('hug');      setPose(gifts.hug.bear, 'open'); showGiftMessage('hug', true); },
    reminder() { opened.add('reminder'); showGiftMessage('reminder', true); },
    sunshine() { opened.add('sunshine'); showGiftMessage('sunshine', true); },
    letter()   { resetLetter(); }
  };

  /* ---------------------------------------------------------
     11. Start
     --------------------------------------------------------- */
  document.addEventListener('visibilitychange', () => {
    document.body.classList.toggle('is-paused', document.hidden);
  });

  buildSky();
  prepareLetter();

  // Always begin at the welcome screen, even if the page was opened with a #hash
  if (location.hash) {
    try { history.replaceState(null, '', location.pathname + location.search); }
    catch (e) { try { location.hash = ''; } catch (e2) { /* ignore */ } }
  }
  views.welcome.hidden = false;
  views.welcome.classList.add('is-active');
  updateBuddy();

  // Expose a tiny hook so the app can be tested without clicking by hand
  window.__box = { decks, MESSAGES, state: () => ({ current, target, unlocked, letterState, opened: Array.from(opened) }) };
})();
