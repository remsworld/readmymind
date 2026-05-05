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
  let displayedText = "";

  let bgEl, textEl, containerEl, navEl;
  let audioEl;

  // INIT
  function init(userConfig) {
    config = userConfig;

    createScene();
    setBackground();
    setupAudio();
    setupNavigation();

    document.addEventListener("click", handleClick);

    typeLine();
  }

  // CREATE BASIC STRUCTURE
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
    bgEl.style.filter = "brightness(0.7)";
    document.body.appendChild(bgEl);

    // CENTER WRAPPER
    const wrapper = document.createElement("div");
    wrapper.style.position = "relative";
    wrapper.style.zIndex = "2";
    wrapper.style.width = "70%";
    wrapper.style.maxWidth = "800px";
    wrapper.style.margin = "auto";
    wrapper.style.top = "50%";
    wrapper.style.transform = "translateY(-50%)";

    // TEXT BOX
    containerEl = document.createElement("div");
    containerEl.style.background = "rgba(245,245,245,0.95)";
    containerEl.style.padding = "40px";
    containerEl.style.boxShadow = "0 0 25px rgba(0,0,0,0.4)";
    containerEl.style.boxSizing = "border-box";

    textEl = document.createElement("div");
    textEl.style.fontSize = "28px";
    textEl.style.lineHeight = "1.4";
    textEl.style.color = "#111";
    textEl.style.minHeight = "200px";

    containerEl.appendChild(textEl);

    wrapper.appendChild(containerEl);
    document.body.appendChild(wrapper);
  }

  // BACKGROUND
  function setBackground() {
    if (bgEl && config.background) {
      bgEl.style.backgroundImage = `url('${config.background}')`;
    }
  }

  // AUDIO
  function setupAudio() {
    audioEl = new Audio("type.mp3");
    audioEl.volume = 0.4;
  }

  function playSound() {
    if (!audioEl) return;
    audioEl.currentTime = 0;
    audioEl.play().catch(() => {});
  }

  // TYPE SYSTEM
  function typeLine() {
    if (lineIndex >= config.text.length) return;

    const line = config.text[lineIndex];

    if (charIndex < line.length) {
      displayedText += line[charIndex];
      textEl.innerHTML = displayedText;

      playSound();

      charIndex++;
      setTimeout(typeLine, 35);
    } else {
      displayedText += "<br><br>";
      textEl.innerHTML = displayedText;
      isTyping = false;
    }
  }

  function handleClick() {
    if (isTyping) return;

    if (lineIndex < config.text.length - 1) {
      isTyping = true;
      charIndex = 0;
      lineIndex++;
      typeLine();
    }
  }

  // NAVIGATION
  function setupNavigation() {
    const nav = document.createElement("div");
    nav.style.display = "flex";
    nav.style.justifyContent = "space-between";
    nav.style.marginTop = "25px";
    nav.style.fontSize = "22px";

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
