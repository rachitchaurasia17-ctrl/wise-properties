(function () {
  'use strict';

  var CHAT_URL = '/api/chat';
  var GROQ_MODEL = 'llama-3.1-8b-instant';
  var SYSTEM_PROMPT = [
    'You are a helpful assistant for J.P. Singh & Co, a trusted property consultancy firm.',
    'You help website visitors with:',
    '- Company history, founders, and values',
    '- Available properties for sale or rent',
    '- Property investment advice and market insights',
    '- Booking site visits (collect visitor name, phone, preferred date)',
    '- Property taxes, stamp duty, registration charges in India',
    '- General real estate queries',
    '',
    'Always be polite, professional, and concise. If unsure about something specific,',
    'say the team will follow up. Encourage visitors to call or WhatsApp for urgent queries.',
    'Never make up property listings — only refer to what exists on the website.',
  ].join('\n');

  var isOpen = false;
  var isBusy = false;
  var history = [];

  /* ── Inject CSS ─────────────────────────────────────────── */
  var styleEl = document.createElement('style');
  styleEl.textContent = [
    '#jpc-root{font-family:"Satoshi",ui-sans-serif,system-ui,sans-serif}',
    '#jpc-root *{box-sizing:border-box;margin:0;padding:0}',

    /* Toggle button */
    '#jpc-btn{',
      'position:fixed;right:24px;bottom:96px;z-index:200;',
      'width:56px;height:56px;border-radius:50%;',
      'background:#1e1e1e;border:none;cursor:pointer;',
      'display:flex;align-items:center;justify-content:center;',
      'box-shadow:0 8px 28px rgba(17,17,17,.25),0 2px 8px rgba(17,17,17,.12);',
      'transition:transform 250ms cubic-bezier(.77,0,.175,1),background 180ms;',
    '}',
    '#jpc-btn:hover{background:#111;transform:scale(1.07)}',
    '#jpc-icon-chat{transition:opacity 200ms,transform 200ms}',
    '#jpc-icon-x{position:absolute;opacity:0;transform:rotate(-90deg);transition:opacity 200ms,transform 200ms}',
    '#jpc-btn.open #jpc-icon-chat{opacity:0;transform:rotate(90deg)}',
    '#jpc-btn.open #jpc-icon-x{opacity:1;transform:rotate(0)}',
    '#jpc-notif{',
      'position:absolute;top:-1px;right:-1px;',
      'width:13px;height:13px;border-radius:50%;',
      'background:#c89a3c;border:2px solid #f2f2f2;',
      'opacity:0;transition:opacity 300ms;',
    '}',

    /* Chat window */
    '#jpc-win{',
      'position:fixed;right:24px;bottom:164px;z-index:200;',
      'width:370px;max-width:calc(100vw - 32px);',
      'height:500px;max-height:calc(100vh - 200px);',
      'background:#f2f2f2;border-radius:12px;',
      'box-shadow:0 20px 60px rgba(17,17,17,.18),0 4px 16px rgba(17,17,17,.10);',
      'display:flex;flex-direction:column;overflow:hidden;',
      'opacity:0;pointer-events:none;',
      'transform:translateY(16px) scale(.97);',
      'transition:opacity 280ms ease,transform 300ms cubic-bezier(.77,0,.175,1);',
    '}',
    '#jpc-win.open{opacity:1;pointer-events:auto;transform:translateY(0) scale(1)}',

    /* Header */
    '#jpc-head{',
      'background:#1e1e1e;color:#f6f6f6;',
      'padding:14px 16px;display:flex;align-items:center;gap:10px;flex-shrink:0;',
    '}',
    '.jpc-av{',
      'width:34px;height:34px;border-radius:50%;',
      'background:#c89a3c;color:#1e1e1e;',
      'display:flex;align-items:center;justify-content:center;',
      'font-size:13px;font-weight:700;flex-shrink:0;',
      'font-family:"Clash Display","Satoshi",sans-serif;letter-spacing:-.02em;',
    '}',
    '.jpc-head-info{flex:1;min-width:0}',
    '.jpc-head-name{',
      'font-size:14px;font-weight:700;',
      'font-family:"Clash Display","Satoshi",sans-serif;letter-spacing:-.02em;',
      'white-space:nowrap;overflow:hidden;text-overflow:ellipsis;',
    '}',
    '.jpc-head-sub{font-size:10px;color:rgba(246,246,246,.5);text-transform:uppercase;letter-spacing:.12em;margin-top:2px}',
    '.jpc-head-dot{width:7px;height:7px;border-radius:50%;background:#4ade80;flex-shrink:0}',
    '#jpc-close-btn{',
      'background:transparent;border:none;cursor:pointer;',
      'color:rgba(246,246,246,.55);padding:4px;display:none;',
      'transition:color 150ms;',
    '}',
    '#jpc-close-btn:hover{color:#f6f6f6}',

    /* Messages */
    '#jpc-msgs{',
      'flex:1;overflow-y:auto;padding:16px 14px;',
      'display:flex;flex-direction:column;gap:10px;scroll-behavior:smooth;',
    '}',
    '#jpc-msgs::-webkit-scrollbar{width:4px}',
    '#jpc-msgs::-webkit-scrollbar-thumb{background:#ccc;border-radius:4px}',

    /* Welcome card */
    '.jpc-welcome{text-align:center;padding:14px 0 8px}',
    '.jpc-welcome-ico{font-size:28px;margin-bottom:10px}',
    '.jpc-welcome-title{',
      'font-size:15px;font-weight:700;color:#111;',
      'font-family:"Clash Display","Satoshi",sans-serif;letter-spacing:-.02em;margin-bottom:5px;',
    '}',
    '.jpc-welcome-sub{font-size:13px;color:#838282;line-height:1.5;max-width:248px;margin:0 auto}',

    /* Bubbles */
    '.jpc-msg{display:flex;flex-direction:column;max-width:84%}',
    '.jpc-msg.user{align-self:flex-end;align-items:flex-end}',
    '.jpc-msg.bot{align-self:flex-start;align-items:flex-start}',
    '.jpc-bubble{padding:10px 13px;font-size:14px;line-height:1.55;word-break:break-word;border-radius:14px}',
    '.jpc-msg.user .jpc-bubble{background:#1e1e1e;color:#f6f6f6;border-bottom-right-radius:4px}',
    '.jpc-msg.bot .jpc-bubble{background:#fff;color:#1e1e1e;border:1px solid rgba(30,30,30,.09);border-bottom-left-radius:4px}',
    '.jpc-time{font-size:10px;color:#aaa;margin-top:4px}',

    /* Typing indicator */
    '#jpc-typing{align-self:flex-start;display:none}',
    '#jpc-typing.show{display:flex}',
    '.jpc-typing-bub{',
      'background:#fff;border:1px solid rgba(30,30,30,.09);',
      'border-radius:14px;border-bottom-left-radius:4px;',
      'padding:11px 14px;display:flex;gap:5px;align-items:center;',
    '}',
    '.jpc-dot{width:7px;height:7px;border-radius:50%;background:#c0c0c0;animation:jpc-bop 1.1s infinite ease-in-out}',
    '.jpc-dot:nth-child(2){animation-delay:.18s}',
    '.jpc-dot:nth-child(3){animation-delay:.36s}',
    '@keyframes jpc-bop{0%,80%,100%{transform:translateY(0);opacity:.5}40%{transform:translateY(-5px);opacity:1}}',

    /* Input area */
    '#jpc-foot{',
      'padding:10px 12px;border-top:1px solid rgba(30,30,30,.09);',
      'background:#fff;display:flex;gap:8px;align-items:flex-end;flex-shrink:0;',
    '}',
    '#jpc-inp{',
      'flex:1;border:1px solid rgba(30,30,30,.15);border-radius:20px;',
      'padding:9px 14px;font-family:inherit;font-size:14px;color:#111;',
      'background:#f6f6f6;outline:none;resize:none;max-height:90px;',
      'line-height:1.4;transition:border-color 180ms;',
    '}',
    '#jpc-inp:focus{border-color:#1e1e1e}',
    '#jpc-inp::placeholder{color:#bbb}',
    '#jpc-send{',
      'width:38px;height:38px;border-radius:50%;',
      'background:#1e1e1e;border:none;cursor:pointer;flex-shrink:0;',
      'display:flex;align-items:center;justify-content:center;',
      'transition:background 180ms,transform 180ms;',
    '}',
    '#jpc-send:hover{background:#111;transform:scale(1.06)}',
    '#jpc-send:disabled{background:#ccc;cursor:default;transform:none}',

    /* Mobile overrides */
    '@media(max-width:480px){',
      '#jpc-btn{right:16px;bottom:88px}',
      '#jpc-win{right:0;left:0;bottom:0;width:100%;max-width:100%;height:72vh;max-height:72vh;border-radius:16px 16px 0 0}',
      '#jpc-close-btn{display:flex;align-items:center;justify-content:center}',
    '}',
  ].join('');
  document.head.appendChild(styleEl);

  /* ── DOM ────────────────────────────────────────────────── */
  var root = document.createElement('div');
  root.id = 'jpc-root';
  document.body.appendChild(root);

  /* Toggle bubble */
  var btn = document.createElement('button');
  btn.id = 'jpc-btn';
  btn.setAttribute('aria-label', 'Chat with our property assistant');
  btn.innerHTML =
    '<svg id="jpc-icon-chat" width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="#f6f6f6" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>' +
    '<svg id="jpc-icon-x" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#f6f6f6" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M18 6L6 18M6 6l12 12"/></svg>' +
    '<div id="jpc-notif"></div>';
  root.appendChild(btn);

  /* Chat window */
  var win = document.createElement('div');
  win.id = 'jpc-win';
  win.setAttribute('role', 'dialog');
  win.setAttribute('aria-label', 'Property assistant chat');
  win.innerHTML =
    '<div id="jpc-head">' +
      '<div class="jpc-av">JP</div>' +
      '<div class="jpc-head-info">' +
        '<div class="jpc-head-name">J.P. Singh &amp; Co</div>' +
        '<div class="jpc-head-sub">Property Assistant</div>' +
      '</div>' +
      '<div class="jpc-head-dot"></div>' +
      '<button id="jpc-close-btn" aria-label="Close chat">' +
        '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>' +
      '</button>' +
    '</div>' +
    '<div id="jpc-msgs">' +
      '<div class="jpc-welcome">' +
        '<div class="jpc-welcome-ico">🏠</div>' +
        '<div class="jpc-welcome-title">How can I help you?</div>' +
        '<div class="jpc-welcome-sub">Ask about properties, pricing, or book a site visit.</div>' +
      '</div>' +
      '<div id="jpc-typing">' +
        '<div class="jpc-typing-bub">' +
          '<div class="jpc-dot"></div>' +
          '<div class="jpc-dot"></div>' +
          '<div class="jpc-dot"></div>' +
        '</div>' +
      '</div>' +
    '</div>' +
    '<div id="jpc-foot">' +
      '<textarea id="jpc-inp" rows="1" placeholder="Ask about properties…" maxlength="500" aria-label="Message"></textarea>' +
      '<button id="jpc-send" aria-label="Send">' +
        '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#f6f6f6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 2L11 13M22 2L15 22 11 13 2 9l20-7z"/></svg>' +
      '</button>' +
    '</div>';
  root.appendChild(win);

  var msgsEl   = win.querySelector('#jpc-msgs');
  var typingEl = win.querySelector('#jpc-typing');
  var inpEl    = win.querySelector('#jpc-inp');
  var sendEl   = win.querySelector('#jpc-send');
  var notifEl  = btn.querySelector('#jpc-notif');
  var closeEl  = win.querySelector('#jpc-close-btn');

  /* ── Helpers ─────────────────────────────────────────────── */
  function hhMM() {
    var d = new Date();
    return (d.getHours() < 10 ? '0' : '') + d.getHours() + ':' + (d.getMinutes() < 10 ? '0' : '') + d.getMinutes();
  }

  function pushMsg(role, text) {
    var wrap = document.createElement('div');
    wrap.className = 'jpc-msg ' + role;
    var bub = document.createElement('div');
    bub.className = 'jpc-bubble';
    bub.textContent = text;
    var ts = document.createElement('div');
    ts.className = 'jpc-time';
    ts.textContent = hhMM();
    wrap.appendChild(bub);
    wrap.appendChild(ts);
    msgsEl.insertBefore(wrap, typingEl);
    msgsEl.scrollTop = msgsEl.scrollHeight;
  }

  function setTyping(on) {
    typingEl.className = 'jpc-typing' + (on ? ' show' : '');
    if (on) msgsEl.scrollTop = msgsEl.scrollHeight;
  }

  function autoHeight() {
    inpEl.style.height = 'auto';
    inpEl.style.height = Math.min(inpEl.scrollHeight, 90) + 'px';
  }

  function toggle() {
    isOpen = !isOpen;
    btn.className = isOpen ? 'open' : '';
    win.className = isOpen ? 'open' : '';
    notifEl.style.opacity = '0';
    if (isOpen) setTimeout(function () { inpEl.focus(); }, 320);
  }

  /* ── Send ────────────────────────────────────────────────── */
  function send() {
    var text = inpEl.value.trim();
    if (!text || isBusy) return;

    inpEl.value = '';
    inpEl.style.height = 'auto';
    sendEl.disabled = true;
    isBusy = true;

    pushMsg('user', text);
    history.push({ role: 'user', content: text });
    setTyping(true);

    var messages = [{ role: 'system', content: SYSTEM_PROMPT }].concat(history);

    fetch(CHAT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: messages,
        max_tokens: 512,
        temperature: 0.65,
      }),
    })
    .then(function (res) {
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return res.json();
    })
    .then(function (data) {
      var reply = data.choices[0].message.content.trim();
      history.push({ role: 'assistant', content: reply });
      setTyping(false);
      pushMsg('bot', reply);
    })
    .catch(function (err) {
      setTyping(false);
      pushMsg('bot', 'Sorry, there was a connection issue. Please try again, or call us directly for assistance.');
      console.warn('[JPC]', err);
    })
    .finally(function () {
      isBusy = false;
      sendEl.disabled = false;
      inpEl.focus();
    });
  }

  /* ── Events ─────────────────────────────────────────────── */
  btn.addEventListener('click', toggle);
  closeEl.addEventListener('click', toggle);

  inpEl.addEventListener('input', autoHeight);
  inpEl.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  });
  sendEl.addEventListener('click', send);

  /* Show notification dot after 3s if chat is still closed */
  setTimeout(function () {
    if (!isOpen) notifEl.style.opacity = '1';
  }, 3000);

})();
