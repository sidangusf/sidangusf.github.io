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
    { id: 'seed-v3-000001', content: 'Today the universe reminds me to trust the process while honoring my feelings and brighter opportunities will meet me there.' },
    { id: 'seed-v3-000002', content: 'Even now I choose to lead with integrity and follow through consistently because focused effort turns dreams into lived reality.' },
    { id: 'seed-v3-000003', content: 'My steady effort invites me to transform pressure into strength and wisdom because this season is preparing me for expansion.' },
    { id: 'seed-v3-000004', content: 'In this moment, I choose to forgive myself and restart with clearer intention and my courage will inspire people around me.' },
    { id: 'seed-v3-000005', content: 'When doubt gets loud, I choose to move forward gently and still stay determined and my clarity will guide my next decision.' },
    { id: 'seed-v3-000006', content: 'I keep centered effort close, and my honest momentum remains available.' },
    { id: 'seed-v3-000007', content: 'I give myself permission to value my path instead of comparing timelines and my patience protects what matters most.' },
    { id: 'seed-v3-000008', content: 'One brave decision now helps me to act with courage before certainty arrives and my steady heart can handle what comes next.' },
    { id: 'seed-v3-000009', content: 'Quiet progress still counts when I choose to celebrate progress and learn from each setback so my life reflects both purpose and compassion.' },
    { id: 'seed-v3-000010', content: 'My heart already knows how to honor rest and continue my focused momentum and the right doors will open at the right pace.' },
    { id: 'seed-v3-000011', content: 'I let patience teach me to remain hopeful while handling practical responsibilities because my disciplined hope is changing my future.' },
    { id: 'seed-v3-000012', content: 'A calmer mind helps me to protect my peace and pursue meaningful goals because my next chapter deserves this version of me.' },
    { id: 'seed-v3-000013', content: 'I choose the next honest step to return to gratitude and rebuild my confidence and my peace can coexist with healthy ambition.' },
    { id: 'seed-v3-000014', content: 'My future opens wider when I choose to strengthen my spirit through consistent practice and my belief in myself keeps momentum alive.' },
    { id: 'seed-v3-000015', content: 'Small consistent actions train me to stay grounded and keep my promise to myself while my wisdom grows through each lived lesson.' },
    { id: 'seed-v3-000016', content: 'I trust my growth, because I choose to stay disciplined while treating myself with compassion while my gratitude keeps my spirit open.' },
    { id: 'seed-v3-000017', content: 'I carry both hope and courage to serve others kindly while respecting my limits because consistency quietly creates extraordinary outcomes.' },
    { id: 'seed-v3-000018', content: 'This challenge helps me to stay brave through change and trust my preparation because my actions are aligning with my values.' },
    { id: 'seed-v3-000019', content: 'I keep my focus and choose to release old fear and make room for joy so my progress stays real, honest, and sustainable.' },
    { id: 'seed-v3-000020', content: 'My kindness toward myself helps me to keep showing up with purpose and resilience while each challenge refines my inner strength.' }
  ];

  var bottomArtSources = [
    'assets/bottom-screen-art/bottom-art-01.png',
    'assets/bottom-screen-art/bottom-art-02.png',
    'assets/bottom-screen-art/bottom-art-03.png',
    'assets/bottom-screen-art/bottom-art-04.png',
    'assets/bottom-screen-art/bottom-art-05.png',
    'assets/bottom-screen-art/bottom-art-06.png',
    'assets/bottom-screen-art/bottom-art-07.png',
    'assets/bottom-screen-art/bottom-art-08.png'
  ];

  var sendProgressImageSources = [
    'assets/send-progress/blink-01.png',
    'assets/send-progress/blink-02.png',
    'assets/send-progress/blink-03.png'
  ];

  var state = {
    dateKey: '',
    sentence: sentences[0],
    displaySentence: formatSentenceForDisplay(sentences[0].content),
    toastTimer: null,
    sendTimer: null,
    dotsTimer: null,
    sendProgressIndex: 0,
    heartBlinkTimer: null,
    isCurrentCharBlinkVisible: true,
    mindCopyToastTimer: null,
    tabAnimationFrame: null,
    tabIndicatorPosition: 0,
    tabIndicatorScale: 1,
    pendingSendMode: null
  };

  var SEND_DURATION_MS = 5000;
  var TAB_TRANSLATE_SPRING = { damping: 15, stiffness: 220, mass: 0.8 };
  var TAB_DROP_SPRING = { damping: 9, stiffness: 260, mass: 0.55 };
  var TAB_REST_SPEED = 0.02;
  var TAB_REST_DISPLACEMENT = 0.02;

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
  var mindSideActions = root.querySelector('[data-mind-side-actions]');
  var mindCopyToast = root.querySelector('[data-mind-copy-toast]');
  var mindClearConfirm = root.querySelector('[data-mind-clear-confirm]');
  var sendActions = root.querySelector('[data-send-actions]');
  var sendDismiss = root.querySelector('[data-send-dismiss]');
  var sendMenu = root.querySelector('[data-send-menu]');
  var menuToggle = root.querySelector('[data-action="toggle-menu"]');
  var quickSendButton = root.querySelector('[data-action="quick-send"]');
  var toast = root.querySelector('[data-toast]');
  var successMessage = root.querySelector('[data-success-message]');
  var sendProgressGreeting = root.querySelector('[data-send-progress-greeting]');
  var sendProgressImage = root.querySelector('[data-send-progress-image]');
  var sendProgressDots = root.querySelectorAll('[data-send-progress-dot]');
  var bottomArtImages = root.querySelectorAll('[data-bottom-art]');
  var profileGreeting = root.querySelector('[data-profile-greeting]');
  var panels = root.querySelectorAll('[data-panel]');
  var views = root.querySelectorAll('[data-view]');
  var tabs = root.querySelectorAll('[data-tab]');
  var tabBar = root.querySelector('[data-tab-bar]');

  function pickRandomItem(items) {
    return items[Math.floor(Math.random() * items.length)];
  }

  function setSessionBottomArt() {
    var artSource = pickRandomItem(bottomArtSources);

    bottomArtImages.forEach(function (image) {
      image.setAttribute('src', artSource);
    });
  }

  function updateSendProgressFrame() {
    var frameIndex = state.sendProgressIndex % sendProgressImageSources.length;

    if (sendProgressImage) {
      sendProgressImage.setAttribute('src', sendProgressImageSources[frameIndex]);
    }

    sendProgressDots.forEach(function (dot, index) {
      dot.classList.toggle('active', index === frameIndex);
    });
  }

  function formatSentenceForDisplay(sentence) {
    return sentence.trim().replace(/\.$/, '');
  }

  function setSendMenuOpen(isOpen) {
    sendMenu.hidden = !isOpen;
    if (sendDismiss) {
      sendDismiss.hidden = !isOpen;
    }
    if (sendActions) {
      sendActions.classList.toggle('is-menu-open', isOpen);
    }
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Close send mode options' : 'Open send mode options');
  }

  function closePanels() {
    panels.forEach(function (panel) {
      panel.hidden = true;
    });
    clearHeartBlinkTimer();
    closeMindClearConfirm();
    hideMindCopyToast();
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
    var successText = 'Message is sent to the Universe!';
    var greeting = Math.random() < 0.5 ? 'Hey' : 'Hi';

    clearSendTimers();
    state.pendingSendMode = mode;

    closePanels();
    setSendMenuOpen(false);

    if (mode === 'heart' || mode === 'mind') {
      successText = 'Message is sent to the Universe with your heart in it!';
    }

    if (sendProgressGreeting) {
      sendProgressGreeting.textContent = greeting + ' there!';
    }

    state.sendProgressIndex = 0;
    updateSendProgressFrame();

    openPanel('sending');
    state.dotsTimer = setInterval(function () {
      state.sendProgressIndex = (state.sendProgressIndex + 1) % sendProgressImageSources.length;
      updateSendProgressFrame();
    }, 500);

    state.sendTimer = setTimeout(function () {
      clearSendTimers();
      state.pendingSendMode = null;

      if (mode === 'mind' && mindInput) {
        mindInput.value = '';
        updateMindState();
      }

      if (successMessage) {
        successMessage.textContent = successText;
      }

      openPanel('success');
    }, SEND_DURATION_MS);
  }

  function cancelSend() {
    var returnMode = state.pendingSendMode;

    clearSendTimers();
    state.pendingSendMode = null;
    closePanels();

    if (returnMode === 'mind') {
      openPanel('mind');
    }
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

    if (mindSideActions) {
      mindSideActions.hidden = value.length === 0;
    }
  }

  function openMindClearConfirm() {
    if (mindClearConfirm) {
      mindClearConfirm.hidden = false;
    }
  }

  function closeMindClearConfirm() {
    if (mindClearConfirm) {
      mindClearConfirm.hidden = true;
    }
  }

  function confirmClearMindDraft() {
    if (mindInput) {
      mindInput.value = '';
      updateMindState();
      mindInput.focus();
    }

    closeMindClearConfirm();
  }

  function hideMindCopyToast() {
    if (state.mindCopyToastTimer) {
      clearTimeout(state.mindCopyToastTimer);
      state.mindCopyToastTimer = null;
    }

    if (mindCopyToast) {
      mindCopyToast.hidden = true;
    }
  }

  function showMindCopyToast() {
    if (!mindCopyToast) {
      return;
    }

    hideMindCopyToast();
    mindCopyToast.hidden = false;
    state.mindCopyToastTimer = setTimeout(function () {
      mindCopyToast.hidden = true;
      state.mindCopyToastTimer = null;
    }, 2000);
  }

  function copyMindMessage() {
    var value = mindInput ? mindInput.value : '';

    if (!value) {
      return;
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(value).then(showMindCopyToast).catch(function () {
        showToast('Unable to copy right now');
      });
      return;
    }

    mindInput.focus();
    mindInput.select();

    try {
      document.execCommand('copy');
      showMindCopyToast();
    } catch (error) {
      showToast('Unable to copy right now');
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
    var previousViewName = tabBar ? tabBar.getAttribute('data-active-tab') : null;

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

    updateTabBarSelection(viewName, previousViewName !== viewName);

    if (viewName === 'profile') {
      updateProfileGreeting();
    }
  }

  function getTabTravelDistance() {
    var style;
    var tabWidth;
    var tabGap;

    if (!tabBar || !window.getComputedStyle) {
      return 118;
    }

    style = window.getComputedStyle(tabBar);
    tabWidth = parseFloat(style.getPropertyValue('--app-tab-width'));
    tabGap = parseFloat(style.getPropertyValue('--app-tab-gap'));

    return (Number.isNaN(tabWidth) ? 116 : tabWidth) + (Number.isNaN(tabGap) ? 2 : tabGap);
  }

  function getTabTargetPosition(viewName) {
    return viewName === 'profile' ? getTabTravelDistance() : 0;
  }

  function setTabIndicatorTransform(position, scale) {
    state.tabIndicatorPosition = position;
    state.tabIndicatorScale = scale;

    if (!tabBar) {
      return;
    }

    tabBar.style.setProperty('--app-tab-indicator-x', position.toFixed(3) + 'px');
    tabBar.style.setProperty('--app-tab-indicator-scale', String(Math.round(scale * 1000) / 1000));
  }

  function cancelTabAnimation() {
    if (!state.tabAnimationFrame) {
      return;
    }

    cancelAnimationFrame(state.tabAnimationFrame);
    state.tabAnimationFrame = null;
  }

  function advanceSpring(position, velocity, target, elapsedSeconds, spring) {
    var displacement = position - target;
    var acceleration = (-spring.stiffness * displacement - spring.damping * velocity) / spring.mass;
    var nextVelocity = velocity + acceleration * elapsedSeconds;

    return {
      position: position + nextVelocity * elapsedSeconds,
      velocity: nextVelocity
    };
  }

  function isSpringAtRest(position, velocity, target) {
    return Math.abs(velocity) < TAB_REST_SPEED && Math.abs(target - position) < TAB_REST_DISPLACEMENT;
  }

  function animateTabIndicatorTo(targetPosition) {
    var position = state.tabIndicatorPosition;
    var velocity = 0;
    var scale = 0.9;
    var scaleVelocity = 0;
    var lastTimestamp = null;

    cancelTabAnimation();
    setTabIndicatorTransform(position, scale);

    function animate(timestamp) {
      var elapsedSeconds;
      var translation;
      var drop;

      if (lastTimestamp === null) {
        lastTimestamp = timestamp;
      }

      elapsedSeconds = Math.min((timestamp - lastTimestamp) / 1000, 1 / 30);
      lastTimestamp = timestamp;

      translation = advanceSpring(position, velocity, targetPosition, elapsedSeconds, TAB_TRANSLATE_SPRING);
      drop = advanceSpring(scale, scaleVelocity, 1, elapsedSeconds, TAB_DROP_SPRING);
      position = translation.position;
      velocity = translation.velocity;
      scale = drop.position;
      scaleVelocity = drop.velocity;

      setTabIndicatorTransform(position, scale);

      if (isSpringAtRest(position, velocity, targetPosition) && isSpringAtRest(scale, scaleVelocity, 1)) {
        setTabIndicatorTransform(targetPosition, 1);
        state.tabAnimationFrame = null;
        return;
      }

      state.tabAnimationFrame = requestAnimationFrame(animate);
    }

    state.tabAnimationFrame = requestAnimationFrame(animate);
  }

  function updateTabBarSelection(viewName, shouldAnimate) {
    var targetPosition;

    if (!tabBar) {
      return;
    }

    targetPosition = getTabTargetPosition(viewName);
    tabBar.setAttribute('data-active-tab', viewName);

    if (!shouldAnimate || !window.requestAnimationFrame) {
      cancelTabAnimation();
      setTabIndicatorTransform(targetPosition, 1);
      return;
    }

    animateTabIndicatorTo(targetPosition);
  }

  function syncDailyMessage() {
    var now = new Date();
    var heading = pickRandomItem(headings);
    var sentence = pickRandomItem(sentences);

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

    if (action === 'close-menu') {
      setSendMenuOpen(false);
      return;
    }

    if (action === 'capture-home') {
      setSendMenuOpen(false);
      showToast('Saving the home page image is unavailable in this build');
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
      return;
    }

    if (action === 'mind-clear') {
      openMindClearConfirm();
      return;
    }

    if (action === 'mind-copy') {
      copyMindMessage();
      return;
    }

    if (action === 'mind-clear-no') {
      closeMindClearConfirm();
      return;
    }

    if (action === 'mind-clear-yes') {
      confirmClearMindDraft();
      return;
    }

    if (action === 'close-modal') {
      clearSendTimers();
      state.pendingSendMode = null;
      closePanels();
    }

    if (action === 'cancel-send') {
      cancelSend();
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
      if (state.pendingSendMode) {
        cancelSend();
        return;
      }

      clearSendTimers();
      state.pendingSendMode = null;
      closePanels();
      setSendMenuOpen(false);
    }
  });

  setSessionBottomArt();
  updateSendProgressFrame();
  syncDailyMessage();
  updateMindState();
  updateProfileGreeting();
}());