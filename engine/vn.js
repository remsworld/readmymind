const VN = (() => {

  let config = {
    background: "",
    text: [],
    next: null,
    prev: null
  };

  let lineIndex = 0;
  let charIndex = 0;

  let isTyping = false;
  let isWaitingForNext = false;

  let currentLineEl = "";
  
  let bgEl, textEl, containerEl;
  let audioEl;

  // INIT
  function init(userConfig) {
    config = userConfig;

    createScene();
    setBackground();
    setupAudio();
    setupNavigation();

    document.addEventListener("click", handleClick);

    startLine();
  }

  // -------------------------
  // SCENE SETUP
  // -------------------------
  function createScene() {
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.body.style.fontFamily = "'VT323', monospace";
    document.body.style.overflow = "hidden";
    document.body.style.height = "100vh";

    // BACKGROUND
    bgEl = document.createElement("div");
    bgEl.style.position = "absolute";
    bgEl.style.width = "100%";
    bgEl.style.height = "100%";
    bgEl.style.backgroundSize = "cover";
    bgEl.style.backgroundPosition = "center";
    bgEl.style.filter = "brightness(0.75)";
    document.body.appendChild(bgEl);

    // TEXTBOX (dating sim style)
    containerEl = document.createElement("div");
    containerEl.style.position = "absolute";
    containerEl.style.bottom = "0";
    containerEl.style.left = "0";
    containerEl.style.width = "100%";

    containerEl.style.padding = "30px";
    containerEl.style.boxSizing = "border-box";

    containerEl.style.background = "rgba(0, 8, 79, 0.75)";
    containerEl.style.borderTop = "2px solid rgba(255,255,255,0.2)";

    // TEXT
    textEl = document.createElement("div");
    textEl.style.fontSize = "28px";
    textEl.style.lineHeight = "1.5";
    textEl.style.color = "#f2f2f2";
    textEl.style.minHeight = "120px";

    containerEl.appendChild(textEl);
    document.body.appendChild(containerEl);
  }

  // -------------------------
  // BACKGROUND
  // -------------------------
  function setBackground() {
    if (bgEl && config.background) {
      bgEl.style.backgroundImage = `url('${config.background}')`;
    }
  }

  // -------------------------
  // AUDIO
  // -------------------------
  function setupAudio() {
    audioEl = new Audio("type.mp3");
    audioEl.volume = 0.4;
  }

  function playSound() {
    if (!audioEl) return;
    audioEl.currentTime = 0;
    audioEl.play().catch(() => {});
  }

  // -------------------------
  // TEXT SYSTEM
  // -------------------------
  function startLine() {
    if (lineIndex >= config.text.length) return;

    currentLineEl = document.createElement("span");
    textEl.appendChild(currentLineEl);

    charIndex = 0;
    isTyping = true;
    typeChar();
  }

  function typeChar() {
    const line = config.text[lineIndex];

    if (!line) return;

    if (charIndex < line.length) {
      currentLineEl.innerHTML += line[charIndex];
      playSound();

      charIndex++;
      setTimeout(typeChar, 25);
    } else {
      isTyping = false;
      isWaitingForNext = true;

      // paragraph spacing
      textEl.innerHTML += "<br><br>";
    }
  }

  // -------------------------
  // CLICK LOGIC (SKIP + ADVANCE)
  // -------------------------
  function handleClick() {

    // 1. IF CURRENT LINE IS TYPING → SKIP TO FULL LINE
    if (isTyping) {
      const line = config.text[lineIndex];
      currentLineEl.innerHTML = line;

      isTyping = false;
      isWaitingForNext = true;

      textEl.innerHTML += "<br><br>";
      return;
    }

    // 2. IF DONE TYPING LINE → GO NEXT LINE
    if (isWaitingForNext) {
      isWaitingForNext = false;
      lineIndex++;

      startLine();
    }
  }

  // -------------------------
  // NAVIGATION
  // -------------------------
  function setupNavigation() {
    const nav = document.createElement("div");
    nav.style.display = "flex";
    nav.style.justifyContent = "space-between";
    nav.style.marginTop = "20px";
    nav.style.fontSize = "22px";
    nav.style.color = "#ffffff";

    const prev = document.createElement("a");
    const next = document.createElement("a");

    prev.innerText = "back";
    next.innerText = "next";

    prev.style.cursor = config.prev ? "pointer" : "default";
    next.style.cursor = config.next ? "pointer" : "default";

    prev.style.opacity = config.prev ? "1" : "0.3";
    next.style.opacity = config.next ? "1" : "0.3";

    prev.onclick = () => {
      if (config.prev) window.location.href = config.prev;
    };

    next.onclick = () => {
      if (config.next) window.location.href = config.next;
    };

    nav.appendChild(prev);
    nav.appendChild(next);

    containerEl.appendChild(nav);
  }

  return { init };

})();
