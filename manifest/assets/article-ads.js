(() => {
  const adClient = "ca-pub-6323069774159564";
  const adSlot = "8670461960";
  const articleAdCount = 2;
  const adsenseSrc = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adClient}`;

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

  function createAdBanner() {
    const wrapper = document.createElement("div");
    wrapper.className = "ad-banner article-ad-banner";
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
    } catch (error) {
      // Ad blockers or AdSense timing can prevent rendering; keep article content unaffected.
    }
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

      target.insertAdjacentElement("afterend", createAdBanner());
      pushAd();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", insertArticleAds);
  } else {
    insertArticleAds();
  }
})();