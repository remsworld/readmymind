const VN = (() => {

  let config = {
    background: "",
    text: [],
    next: null,
    prev: null,
    typeSound: "../../assets/typing.mp3" 
  };

  let lineIndex = 0;
  let charIndex = 0;
  let typing = false;
  let waiting = false;
  let lastSoundTime = 0;

  let bgEl, containerEl, textEl;

let audioCache = {};

function getAudio(src) {
  if (!audioCache[src]) {
    audioCache[src] = new Audio(src);
    audioCache[src].volume = 0.4;
  }
  return audioCache[src];
}

  // INIT
  function init(userConfig) {
    config = { ...config, ...userConfig }; // merge safely

    injectFont();
    createLayout();
    setBackground();
    
    setupNavigation();

    document.addEventListener("click", handleClick);

    startLine();
  }

let currentSpan = null;
  
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

    // BACKGROUND
    bgEl = document.createElement("div");
    bgEl.style.position = "absolute";
    bgEl.style.inset = "0";
    bgEl.style.backgroundSize = "cover";
    bgEl.style.backgroundPosition = "center";
    bgEl.style.zIndex = "0";
    document.body.appendChild(bgEl);

    // WRAPPER
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

  // BACKGROUND
  function setBackground() {
    if (config.background && bgEl) {
      bgEl.style.backgroundImage = `url('${config.background}')`;
    }
  }

  // AUDIO (UPDATED)
function playSound() {
  const lineObj = config.text[lineIndex];
  const soundSrc = typeof lineObj === "object"
    ? lineObj.sound
    : config.typeSound;

  if (!soundSrc) return;

  const audio = getAudio(soundSrc);
  audio.currentTime = 0;
  audio.play().catch(() => {});
}

  

  // TEXT SYSTEM
 function startLine() {
  if (lineIndex >= config.text.length) return;

  charIndex = 0;
  typing = true;


   
  const span = document.createElement("span");
  currentSpan = span; // 💡 TRACK IT PROPERLY

  textEl.appendChild(span);

  typeChar(span);
}

 function typeChar(span) {
  const lineObj = config.text[lineIndex];
const line = typeof lineObj === "object" ? lineObj.line : lineObj;

  if (charIndex < line.length) {

    span.innerHTML += line[charIndex];

    // 🔊 play sound per character
    playTypeSound();

    charIndex++;
    setTimeout(() => typeChar(span), 25);

  } else {

    typing = false;
    waiting = true;
    textEl.innerHTML += "<br><br>";
  }
}

  // CLICK CONTROL
 function handleClick() {

  // unlock audio on first user interaction
  if (!audioUnlocked) {
    audioUnlocked = true;
  }

  // SKIP typing
 if (typing) {

  if (!currentSpan) return;

  currentSpan.innerHTML = config.text[lineIndex];

  typing = false;
  waiting = true;
  textEl.innerHTML += "<br><br>";

  return;
}

  // NEXT line
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
