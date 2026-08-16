(function(){
  var root = document.querySelector("[data-nw-preview]");
  if (!root) { return; }

  var dailyTexts = [
    "Locked the keys inside the house, which was a great way to keep them extremely safe.",
    "Tried unlocking the front door with the car remote, but the house refused to beep.",
    "Wore the shirt backward all morning, which explained why the day felt behind schedule.",
    "Stepped into a puddle with fresh socks, giving the feet their first indoor swimming lesson.",
    "Picked the slowest checkout line, where the groceries aged enough to qualify as antiques.",
    "Forgot the coffee inside the microwave, so breakfast quietly became an archaeological discovery.",
    "Opened chips during a silent meeting, and the wrapper immediately requested lead vocals.",
    "Searched everywhere for the phone while holding it, proving the search had excellent mobile coverage.",
    "Reset the password and forgot it instantly, achieving maximum security against the account owner.",
    "Chose the shopping cart with one bad wheel, making every aisle a turn by turn adventure.",
    "Sat on the squeaky chair during silence, and accidentally chaired the entire conversation.",
    "Carried an umbrella through perfect sunshine, keeping it open to future career opportunities.",
    "Dropped toast butter side down, apparently breakfast was trying to butter up the floor.",
    "Missed the elevator by one second, taking disappointment to an entirely different level.",
    "Put both earbuds in, then discovered only the left one believed in equal rights.",
    "Printed one page and received twelve because the printer enjoyed making copies of itself.",
    "Spilled coffee on the keyboard, giving the computer its first proper Java update.",
    "Took a shortcut and arrived later, successfully turning less distance into more experience.",
    "Forgot the grocery list because memory offers curbside pickup only after reaching home.",
    "Set the alarm for evening instead of morning, giving punctuality the night shift."
  ];

  var stickerFiles = [
    "01-daily-life-trash.png", "02-tiny-inconvenience-big-impact.png", "03-complain-responsibly.png", "04-not-you-nice.png", "05-for-real.png",
    "06-oh-no.png", "07-oh-man.png", "08-really.png", "09-come-on-man.png", "10-well-thats-rude.png",
    "11-absolutely-not.png", "12-of-course.png", "13-why-though.png", "14-very-unfortunate.png", "15-barely-survived.png",
    "16-mood-dampened.png", "17-minor-tragedy.png", "18-personal-attack.png", "19-this-again.png", "20-im-fine.png"
  ].map(function(file){ return "assets/gallery/transparent-stickers/" + file; });

  var tapeFiles = [
    "tape-sticker-01-classic-orange.png", "tape-sticker-02-mustard-polka-dot.png", "tape-sticker-03-coral-checker.png", "tape-sticker-04-turquoise-speed-stripe.png", "tape-sticker-05-purple-starburst.png",
    "tape-sticker-06-hot-pink-confetti.png", "tape-sticker-07-lime-zigzag.png", "tape-sticker-08-hazard-stripe.png", "tape-sticker-09-graph-paper.png", "tape-sticker-10-kraft-paper.png",
    "tape-sticker-11-pastel-rainbow.png", "tape-sticker-12-midnight-stars.png", "tape-sticker-13-comic-flames.png", "tape-sticker-14-abstract-camouflage.png", "tape-sticker-15-vintage-halftone.png",
    "tape-sticker-16-retro-racing-stripes.png", "tape-sticker-17-blue-confetti.png", "tape-sticker-18-antique-gold-crinkle.png", "tape-sticker-19-red-tartan.png", "tape-sticker-20-orange-lightning.png"
  ].map(function(file){ return "assets/gallery/tape-stickers/" + file; });

  var homeArtFiles = ["001", "002", "003", "005", "006", "007", "008", "009", "010", "011", "012", "014", "015", "016", "017", "018", "019", "020", "021", "022"]
    .map(function(file){ return "assets/gallery/reactions/" + file + ".png"; });

  var whateverSentences = [
    "Be prepared, today looks suspiciously pleased with itself.",
    "Be prepared, the universe has started whispering again.",
    "Be prepared, something inconvenient feels unusually confident.",
    "Be prepared, today brought extra nonsense for you.",
    "Be prepared, your timing may require emotional support.",
    "Be prepared, the odds are stretching before work.",
    "Be prepared, today seems proud of its plans.",
    "Be prepared, your patience just received a calendar invite.",
    "Be prepared, the universe cleared its schedule for you.",
    "Be prepared, today has been practicing that look.",
    "It is time, so lower your eyebrows carefully.",
    "It is time, and today seems suspiciously ready.",
    "It is time, your questionable timing has awakened.",
    "It is time, even though the universe looks amused.",
    "It is time, so keep your patience fully charged.",
    "It is time, and nonsense knows your full name.",
    "It is time, your calm should remain cautiously optimistic.",
    "It is time, and today already looks complicated.",
    "It is time, your inner warning light feels chatty.",
    "It is time, so act surprised when necessary."
  ];

  var nopeSentences = [
    "Not today, you are officially safe",
    "Please relax, today decided to behave",
    "Good news, today forgot to bother you",
    "Let us go, you are finally free",
    "Nice work, you escaped today's nonsense",
    "Haha relax, you got suspiciously lucky today",
    "Stay calm, the universe missed you this time",
    "You are saved, today can look elsewhere",
    "Well played, bad luck lost your address",
    "Victory confirmed, you are safe for now",
    "Not this time, you slipped past the nonsense",
    "Lucky you, today forgot its dramatic entrance",
    "Breathe easy, the weirdness has been redirected",
    "Safe again, your timing finally learned something",
    "Look at you, escaping trouble with accidental elegance",
    "Freedom achieved, you may celebrate very quietly",
    "Crisis avoided, you remain wonderfully untouched",
    "Congratulations, today has released you early",
    "Nice escape, the universe looked the other way",
    "All clear, you can lower one eyebrow"
  ];

  var whateverArtFiles = numberFiles("assets/gallery/carefree/", 20);
  var nopeArtFiles = numberFiles("assets/gallery/lucky-escape/", 20);
  var state = { lockedChoice: null, home: null, result: null };

  function numberFiles(path, count) {
    var files = [];
    for (var index = 1; index <= count; index += 1) {
      files.push(path + String(index).padStart(3, "0") + ".png");
    }
    return files;
  }

  function pick(items) {
    return items[Math.floor(Math.random() * items.length)];
  }

  function pickMany(items, count) {
    var source = items.slice();
    var selected = [];
    while (selected.length < count && source.length) {
      selected.push(source.splice(Math.floor(Math.random() * source.length), 1)[0]);
    }
    return selected;
  }

  function splitTwoPart(sentence) {
    var comma = sentence.indexOf(",");
    if (comma === -1) {
      return { lead: sentence, detail: "" };
    }
    return {
      lead: sentence.slice(0, comma).trim(),
      detail: sentence.slice(comma + 1).trim()
    };
  }

  function setImage(selector, src, alt) {
    var image = root.querySelector(selector);
    if (!image) { return; }
    image.src = src;
    image.alt = alt || "";
  }

  function setText(selector, text) {
    var element = root.querySelector(selector);
    if (element) { element.textContent = text; }
  }

  function newHomeContent() {
    var stickers = pickMany(stickerFiles, 4);
    return {
      sentence: pick(dailyTexts),
      stickers: stickers,
      middleSticker: stickers[3] || pick(stickerFiles),
      tape: pick(tapeFiles),
      art: pick(homeArtFiles)
    };
  }

  function renderHomeContent() {
    var content = state.home;
    setText("[data-nw-daily-text]", content.sentence);
    content.stickers.slice(0, 3).forEach(function(src, index){
      setImage('[data-nw-sticker="' + index + '"]', src, "");
    });
    setImage("[data-nw-middle-sticker]", content.middleSticker, "");
    setImage("[data-nw-tape]", content.tape, "");
    setImage("[data-nw-bottom-art]", content.art, "Daily Nothing Worse reaction");
    root.querySelector("[data-nw-choice-row]").hidden = !!state.lockedChoice;
    root.querySelector("[data-nw-locked]").hidden = !state.lockedChoice;
    if (state.lockedChoice) {
      setText("[data-nw-locked-message]", state.lockedChoice === "fine"
        ? "You welcomed today’s challenge. Come back tomorrow for a fresh choice."
        : "You chose a chill day today. Come back tomorrow for a fresh choice.");
    }
  }

  function showHome() {
    root.querySelector("[data-nw-home]").hidden = false;
    root.querySelector("[data-nw-result]").hidden = true;
    renderHomeContent();
  }

  function newResult(choice) {
    var isNope = choice === "nope";
    var twoPart = splitTwoPart(pick(isNope ? nopeSentences : whateverSentences));
    return {
      choice: choice,
      lead: twoPart.lead + (twoPart.lead.endsWith(".") ? "" : "."),
      detail: twoPart.detail ? twoPart.detail.charAt(0).toUpperCase() + twoPart.detail.slice(1) : "",
      sticker: state.home.stickers[0] || pick(stickerFiles),
      tape: state.home.tape,
      art: pick(isNope ? nopeArtFiles : whateverArtFiles),
      title: isNope ? "LUCKY ESCAPE" : "TODAY’S WARNING",
      button: isNope ? "Nice. I’m safe." : "Fine. Whatever."
    };
  }

  function showResult(choice) {
    state.result = newResult(choice);
    var resultPanel = root.querySelector("[data-nw-result-panel]");
    resultPanel.classList.toggle("is-nope", choice === "nope");
    resultPanel.classList.toggle("is-fine", choice !== "nope");
    setText("[data-nw-result-title]", state.result.title);
    setText("[data-nw-result-lead]", state.result.lead);
    setText("[data-nw-result-detail]", state.result.detail);
    setText("[data-nw-result-done]", state.result.button);
    setImage("[data-nw-result-sticker]", state.result.sticker, "");
    setImage("[data-nw-result-tape]", state.result.tape, "");
    setImage("[data-nw-result-art]", state.result.art, choice === "nope" ? "Lucky escape reaction" : "Carefree Nothing Worse reaction");
    root.querySelector("[data-nw-home]").hidden = true;
    root.querySelector("[data-nw-result]").hidden = false;
  }

  function replay() {
    state.lockedChoice = null;
    state.home = newHomeContent();
    showHome();
  }

  root.querySelectorAll("[data-nw-choice]").forEach(function(button){
    button.addEventListener("click", function(){
      showResult(button.getAttribute("data-nw-choice"));
    });
  });

  root.querySelector("[data-nw-result-done]").addEventListener("click", function(){
    state.lockedChoice = state.result.choice;
    showHome();
  });

  root.querySelector("[data-nw-replay]").addEventListener("click", replay);

  state.home = newHomeContent();
  showHome();
})();