// Language picker for every 1Million Secrets page: the app's 7 languages.
//
// Elements with data-i18n="key" get their innerHTML swapped, and data-i18n-label="key" swaps the
// aria-label. Keys starting with "c." are the header and footer, shared by every page (below);
// the rest come from the page's own <script type="application/json" id="page-i18n">.
// English is read from the page itself, so only translations are stored.
//
// The choice comes from ?lang=, then the last pick, then the browser language. Other scripts can
// read window.OMS_LANG and listen for the "oms:lang" event (the home page's phone preview does).
(function () {
  "use strict";

  var COMMON = {
    fr: {
      by: "par 995 Studio", home: "Accueil", story: "Histoire", faq: "FAQ", guidelines: "Règles", privacy: "Confidentialité", terms: "Conditions",
      guidelinesFull: "Règles de la communauté", langLabel: "Langue",
      tagline: "Une pensée. Un inconnu. Des messages anonymes à sens unique pour adultes, par 995 Studio.",
      emergency: "Ce n'est pas un service d'urgence. Si vous ou une autre personne êtes en danger, contactez les services d'urgence locaux.",
      rights: "© 2026 995 Studio. Tous droits réservés. Contact : <a href=\"mailto:support@995studio.com\">support@995studio.com</a>"
    },
    es: {
      by: "por 995 Studio", home: "Inicio", story: "Historia", faq: "Preguntas frecuentes", guidelines: "Normas", privacy: "Privacidad", terms: "Términos",
      guidelinesFull: "Normas de la comunidad", langLabel: "Idioma",
      tagline: "Un pensamiento. Un desconocido. Mensajes anónimos de un solo sentido para adultos, de 995 Studio.",
      emergency: "No es un servicio de emergencias. Si tú u otra persona estáis en peligro, contacta con los servicios de emergencia locales.",
      rights: "© 2026 995 Studio. Todos los derechos reservados. Contacto: <a href=\"mailto:support@995studio.com\">support@995studio.com</a>"
    },
    zh: {
      by: "995 Studio 出品", home: "首页", story: "故事", faq: "常见问题", guidelines: "社区准则", privacy: "隐私", terms: "条款",
      guidelinesFull: "社区准则", langLabel: "语言",
      tagline: "一个念头，一位陌生人。面向成年人的匿名单向消息，由 995 Studio 出品。",
      emergency: "本服务不是紧急服务。如果你或他人身处危险之中，请联系当地紧急服务。",
      rights: "© 2026 995 Studio。保留所有权利。联系方式：<a href=\"mailto:support@995studio.com\">support@995studio.com</a>"
    },
    vi: {
      by: "bởi 995 Studio", home: "Trang chủ", story: "Câu chuyện", faq: "Hỏi đáp", guidelines: "Nguyên tắc", privacy: "Quyền riêng tư", terms: "Điều khoản",
      guidelinesFull: "Nguyên tắc cộng đồng", langLabel: "Ngôn ngữ",
      tagline: "Một suy nghĩ. Một người lạ. Tin nhắn ẩn danh một chiều dành cho người lớn, từ 995 Studio.",
      emergency: "Đây không phải dịch vụ khẩn cấp. Nếu bạn hoặc người khác đang gặp nguy hiểm, hãy liên hệ dịch vụ khẩn cấp tại địa phương.",
      rights: "© 2026 995 Studio. Bảo lưu mọi quyền. Liên hệ: <a href=\"mailto:support@995studio.com\">support@995studio.com</a>"
    },
    ja: {
      by: "995 Studio 制作", home: "ホーム", story: "ストーリー", faq: "よくある質問", guidelines: "ガイドライン", privacy: "プライバシー", terms: "利用規約",
      guidelinesFull: "コミュニティガイドライン", langLabel: "言語",
      tagline: "ひとつの想い、ひとりの見知らぬ誰か。995 Studio による、大人のための匿名の一方通行メッセージ。",
      emergency: "緊急サービスではありません。あなたや他の誰かに危険が迫っている場合は、地域の緊急サービスに連絡してください。",
      rights: "© 2026 995 Studio. All rights reserved. お問い合わせ：<a href=\"mailto:support@995studio.com\">support@995studio.com</a>"
    },
    de: {
      by: "von 995 Studio", home: "Start", story: "Geschichte", faq: "FAQ", guidelines: "Richtlinien", privacy: "Datenschutz", terms: "Bedingungen",
      guidelinesFull: "Community-Richtlinien", langLabel: "Sprache",
      tagline: "Ein Gedanke. Ein fremder Mensch. Anonyme Einweg-Nachrichten für Erwachsene, von 995 Studio.",
      emergency: "Kein Notdienst. Wenn du oder jemand anderes in Gefahr ist, wende dich an den örtlichen Notdienst.",
      rights: "© 2026 995 Studio. Alle Rechte vorbehalten. Kontakt: <a href=\"mailto:support@995studio.com\">support@995studio.com</a>"
    }
  };
  var TAGS = { en: "en", fr: "fr", es: "es", zh: "zh-CN", vi: "vi", ja: "ja", de: "de" };
  var KEY = "oms-legal-lang";

  var select = document.getElementById("page-lang");
  var json = document.getElementById("page-i18n");
  var page = {};
  try { page = json ? JSON.parse(json.textContent) : {}; } catch (e) { page = {}; }
  var nodes = document.querySelectorAll("[data-i18n]");
  var labelled = document.querySelectorAll("[data-i18n-label]");

  // English, as written in the page.
  var en = { title: document.title, text: {}, label: {} };
  nodes.forEach(function (n) { en.text[n.getAttribute("data-i18n")] = n.innerHTML; });
  labelled.forEach(function (n) { en.label[n.getAttribute("data-i18n-label")] = n.getAttribute("aria-label"); });

  function lookup(code, key, kind) {
    if (code === "en") return null;
    if (key.indexOf("c.") === 0) return (COMMON[code] || {})[key.slice(2)];
    var p = page[code];
    return p && p[kind] ? p[kind][key] : null;
  }

  var current = "en";
  function apply(code, save) {
    if (!TAGS[code]) code = "en";
    if (code !== current) {
      nodes.forEach(function (n) {
        var k = n.getAttribute("data-i18n"), t = lookup(code, k, "text");
        n.innerHTML = t != null ? t : en.text[k];
      });
      labelled.forEach(function (n) {
        var k = n.getAttribute("data-i18n-label"), t = lookup(code, k, "label");
        n.setAttribute("aria-label", t != null ? t : en.label[k]);
      });
      current = code;
    }
    document.documentElement.lang = TAGS[code];
    document.title = (code !== "en" && page[code] && page[code].title) || en.title;
    if (select) select.value = code;
    window.OMS_LANG = code;
    if (save) {
      try { localStorage.setItem(KEY, code); } catch (e) {}
      try {
        var u = new URL(location.href);
        if (code === "en") u.searchParams.delete("lang"); else u.searchParams.set("lang", code);
        history.replaceState(null, "", u);
      } catch (e) {}
      document.dispatchEvent(new CustomEvent("oms:lang", { detail: code }));
    }
  }

  function pick() {
    var q = null;
    try { q = new URLSearchParams(location.search).get("lang"); } catch (e) {}
    if (q && TAGS[q]) return q;
    try { var s = localStorage.getItem(KEY); if (s && TAGS[s]) return s; } catch (e) {}
    var nav = navigator.languages || [navigator.language || "en"];
    for (var i = 0; i < nav.length; i++) { var c = String(nav[i]).slice(0, 2).toLowerCase(); if (TAGS[c]) return c; }
    return "en";
  }

  if (select) select.addEventListener("change", function () { apply(select.value, true); });
  var start = pick();
  window.OMS_LANG = start;
  if (start !== "en") {
    apply(start, false);
    // The swapped-in text has the same section ids, so a #link still lands in the right place.
    if (location.hash) {
      var target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
      if (target) target.scrollIntoView();
    }
  }
})();
