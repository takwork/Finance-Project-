(() => {
  'use strict';

  const ROOT = document.body.dataset.root || '';
  const PAGE = document.body.dataset.page || '';

  const PILLARS = [
    { key:'make', name:'Earn', lessons:[['make-jobs','Jobs & Paychecks'],['make-taxes','Taxes Basics'],['make-hustles','Side Hustles']] },
    { key:'save', name:'Save', lessons:[['save-banking','Smart Money'],['save-budget','Budgeting'],['save-emergency','Emergency Fund']] },
    { key:'invest', name:'Invest', lessons:[['invest-funds','Investment Types'],['invest-stocks','What Is a Stock?'],['invest-compound','Compound Interest']] },
    { key:'protect', name:'Protect', lessons:[['protect-credit','Credit & Debt'],['protect-insurance','Insurance'],['protect-secure','Scams & Identity Theft']] }
  ];
  const LESSONS = PILLARS.flatMap(p => p.lessons.map(([id, t]) => ({ id, t, p:p.key })));
  const EXTRA = [
    ['tools', 'ti-calculator', 'Tools & Calculators'],
    ['ask-ai', 'ti-sparkles', 'Ask AI'],
    ['quiz', 'ti-clipboard-check', 'Money Quiz'],
    ['glossary', 'ti-vocabulary', 'Glossary'],
    ['feedback', 'ti-message-circle', 'Feedback'],
    ['about', 'ti-info-circle', 'About']
  ];

  const href = page => ROOT + page + '.html';
  const lessonHref = id => ROOT + 'learn/' + id + '.html';
  const amp = s => s.replace(/&/g, '&amp;');
  const fmt = n => '$' + Math.round(n).toLocaleString('en-US');
  const plural = (n, one, many) => n + ' ' + (n === 1 ? one : many);

  /* ---------- lesson progress (kept for this browser tab only, like the old site's per-visit progress) ---------- */
  const PROGRESS_KEY = 'tml-progress';
  let done;
  try { done = new Set(JSON.parse(sessionStorage.getItem(PROGRESS_KEY) || '[]')); } catch (e) { done = new Set(); }
  function paintProgress() {
    const n = [...done].filter(id => LESSONS.some(l => l.id === id)).length;
    document.querySelectorAll('[data-progress-count]').forEach(el => { el.textContent = `${n} of ${LESSONS.length}`; });
    document.querySelectorAll('[data-progress-bar]').forEach(el => { el.style.width = (n / LESSONS.length * 100) + '%'; });
    document.querySelectorAll('[data-lesson-id]').forEach(el => el.classList.toggle('is-done', done.has(el.dataset.lessonId)));
  }
  function markDone(id) {
    if (!LESSONS.some(l => l.id === id) || done.has(id)) return;
    done.add(id);
    try { sessionStorage.setItem(PROGRESS_KEY, JSON.stringify([...done])); } catch (e) { /* storage blocked: progress still shows for this page */ }
    paintProgress();
    if (typeof gtag === 'function') gtag('event', 'lesson_complete', { lesson_id:id });
  }
  const progressBox = cls => `<div class="${cls}"><p class="dp-top"><span>Your progress</span><b><span data-progress-count>0 of ${LESSONS.length}</span> lessons</b></p><span class="dp-track"><span data-progress-bar></span></span></div>`;

  function buildProgressViews() {
    const header = document.querySelector('.site-header');
    if (header) {
      const pill = document.createElement('a');
      pill.className = 'hdr-progress';
      pill.href = href('lessons');
      pill.title = 'Lessons completed';
      pill.innerHTML = '<span class="dp-track"><span data-progress-bar></span></span><span><span data-progress-count></span> lessons</span>';
      header.append(pill);
    }
    if (PAGE === 'lessons') {
      document.querySelectorAll('.rows .row').forEach(a => {
        const m = a.getAttribute('href').match(/learn\/([\w-]+)\.html/);
        if (m) a.dataset.lessonId = m[1];
      });
      const lede = document.querySelector('main .lede');
      if (lede) lede.insertAdjacentHTML('afterend', progressBox('progress-box'));
    }
  }

  /* ---------- dark mode (same saved setting as the old site) ---------- */
  function buildThemeToggle() {
    const header = document.querySelector('.site-header');
    if (!header) return;
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'theme-btn';
    const paint = () => {
      const dark = document.documentElement.getAttribute('data-theme') === 'dark';
      btn.innerHTML = `<i class="ti ${dark ? 'ti-sun' : 'ti-moon'}" aria-hidden="true"></i>`;
      btn.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
    };
    btn.addEventListener('click', () => {
      const dark = document.documentElement.getAttribute('data-theme') !== 'dark';
      if (dark) document.documentElement.setAttribute('data-theme', 'dark');
      else document.documentElement.removeAttribute('data-theme');
      try { localStorage.setItem('tml2-theme', dark ? 'dark' : 'light'); } catch (e) { /* storage blocked: choice lasts for this page */ }
      paint();
    });
    paint();
    header.append(btn);
  }

  /* ---------- menu drawer ---------- */
  function buildDrawer() {
    const openBtn = document.getElementById('menu-open');
    if (!openBtn) return;
    const cur = on => on ? ' aria-current="page"' : '';
    const groups = PILLARS.map(p => `
      <details class="nav-group" data-accent="${p.key}"${p.lessons.some(([id]) => id === PAGE) ? ' open' : ''}>
        <summary><span class="dot"></span>${p.name}<i class="ti ti-chevron-right chev" aria-hidden="true"></i></summary>
        ${p.lessons.map(([id, t]) => `<a class="sub" href="${lessonHref(id)}" data-lesson-id="${id}"${cur(id === PAGE)}>${amp(t)}</a>`).join('')}
      </details>`).join('');
    const extras = EXTRA.map(([pg, ic, t]) =>
      `<a class="nav-link" href="${href(pg)}"${cur(pg === PAGE)}><i class="ti ${ic}" aria-hidden="true"></i>${amp(t)}</a>`).join('');

    const dlg = document.createElement('dialog');
    dlg.className = 'drawer';
    dlg.id = 'drawer';
    dlg.setAttribute('aria-label', 'Site menu');
    dlg.innerHTML = `
      <div class="drawer-head">
        <a class="logo" href="${href('index')}"><span class="logo-mark"><i class="ti ti-coin" aria-hidden="true"></i></span>Teen Money <em>Lab</em></a>
        <button class="menu-btn" id="menu-close" aria-label="Close menu" autofocus><i class="ti ti-x" aria-hidden="true"></i></button>
      </div>
      ${progressBox('drawer-progress')}
      <nav class="drawer-body">
        <a class="nav-link" href="${href('index')}"${cur(PAGE === 'index')}><i class="ti ti-home" aria-hidden="true"></i>Home</a>
        <a class="nav-link" href="${href('lessons')}"${cur(PAGE === 'lessons')}><i class="ti ti-book-2" aria-hidden="true"></i>All lessons</a>
        ${groups}
        <div class="nav-divider" role="separator"></div>
        ${extras}
      </nav>`;
    document.body.appendChild(dlg);

    const setOpen = open => {
      document.body.classList.toggle('drawer-open', open);
      openBtn.setAttribute('aria-expanded', String(open));
    };
    openBtn.addEventListener('click', () => { dlg.showModal(); setOpen(true); });
    dlg.querySelector('#menu-close').addEventListener('click', () => dlg.close());
    dlg.addEventListener('close', () => { setOpen(false); openBtn.focus(); });
    // backdrop clicks are reported on the dialog itself; detect them by position outside the panel
    dlg.addEventListener('click', e => { if (e.clientX > dlg.getBoundingClientRect().right) dlg.close(); });
  }

  /* ---------- lesson: next / previous + reading progress ---------- */
  function buildLessonNav() {
    const box = document.getElementById('lesson-nav');
    const i = LESSONS.findIndex(l => l.id === PAGE);
    if (!box || i < 0) return;
    const next = LESSONS[i + 1];
    const prev = LESSONS[i - 1];
    const nextHtml = next
      ? `<a class="next-link" href="${lessonHref(next.id)}" data-accent="${next.p}"><span><small>Next lesson</small><span class="t">${amp(next.t)}</span></span><i class="ti ti-arrow-right" aria-hidden="true"></i></a>`
      : `<a class="next-link" href="${href('quiz')}"><span><small>That was the last lesson</small><span class="t">Take the Money Quiz</span></span><i class="ti ti-arrow-right" aria-hidden="true"></i></a>`;
    const prevHtml = prev
      ? `<a class="prev-link" href="${lessonHref(prev.id)}"><i class="ti ti-arrow-left" aria-hidden="true"></i>${amp(prev.t)}</a>`
      : `<a class="prev-link" href="${href('lessons')}"><i class="ti ti-arrow-left" aria-hidden="true"></i>All lessons</a>`;
    box.innerHTML = nextHtml + prevHtml;

    const bar = document.createElement('nav');
    bar.className = 'lesson-bar';
    bar.setAttribute('aria-label', 'Lesson steps');
    bar.innerHTML = `<div class="lesson-bar-in">
        <a class="lb-prev" href="${prev ? lessonHref(prev.id) : href('lessons')}" aria-label="Previous: ${prev ? amp(prev.t) : 'All lessons'}"><i class="ti ti-arrow-left" aria-hidden="true"></i></a>
        <span class="lb-pos">${i + 1} of ${LESSONS.length}</span>
        <a class="lb-next" href="${next ? lessonHref(next.id) : href('quiz')}"${next ? ` data-accent="${next.p}"` : ''}><span><small>Next</small><span class="t">${next ? amp(next.t) : 'Money Quiz'}</span></span><i class="ti ti-arrow-right" aria-hidden="true"></i></a>
      </div>`;
    document.body.appendChild(bar);
    document.body.classList.add('has-lesson-bar');
    [box.querySelector('.next-link'), bar.querySelector('.lb-next')].forEach(a => a.addEventListener('click', () => markDone(PAGE)));
    // the full-size next link at the end of the lesson takes over once it is on screen
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(([e]) => bar.classList.toggle('away', e.isIntersecting)).observe(box);
    }
  }

  /* ---------- lesson sections: highlight the one being read ---------- */
  function bindParts() {
    const nav = document.querySelector('.part-nav');
    if (!nav) return;
    const links = [...nav.querySelectorAll('a')];
    const parts = links.map(a => document.getElementById(a.hash.slice(1)));
    let ticking = false;
    const update = () => {
      ticking = false;
      const line = nav.getBoundingClientRect().bottom + 24;
      let cur = 0;
      parts.forEach((p, i) => { if (p.getBoundingClientRect().top <= line) cur = i; });
      if (innerHeight + scrollY >= document.documentElement.scrollHeight - 4) cur = parts.length - 1;
      links.forEach((a, i) => {
        a.classList.toggle('done', i < cur);
        if (i === cur) a.setAttribute('aria-current', 'location'); else a.removeAttribute('aria-current');
      });
    };
    addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive:true });
    update();
  }

  function readProgress() {
    if (!LESSONS.some(l => l.id === PAGE)) return;
    const bar = document.createElement('div');
    bar.className = 'read-progress';
    document.body.appendChild(bar);
    const update = () => {
      const h = document.documentElement.scrollHeight - innerHeight;
      bar.style.width = (h > 0 ? Math.min(1, scrollY / h) * 100 : 0) + '%';
    };
    addEventListener('scroll', update, { passive:true });
    addEventListener('resize', update);
    update();
  }

  /* ---------- quick check (one question per lesson) ---------- */
  function bindChecks() {
    document.querySelectorAll('.check').forEach(card => {
      const opts = card.querySelectorAll('.opt');
      const fb = card.querySelector('.feedback');
      const verdict = fb.querySelector('[data-fb]');
      const why = fb.querySelector('[data-exp]');
      opts.forEach(o => o.addEventListener('click', () => {
        if ('correct' in o.dataset) {
          opts.forEach(x => { x.disabled = true; if (x !== o && !x.classList.contains('wrong')) x.classList.add('faded'); });
          o.classList.add('right');
          o.insertAdjacentText('afterbegin', '✓ ');
          verdict.textContent = 'That’s it. ';
          why.hidden = false;
          if (typeof gtag === 'function') gtag('event', 'lesson_check', { lesson_id:PAGE, correct:true });
          markDone(PAGE);
          card.insertAdjacentHTML('beforeend', `<p class="lesson-done"><i class="ti ti-circle-check" aria-hidden="true"></i>Lesson complete · <span data-progress-count></span> lessons done</p>`);
          paintProgress();
        } else {
          o.classList.add('wrong');
          o.disabled = true;
          o.insertAdjacentText('afterbegin', '✕ ');
          verdict.textContent = 'Not quite — give another one a try.';
        }
        fb.classList.add('show');
      }));
    });
  }

  /* ---------- calculators ---------- */
  function tool(el, update) {
    const val = name => +el.querySelector(`[name="${name}"]`).value;
    // values passed with html=true are built only from numbers computed here, never user text
    const out = (key, value, html) => el.querySelectorAll(`[data-out="${key}"]`).forEach(o => {
      if (html) o.innerHTML = value; else o.textContent = value;
    });
    const run = () => update(val, out);
    el.addEventListener('input', run);
    el.addEventListener('change', run);
    run();
  }

  const TOOLS = {
    skill(el) {
      tool(el, (v, out) => {
        const custom = v('skill') === 0;
        el.querySelector('[data-custom]').hidden = !custom;
        const rate = custom ? v('rate') : v('skill');
        const hrs = v('hrs');
        const monthly = Math.round(rate * hrs * 4.33);
        const yearly = Math.round(rate * hrs * 52);
        out('rate', '$' + rate + '/hr');
        out('hrs', plural(hrs, 'hr', 'hrs'));
        out('yearly', fmt(yearly));
        out('says', `About <strong>${fmt(monthly)} a month</strong> at $${rate}/hr — and <strong>${fmt(yearly * 4)}</strong> if you keep it up for 4 years.`, true);
      });
    },

    paycheck(el) {
      tool(el, (v, out) => {
        const gross = v('gross');
        const tax = Math.round(gross * 0.15);
        out('gross', fmt(gross));
        out('net', fmt(gross - tax));
        out('says', `Out of <strong>${fmt(gross)}</strong> earned, about <strong>${fmt(tax)}</strong> (~15%) is withheld for taxes. Budget with the take-home number.`, true);
      });
    },

    budget(el) {
      tool(el, (v, out) => {
        const inc = v('income');
        const pct = v('pct');
        const goal = v('goal');
        const save = Math.round(inc * pct / 100);
        const rem = inc - save;
        const needs = Math.round(rem * 0.625);
        const wants = Math.round(rem * 0.375);
        out('income', fmt(inc));
        out('pct', pct + '%');
        out('save', fmt(save));
        out('says', `That’s <strong>${fmt(save * 12)} a year</strong> — moved to savings before you spend anything else.`, true);
        out('k-save', fmt(save));
        out('k-needs', fmt(needs));
        out('k-wants', fmt(wants));
        el.querySelector('[data-seg="save"]').style.flexGrow = save;
        el.querySelector('[data-seg="needs"]').style.flexGrow = needs;
        el.querySelector('[data-seg="wants"]').style.flexGrow = wants;
        out('goal', fmt(goal));
        const months = Math.ceil(goal / save);
        const d = new Date();
        d.setMonth(d.getMonth() + months);
        out('goal-time', plural(months, 'month', 'months'));
        out('goal-says', `Saving ${fmt(save)} a month gets you to ${fmt(goal)} around <strong>${d.toLocaleDateString('en-US', { month:'long', year:'numeric' })}</strong>.`, true);
      });
    },

    emergency(el) {
      tool(el, (v, out) => {
        const exp = v('expenses');
        const sv = v('save');
        out('expenses', fmt(exp));
        out('save', fmt(sv));
        out('time', plural(Math.ceil(exp * 3 / sv), 'month', 'months'));
        out('says', `Your 3-month cushion is <strong>${fmt(exp * 3)}</strong>. Keep going to <strong>${fmt(exp * 6)}</strong> for a full 6 months.`, true);
      });
    },

    cashback(el) {
      tool(el, (v, out) => {
        const spend = v('spend');
        out('spend', fmt(spend));
        out('diff', '+' + fmt(spend * 0.02));
        out('says', `${fmt(spend * 0.01)} back with a 1% card vs <strong>${fmt(spend * 0.03)}</strong> with a 3% card — on exactly the same spending.`, true);
      });
    },

    compound(el) {
      tool(el, (v, out) => {
        const start = v('start');
        const mo = v('monthly');
        const yrs = v('years');
        const rate = v('rate');
        const mr = rate / 100 / 12;
        let bal = start;
        let put = start;
        for (let m = 0; m < yrs * 12; m++) { bal = bal * (1 + mr) + mo; put += mo; }
        const total = Math.round(bal);
        const growth = total - Math.round(put);
        out('start', fmt(start));
        out('monthly', fmt(mo));
        out('years', plural(yrs, 'year', 'years'));
        out('rate', rate + '%');
        out('after', `After ${plural(yrs, 'year', 'years')} you’d have`);
        out('total', fmt(total));
        out('put', fmt(put));
        out('growth', fmt(growth));
        const top = Math.max(put, growth, 1);
        el.querySelector('[data-bar="put"]').style.width = (put / top * 100) + '%';
        el.querySelector('[data-bar="growth"]').style.width = (growth / top * 100) + '%';
        out('says', growth > put
          ? 'Growth is now bigger than everything you put in. <strong>Your money is working harder than you are.</strong>'
          : 'Growth hasn’t passed what you put in yet. <strong>Try adding more years</strong> — time does the heavy lifting.', true);
      });
    },

    r72(el) {
      tool(el, (v, out) => {
        const r = v('rate');
        const yrs = (72 / r).toFixed(1);
        out('rate', r + '%');
        out('years', '~' + yrs + ' years');
        out('says', `72 ÷ ${r} = ${yrs}. At ${r}% a year, $1,000 becomes about $2,000 in that time.`);
      });
    },

    credit(el) {
      tool(el, (v, out) => {
        const s = v('score');
        let r;
        if (s >= 800) r = ['Excellent', 'var(--green-600)', '4.5%', null];
        else if (s >= 740) r = ['Very good', 'var(--green-600)', '5.5%', '~$400'];
        else if (s >= 670) r = ['Good', 'var(--blue-600)', '7.2%', '~$900'];
        else if (s >= 580) r = ['Fair', 'var(--amber-600)', '11.5%', '~$2,400'];
        else r = ['Poor', 'var(--red-600)', '16%+', '~$4,000+'];
        out('score', String(s));
        out('rating', r[0]);
        el.querySelector('[data-out="rating"]').style.setProperty('--c', r[1]);
        el.querySelector('.meter-dot').style.left = ((s - 300) / 550 * 100) + '%';
        out('says', r[3]
          ? `On a $15,000, 4-year car loan that’s about <strong>${r[2]}</strong> — roughly <strong>${r[3]} more</strong> in interest than someone with excellent credit.`
          : `On a $15,000, 4-year car loan that’s about <strong>${r[2]}</strong> — the best rates available.`, true);
      });
    },

    debt(el) {
      tool(el, (v, out) => {
        const bal = v('balance');
        const pay = v('min');
        const mr = 0.21 / 12;
        let b = bal, paid = 0, months = 0, never = false;
        while (b > 0) {
          const interest = b * mr;
          if (pay <= interest || months >= 600) { never = true; break; }
          b = b + interest - pay;
          paid += pay;
          months++;
        }
        out('balance', fmt(bal));
        out('min', fmt(pay));
        if (never) {
          out('time', 'Never');
          out('says', 'This payment doesn’t even cover the monthly interest, so <strong>the balance never shrinks</strong>.', true);
          return;
        }
        const y = Math.floor(months / 12);
        const m = months % 12;
        out('time', y ? `${y} ${y === 1 ? 'yr' : 'yrs'}${m ? ` ${m} mo` : ''}` : plural(months, 'month', 'months'));
        out('says', `You’d pay <strong>${fmt(paid - bal)} in interest</strong> — ${fmt(paid)} in total to clear a ${fmt(bal)} balance.`, true);
      });
    },

    choices(el) {
      const btns = el.querySelectorAll('[data-choice]');
      btns.forEach(b => b.addEventListener('click', () => {
        btns.forEach(x => x.setAttribute('aria-pressed', String(x === b)));
        el.querySelectorAll('[data-panel]').forEach(p => { p.hidden = p.dataset.panel !== b.dataset.choice; });
      }));
    },

    // fixed-rate loan (car or home): M = P·r(1+r)^n / ((1+r)^n − 1), r = APR/12, n = months
    loan(el) {
      const home = el.dataset.kind === 'home';
      const payment = (loan, apr, n) => {
        const r = apr / 100 / 12;
        if (loan <= 0) return 0;
        if (r === 0) return loan / n;
        const f = Math.pow(1 + r, n);
        return loan * r * f / (f - 1);
      };
      const termName = n => home ? (n / 12) + '-year' : n + '-month';
      const term = el.querySelector('[name="term"]');
      const btns = el.querySelectorAll('[data-term]');
      btns.forEach(b => b.addEventListener('click', () => {
        btns.forEach(x => x.setAttribute('aria-pressed', String(x === b)));
        term.value = b.dataset.term;
        term.dispatchEvent(new Event('input', { bubbles:true }));
      }));
      let tracked = false;
      el.addEventListener('input', () => {
        if (tracked) return;
        tracked = true;
        if (typeof gtag === 'function') gtag('event', 'calculator_use', { calculator: home ? 'mortgage' : 'car_loan' });
      });
      tool(el, (v, out) => {
        const price = v('price');
        const pct = v('down');
        const apr = v('rate');
        const extra = v('extra');
        const n = v('term');
        const down = price * pct / 100;
        const loan = price - down;
        const pi = payment(loan, apr, n);
        const interest = pi * n - loan;
        out('price', fmt(price));
        out('down', pct + '% · ' + fmt(down));
        out('rate', apr + '%');
        out('extra', fmt(extra) + '/mo');
        out('pi', fmt(pi));
        out('loan', fmt(loan));
        out('interest', fmt(interest));
        el.querySelector('[data-seg="loan"]').style.flexGrow = loan;
        el.querySelector('[data-seg="interest"]').style.flexGrow = interest;
        out('says', `About <strong>${fmt(pi + extra)} a month</strong> with ${home ? 'tax and insurance' : 'insurance'}. In total you’d pay <strong>${fmt(down + loan + interest)}</strong> for a ${fmt(price)} ${home ? 'home' : 'car'}.`, true);
        // compare with the shortest term, or with the usual term when the shortest is picked
        const other = home ? (n === 360 ? 180 : 360) : (n === 36 ? 60 : 36);
        const otherPi = payment(loan, apr, other);
        const otherInterest = otherPi * other - loan;
        out('compare', loan <= 0 ? 'Paying the full price up front means no loan and no interest.'
          : other < n
            ? `A ${termName(other)} loan would cost <strong>${fmt(otherPi - pi)} more a month</strong> but save <strong>${fmt(interest - otherInterest)}</strong> in interest.`
            : `A ${termName(other)} loan would cost <strong>${fmt(pi - otherPi)} less a month</strong> but add <strong>${fmt(otherInterest - interest)}</strong> in interest.`, true);
        el.querySelector('[data-warn]').hidden = home ? pct >= 20 : n < 60;
      });
    },

    sorter(el) {
      const rows = el.querySelectorAll('.sort-row');
      rows.forEach(row => {
        const btns = row.querySelectorAll('.seg button');
        btns.forEach(b => b.addEventListener('click', () => {
          btns.forEach(x => x.setAttribute('aria-pressed', String(x === b)));
          row.dataset.pick = b.dataset.val;
          row.classList.remove('is-right', 'is-wrong');
          row.querySelector('.mark').textContent = '';
        }));
      });
      el.querySelector('[data-check-sort]').addEventListener('click', () => {
        let done = 0, right = 0;
        rows.forEach(row => {
          if (!row.dataset.pick) return;
          done++;
          const ok = row.dataset.pick === row.dataset.ans;
          if (ok) right++;
          row.classList.toggle('is-right', ok);
          row.classList.toggle('is-wrong', !ok);
          row.querySelector('.mark').textContent = ok ? '✓' : '✕';
        });
        el.querySelector('[data-sort-result]').textContent = done < rows.length
          ? `Sort all ${rows.length} first — ${right} right so far.`
          : `${right} of ${rows.length} right.` + (right < rows.length ? ' The ✕ ones are worth a second look.' : ' Nicely sorted.');
      });
    },

    scams(el) {
      el.querySelectorAll('.msg').forEach(msg => {
        const btns = msg.querySelectorAll('[data-guess]');
        btns.forEach(b => b.addEventListener('click', () => {
          const ok = b.dataset.guess === msg.dataset.ans;
          btns.forEach(x => { x.disabled = true; });
          b.classList.add(ok ? 'right' : 'wrong');
          b.insertAdjacentText('afterbegin', ok ? '✓ ' : '✕ ');
          msg.querySelector('[data-verdict]').textContent = ok ? 'Right. '
            : msg.dataset.ans === 'scam' ? 'It’s a scam. ' : 'This one’s legit. ';
          msg.querySelector('.msg-exp').classList.add('show');
        }));
      });
    }
  };

  /* ---------- range sliders: filled track ---------- */
  function paintRange(r) {
    r.style.setProperty('--p', ((r.value - r.min) / (r.max - r.min) * 100) + '%');
  }

  /* ---------- ask-ai: copy prompt ---------- */
  function bindCopy() {
    document.querySelectorAll('[data-copy]').forEach(btn => btn.addEventListener('click', () => {
      const text = document.getElementById(btn.dataset.copy).textContent.trim();
      const original = btn.innerHTML;
      const done = () => {
        btn.innerHTML = '<i class="ti ti-check" aria-hidden="true"></i> Copied';
        btn.classList.add('copied');
        setTimeout(() => { btn.innerHTML = original; btn.classList.remove('copied'); }, 1600);
      };
      const fallback = () => {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand('copy'); done(); } catch (e) { /* copy unsupported; text stays visible to select by hand */ }
        ta.remove();
      };
      if (typeof gtag === 'function') gtag('event', 'ai_prompt_copy', { prompt_id:btn.dataset.copy });
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, fallback);
      else fallback();
    }));
  }

  /* ---------- glossary search ---------- */
  function bindGlossary() {
    const input = document.getElementById('glossary-search');
    if (!input) return;
    input.addEventListener('input', () => {
      const q = input.value.trim().toLowerCase();
      let any = false;
      document.querySelectorAll('.term').forEach(t => {
        const hit = !q || t.textContent.toLowerCase().includes(q);
        t.hidden = !hit;
        if (hit) any = true;
      });
      document.querySelectorAll('[data-term-group]').forEach(g => { g.hidden = !g.querySelector('.term:not([hidden])'); });
      document.querySelector('.no-results').style.display = any ? 'none' : 'block';
    });
  }

  /* ---------- loan calculator: Car | Home switch ---------- */
  function bindLoanSwitch() {
    const box = document.querySelector('.loan-calc');
    if (!box) return;
    const btns = box.querySelectorAll('[data-loan-kind]');
    btns.forEach(b => b.addEventListener('click', () => {
      btns.forEach(x => x.setAttribute('aria-pressed', String(x === b)));
      box.querySelectorAll('[data-tool="loan"]').forEach(t => { t.hidden = t.dataset.kind !== b.dataset.loanKind; });
    }));
  }

  /* ---------- tools page: Calculators | Tools switch (phones only; both columns show on wide screens) ---------- */
  function bindToolsSwitch() {
    const split = document.querySelector('.tools-split');
    const tabs = [...document.querySelectorAll('[data-tools-tab]')];
    if (!split || !tabs.length) return;
    const show = (key, focus) => {
      split.dataset.show = key;
      tabs.forEach(t => {
        const on = t.dataset.toolsTab === key;
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
        if (on && focus) t.focus();
      });
      try { sessionStorage.setItem('toolsTab', key); } catch (e) { /* storage blocked; the default tab still works */ }
    };
    tabs.forEach((t, i) => {
      t.addEventListener('click', () => show(t.dataset.toolsTab));
      t.addEventListener('keydown', e => {
        if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
        e.preventDefault();
        show(tabs[(i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length].dataset.toolsTab, true);
      });
    });
    let saved = null;
    try { saved = sessionStorage.getItem('toolsTab'); } catch (e) { /* storage blocked */ }
    show(saved === 'tools' ? 'tools' : 'calc');
  }

  document.querySelectorAll('.top-links a').forEach(a => { if (a.dataset.page === PAGE) a.setAttribute('aria-current', 'page'); });
  buildProgressViews();
  buildThemeToggle();
  buildDrawer();
  buildLessonNav();
  bindParts();
  readProgress();
  bindChecks();
  document.querySelectorAll('[data-tool]').forEach(el => { const init = TOOLS[el.dataset.tool]; if (init) init(el); });
  document.querySelectorAll('input[type=range]').forEach(r => { r.addEventListener('input', () => paintRange(r)); paintRange(r); });
  bindCopy();
  bindGlossary();
  bindToolsSwitch();
  bindLoanSwitch();
  paintProgress();
})();
