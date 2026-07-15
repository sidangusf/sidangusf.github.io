(() => {
  const adClient = "ca-pub-6323069774159564";
  const adSlot = "8670461960";
  const articleAdCount = 2;
  const adStatusTimeout = 8000;
  const adsenseSrc = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adClient}`;

  function normalizePagePath(pathname) {
    const path = pathname.replace(/\/+$/, "");
    if (!path) {
      return "/index.html";
    }

    const lastSegment = path.split("/").pop();
    if (lastSegment && !lastSegment.includes(".")) {
      return `${path}/index.html`;
    }

    return path;
  }

  function isBlogArticlePath(path) {
    return /\/blog\/[^/]+\.html$/.test(path);
  }

  function markCurrentNavLinks() {
    const currentPath = normalizePagePath(window.location.pathname);
    const isBlogArticle = isBlogArticlePath(currentPath);

    document.querySelectorAll(".nav .links a, .footer .links a").forEach((link) => {
      const linkUrl = new URL(link.getAttribute("href"), window.location.href);
      if (linkUrl.origin !== window.location.origin) {
        return;
      }

      const linkPath = normalizePagePath(linkUrl.pathname);
      const isExactPage = linkPath === currentPath;
      const isCurrentSection = isBlogArticle && /\/blog\.html$/.test(linkPath);

      if (!isExactPage && !isCurrentSection) {
        return;
      }

      link.classList.add("is-current");
      link.setAttribute("aria-current", isExactPage ? "page" : "location");
    });
  }

  function ensureAdsenseScript() {
    const existingScript = document.querySelector('script[src^="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"]');
    if (existingScript) {
      return;
    }

    const script = document.createElement("script");
    script.async = true;
    script.src = adsenseSrc;
    script.crossOrigin = "anonymous";
    document.head.appendChild(script);
  }

  function createAdBanner(placementClass) {
    const wrapper = document.createElement("div");
    wrapper.className = `ad-banner ${placementClass} ad-banner-pending`;
    wrapper.setAttribute("aria-label", "Advertisement");

    const label = document.createElement("div");
    label.className = "ad-label";
    label.textContent = "Advertisement";

    const ad = document.createElement("ins");
    ad.className = "adsbygoogle";
    ad.style.display = "block";
    ad.setAttribute("data-ad-client", adClient);
    ad.setAttribute("data-ad-slot", adSlot);
    ad.setAttribute("data-ad-format", "auto");
    ad.setAttribute("data-full-width-responsive", "true");

    wrapper.appendChild(label);
    wrapper.appendChild(ad);
    return wrapper;
  }

  function pushAd() {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      return true;
    } catch (error) {
      // Ad blockers or AdSense timing can prevent rendering; keep article content unaffected.
      return false;
    }
  }

  function watchAdBanner(wrapper, ad, removeTarget = wrapper) {
    if (!ad) {
      removeTarget.remove();
      return;
    }

    let isComplete = false;
    let timeoutId;

    const finish = (isFilled) => {
      if (isComplete) {
        return;
      }

      isComplete = true;
      observer.disconnect();
      window.clearTimeout(timeoutId);

      if (isFilled) {
        wrapper.classList.remove("ad-banner-pending");
      } else {
        removeTarget.remove();
      }
    };

    const checkStatus = () => {
      const status = ad.getAttribute("data-ad-status");
      if (status === "filled") {
        finish(true);
      } else if (status === "unfilled") {
        finish(false);
      }
    };

    const observer = new MutationObserver(checkStatus);
    observer.observe(ad, { attributes: true, attributeFilter: ["data-ad-status"] });

    timeoutId = window.setTimeout(() => {
      finish(ad.getAttribute("data-ad-status") === "filled");
    }, adStatusTimeout);

    checkStatus();
  }

  function getArticleBlocks(article) {
    return Array.from(article.children).filter((child) => {
      return child.matches("p, h2, blockquote, ul, ol") && !child.classList.contains("blog-downloads");
    });
  }

  function getEvenInsertionIndexes(blocks) {
    const step = blocks.length / (articleAdCount + 1);
    const indexes = [];

    for (let adNumber = 1; adNumber <= articleAdCount; adNumber += 1) {
      const index = Math.min(
        blocks.length - 1,
        Math.max(1, Math.round(step * adNumber) - 1)
      );

      if (!indexes.includes(index)) {
        indexes.push(index);
      }
    }

    return indexes;
  }

  function insertArticleAds() {
    const article = document.querySelector("article.article");
    if (!article || article.querySelector(".article-ad-banner")) {
      return;
    }

    const blocks = getArticleBlocks(article);
    if (blocks.length < 4) {
      return;
    }

    ensureAdsenseScript();

    getEvenInsertionIndexes(blocks).forEach((index) => {
      const target = blocks[index];
      if (!target) {
        return;
      }

      const banner = createAdBanner("article-ad-banner");
      const ad = banner.querySelector(".adsbygoogle");

      target.insertAdjacentElement("afterend", banner);

      if (pushAd()) {
        watchAdBanner(banner, ad);
      } else {
        banner.remove();
      }
    });
  }

  function insertGalleryAds() {
    const gallery = document.querySelector(".gallery-grid");
    if (!gallery || gallery.querySelector(".gallery-ad-banner")) {
      return;
    }

    const cards = Array.from(gallery.children).filter((child) => child.matches(".gallery-card"));
    if (cards.length < 4) {
      return;
    }

    ensureAdsenseScript();

    getEvenInsertionIndexes(cards).forEach((index) => {
      const target = cards[index];
      if (!target) {
        return;
      }

      const banner = createAdBanner("gallery-ad-banner");
      const ad = banner.querySelector(".adsbygoogle");

      target.insertAdjacentElement("afterend", banner);

      if (pushAd()) {
        watchAdBanner(banner, ad);
      } else {
        banner.remove();
      }
    });
  }

  function insertFaqAds() {
    const faqItems = Array.from(document.querySelectorAll(".article-page .faq-item"));
    if (faqItems.length < 6 || document.querySelector(".faq-ad-banner")) {
      return;
    }

    ensureAdsenseScript();

    getEvenInsertionIndexes(faqItems).forEach((index) => {
      const target = faqItems[index];
      if (!target) {
        return;
      }

      const banner = createAdBanner("faq-ad-banner");
      const ad = banner.querySelector(".adsbygoogle");

      target.insertAdjacentElement("afterend", banner);

      if (pushAd()) {
        watchAdBanner(banner, ad);
      } else {
        banner.remove();
      }
    });
  }

  function insertAds() {
    markCurrentNavLinks();
    insertArticleAds();
    insertGalleryAds();
    insertFaqAds();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", insertAds);
  } else {
    insertAds();
  }
})();