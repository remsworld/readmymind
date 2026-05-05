const VN = (() => {

  let config = {
    background: "",
    text: []
  };

  let currentLine = 0;
  let currentChar = 0;
  let isTyping = false;
  let displayedText = "";

  // Create DOM elements once
  let bgEl, textEl, hintEl, audioEl;

  function init(userConfig) {
    config = userConfig;

    setupDOM();
    setupBackground();
    setupAudio();

    document.addEventListener("click", next);
    typeLine();
  }

  function setupDOM() {
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.body.style.fontFamily = "'VT323', monospace";
    document.body.style.overflow = "hidden";

    // Background
    bgEl = document.createElement("div");
    bgEl.style.position = "absolute";
    bgEl.style.width = "100%";
    bgEl.style.height = "100%";
    bgEl.style.backgroundSize = "cover";
    bgEl.style.backgroundPosition = "center";
    bgEl.style.filter = "brightness(0.7)";
    document.body.appendChild(bgEl);

    // Container
    const container = document.createElement("div");
    container.style.position = "relative";
    container.style.zIndex = "2";
    container.style.width = "70%";
    container.style.maxWidth = "800px";
    container.style.margin = "auto";
    container.style.top = "50%";
    container.style.transform = "translateY(-50%)";
    container.style.background = "rgba(245,245,245,0.95)";
    container.style.padding = "40px";
    container.style.boxShadow = "0 0 25px rgba(0,0,0,0.4)";
    document.body.appendChild(container);

    // Text
    textEl = document.createElement("div");
    textEl.style.fontSize = "28px";
    textEl.style.lineHeight = "1.4";
    textEl.style.color = "#111";
    textEl.style.minHeight = "200px";

    // Hint
    hintEl = document.createElement("div");
    hintEl.innerText = "click to continue";
    hintEl.style.marginTop = "20px";
    hintEl.style.fontSize = "18px";
    hintEl.style.opacity = "0.6";

    container.appendChild(textEl);
    container.appendChild(hintEl);
  }

  function setupBackground() {
    if (bgEl && config.background) {
      bgEl.style.backgroundImage = `url('${config.background}')`;
    }
  }

  function setupAudio() {
    audioEl = new Audio("type.mp3"); //add typing sound here when you find it
    audioEl.volume = 0.5;
  }

  function playSound() {
    if (!audioEl) return;
    audioEl.currentTime = 0;
    audioEl.play().catch(() => {});
  }

  function typeLine() {
    if (currentLine >= config.text.length) return;

    const line = config.text[currentLine];

    if (currentChar < line.length) {
      displayedText += line[currentChar];
      textEl.innerHTML = displayedText;

      playSound();

      currentChar++;
      setTimeout(typeLine, 35); // typing speed
    } else {
      displayedText += "<br><br>";
      textEl.innerHTML = displayedText;
      isTyping = false;
    }
  }

  function next() {
    if (isTyping) return;
    if (currentLine >= config.text.length) return;

    isTyping = true;
    currentChar = 0;
    currentLine++;

    typeLine();
  }

  return {
    init
  };

})();
