// Interactive preview of the 1Million Secrets iOS app on the home page.
// Layout, copy and behavior mirror apps/ios in the app repository. It is a demo only:
// nothing typed here is sent, stored, or leaves the browser.
(function () {
  "use strict";
  var root = document.querySelector("[data-oms-sim]");
  if (!root) return;

  var APP = "assets/app/";
  var DEMO_NOTE = "This is a preview, so nothing leaves your browser.";

  // ---------- Copy (English strings from shared/Strings.kt) ----------
  var T = {
    writeInfo:
      "One Million Secrets is a place to share a secret with the world without worrying about being judged, or simply to send a kind word to a stranger. A real person will read your message, so please be kind and respectful.\n\n" +
      "Your message goes to one random person, without your name. One Million Secrets can see it for safety. The person who receives it can share it, so don't include anything that identifies you or anyone else.\n\n" +
      "The person who receives your message can report it if they feel disrespected or unsafe. Reports can get your account banned for a period of time, and repeated reports can lead to a permanent ban.",
    aboutMessageTitle: "About this message",
    aboutMessageBody: "You can't reply, and the sender isn't told whether you've read it.",
    hideMessageTitle: "Hide this message?",
    hideReceivedBody: "It will be removed from your inbox on all your devices, and you won't be able to get it back.",
    blockTitle: "Block this sender?",
    blockBody: "You won't receive messages from this sender again. They won't be told, and you still won't learn who they are.",
    blocked: "You won't receive messages from this sender again. They won't be told.",
    reportDone: "Thanks. Your report was received.",
    removeAllTitle: "Remove all text?",
    removeAllBody: "This clears everything you've written.",
    useCreditTitle: "Use 1 credit?",
    creditsInfo: "Credits never expire. 1 credit buys 1 extra send or 1 extra receive. Each ad earns 1 credit, up to 3 ads a day."
  };
  function useCreditBody(left) { return "Your free send isn't ready, so this send costs 1 credit. You'll have " + left + " left."; }
  function nextFreeSend(time) { return "Your next free send is " + time + ". Buy credits or watch ads to earn credits and send now."; }

  // ---------- Content filter (port of shared/ContentFilter.kt; contact patterns and a subset of terms) ----------
  var FILTER = {
    suffixes: ["s", "es", "ed", "er", "ers", "ing"],
    terms: [
      "fuck", "fuk", "fuckin", "fck", "fcking", "phuck", "motherfucker", "motherfucking", "mofo", "wtf", "stfu", "gtfo",
      "shit", "shitty", "shite", "bullshit", "horseshit", "shithead", "shithole", "ass", "arse", "asshole", "arsehole",
      "dumbass", "jackass", "bitch", "bitchy", "bastard", "cunt", "twat", "wanker", "prick", "dick", "dickhead", "douche",
      "douchebag", "piss", "bollocks", "slut", "whore", "skank", "scumbag", "dipshit", "goddamn", "damnit",
      "sex", "sexy", "sexting", "porn", "porno", "nude", "nudes", "naked", "horny", "boobs", "tits", "pussy", "penis",
      "cock", "dildo", "onlyfans", "nsfw", "xxx", "hentai", "fetish",
      "kill", "shoot", "stab", "bomb", "murder", "rape", "rapist", "behead", "massacre", "terrorist",
      "suicide", "suicidal", "kys", "kill yourself", "kill myself", "self harm", "selfharm", "end my life", "end your life", "cut myself",
      "minor", "underage", "child", "children", "kid", "pedo", "pedophile", "loli", "jailbait",
      "bitcoin", "crypto", "wire transfer", "gift card", "investment opportunity"
    ],
    patterns: [
      "[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}",
      "(?:\\+?\\d[\\s().-]*){9,}\\d",
      "\\b(?:https?://|www\\.)\\S+",
      "\\b[a-z0-9-]+\\.(?:com|net|org|io|me|app|ly|gg)\\b",
      "(?:^|\\s)@[A-Za-z0-9_.]{3,}",
      "\\b(?:snap(?:chat)?|insta(?:gram)?|telegram|whatsapp|discord|kik)\\b\\s*[:\\-]?\\s*\\S+"
    ]
  };
  var LEET = { "0": "o", "1": "i", "3": "e", "4": "a", "5": "s", "7": "t", "@": "a", "$": "s" };
  var singles = {}, phrases = [];
  FILTER.terms.forEach(function (term) {
    var words = term.toLowerCase().split(" ").filter(Boolean);
    if (words.length === 1) singles[words[0]] = true; else phrases.push(words);
  });
  var patterns = FILTER.patterns.map(function (p) { return new RegExp(p, "gi"); });
  function isLetter(c) { return /[A-Za-z]/.test(c); }
  function isWordChar(c) { return /[A-Za-z0-9@$]/.test(c); }
  function tokenize(text) {
    var tokens = [], i = 0;
    while (i < text.length) {
      if (!isWordChar(text[i])) { i++; continue; }
      var start = i;
      while (i < text.length && isWordChar(text[i])) i++;
      var raw = text.slice(start, i), hasLetter = /[A-Za-z]/.test(raw), word = "";
      for (var k = 0; k < raw.length; k++) {
        var c = raw[k].toLowerCase();
        word += hasLetter && LEET[c] ? LEET[c] : c;
      }
      tokens.push({ start: start, end: i, word: word });
    }
    return tokens;
  }
  function matchesWord(token, word) {
    return token === word || FILTER.suffixes.some(function (s) { return token === word + s; });
  }
  function isSingle(token) {
    if (singles[token]) return true;
    return FILTER.suffixes.some(function (s) {
      return token.length > s.length && token.slice(-s.length) === s && singles[token.slice(0, -s.length)];
    });
  }
  function checkText(text) {
    var found = [], tokens = tokenize(text);
    tokens.forEach(function (token, index) {
      if (isSingle(token.word)) found.push([token.start, token.end]);
      phrases.forEach(function (words) {
        var last = index + words.length - 1;
        if (last >= tokens.length) return;
        var ok = words.every(function (w, o) {
          var cand = tokens[index + o].word;
          return o === words.length - 1 ? matchesWord(cand, w) : cand === w;
        });
        if (ok) found.push([token.start, tokens[last].end]);
      });
    });
    patterns.forEach(function (re) {
      re.lastIndex = 0;
      var m;
      while ((m = re.exec(text))) {
        var start = m.index, end = m.index + m[0].length;
        while (start < end && /\s/.test(text[start])) start++;
        if (start < end) found.push([start, end]);
        if (m[0].length === 0) re.lastIndex++;
      }
    });
    found.sort(function (a, b) { return a[0] - b[0] || a[1] - b[1]; });
    var merged = [];
    found.forEach(function (r) {
      var prev = merged[merged.length - 1];
      if (prev && r[0] <= prev[1]) prev[1] = Math.max(prev[1], r[1]); else merged.push([r[0], r[1]]);
    });
    return merged;
  }

  // ---------- Formatting (port of Formats.swift) ----------
  function dayStart(d) { return new Date(d.getFullYear(), d.getMonth(), d.getDate()); }
  function timeOf(d) { return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }); }
  function listTime(d) {
    var now = new Date(), days = Math.round((dayStart(now) - dayStart(d)) / 864e5);
    if (days <= 0) return timeOf(d);
    if (days === 1) return "Yesterday";
    if (days < 7) return d.toLocaleDateString("en-US", { weekday: "short" });
    if (d.getFullYear() === now.getFullYear()) return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  }
  function dateTime(d) {
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) + " at " + timeOf(d);
  }
  function ago(minutes) { return new Date(Date.now() - minutes * 60000); }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function codePoints(s) { return Array.from(s.trim()).length; }

  // ---------- Icons (SF Symbols look-alikes) ----------
  function svg(body, vb, extra) {
    return '<svg viewBox="' + (vb || "0 0 24 24") + '" aria-hidden="true" focusable="false"' + (extra || "") + ">" + body + "</svg>";
  }
  var S = ' fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"';
  var TRAY = "M3 13.5 5.6 5.4A2 2 0 0 1 7.5 4h9a2 2 0 0 1 1.9 1.4L21 13.5V18a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z";
  var PLANE = "M21.5 2.5 2.8 10.2a.6.6 0 0 0 0 1.1l7 2.9 2.9 7a.6.6 0 0 0 1.1 0z";
  var I = {
    trayOff: svg('<path d="' + TRAY + '"/><path d="M3 13.5h5a4 4 0 0 0 8 0h5"/>', 0, S),
    trayOn: svg('<path fill="currentColor" d="' + TRAY + '"/><path d="M3.6 13.5H8a4 4 0 0 0 8 0h4.4" fill="none" stroke="#f9f9f9" stroke-width="1.6"/>'),
    planeOff: svg('<path d="' + PLANE + '"/><path d="M21.5 2.5 9.8 14.2"/>', 0, S),
    planeOn: svg('<path fill="currentColor" d="' + PLANE + '"/><path d="M21 3 9.8 14.2" stroke="#f9f9f9" stroke-width="1.5"/>'),
    personOff: svg('<circle cx="12" cy="12" r="9.5"/><circle cx="12" cy="9.8" r="3.3"/><path d="M5.8 18.2a8 8 0 0 1 12.4 0"/>', 0, S),
    personOn: svg('<circle cx="12" cy="12" r="10.2" fill="currentColor"/><circle cx="12" cy="9.8" r="3.3" fill="#f9f9f9"/><path d="M5.6 18.6a8.4 8.4 0 0 1 12.8 0A9.2 9.2 0 0 1 12 21.2a9.2 9.2 0 0 1-6.4-2.6z" fill="#f9f9f9"/>'),
    write: svg('<path d="M12 4.5H6.5a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V12"/><path d="M17.8 3.6a2 2 0 0 1 2.8 2.8L12.3 14.7l-3.7.9.9-3.7z"/>', 0, ' fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"'),
    info: svg('<circle cx="12" cy="12" r="9.5" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M12 11v6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><circle cx="12" cy="7.6" r="1.25" fill="currentColor"/>'),
    xmarkCircle: svg('<circle cx="12" cy="12" r="11" fill="currentColor" opacity=".18"/><path d="M8.4 8.4l7.2 7.2M15.6 8.4l-7.2 7.2" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>'),
    trash: svg('<path d="M4 6.5h16M9.5 6.5V4.8c0-.5.4-.8.8-.8h3.4c.4 0 .8.3.8.8v1.7M6 6.5l.9 12.6A2 2 0 0 0 8.9 21h6.2a2 2 0 0 0 2-1.9L18 6.5M10 10.5v6M14 10.5v6"/>', 0, S),
    copy: svg('<rect x="8.5" y="8.5" width="11.5" height="12.5" rx="2"/><path d="M15.5 8.5V5a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v10.5a2 2 0 0 0 2 2h2.5"/>', 0, S),
    planeFill: svg('<path d="' + PLANE + '"/>'),
    flame: svg('<path d="M12 1.5c.6 3.6 5.6 6 5.6 11.6A5.6 5.6 0 0 1 12 18.7a5.6 5.6 0 0 1-5.6-5.6c0-2.8 1.5-4.4 2.7-5.8.2 1.9 1.1 3 2.3 3.5.4-3.1-.1-6.4.6-9.3z"/>', "0 0 24 20"),
    chevronLeft: svg('<path d="M10 2 2 10l8 8" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>', "0 0 12 20"),
    chevronRight: svg('<path d="M1.5 1.5 6.5 7l-5 5.5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>', "0 0 8 14"),
    ellipsis: svg('<circle cx="12" cy="12" r="9.5" fill="none" stroke="currentColor" stroke-width="1.6"/><circle cx="7.8" cy="12" r="1.3" fill="currentColor"/><circle cx="12" cy="12" r="1.3" fill="currentColor"/><circle cx="16.2" cy="12" r="1.3" fill="currentColor"/>'),
    sparkles: svg('<path fill="currentColor" d="M10 3l1.6 4.4L16 9l-4.4 1.6L10 15l-1.6-4.4L4 9l4.4-1.6zM17.5 13l.9 2.1 2.1.9-2.1.9-.9 2.1-.9-2.1-2.1-.9 2.1-.9z"/>', 0, ' width="14" height="14"'),
    cart: svg('<path d="M2.5 3.5h2.6l2.3 11.2a1.6 1.6 0 0 0 1.6 1.3h8.6a1.6 1.6 0 0 0 1.6-1.2L21 7H6.2"/><circle cx="9.5" cy="20" r="1.5" fill="currentColor"/><circle cx="17.5" cy="20" r="1.5" fill="currentColor"/>', 0, ' fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"'),
    play: svg('<path d="M7 4.5v15a1 1 0 0 0 1.5.9l12-7.5a1 1 0 0 0 0-1.8l-12-7.5A1 1 0 0 0 7 4.5z"/>'),
    sync: svg('<path d="M20 11a8 8 0 0 0-14.3-4.6M4 13a8 8 0 0 0 14.3 4.6"/><path d="M5.5 2.8v3.8h3.8M18.5 21.2v-3.8h-3.8"/>', 0, S),
    shield: svg('<path fill="currentColor" d="M12 2 4 5v6.2c0 5 3.4 9.4 8 10.8 4.6-1.4 8-5.8 8-10.8V5z"/><path d="m8.5 12 2.5 2.5 4.5-5" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>'),
    gear: svg('<path fill="currentColor" fill-rule="evenodd" d="M10.3 2h3.4l.5 2.6 1.6.9 2.5-.9 1.7 2.9-2 1.7v1.6l2 1.7-1.7 2.9-2.5-.9-1.6.9-.5 2.6h-3.4l-.5-2.6-1.6-.9-2.5.9-1.7-2.9 2-1.7v-1.6l-2-1.7 1.7-2.9 2.5.9 1.6-.9zM12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7z" transform="translate(0 1)"/>'),
    noAds: svg('<rect x="2.5" y="6" width="19" height="12" rx="2"/><path d="M7 15l1.6-5h.8l1.6 5M7.6 13.4h2.8M13 10h1.6a2.5 2.5 0 0 1 0 5H13z"/><path d="M3.5 3.5l17 17"/>', 0, S),
    eyeSlash: svg('<path d="M3 12s3.3-6 9-6 9 6 9 6-3.3 6-9 6-9-6-9-6z"/><circle cx="12" cy="12" r="2.8"/><path d="M4 3.5 20 20.5"/>', 0, S),
    flag: svg('<path d="M5 21V4M5 4h11.5l-2 4 2 4H5"/>', 0, S),
    flagFill: svg('<path d="M5 21V4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path fill="currentColor" d="M5 3.2h12l-2.2 4.4 2.2 4.4H5z"/>'),
    hand: svg('<path d="M8 12V5.5a1.5 1.5 0 0 1 3 0V11M11 10.5V4a1.5 1.5 0 0 1 3 0v6.5M14 10.5V5.5a1.5 1.5 0 0 1 3 0V14c0 4-2.5 7-6.5 7-2.5 0-4-1.2-5.4-3.3L3.4 15a1.6 1.6 0 0 1 2.6-1.8L8 15"/>', 0, S),
    signal: svg('<rect x="0" y="7" width="3" height="4" rx="1"/><rect x="5" y="5" width="3" height="6" rx="1"/><rect x="10" y="2.5" width="3" height="8.5" rx="1"/><rect x="15" y="0" width="3" height="11" rx="1"/>', "0 0 18 11", ' width="18" height="11" fill="currentColor"'),
    wifi: svg('<path d="M8 2.2c2.5 0 4.8 1 6.5 2.6l1.1-1.1A10.8 10.8 0 0 0 8 .6 10.8 10.8 0 0 0 .4 3.7l1.1 1.1A9.2 9.2 0 0 1 8 2.2zm0 3.4c1.6 0 3 .6 4.1 1.6l1.1-1.1A7.5 7.5 0 0 0 8 4a7.5 7.5 0 0 0-5.2 2.1l1.1 1.1c1.1-1 2.5-1.6 4.1-1.6zm0 3.4c.7 0 1.3.3 1.8.7L8 11.5 6.2 9.7c.5-.4 1.1-.7 1.8-.7z"/>', "0 0 16 12", ' width="16" height="12" fill="currentColor"'),
    battery: svg('<rect x=".5" y=".5" width="24" height="12" rx="3.8" fill="none" stroke="currentColor" opacity=".4"/><rect x="2" y="2" width="21" height="9" rx="2.5" fill="currentColor"/><path d="M26 4.5v4c.8-.3 1.3-1.1 1.3-2s-.5-1.7-1.3-2z" fill="currentColor" opacity=".45"/>', "0 0 28 13", ' width="28" height="13"')
  };

  // ---------- Demo data ----------
  var AVATARS = ["avatar_042", "avatar_123", "avatar_000", "avatar_160", "avatar_088", "avatar_017", "avatar_199"];
  var state = {
    tab: "inbox",
    freeAvailable: true,
    balance: 3,
    adsToday: 0,
    streak: 7,
    sentToday: false,
    draft: "",
    inbox: [
      { text: "I finally told my mom I'm proud of her. She cried, then I cried. Whoever reads this: call yours if you can.", at: ago(25), unread: true },
      { text: "Today I ate lunch alone in my car and it was the best twenty minutes of my week. Rest is allowed.", at: ago(130), unread: true },
      { text: "I still keep a voicemail from my grandpa. I play it on the days I forget who I am.", at: ago(60 * 26) },
      { text: "Nobody at work knows I'm learning piano at 41. Three songs in. Still terrible. Still happy.", at: ago(60 * 24 * 3) },
      { text: "To the stranger reading this: you're doing better than you think. Really.", at: ago(60 * 24 * 5) },
      { text: "I said yes to the job across the country. Terrified. Excited. Mostly terrified.", at: ago(60 * 24 * 12) }
    ],
    sent: [
      { text: "Some days I pretend to be busy so no one asks how I'm doing. Today I'm actually okay, and I wanted someone to know.", at: ago(60 * 20), status: "Received" },
      { text: "I planted tomatoes from seed this spring. Forty of them. I have no idea what to do with forty tomato plants.", at: ago(60 * 24 * 2 + 40), status: "Received" },
      { text: "I forgave my brother last week. I never told him. I just felt it go.", at: ago(60 * 24 * 4), status: "Received" },
      { text: "If you're reading this on a hard day, drink some water and open a window. Small things count.", at: ago(60 * 24 * 9), status: "Received" }
    ]
  };
  state.inbox.forEach(function (m, i) { m.id = "r" + i; m.avatar = AVATARS[i % AVATARS.length]; });
  state.sent.forEach(function (m, i) { m.id = "s" + i; });
  var nextId = 100;

  // ---------- Markup ----------
  function tabButton(name, label, off, on) {
    return '<button type="button" data-action="tab" data-tab="' + name + '" aria-label="' + label + '"><span class="off">' + off + '</span><span class="on">' + on + "</span>" +
      (name === "inbox" ? '<span class="oms-badge" data-badge hidden></span>' : "") + "</button>";
  }
  var LOGO = '<img class="oms-logo" src="' + APP + 'logo.png" alt="One Million Secrets" width="300" height="44">';
  root.innerHTML =
    '<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs><linearGradient id="oms-flame" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffcc00"/><stop offset=".5" stop-color="#ff9500"/><stop offset="1" stop-color="#ff3b30"/></linearGradient></defs></svg>' +
    '<div class="oms-device"><div class="oms-screen" data-screen>' +
      '<div class="oms-app" data-app>' +
        '<section class="oms-tab" data-panel="inbox"><div class="oms-page is-list"><div class="oms-page-inner">' + LOGO +
          '<div class="oms-title-row"><h3 class="oms-title">Inbox</h3><span class="oms-streak" data-streak></span></div>' +
          '<div class="oms-list" data-inbox-list></div></div></div><div class="oms-page is-detail" data-inbox-detail></div></section>' +
        '<section class="oms-tab" data-panel="sent"><div class="oms-page is-list"><div class="oms-page-inner">' + LOGO +
          '<h3 class="oms-title oms-page-title">Sent</h3><div class="oms-list" data-sent-list></div></div></div><div class="oms-page is-detail" data-sent-detail></div></section>' +
        '<section class="oms-tab" data-panel="account"><div class="oms-page is-list"><div class="oms-page-inner" data-account></div></div></section>' +
        '<button type="button" class="oms-write-fab" data-action="open-write" aria-label="Write">' + I.write + "</button>" +
        '<nav class="oms-tabbar" aria-label="Tabs"><span class="oms-tab-indicator" data-indicator aria-hidden="true"></span>' + tabButton("inbox", "Inbox", I.trayOff, I.trayOn) + tabButton("sent", "Sent", I.planeOff, I.planeOn) +
          tabButton("account", "Account", I.personOff, I.personOn) + "</nav>" +
      "</div>" +
      '<div class="oms-dim" data-action="close-write"></div>' +
      '<div class="oms-sheet" data-sheet role="dialog" aria-label="Write"><div class="oms-sheet-inner">' +
        '<div class="oms-write-head"><h3 class="oms-title">Write</h3>' +
          '<button type="button" class="oms-info" data-action="popover" data-title="Write" data-key="writeInfo" aria-label="About Write">' + I.info + "</button>" +
          '<button type="button" class="oms-close" data-action="close-write" aria-label="Close">' + I.xmarkCircle + "</button></div>" +
        '<div class="oms-editor-wrap"><div class="oms-editor" data-editor role="textbox" aria-multiline="true" aria-label="Your message" spellcheck="false" data-placeholder="Write a secret, or a kind word for a stranger…"></div><div data-notice></div></div>' +
        '<div class="oms-tools"><button type="button" class="oms-tool" data-action="clear" aria-label="Remove all text">' + I.trash + "</button>" +
          '<button type="button" class="oms-tool" data-action="copy" aria-label="Copy all text">' + I.copy + "</button>" +
          '<span class="oms-counter" data-counter>0 / 2000</span></div>' +
        '<p class="oms-warn" data-warn hidden>Remove the words in red to send.</p>' +
        '<div data-send-area></div>' +
      "</div></div>" +
      '<div class="oms-cover" data-cover aria-live="polite">' + LOGO + '<div class="oms-cover-body" data-cover-body></div></div>' +
      '<div class="oms-status" aria-hidden="true"><span>9:41</span><span class="oms-status-icons">' + I.signal + I.wifi + I.battery + "</span></div>" +
      '<div class="oms-island" aria-hidden="true"></div><div class="oms-home-indicator" aria-hidden="true"></div>' +
      "<div data-overlay></div>" +
    "</div></div>";

  var screen = root.querySelector("[data-screen]");
  var app = root.querySelector("[data-app]");
  var overlay = root.querySelector("[data-overlay]");
  var editor = root.querySelector("[data-editor]");
  function $(sel) { return root.querySelector(sel); }
  // The phone's clipped layers must never scroll (a focused field could otherwise nudge them).
  [screen, app, $("[data-sheet]")].forEach(function (el) {
    el.addEventListener("scroll", function () { el.scrollTop = 0; el.scrollLeft = 0; });
  });

  // ---------- Fit to the page ----------
  function fit() {
    var parent = root.parentElement, cs = getComputedStyle(parent);
    var width = parent.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
    root.style.setProperty("--s", Math.max(.5, Math.min(.8, width / 414)).toFixed(3));
  }
  fit();
  window.addEventListener("resize", fit);

  // ---------- Rendering ----------
  function unreadCount() { return state.inbox.filter(function (m) { return m.unread; }).length; }

  function renderTabs() {
    root.querySelectorAll("[data-panel]").forEach(function (p) {
      var name = p.getAttribute("data-panel");
      p.classList.toggle("is-active", name === state.tab);
    });
    root.querySelectorAll(".oms-tabbar [data-tab]").forEach(function (b) {
      var on = b.getAttribute("data-tab") === state.tab;
      b.classList.toggle("is-active", on);
      b.setAttribute("aria-pressed", on);
    });
    // The glass bubble behind the selected tab slides between tabs, as on iOS 26.
    $("[data-indicator]").style.transform = "translateX(" + (["inbox", "sent", "account"].indexOf(state.tab) * 100) + "%)";
    var badge = $("[data-badge]"), n = unreadCount();
    badge.hidden = n === 0;
    badge.textContent = n > 99 ? "99+" : n;
  }

  function renderStreak() {
    var el = $("[data-streak]");
    el.className = "oms-streak" + (state.sentToday ? " is-active" : "");
    el.innerHTML = I.flame + "<span>" + state.streak + "</span>";
    el.setAttribute("aria-label", "Daily streak: " + state.streak + " days");
  }

  function emptyState(kind) {
    return '<p class="oms-caption" style="text-align:center;margin-top:120px;font-size:15px">' +
      (kind === "inbox" ? "No messages yet. Messages arrive at random, so there's no set time." : "Messages you write appear here, with their status.") + "</p>";
  }

  function renderInbox() {
    var list = $("[data-inbox-list]");
    if (!state.inbox.length) { list.innerHTML = emptyState("inbox"); return; }
    list.innerHTML = state.inbox.map(function (m) {
      return '<button type="button" class="oms-row" data-action="open-received" data-id="' + m.id + '">' +
        '<img class="oms-avatar" src="' + APP + "avatars/" + m.avatar + '.png" alt="" width="48" height="48">' +
        '<span class="oms-row-text"><span class="oms-row-msg' + (m.unread ? " is-unread" : "") + '">' + esc(m.text) + "</span>" +
        '<span class="oms-caption">' + listTime(m.at) + "</span></span></button>";
    }).join("");
  }

  function renderSent() {
    var list = $("[data-sent-list]");
    if (!state.sent.length) { list.innerHTML = emptyState("sent"); return; }
    list.innerHTML = state.sent.map(function (m) {
      return '<button type="button" class="oms-row" data-action="open-sent" data-id="' + m.id + '">' +
        '<img class="oms-avatar" src="' + APP + 'avatars/profile_avatar_20.png" alt="" width="48" height="48">' +
        '<span class="oms-row-text"><span class="oms-row-msg">' + esc(m.text) + "</span>" +
        '<span class="oms-caption">' + m.status + " · " + listTime(m.at) + "</span></span></button>";
    }).join("");
  }

  function renderAccount() {
    var unit = state.balance === 1 ? "credit" : "credits";
    $("[data-account]").innerHTML = LOGO +
      '<h3 class="oms-title oms-page-title">Account</h3>' +
      '<div class="oms-credits"><div class="oms-credits-head"><span class="oms-spark">' + I.sparkles + "</span>Credits" +
        '<button type="button" data-action="popover" data-title="Credits" data-key="creditsInfo" aria-label="About Credits" style="color:rgba(255,255,255,.75);width:20px;height:20px">' + I.info + "</button></div>" +
        '<div class="oms-credits-balance"><span class="ghost">' + unit + "</span><strong>" + state.balance + "</strong><span>" + unit + "</span></div>" +
        '<div class="oms-pill-row"><button type="button" class="oms-pill filled" data-action="buy">' + I.cart + "Buy 10 · $1.99</button>" +
          '<button type="button" class="oms-pill outline" data-action="watch-ad">' + I.play + "Watch ad</button></div>" +
        '<button type="button" class="oms-sync" data-action="demo">' + I.sync + "Sync purchases</button></div>" +
      '<div class="oms-tiles">' +
        tile(I.shield, "Account status", '<i class="oms-dot"></i>Good standing') +
        tile(I.gear, "Settings", "Preferences") +
        tile(I.noAds, "Remove ads", "One time purchase") +
      "</div>";
  }
  function tile(icon, title, value) {
    return '<button type="button" class="oms-tile" data-action="demo"><span class="oms-tile-icon">' + icon + "</span>" +
      '<span class="oms-tile-text"><b>' + title + "</b><span>" + value + '</span></span><span class="oms-chev">' + I.chevronRight + "</span></button>";
  }

  function renderAll() { renderTabs(); renderStreak(); renderInbox(); renderSent(); renderAccount(); }

  // ---------- Navigation ----------
  function panel(name) { return root.querySelector('[data-panel="' + name + '"]'); }
  function pop(name) { panel(name).classList.remove("is-pushed"); }
  function openReceived(id) {
    var m = find(state.inbox, id);
    if (!m) return;
    if (m.unread) { m.unread = false; renderInbox(); renderTabs(); }
    var detail = $("[data-inbox-detail]");
    detail.innerHTML = '<div class="oms-page-inner">' + LOGO +
      '<button type="button" class="oms-back" data-action="back" data-tab="inbox">' + I.chevronLeft + "Back</button>" +
      '<div class="oms-detail-tools"><button type="button" data-action="popover" data-title="' + T.aboutMessageTitle + '" data-key="aboutMessageBody" aria-label="About this message" style="color:rgba(60,60,67,.6);width:22px;height:22px">' + I.info + "</button>" +
        '<button type="button" data-action="menu" data-id="' + m.id + '" aria-label="More actions" style="width:26px;height:26px">' + I.ellipsis + "</button></div>" +
      '<div class="oms-received-box"><p>' + esc(m.text) + '</p><span class="oms-caption">' + dateTime(m.at) + "</span></div></div>";
    detail.scrollTop = 0;
    panel("inbox").classList.add("is-pushed");
  }
  function openSent(id) {
    var m = find(state.sent, id);
    if (!m) return;
    var detail = $("[data-sent-detail]");
    detail.innerHTML = '<div class="oms-page-inner">' + LOGO +
      '<button type="button" class="oms-back" data-action="back" data-tab="sent">' + I.chevronLeft + "Back</button>" +
      '<div class="oms-letter"><p>' + esc(m.text) + "</p><small>" + m.status + " · " + dateTime(m.at) + "</small></div></div>";
    detail.scrollTop = 0;
    panel("sent").classList.add("is-pushed");
  }
  function find(list, id) { for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i]; return null; }

  // ---------- Overlays: toast, dialog, menu, popover ----------
  var toastTimer;
  function toast(message) {
    clearTimeout(toastTimer);
    overlay.querySelectorAll(".oms-toast").forEach(function (t) { t.remove(); });
    var el = document.createElement("div");
    el.className = "oms-toast";
    el.setAttribute("role", "status");
    el.textContent = message;
    el.addEventListener("click", function () { el.remove(); });
    overlay.appendChild(el);
    toastTimer = setTimeout(function () { el.remove(); }, 4000);
  }
  function closeFloating() { overlay.querySelectorAll(".oms-dialog,.oms-menu,.oms-popover,.oms-scrim").forEach(function (e) { e.remove(); }); }
  function dialog(title, message, actions) {
    closeFloating();
    var el = document.createElement("div");
    el.className = "oms-dialog";
    el.innerHTML = '<div class="oms-dialog-group"><div class="oms-dialog-head"><b>' + esc(title) + "</b><span>" + esc(message) + "</span></div>" +
      actions.map(function (a, i) { return '<button type="button" data-i="' + i + '"' + (a.destructive ? ' class="destructive"' : "") + ">" + esc(a.label) + "</button>"; }).join("") +
      '</div><button type="button" class="oms-dialog-cancel" data-i="-1">Cancel</button>';
    el.addEventListener("click", function (e) {
      var b = e.target.closest("button");
      if (!b && e.target !== el) return;
      el.remove();
      if (b && b.getAttribute("data-i") !== "-1") actions[+b.getAttribute("data-i")].run();
    });
    overlay.appendChild(el);
  }
  // Position of a button inside the phone screen, from layout offsets (ignores slide transitions and page scale).
  function anchor(button) {
    var x = 0, y = 0, el = button;
    while (el && el !== screen) {
      x += el.offsetLeft; y += el.offsetTop;
      var parent = el.offsetParent;
      if (!parent) break;
      x -= parent.scrollLeft; y -= parent.scrollTop;
      el = parent;
    }
    return { left: x, top: y, right: x + button.offsetWidth, bottom: y + button.offsetHeight };
  }
  function scrim() {
    var el = document.createElement("div");
    el.className = "oms-scrim";
    el.addEventListener("click", closeFloating);
    overlay.appendChild(el);
  }
  function popover(button) {
    closeFloating();
    scrim();
    var key = button.getAttribute("data-key"), a = anchor(button);
    var el = document.createElement("div");
    el.className = "oms-popover";
    el.setAttribute("role", "dialog");
    el.innerHTML = "<b>" + esc(button.getAttribute("data-title")) + "</b><p>" + esc(T[key]) + "</p>";
    el.style.left = Math.max(16, Math.min(374 - 300, a.left - 140)) + "px";
    el.style.top = (a.bottom + 8) + "px";
    overlay.appendChild(el);
    var bottom = el.offsetTop + el.offsetHeight;
    if (bottom > 820) el.style.top = Math.max(60, a.top - 8 - el.offsetHeight) + "px";
    el.addEventListener("click", closeFloating);
  }
  function menu(button) {
    closeFloating();
    scrim();
    var id = button.getAttribute("data-id"), m = find(state.inbox, id), a = anchor(button);
    var el = document.createElement("div");
    el.className = "oms-menu";
    el.setAttribute("role", "menu");
    el.innerHTML = '<button type="button" data-m="hide">Hide' + I.eyeSlash + "</button>" +
      (m.reported ? '<button type="button" disabled>Reported' + I.flagFill + "</button>" : '<button type="button" data-m="report">Report' + I.flag + "</button>") +
      '<button type="button" class="destructive" data-m="block">Block sender' + I.hand + "</button>";
    el.style.left = (a.right - 250) + "px";
    el.style.top = (a.bottom + 6) + "px";
    el.addEventListener("click", function (e) {
      var b = e.target.closest("button[data-m]");
      if (!b) return;
      closeFloating();
      var action = b.getAttribute("data-m");
      if (action === "hide") {
        dialog(T.hideMessageTitle, T.hideReceivedBody, [{ label: "Hide", destructive: true, run: function () {
          state.inbox = state.inbox.filter(function (x) { return x.id !== id; });
          pop("inbox"); renderInbox(); renderTabs();
        } }]);
      } else if (action === "report") {
        m.reported = true;
        toast(T.reportDone);
      } else {
        dialog(T.blockTitle, T.blockBody, [{ label: "Block", destructive: true, run: function () { toast(T.blocked); } }]);
      }
    });
    overlay.appendChild(el);
  }

  // ---------- Write sheet ----------
  var frames = [], framesLoaded = false;
  function preloadFrames() {
    if (framesLoaded) return;
    framesLoaded = true;
    for (var i = 0; i < 120; i++) {
      var img = new Image();
      img.src = APP + "send/send_frame_" + ("00" + i).slice(-3) + ".jpg";
      frames.push(img);
    }
    new Image().src = APP + "send_success.png";
  }
  function openWrite() {
    closeFloating();
    preloadFrames();
    setText(state.draft, false);
    screen.classList.add("is-sheet");
    updateWrite();
  }
  function closeWrite() {
    state.draft = text();
    screen.classList.remove("is-sheet");
    editor.blur();
  }

  // Editable box that shows filter matches in bold red, like HighlightingTextEditor.
  editor.contentEditable = "plaintext-only";
  if (editor.contentEditable !== "plaintext-only") editor.contentEditable = "true";
  var composing = false;
  function text() { return editor.textContent; }
  function caret() {
    var sel = window.getSelection();
    if (!sel.rangeCount || !editor.contains(sel.anchorNode)) return null;
    var range = sel.getRangeAt(0);
    function offset(node, off) {
      var r = document.createRange();
      r.selectNodeContents(editor);
      r.setEnd(node, off);
      return r.toString().length;
    }
    return [offset(range.startContainer, range.startOffset), offset(range.endContainer, range.endOffset)];
  }
  function placeCaret(pos) {
    var walker = document.createTreeWalker(editor, NodeFilter.SHOW_TEXT), node, left = pos, last = null;
    while ((node = walker.nextNode())) {
      last = node;
      if (left <= node.length) break;
      left -= node.length;
    }
    var range = document.createRange();
    if (node) range.setStart(node, left);
    else if (last) range.setStart(last, last.length);
    else range.setStart(editor, 0);
    range.collapse(true);
    var sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  }
  function highlightHtml(value) {
    var ranges = checkText(value), out = "", pos = 0;
    ranges.forEach(function (r) {
      out += esc(value.slice(pos, r[0])) + "<b>" + esc(value.slice(r[0], r[1])) + "</b>";
      pos = r[1];
    });
    out += esc(value.slice(pos));
    if (/\n$/.test(value)) out += "<br>";
    return { html: out, blocked: ranges.length > 0 };
  }
  function setText(value, keepCaret, caretAt) {
    var pos = keepCaret ? (caretAt != null ? caretAt : (caret() || [value.length])[1]) : null;
    var result = highlightHtml(value);
    if (editor.innerHTML !== result.html) editor.innerHTML = result.html;
    if (pos != null && document.activeElement === editor) placeCaret(pos);
    return result.blocked;
  }
  function insertAtCaret(insert) {
    var value = text(), c = caret() || [value.length, value.length];
    setText(value.slice(0, c[0]) + insert + value.slice(c[1]), true, c[0] + insert.length);
    afterEdit();
  }
  editor.addEventListener("beforeinput", function (e) {
    if (e.inputType === "insertParagraph" || e.inputType === "insertLineBreak") { e.preventDefault(); insertAtCaret("\n"); }
    else if (e.inputType === "insertFromPaste" || e.inputType === "insertFromDrop") {
      var data = e.dataTransfer && e.dataTransfer.getData("text/plain");
      if (data != null) { e.preventDefault(); insertAtCaret(data.replace(/\r\n?/g, "\n")); }
    }
  });
  editor.addEventListener("paste", function (e) {
    if (e.defaultPrevented) return;
    e.preventDefault();
    insertAtCaret((e.clipboardData.getData("text/plain") || "").replace(/\r\n?/g, "\n"));
  });
  editor.addEventListener("compositionstart", function () { composing = true; });
  editor.addEventListener("compositionend", function () { composing = false; setText(text(), true); afterEdit(); });
  editor.addEventListener("input", function () {
    if (composing) return;
    setText(text(), true);
    afterEdit();
  });
  function afterEdit() {
    state.draft = text();
    if (text()) clearNotice();
    updateWrite();
  }

  var noticeTimer, removedText = null;
  function notice(html, ms) {
    clearTimeout(noticeTimer);
    $("[data-notice]").innerHTML = '<div class="oms-notice">' + html + "</div>";
    noticeTimer = setTimeout(clearNotice, ms);
  }
  function clearNotice() { clearTimeout(noticeTimer); removedText = null; $("[data-notice]").innerHTML = ""; }

  function quote() {
    if (state.freeAvailable) return "free";
    return state.balance > 0 ? "credit" : "none";
  }
  function nextMidnight() { var d = dayStart(new Date()); d.setDate(d.getDate() + 1); return d; }

  function updateWrite() {
    var value = text(), count = codePoints(value), blocked = checkText(value).length > 0;
    var lengthValid = count >= 1 && count <= 2000, valid = lengthValid && !blocked;
    var counter = $("[data-counter]");
    counter.textContent = count + " / 2000";
    counter.classList.toggle("is-over", !lengthValid && value.length > 0);
    $("[data-warn]").hidden = !blocked;
    root.querySelectorAll(".oms-tool").forEach(function (b) { b.disabled = value.length === 0; });
    var q = quote(), area = $("[data-send-area]");
    if (q === "none") {
      area.innerHTML = '<p class="oms-next-free">' + nextFreeSend(dateTime(nextMidnight())) + "</p>" +
        '<div class="oms-buy-row"><button type="button" class="prominent" data-action="buy">' + I.cart + "Buy 10 · $1.99</button>" +
        '<button type="button" class="bordered" data-action="watch-ad">' + I.play + "Watch ad</button></div>";
    } else {
      area.innerHTML = '<div class="oms-send-row"><button type="button" class="oms-send" data-action="send"' + (valid ? "" : " disabled") + ">" +
        I.planeFill + (q === "free" ? "Send free" : "Send for 1 credit") + "</button></div>";
    }
  }

  // ---------- Sending page ----------
  var frameTimer = null, sendTimers = [];
  function startSending(funding) {
    var message = text().trim();
    editor.blur();
    var body = $("[data-cover-body]");
    body.innerHTML = '<img class="oms-cover-frame" data-frame src="' + frames[0].src + '" alt="" width="350" height="350">' +
      '<span class="oms-cover-label" role="status">Sending your message…</span>';
    screen.classList.add("is-sending");
    var frameEl = body.querySelector("[data-frame]"), start = performance.now();
    frameTimer = setInterval(function () {
      var img = frames[Math.floor((performance.now() - start) / 1000 * 30) % 120];
      if (img.complete && img.naturalWidth) frameEl.src = img.src;
    }, 1000 / 30);
    // Same timing as the app: a random 5 or 6 seconds, then "Sent Successfully" for 3 seconds.
    sendTimers.push(setTimeout(function () {
      clearInterval(frameTimer);
      body.innerHTML = '<img class="oms-cover-success" src="' + APP + 'send_success.png" alt="Sent successfully" width="350" height="350">';
      sendTimers.push(setTimeout(function () { finishSend(message, funding); }, 3000));
    }, Math.random() < .5 ? 5000 : 6000));
  }
  function finishSend(message, funding) {
    if (funding === "free") state.freeAvailable = false; else state.balance -= 1;
    if (!state.sentToday) { state.sentToday = true; state.streak += 1; }
    var item = { id: "s" + nextId++, text: message, at: new Date(), status: "Sent" };
    state.sent.unshift(item);
    state.draft = "";
    setText("", false);
    clearNotice();
    screen.classList.remove("is-sheet");
    pop("sent");
    state.tab = "sent";
    renderAll();
    setTimeout(function () { screen.classList.remove("is-sending"); }, 30);
    // In the app, a message stays "Sent" until it reaches someone's inbox.
    sendTimers.push(setTimeout(function () { item.status = "Received"; renderSent(); }, 9000));
  }

  // ---------- Events ----------
  root.addEventListener("click", function (e) {
    var b = e.target.closest("[data-action]");
    if (!b || !root.contains(b) || b.disabled) return;
    var action = b.getAttribute("data-action");
    switch (action) {
      case "tab":
        var name = b.getAttribute("data-tab");
        if (name === state.tab) { pop(name); panel(name).querySelector(".is-list").scrollTop = 0; }
        state.tab = name;
        renderTabs();
        break;
      case "open-received": openReceived(b.getAttribute("data-id")); break;
      case "open-sent": openSent(b.getAttribute("data-id")); break;
      case "back": pop(b.getAttribute("data-tab")); break;
      case "menu": menu(b); break;
      case "popover": popover(b); break;
      case "open-write": openWrite(); break;
      case "close-write": closeWrite(); break;
      case "clear":
        dialog(T.removeAllTitle, T.removeAllBody, [{ label: "Remove all", destructive: true, run: function () {
          var old = text();
          setText("", false);
          state.draft = "";
          updateWrite();
          removedText = old;
          notice('<span>Text removed</span><button type="button" data-action="undo">Undo</button>', 3000);
        } }]);
        break;
      case "undo":
        if (removedText != null) { setText(removedText, false); state.draft = removedText; clearNotice(); updateWrite(); }
        break;
      case "copy":
        if (navigator.clipboard) navigator.clipboard.writeText(text()).catch(function () {});
        notice("<span>Copied to clipboard</span>", 1500);
        break;
      case "send":
        var q = quote();
        if (q === "free") startSending("free");
        else if (q === "credit") {
          dialog(T.useCreditTitle, useCreditBody(state.balance - 1), [{ label: "Send for 1 credit", run: function () { startSending("credit"); } }]);
        }
        break;
      case "watch-ad":
        if (state.adsToday >= 3) { toast("You've reached today's 3 rewarded ads. More are available after " + dateTime(nextMidnight()) + "."); break; }
        state.adsToday += 1;
        state.balance += 1;
        renderAccount();
        if (screen.classList.contains("is-sheet")) updateWrite();
        toast("Preview: you earned 1 credit. In the app, a short video ad plays first.");
        break;
      case "buy": toast("Preview: credits are bought in the app through the App Store or Google Play."); break;
      case "demo": toast(DEMO_NOTE); break;
    }
  });
  root.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    if (overlay.querySelector(".oms-dialog,.oms-menu,.oms-popover")) closeFloating();
    else if (screen.classList.contains("is-sheet") && !screen.classList.contains("is-sending")) closeWrite();
  });

  renderAll();
})();
