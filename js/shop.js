import { PRODUCTS, CITIES, ORIGIN, CONFIG } from './data.js';

const $ = id => document.getElementById(id);
const money = n => '$' + (Number.isInteger(n) ? n : n.toFixed(2));
const defSize = p => (p.sizes.includes('40R') ? '40R' : p.sizes.includes('M') ? 'M' : p.sizes[0]);

/* ── the garment bag: a tall forest-green cover, centre zip, hanger hook out of the top, monogram on the chest ── */
const COVER = 'M44 13H56C58.5 13 59.5 15 62 16.5L92 30C96 32 97 35 97 39V192C97 196 95 198 91 198H9C5 198 3 196 3 192V39C3 35 4 32 8 30L38 16.5C40.5 15 41.5 13 44 13Z';
let bagN = 0;
function bagMarkup(){
  const id = 'gz' + (++bagN), ns = 'vector-effect="non-scaling-stroke"';
  return `<svg class="gb-cover" viewBox="0 0 100 200" preserveAspectRatio="none" aria-hidden="true">
    <defs><linearGradient id="${id}g" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stop-color="#fff" stop-opacity=".09"/><stop offset=".45" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".24"/></linearGradient>
    <mask id="${id}m"><rect width="100" height="200" fill="#fff"/><path class="gz-gap" fill="#000" d="M0 0"/></mask></defs>
    <path d="M50 15V8.5C50 3.5 58 3.5 58 8.5" fill="none" stroke="#B08D57" stroke-width="2" stroke-linecap="round" ${ns}/>
    <g mask="url(#${id}m)"><path d="${COVER}" fill="#0F3D2E"/><path d="${COVER}" fill="url(#${id}g)"/>
      <path d="M7.5 41V190C7.5 192.5 8.5 193.5 11 193.5H89C91.5 193.5 92.5 192.5 92.5 190V41" fill="none" stroke="rgba(245,242,234,.2)" stroke-width="1" stroke-dasharray="3 3" ${ns}/>
      <line x1="50" x2="50" y1="16" y2="192" stroke="#07241B" stroke-width="3.2" ${ns}/><line x1="50" x2="50" y1="16" y2="192" stroke="#CFCABB" stroke-width="1.3" stroke-dasharray="1.6 1.6" ${ns}/></g>
    <path class="gz-edge" d="M0 0" fill="none" stroke="#2C6B55" stroke-width="1.6" ${ns}/>
    <rect class="gz-pull" x="47.4" y="15" width="5.2" height="9" rx="1.5" fill="#B08D57"/>
  </svg><i class="gb-mark"></i>`;
}
// k: 0 = open down to the hem, 1 = zipped to the collar
function setZip(bag, k){
  const yp = 190 - (190 - 17) * k, t = (yp - 15) / 175, g = 33 * t, m = yp - 15;
  const d = k >= 1 ? 'M0 0' : `M50 ${yp}C${50 - g * .3} ${yp - m * .5} ${50 - g} ${15 + m * .32} ${50 - g} 15L${50 + g} 15C${50 + g} ${15 + m * .32} ${50 + g * .3} ${yp - m * .5} 50 ${yp}Z`;
  bag.querySelector('.gz-gap').setAttribute('d', d); bag.querySelector('.gz-edge').setAttribute('d', d);
  bag.querySelector('.gz-pull').setAttribute('y', yp - 2); bag.classList.toggle('marked', yp < 52); bag.classList.toggle('shut', k >= 1);
}
// the picked-up suit, with its garment bag closing over it (about half a second)
function bagGhost(p, r){
  const bw = Math.max(r.width * 1.04, r.height * .5), g = document.createElement('div'); g.className = 'ghost';
  g.innerHTML = `<div class="gbag" style="width:${bw}px;height:${r.height}px"><img class="gb-suit" src="${p.front}" alt="">${bagMarkup()}</div>`;
  const bag = g.firstChild, R = { left: r.left + r.width / 2 - bw / 2, top: r.top, width: bw, height: r.height }; setZip(bag, 0);
  const zipped = new Promise(done => { let t0 = 0; const step = now => { if (!t0){ t0 = now + 130; bag.classList.add('on'); } const k = Math.min(1, Math.max(0, (now - t0) / 520)); setZip(bag, k * k * (3 - 2 * k)); if (k < 1 && g.isConnected) requestAnimationFrame(step); else done(); }; requestAnimationFrame(step); });
  return { g, R, zipped, bag };
}

export function initShop({ onPaid }){
  // the container (bag / basket / cart / box) and the word for one product come from CONFIG
  const CW = CONFIG.container.word, IW = CONFIG.itemWord; document.body.dataset.container = CONFIG.container.kind;
  document.querySelectorAll('.cw').forEach(e => { e.textContent = CW; }); document.querySelectorAll('.iw').forEach(e => { e.textContent = IW; });
  ['bagBtn', 'tote'].forEach(id => $(id).setAttribute('aria-label', 'Open ' + CW));
  const cart = [];               // [{id, size, qty}]
  const byId = id => PRODUCTS.find(p => p.id === id);
  const count = () => cart.reduce((n, l) => n + l.qty, 0);
  const subtotal = () => Math.round(cart.reduce((n, l) => n + l.qty * byId(l.id).price, 0) * 100) / 100;
  const shipping = () => (subtotal() > 500 || !cart.length ? 0 : 35);   // free shipping over $500, otherwise $35

  /* ── the rail: pieces hang side-on and turn to face you ── */
  const pieces = $('pieces'), tote = $('tote');
  const unface = () => pieces.querySelectorAll('.piece').forEach(p => p.classList.remove('facing'));
  let dragging = false;
  PRODUCTS.forEach((it, k) => {
    const d = document.createElement('div'); d.className = 'piece'; d.tabIndex = 0;
    d.innerHTML = `<div class="face side"><img src="${it.side}" alt="${it.name}, side" draggable="false"></div>
      <div class="face front"><img src="${it.front}" alt="${it.name}, front" draggable="false"></div>
      <div class="tag">${money(Math.round(it.price))}</div><div class="label">${it.name}<i>drag to ${CW}</i></div>`;
    const face = () => { if (dragging) return; unface(); d.classList.add('facing'); };
    d.addEventListener('mouseenter', face); d.addEventListener('focus', face);
    d.addEventListener('keydown', e => { if (e.key === 'Enter') open(k); });
    pieces.append(d); drag(d, it, k, face);
  });
  pieces.addEventListener('mouseleave', () => { if (!dragging) unface(); });

  /* ── drag a piece off the rail and into the bag ── */
  function drag(el, p, k, face){
    let st = null;
    el.addEventListener('pointerdown', e => { if (e.button) return; st = { x: e.clientX, y: e.clientY, on: false, touch: e.pointerType === 'touch', was: el.classList.contains('facing') }; if (!st.touch){ try { el.setPointerCapture(e.pointerId); } catch (err) {} } });
    el.addEventListener('pointermove', e => {
      if (!st || st.touch) return;
      if (!st.on){
        if (Math.hypot(e.clientX - st.x, e.clientY - st.y) < 8) return;
        // the ghost starts exactly where the facing garment hangs
        const vis = el.querySelector(el.classList.contains('facing') ? '.front img' : '.side img').getBoundingClientRect();
        const h = el.querySelector('.face').offsetHeight, w = h * p.w / p.h;
        const gb = bagGhost(p, { left: vis.left + vis.width / 2 - w / 2, top: vis.top, width: w, height: h }); st.r = gb.R; st.gb = gb;
        st.on = true; st.ox = e.clientX - st.r.left; st.oy = e.clientY - st.r.top; st.rot = 0; st.px = e.clientX;
        st.g = gb.g;
        st.g.style.transformOrigin = `${st.ox}px ${Math.min(st.oy, 40)}px`;
        document.body.append(st.g); el.classList.add('lifted'); document.body.classList.add('dragging'); dragging = true;
      }
      st.rot += ((e.clientX - st.px) * -1.5 - st.rot) * .22; st.px = e.clientX;
      st.g.style.transform = `translate(${e.clientX - st.ox}px,${e.clientY - st.oy}px) rotate(${st.rot.toFixed(1)}deg)`;
      tote.classList.toggle('hot', overBag(e));
    });
    const up = e => {
      if (!st) return; const s = st; st = null;
      if (!s.on){ // a plain click: desktop opens the viewer; touch turns it first, then opens
        if (e.type === 'pointercancel') return;
        if (s.touch && !s.was) face(); else open(k);
        return;
      }
      document.body.classList.remove('dragging'); tote.classList.remove('hot'); dragging = false;
      if (overBag(e)){ const x = e.clientX - s.ox, y = e.clientY - s.oy; s.g.style.transition = 'transform .3s'; s.g.style.transform = `translate(${x}px,${y}px) rotate(0deg)`;   // the zip finishes before the bagged suit goes in
        s.gb.zipped.then(() => { swallow(s.g, x, y, s.r); add(p.id, defSize(p)); setTimeout(() => { el.classList.remove('lifted'); el.classList.add('swing'); setTimeout(() => el.classList.remove('swing'), 950); }, 420); }); }
      else { // spring back onto the rail, out of its bag
        s.gb.bag.classList.add('off'); s.g.style.transition = 'transform .5s cubic-bezier(.3,1.35,.5,1)'; s.g.style.transform = `translate(${s.r.left}px,${s.r.top}px) rotate(0deg)`;
        setTimeout(() => { s.g.remove(); el.classList.remove('lifted'); }, 480);
      }
    };
    el.addEventListener('pointerup', up); el.addEventListener('pointercancel', up);
  }
  const overBag = e => { const r = tote.getBoundingClientRect(), m = 80; return e.clientX > r.left - m && e.clientX < r.right + m && e.clientY > r.top - m && e.clientY < r.bottom + m; };
  function swallow(g, x, y, r){
    const b = tote.getBoundingClientRect(), s = Math.min(.34, (b.width * .36) / r.width);
    g.style.transformOrigin = '0 0'; g.style.transition = 'none'; g.style.transform = `translate(${x}px,${y}px)`; g.getBoundingClientRect();
    g.style.transition = 'transform .55s cubic-bezier(.5,0,.3,1), opacity .55s';
    g.style.transform = `translate(${b.left + b.width / 2 - r.width * s / 2}px,${b.top + b.height * .12}px) scale(${s})`; g.style.opacity = '.2';
    setTimeout(() => g.remove(), 560);
  }

  /* ── focus view: turn a piece front / back, pick a size ── */
  const focus = $('focus'), card = $('card'), viewer = $('viewer'); let angle = 0, cur = null, size = null;
  const isBack = () => ((Math.round(angle / 180) % 2) + 2) % 2 === 1;
  const setAngle = a => { angle = a; card.style.transform = `rotateY(${a}deg)`; focus.querySelectorAll('.tabs button').forEach(b => b.classList.toggle('on', (b.dataset.side === 'back') === isBack())); };
  function open(k){
    cur = PRODUCTS[k]; size = defSize(cur);
    $('imgFront').src = cur.front; $('imgBack').src = cur.back; $('fTitle').textContent = cur.name; $('fCat').textContent = cur.cat || ''; $('fPrice').textContent = '$' + cur.price.toFixed(2);
    const sz = $('sizes'); sz.innerHTML = cur.sizes.map(s => `<button class="${s === size ? 'on' : ''}">${s}</button>`).join('');
    sz.querySelectorAll('button').forEach(b => b.addEventListener('click', () => { size = b.textContent; sz.querySelectorAll('button').forEach(x => x.classList.toggle('on', x === b)); }));
    focus.classList.add('open'); document.body.style.overflow = 'hidden'; setAngle(0);
  }
  const close = () => { focus.classList.remove('open'); document.body.style.overflow = ''; unface(); };
  $('close').addEventListener('click', close); focus.addEventListener('click', e => { if (e.target === focus) close(); });
  focus.querySelectorAll('.tabs button').forEach(b => b.addEventListener('click', () => { if ((b.dataset.side === 'back') !== isBack()) setAngle(angle + 180); }));
  let sx = 0, base = 0, vd = false;
  viewer.addEventListener('pointerdown', e => { sx = e.clientX; base = angle; vd = true; viewer.setPointerCapture(e.pointerId); viewer.classList.add('dragging'); });
  viewer.addEventListener('pointermove', e => { if (!vd) return; angle = base + (e.clientX - sx) * .6; card.style.transform = `rotateY(${angle}deg)`; });
  const settle = () => { if (!vd) return; vd = false; viewer.classList.remove('dragging'); setAngle(Math.round(angle / 180) * 180); };
  viewer.addEventListener('pointerup', settle); viewer.addEventListener('pointercancel', settle);
  $('fAdd').addEventListener('click', () => {
    const r0 = card.getBoundingClientRect(), p = cur, s = size;
    const h = Math.min(r0.height, r0.width * p.h / p.w), w = h * p.w / p.h, gb = bagGhost(p, { left: r0.left + r0.width / 2 - w / 2, top: r0.top, width: w, height: h }), g = gb.g, r = gb.R;
    document.body.append(g); g.style.transform = `translate(${r.left}px,${r.top}px)`;
    close(); gb.zipped.then(() => { swallow(g, r.left, r.top, r); add(p.id, s); });   // zipped into its garment bag first, then into the bag
  });

  /* ── cart state ── */
  function add(id, sz){
    const l = cart.find(x => x.id === id && x.size === sz); l ? l.qty++ : cart.push({ id, size: sz, qty: 1 });
    setTimeout(() => { tote.classList.remove('gulp'); void tote.offsetWidth; tote.classList.add('gulp'); render(); const bb = $('bagBtn'); bb.classList.remove('bump'); void bb.offsetWidth; bb.classList.add('bump'); }, 420);
  }
  function render(){
    const n = count();
    $('bagCount').textContent = n; $('toteBadge').textContent = n; tote.classList.toggle('has', n > 0); $('goCart').disabled = !n; $('toPay').disabled = !n;
    $('totePeek').innerHTML = Array.from({ length: Math.min(3, n) }, (_, i) => `<span class="gbag mini on shut marked" style="--r:${[-7, 6, -1][i]}deg">${bagMarkup()}</span>`).join('');   // what peeks out is the garment bag, not the bare suit
    $('lines').innerHTML = cart.length ? cart.map((l, i) => { const p = byId(l.id); return `<div class="line"><div class="th"><img src="${p.front}" alt=""></div>
      <div><b>${p.name}</b><select data-i="${i}" aria-label="Size">${p.sizes.map(s => `<option${s === l.size ? ' selected' : ''}>${s}</option>`).join('')}</select>
      <span class="qty"><button data-i="${i}" data-d="-1" aria-label="Less">−</button>${l.qty}<button data-i="${i}" data-d="1" aria-label="More">+</button></span></div>
      <div class="pr">${money(Math.round(p.price * l.qty * 100) / 100)}<button class="rm" data-i="${i}" data-d="x">Remove</button></div></div>`; }).join('')
      : `<p class="empty">Your ${CW} is empty.<br>Choose a ${IW} from the rail.</p>`;
    $('subTotal').textContent = money(subtotal()); $('shipCost').textContent = !cart.length ? '—' : shipping() ? money(shipping()) : 'Free';
  }
  $('lines').addEventListener('click', e => {
    const b = e.target.closest('button[data-i]'); if (!b) return; const l = cart[+b.dataset.i];
    if (b.dataset.d === 'x' || (l.qty += +b.dataset.d) <= 0) cart.splice(+b.dataset.i, 1); render();
  });
  $('lines').addEventListener('change', e => { const s = e.target.closest('select[data-i]'); if (s){ cart[+s.dataset.i].size = s.value; } });

  /* ── drawer + demo payment ── */
  const drawer = $('drawer'), scrim = $('scrim'), pay = $('pay');
  const openDrawer = on => { drawer.classList.toggle('on', on); scrim.classList.toggle('on', on); drawer.setAttribute('aria-hidden', !on); };
  [$('bagBtn'), tote, $('goCart')].forEach(b => b.addEventListener('click', () => openDrawer(true)));
  [$('drawerX'), scrim].forEach(b => b.addEventListener('click', () => openDrawer(false)));
  const citySel = $('citySel'); CITIES.forEach(c => citySel.add(new Option(`${c.city}, ${c.country}`, c.code)));
  function openPay(on){
    if (on){
      $('sum').innerHTML = cart.map(l => { const p = byId(l.id); return `<div class="si"><i><img src="${p.front}" alt=""></i><span>${p.name}<small>Size ${l.size} · Qty ${l.qty}</small></span><b>${money(Math.round(p.price * l.qty * 100) / 100)}</b></div>`; }).join('');
      const tot = Math.round((subtotal() + shipping()) * 100) / 100;
      $('pSub').textContent = money(subtotal()); $('pShip').textContent = shipping() ? money(shipping()) : 'Free'; $('pTotal').textContent = money(tot); $('payAmt').textContent = money(tot);
      $('payBtn').className = 'or-btn wide pay-btn'; $('payBtn').disabled = false; openDrawer(false);
    }
    pay.classList.toggle('on', on); pay.setAttribute('aria-hidden', !on);
  }
  $('toPay').addEventListener('click', () => cart.length && openPay(true));
  $('payX').addEventListener('click', () => openPay(false));
  addEventListener('keydown', e => { if (e.key !== 'Escape') { if (focus.classList.contains('open')){ if (e.key === 'ArrowRight') setAngle(angle + 180); if (e.key === 'ArrowLeft') setAngle(angle - 180); } return; } close(); openPay(false); openDrawer(false); });
  $('payForm').addEventListener('submit', e => {
    e.preventDefault(); const f = e.target, btn = $('payBtn'); if (btn.disabled || !cart.length) return;
    btn.disabled = true; btn.classList.add('busy');
    const order = {
      no: 'CSS-' + String(Math.floor(10000 + Math.random() * 89999)), name: f.name.value.trim() || 'Friend', street: f.street.value.trim(),
      dest: CITIES.find(c => c.code === f.city.value), origin: ORIGIN, total: subtotal() + shipping(),
      items: cart.flatMap(l => Array.from({ length: l.qty }, () => ({ ...byId(l.id), size: l.size })))
    };
    setTimeout(() => { btn.classList.remove('busy'); btn.classList.add('done'); }, 1300);   // simulated payment — nothing is charged
    setTimeout(() => { onPaid(order, () => { openPay(false); cart.length = 0; render(); }); }, 2000);
  });

  render();
  return { update(){} };
}
