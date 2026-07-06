(function () {
  var root = document.querySelector('[data-manifest-phone]');

  if (!root) {
    return;
  }

  var headings = [
    'The Universe Whispered',
    'A Message Arrived',
    'The Signs Speak Today',
    'The Cosmos Calls',
    'Today’s Omen',
    'A Sign For You',
    'The Message Found You',
    'Cosmic Signal',
    'The Stars Sent Guidance',
    'The Universe Has A Message',
    'The Signal Was Meant For You'
  ];

  var sentences = [
    { id: 'web-001', content: 'I am aligned with today.' },
    { id: 'web-002', content: 'I am calm and capable.' },
    { id: 'web-003', content: 'I choose progress over perfection.' },
    { id: 'web-004', content: 'I welcome growth and clarity.' },
    { id: 'web-005', content: 'I trust myself to take the next step.' },
    { id: 'web-006', content: 'I can move gently and still move forward.' },
    { id: 'web-007', content: 'I listen before I react, and my ambition stays human.' },
    { id: 'web-008', content: 'I let today be simple, honest, and enough.' },
    { id: 'web-009', content: 'I am allowed to begin again with softness.' },
    { id: 'web-010', content: 'I send my attention where my future can grow.' },
    { id: 'web-011', content: 'I choose the next kind action available to me.' },
    { id: 'web-012', content: 'I return to myself with patience and care.' },
    { id: 'web-013', content: 'I am building trust through small proof.' },
    { id: 'web-014', content: 'I can be ambitious without abandoning my peace.' },
    { id: 'web-015', content: 'I let one clear thought guide my next step.' },
    { id: 'web-016', content: 'I am safe to want more and move slowly.' },
    { id: 'web-017', content: 'I honor my energy and still welcome change.' },
    { id: 'web-018', content: 'I release pressure and keep the promise softly.' },
    { id: 'web-019', content: 'I am present enough to receive the sign.' },
    { id: 'web-020', content: 'I trust the quiet work I am doing.' }
  ];

  var state = {
    dateKey: '',
    sentence: sentences[0],
    displaySentence: formatSentenceForDisplay(sentences[0].content),
    toastTimer: null,
    sendTimer: null,
    dotsTimer: null,
    dotsIndex: 0,
    heartBlinkTimer: null,
    isCurrentCharBlinkVisible: true
  };

  var SEND_DURATION_MS = 5000;
  var DOT_SUFFIXES = ['.\u00A0\u00A0', '..\u00A0', '...', '\u00A0\u00A0\u00A0'];

  var headingEl = root.querySelector('[data-daily-heading]');
  var sentenceEl = root.querySelector('[data-daily-sentence]');
  var dateEl = root.querySelector('[data-daily-date]');
  var heartTargetEl = root.querySelector('[data-heart-target]');
  var heartSurface = root.querySelector('[data-heart-surface]');
  var heartInput = root.querySelector('[data-heart-input]');
  var heartSendButton = root.querySelector('[data-action="heart-send"]');
  var mindInput = root.querySelector('[data-mind-input]');
  var mindCount = root.querySelector('[data-mind-count]');
  var mindSendButton = root.querySelector('[data-action="mind-send"]');
  var sendMenu = root.querySelector('[data-send-menu]');
  var menuToggle = root.querySelector('[data-action="toggle-menu"]');
  var quickSendButton = root.querySelector('[data-action="quick-send"]');
  var toast = root.querySelector('[data-toast]');
  var successMessage = root.querySelector('[data-success-message]');
  var sendProgressGreeting = root.querySelector('[data-send-progress-greeting]');
  var sendProgressDots = root.querySelector('[data-send-progress-dots]');
  var profileGreeting = root.querySelector('[data-profile-greeting]');
  var panels = root.querySelectorAll('[data-panel]');
  var views = root.querySelectorAll('[data-view]');
  var tabs = root.querySelectorAll('[data-tab]');

  function toDateKey(date) {
    var year = date.getFullYear();
    var month = String(date.getMonth() + 1).padStart(2, '0');
    var day = String(date.getDate()).padStart(2, '0');

    return year + '-' + month + '-' + day;
  }

  function hashString(input) {
    var hash = 2166136261;
    var index;

    for (index = 0; index < input.length; index += 1) {
      hash ^= input.charCodeAt(index);
      hash = Math.imul(hash, 16777619);
    }

    return hash >>> 0;
  }

  function pickDailyItem(items, dateKey, salt) {
    return items[hashString(salt + ':' + dateKey) % items.length];
  }

  function formatSentenceForDisplay(sentence) {
    return sentence.trim().replace(/\.$/, '');
  }

  function setSendMenuOpen(isOpen) {
    sendMenu.hidden = !isOpen;
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Close send options' : 'Open send options');
  }

  function closePanels() {
    panels.forEach(function (panel) {
      panel.hidden = true;
    });
    clearHeartBlinkTimer();
  }

  function clearSendTimers() {
    if (state.sendTimer) {
      clearTimeout(state.sendTimer);
      state.sendTimer = null;
    }

    if (state.dotsTimer) {
      clearInterval(state.dotsTimer);
      state.dotsTimer = null;
    }
  }

  function clearHeartBlinkTimer() {
    if (state.heartBlinkTimer) {
      clearInterval(state.heartBlinkTimer);
      state.heartBlinkTimer = null;
    }
    state.isCurrentCharBlinkVisible = true;
  }

  function startHeartBlinkTimer() {
    clearHeartBlinkTimer();
    state.heartBlinkTimer = setInterval(function () {
      state.isCurrentCharBlinkVisible = !state.isCurrentCharBlinkVisible;
      updateHeartState();
    }, 500);
  }

  function openPanel(name) {
    var panel = root.querySelector('[data-panel="' + name + '"]');

    closePanels();
    setSendMenuOpen(false);

    if (!panel) {
      return;
    }

    panel.hidden = false;

    if (name === 'heart' && heartInput) {
      heartInput.value = '';
      heartInput.setAttribute('maxlength', String(state.displaySentence.length));
      updateHeartState();
      startHeartBlinkTimer();
      heartInput.focus();
    }

    if (name === 'mind' && mindInput) {
      mindInput.focus();
    }
  }

  function showToast(message) {
    if (!toast) {
      return;
    }

    if (state.toastTimer) {
      clearTimeout(state.toastTimer);
    }

    toast.textContent = message;
    toast.hidden = false;
    state.toastTimer = setTimeout(function () {
      toast.hidden = true;
      state.toastTimer = null;
    }, 2200);
  }

  function startSend(mode, message) {
    var successText = 'Message is sent to the Universe.';

    clearSendTimers();

    closePanels();
    setSendMenuOpen(false);

    if (mode === 'heart') {
      successText = 'Message is sent to the Universe with your heart in it.';
    }

    if (mode === 'mind') {
      successText = 'Your own message is sent to the Universe.';
    }

    if (mode === 'quick') {
      successText = 'Today’s message is sent to the Universe.';
    }

    if (sendProgressGreeting) {
      sendProgressGreeting.textContent = 'Hey there!';
    }

    state.dotsIndex = 0;

    if (sendProgressDots) {
      sendProgressDots.textContent = DOT_SUFFIXES[state.dotsIndex];
    }

    openPanel('sending');
    state.dotsTimer = setInterval(function () {
      state.dotsIndex = (state.dotsIndex + 1) % DOT_SUFFIXES.length;

      if (sendProgressDots) {
        sendProgressDots.textContent = DOT_SUFFIXES[state.dotsIndex];
      }
    }, 500);

    state.sendTimer = setTimeout(function () {
      clearSendTimers();

      if (successMessage) {
        successMessage.textContent = successText;
      }

      openPanel('success');
    }, SEND_DURATION_MS);
  }

  function updateHeartState() {
    var typed = heartInput ? heartInput.value.slice(0, state.displaySentence.length) : '';
    var isReady = typed === state.displaySentence;

    if (heartInput && heartInput.value !== typed) {
      heartInput.value = typed;
    }

    if (heartTargetEl) {
      renderHeartTemplate(heartTargetEl, state.displaySentence, typed);
    }

    if (heartSendButton) {
      heartSendButton.disabled = !isReady;
    }

  }

  function renderHeartTemplate(container, template, typed) {
    container.textContent = '';

    template.split('').forEach(function (templateChar, index) {
      var typedChar = typed[index];
      var isSpace = templateChar === ' ';
      var stateName = index === typed.length
        ? 'current'
        : index < typed.length
          ? typedChar === templateChar
            ? 'correct'
            : 'wrong'
          : 'pending';
      var span = document.createElement('span');

      span.className = 'app-heart-char ' + stateName;

      if (isSpace) {
        span.textContent = '\u00A0\u200B';
      } else {
        span.textContent = templateChar;
      }

      if (isSpace && stateName === 'wrong') {
        span.className += ' wrong-space';
      }

      if (stateName === 'current' && !state.isCurrentCharBlinkVisible) {
        span.className += ' current-hidden';
      }

      container.appendChild(span);
    });
  }

  function updateMindState() {
    var value = mindInput ? mindInput.value : '';

    if (mindCount) {
      mindCount.textContent = String(value.length);
    }

    if (mindSendButton) {
      mindSendButton.disabled = value.trim().length === 0;
    }
  }

  function updateProfileGreeting() {
    var hour = new Date().getHours();
    var greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

    if (profileGreeting) {
      profileGreeting.textContent = greeting + ', beautiful soul.';
    }
  }

  function switchView(viewName) {
    closePanels();
    setSendMenuOpen(false);

    views.forEach(function (view) {
      view.hidden = view.getAttribute('data-view') !== viewName;
    });

    tabs.forEach(function (tab) {
      var isActive = tab.getAttribute('data-tab') === viewName;

      tab.classList.toggle('active', isActive);
      tab.setAttribute('aria-pressed', String(isActive));
    });

    if (viewName === 'profile') {
      updateProfileGreeting();
    }
  }

  function syncDailyMessage() {
    var now = new Date();
    var dateKey = toDateKey(now);
    var heading = pickDailyItem(headings, dateKey, 'heading');
    var sentence = pickDailyItem(sentences, dateKey, 'sentence');

    if (dateKey === state.dateKey && sentence.id === state.sentence.id) {
      return;
    }

    state.dateKey = dateKey;
    state.sentence = sentence;
    state.displaySentence = formatSentenceForDisplay(sentence.content);

    if (headingEl) {
      headingEl.textContent = heading;
    }

    if (sentenceEl) {
      sentenceEl.textContent = '“' + state.displaySentence + '”';
    }

    if (dateEl) {
      dateEl.textContent = new Intl.DateTimeFormat(undefined, {
        month: 'short',
        day: 'numeric'
      }).format(now);
    }

    updateHeartState();
  }

  root.addEventListener('click', function (event) {
    var actionButton = event.target.closest('[data-action]');
    var tabButton = event.target.closest('[data-tab]');
    var action;

    if (tabButton && root.contains(tabButton)) {
      switchView(tabButton.getAttribute('data-tab'));
      return;
    }

    if (!actionButton || !root.contains(actionButton)) {
      return;
    }

    action = actionButton.getAttribute('data-action');

    if (action === 'toggle-menu') {
      setSendMenuOpen(sendMenu.hidden);
      return;
    }

    if (action === 'quick-send') {
      startSend('quick', state.displaySentence);
      return;
    }

    if (action === 'open-heart') {
      openPanel('heart');
      return;
    }

    if (action === 'open-mind') {
      openPanel('mind');
      return;
    }

    if (action === 'heart-send' && !actionButton.disabled) {
      startSend('heart', state.displaySentence);
      return;
    }

    if (action === 'mind-send' && !actionButton.disabled) {
      startSend('mind', mindInput ? mindInput.value.trim() : '');

      if (mindInput) {
        mindInput.value = '';
        updateMindState();
      }

      return;
    }

    if (action === 'close-modal') {
      clearSendTimers();
      closePanels();
    }

    if (action === 'cancel-send') {
      clearSendTimers();
      closePanels();
    }
  });

  if (heartInput) {
    heartInput.addEventListener('input', updateHeartState);
  }

  if (heartSurface && heartInput) {
    heartSurface.addEventListener('click', function () {
      heartInput.focus();
    });
  }

  if (mindInput) {
    mindInput.addEventListener('input', updateMindState);
  }

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
      clearSendTimers();
      closePanels();
      setSendMenuOpen(false);
    }
  });

  syncDailyMessage();
  updateMindState();
  updateProfileGreeting();
  setInterval(syncDailyMessage, 60000);
}());