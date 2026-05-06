const VN = (() => {

  let config = {
    background: "",
    text: [],
    next: null,
    prev: null
  };

  let lineIndex = 0;
  let charIndex = 0;
  let typing = false;
  let waiting = false;

  let bgEl, containerEl, textEl, navEl;

  let audio;

  // INIT
  function init(userConfig) {
    config = userConfig;

    injectFont();
    createLayout();
    setBackground();
    setupAudio();
    setupNavigation();

    document.addEventListener("click", handleClick);

    startLine();
  }

  // FONT FIX (IMPORTANT)
  function injectFont() {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=VT323&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);

    document.body.style.fontFamily = "'VT323', monospace";
  }

  // LAYOUT
  function createLayout() {
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.body.style.height = "100vh";
    document.body.style.overflow = "hidden";
    document.body.style.backgroundColor = "#00084f";

    // BACKGROUND IMAGE
    bgEl = document.createElement("div");
    bgEl.style.position = "absolute";
    bgEl.style.inset = "0";
    bgEl.style.backgroundSize = "cover";
    bgEl.style.backgroundPosition = "center";
    bgEl.style.zIndex = "0";
    document.body.appendChild(bgEl);

    // MAIN WRAPPER (IMPORTANT FIX)
    const wrapper = document.createElement("div");
    wrapper.style.position = "relative";
    wrapper.style.zIndex = "2";
    wrapper.style.height = "100vh";
    wrapper.style.display = "flex";
    wrapper.style.flexDirection = "column";
    wrapper.style.justifyContent = "flex-end";

    // TEXTBOX
    containerEl = document.createElement("div");
    containerEl.style.width = "100%";
    containerEl.style.boxSizing = "border-box";
    containerEl.style.padding = "25px 30px";

    containerEl.style.background = "rgba(0, 8, 79, 0.75)";
    containerEl.style.borderTop = "2px solid rgba(255,255,255,0.2)";
    containerEl.style.color = "#f2f2f2";

    // TEXT
    textEl = document.createElement("div");
    textEl.style.fontSize = "28px";
    textEl.style.lineHeight = "1.5";
    textEl.style.minHeight = "120px";

    containerEl.appendChild(textEl);
    wrapper.appendChild(containerEl);
    document.body.appendChild(wrapper);
  }

  // BACKGROUND FIX
  function setBackground() {
    if (config.background && bgEl) {
      bgEl.style.backgroundImage = `url('${config.background}')`;
    }
  }

  // AUDIO
  function setupAudio() {
    audio = new Audio("type.mp3");
    audio.volume = 0.4;
  }

  function playSound() {
    if (!audio) return;
    audio.currentTime = 0;
    audio.play().catch(() => {});
  }

  // TEXT SYSTEM
  function startLine() {
    if (lineIndex >= config.text.length) return;

    charIndex = 0;
    typing = true;

    const span = document.createElement("span");
    textEl.appendChild(span);

    typeChar(span);
  }

  function typeChar(span) {
    const line = config.text[lineIndex];

    if (charIndex < line.length) {
      span.innerHTML += line[charIndex];
      playSound();

      charIndex++;
      setTimeout(() => typeChar(span), 25);
    } else {
      textEl.innerHTML += "<br><br>";
      typing = false;
      waiting = true;
    }
  }

  // CLICK CONTROL (skip + advance)
  function handleClick() {

    if (typing) {
      const spans = textEl.querySelectorAll("span");
      const currentSpan = spans[spans.length - 1];

      currentSpan.innerHTML = config.text[lineIndex];

      typing = false;
      waiting = true;
      textEl.innerHTML += "<br><br>";

      return;
    }

    if (waiting) {
      waiting = false;
      lineIndex++;
      startLine();
    }
  }

  // NAVIGATION
  function setupNavigation() {
    const nav = document.createElement("div");
    nav.style.display = "flex";
    nav.style.justifyContent = "space-between";
    nav.style.marginTop = "10px";
    nav.style.fontSize = "22px";
    nav.style.color = "#fff";

    const prev = document.createElement("a");
    const next = document.createElement("a");

    prev.innerText = "back";
    next.innerText = "next";

    prev.style.cursor = config.prev ? "pointer" : "default";
    next.style.cursor = config.next ? "pointer" : "default";

    prev.style.opacity = config.prev ? "1" : "0.3";
    next.style.opacity = config.next ? "1" : "0.3";

    prev.onclick = () => config.prev && (window.location.href = config.prev);
    next.onclick = () => config.next && (window.location.href = config.next);

    nav.appendChild(prev);
    nav.appendChild(next);

    containerEl.appendChild(nav);
  }

  return { init };

})();
