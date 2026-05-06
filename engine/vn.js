const VN = (() => {

  let config = {
    background: "",
    text: [],
    next: null,
    prev: null,
    typeSound: "../../assets/typing.mp3"
    folderChain: null
  };

  let lineIndex = 0;
  let charIndex = 0;
  let typing = false;
  let waiting = false;

  let audioUnlocked = false;

  let bgEl, containerEl, textEl;

  let audioCache = {};
  let currentAudio = null;

  let currentSpan = null;

let folderIndex = 0;
let folderActive = false;

  // INIT
  function init(userConfig) {
    config = { ...config, ...userConfig };

    injectFont();
    createLayout();
    setBackground();
    setupNavigation();

    document.addEventListener("click", handleClick);

    startLine();
  }

  // FONT
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

    bgEl = document.createElement("div");
    bgEl.style.position = "absolute";
    bgEl.style.inset = "0";
    bgEl.style.backgroundSize = "cover";
    bgEl.style.backgroundPosition = "center";
    bgEl.style.zIndex = "0";
    document.body.appendChild(bgEl);

    const wrapper = document.createElement("div");
    wrapper.style.position = "relative";
    wrapper.style.zIndex = "2";
    wrapper.style.height = "100vh";
    wrapper.style.display = "flex";
    wrapper.style.flexDirection = "column";
    wrapper.style.justifyContent = "flex-end";

    containerEl = document.createElement("div");
    containerEl.style.width = "100%";
    containerEl.style.boxSizing = "border-box";
    containerEl.style.padding = "25px 30px";
    containerEl.style.background = "rgba(0, 8, 79, 0.75)";
    containerEl.style.borderTop = "2px solid rgba(255,255,255,0.2)";
    containerEl.style.color = "#f2f2f2";

    textEl = document.createElement("div");
    textEl.style.fontSize = "28px";
    textEl.style.lineHeight = "1.5";
    textEl.style.minHeight = "120px";

    containerEl.appendChild(textEl);
    wrapper.appendChild(containerEl);
    document.body.appendChild(wrapper);
  }

  // BACKGROUND
  function setBackground() {
    if (config.background && bgEl) {
      bgEl.style.backgroundImage = `url('${config.background}')`;
    }
  }

  // AUDIO SYSTEM
  function getAudio(src) {
    if (!audioCache[src]) {
      audioCache[src] = new Audio(src);
      audioCache[src].loop = true;
      audioCache[src].volume = 0.4;
    }
    return audioCache[src];
  }

  function playTypingSound() {
    if (!audioUnlocked) return;

    const lineObj = config.text[lineIndex];
    const soundSrc = typeof lineObj === "object"
      ? lineObj.sound
      : config.typeSound;

    if (!soundSrc) return;

    if (currentAudio && currentAudio.src !== soundSrc) {
      currentAudio.pause();
      currentAudio = null;
    }

    currentAudio = getAudio(soundSrc);
    currentAudio.play().catch(() => {});
  }

  function stopTypingSound() {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    }
  }

// SPAWN FOLDERS

function spawnFolderRapid(chain) {
  if (!chain || chain.length === 0) return;

  const spawnNext = () => {

    if (folderIndex >= chain.length) return;

    const folder = document.createElement("div");

    folder.className = "vn-folder";

    folder.style.position = "fixed";
    folder.style.width = "60px";
    folder.style.height = "45px";
    folder.style.background = "#d4b24c";
    folder.style.borderRadius = "6px";
    folder.style.boxShadow = "0 5px 10px rgba(0,0,0,0.4)";
    folder.style.cursor = "pointer";

    folder.style.left = Math.random() * 80 + "vw";
    folder.style.top = Math.random() * 70 + "vh";

    folder.style.opacity = "0";
    folder.style.transform = "scale(0.8)";
    folder.style.transition = "0.2s";

    document.body.appendChild(folder);

    // animate in
    requestAnimationFrame(() => {
      folder.style.opacity = "1";
      folder.style.transform = "scale(1)";
    });

    folder.onclick = () => {
      folder.remove();
      folderIndex++;
      spawnNext(); // next appears immediately after click
    };

    //  rapid fire effect (controls spacing)
    setTimeout(() => {
      if (folderIndex === 0) {
        // first one appears immediately
      }
    }, 120);

  };

  // start first folder
  spawnNext();
}
function onStoryEnd() {
  if (!config.folderChain) return;

  folderIndex = 0;
  folderActive = true;

  spawnFolderRapid(config.folderChain);
}

  // TEXT SYSTEM
  function startLine() {
    if (lineIndex >= config.text.length) return;

    charIndex = 0;
    typing = true;

    const span = document.createElement("span");
    currentSpan = span;

    textEl.appendChild(span);

    // ONLY start sound if already unlocked
    playTypingSound();

    typeChar(span);
  }

  function typeChar(span) {
    const lineObj = config.text[lineIndex];
    const line = typeof lineObj === "object" ? lineObj.line : lineObj;

    if (charIndex < line.length) {

      span.innerHTML += line[charIndex];

      charIndex++;
      setTimeout(() => typeChar(span), 25);

    } else {

     typing = false;
waiting = true;

textEl.innerHTML += "<br><br>";

stopTypingSound();

    }
  }

  // CLICK CONTROL
  function handleClick() {

    // FIRST CLICK UNLOCK
    if (!audioUnlocked) {
      audioUnlocked = true;
      playTypingSound(); // start immediately on first interaction
    }

    if (typing) {

      const lineObj = config.text[lineIndex];
      const line = typeof lineObj === "object" ? lineObj.line : lineObj;

      currentSpan.innerHTML = line;

      typing = false;
      waiting = true;

      stopTypingSound();

      textEl.innerHTML += "<br><br>";
      return;
    }

  if (waiting) {
  waiting = false;
  lineIndex++;

  if (lineIndex >= config.text.length) {
    onStoryEnd();
  } else {
    startLine();
    }
  }

//FOLDER STUFF

function checkFolderTriggers() {

  if (!config.folderChain) return;

  if (folderActive) return;

  folderActive = true;
  folderIndex = 0;

  spawnFolder(config.folderChain);
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
