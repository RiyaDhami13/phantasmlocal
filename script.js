let audioCtx = null;
let audioInitialized = false;
let soundtrackInterval = null;

function initAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

// Automatically start ambient horror soundtrack on first click anywhere
function startAmbientHorrorSoundtrack() {
  if (audioInitialized) return;
  initAudio();
  audioInitialized = true;

  // Start slow creepy ambient drone
  playCreepyDrone();

  // Schedule random eerie laughs, sudden shouts, and static flickers
  soundtrackInterval = setInterval(() => {
    const rand = Math.random();
    if (rand > 0.65) {
      playCreepyLaugh();
    } else if (rand > 0.35) {
      playSuddenHorrorShout();
    } else {
      playStaticBurst();
    }
  }, 12000);
}

// Slow Creepy Ambient Synth Drone
function playCreepyDrone() {
  try {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(42, audioCtx.currentTime); // Low sub-bass
    
    // Slow undulating filter sweep
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(120, audioCtx.currentTime);
    filter.frequency.linearRampToValueAtTime(350, audioCtx.currentTime + 6);
    filter.frequency.linearRampToValueAtTime(100, audioCtx.currentTime + 12);

    gain.gain.setValueAtTime(0.02, audioCtx.currentTime);
    
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
  } catch(e){}
}

// Creepy Ghostly Laugh Sound Effect
function playCreepyLaugh() {
  if (!audioCtx) return;
  try {
    let now = audioCtx.currentTime;
    for (let i = 0; i < 4; i++) {
      let osc = audioCtx.createOscillator();
      let gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(300 + (i * 40), now + (i * 0.15));
      gain.gain.setValueAtTime(0.04, now + (i * 0.15));
      gain.gain.exponentialRampToValueAtTime(0.001, now + (i * 0.15) + 0.1);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now + (i * 0.15));
      osc.stop(now + (i * 0.15) + 0.1);
    }
  } catch(e){}
}

// Sudden Horror Shout / Screech
function playSuddenHorrorShout() {
  if (!audioCtx) return;
  try {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(450, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(120, audioCtx.currentTime + 0.5);

    gain.gain.setValueAtTime(0.06, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.6);

    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.6);

    // Flash screen glitch
    document.body.classList.add('glitch-flash');
    setTimeout(() => document.body.classList.remove('glitch-flash'), 150);
  } catch(e){}
}

// Keypress Mechanical Typing Sound
function playKeyClickSound() {
  if (!audioCtx) return;
  try {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(140 + Math.random() * 90, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.03);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.03);
  } catch(e){}
}

// Static Burst with Screen Glitch
function playStaticBurst() {
  if (!audioCtx) return;
  try {
    const bufferSize = audioCtx.sampleRate * 0.25;
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const noise = audioCtx.createBufferSource();
    noise.buffer = buffer;
    const gain = audioCtx.createGain();
    gain.gain.setValueAtTime(0.07, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.25);
    noise.connect(gain);
    gain.connect(audioCtx.destination);
    noise.start();

    document.body.classList.add('glitch-flash');
    setTimeout(() => document.body.classList.remove('glitch-flash'), 120);
  } catch(e){}
}

// Tab Switching
function switchTab(tabId) {
  playKeyClickSound();
  ['ofrenda', 'terminal', 'seance', 'radio'].forEach(id => {
    document.getElementById('tab-' + id).classList.add('hidden');
  });
  document.getElementById('tab-' + tabId).classList.remove('hidden');
}

// Terminal Input
function handleTerminalInput(e) {
  playKeyClickSound();
  if (e.key === 'Enter') {
    const input = document.getElementById('termInput');
    const val = input.value.trim();
    if (!val) return;

    const term = document.getElementById('terminalWindow');
    term.innerHTML += `<p style="color: #fff;">C:\\> ${val}</p>`;

    const cmd = val.toLowerCase();
    if (cmd === 'help') {
      term.innerHTML += `<p style="color: #ffff00;">Commands: dir, whoami, scan, exorcise, clear</p>`;
    } else if (cmd === 'dir') {
      term.innerHTML += `<p> 10/28/1998  03:12 PM             1,998 memory_vault.db<br> 10/28/1998  03:12 PM               450 ghost_proc.sys</p>`;
    } else if (cmd === 'whoami') {
      term.innerHTML += `<p>user: local_operator // privileges: root_haunted</p>`;
    } else if (cmd === 'scan') {
      playStaticBurst();
      term.innerHTML += `<p style="color: #ffb000;">[TabPFN 3.5 Engine]: Scanning kernel... 1 phantom process detected.</p>`;
    } else if (cmd === 'exorcise') {
      term.innerHTML += `<p style="color: #ff3333;">[EXORCISM ACTIVE]: Memory cache flushed.</p>`;
    } else if (cmd === 'clear') {
      term.innerHTML = `<p>PHANTASM_LOCAL [Version 3.50.1998]</p>`;
    } else {
      term.innerHTML += `<p style="color: #ff3333;">Bad command. Type 'help' for instructions.</p>`;
    }

    input.value = '';
    term.scrollTop = term.scrollHeight;
  }
}

// Shortwave Ghost Radio
function tuneRadio(freq) {
  document.getElementById('radioFreqDisplay').innerText = freq + " MHz";
  const status = document.getElementById('radioStatus');
  const log = document.getElementById('radioMessageLog');

  if (freq === "91.1") {
    status.innerText = "SIGNAL DETECTED: NUMBERS STATION";
    status.style.color = "#ff3333";
    log.innerHTML = `<p style="color:#ff6666;">[TRANSMISSION]: 4 ... 8 ... 15 ... 16 ... 23 ... 42 ... "Keep memories offline."</p>`;
    playStaticBurst();
  } else if (freq === "104.7") {
    status.innerText = "SIGNAL DETECTED: DIAL-UP HANDSHAKE";
    status.style.color = "#ff3333";
    log.innerHTML = `<p style="color:#ff6666;">[TRANSMISSION]: ATDT 555-0199 ... CONNECT 14400 ... Séance channel active.</p>`;
    playStaticBurst();
  } else {
    status.innerText = "STATUS: HEAVY STATIC / NO SIGNAL";
    status.style.color = "#888";
  }
}

// Polaroid Image Loader
function loadPolaroid(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      const placeholder = document.getElementById('photoPlaceholder');
      placeholder.innerHTML = `<img src="${e.target.result}" style="width:100%; height:130px; object-fit:cover; filter: sepia(0.5) contrast(1.1);">`;
      document.getElementById('polaroidCaption').innerText = document.getElementById('inputName').value.toUpperCase();
    };
    reader.readAsDataURL(file);
  }
}

// Calavera Literaria generator
function generateCalavera() {
  playKeyClickSound();
  const name = document.getElementById('inputName').value;
  const poems = [
    `La Catrina llegó sonriendo al hogar de ${name.split(' ')[0]},\nBuscando el pan de muerto y la guitarra que deixou.\n"¡No me lleves aún!" dijo entre flores de cempasúchil,\nY la muerte bailó un vals al compás de la luz candil. 🕯️`,
    `Entre veladoras encendidas y aroma a copal,\n${name.split(' ')[0]} nos guía con su amor celestial.\nNi el tiempo ni la distancia lo podrán borrar,\nPues en nuestro altar siempre va a brillar. 🌼`
  ];
  document.getElementById('poemOutput').innerText = poems[Math.floor(Math.random() * poems.length)];
}

function exportCapsule() {
  const html = document.documentElement.outerHTML;
  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'phantasmlocal-ofrenda-capsule.html';
  a.click();
}

// Séance Logic
let activeSpirit = 'COBOL';
function setSpirit(spirit) {
  playKeyClickSound();
  activeSpirit = spirit;
  document.getElementById('seanceLog').innerHTML += `<p style="color: #ffff00;">[BBS System]: Switched active spirit medium to ${spirit}.</p>`;
}

function handleSeance(e) {
  playKeyClickSound();
  if (e.key === 'Enter') sendSeance();
}

function sendSeance() {
  const input = document.getElementById('seanceInput');
  const val = input.value.trim();
  if (!val) return;
  const log = document.getElementById('seanceLog');
  log.innerHTML += `<p style="color: #fff;">Operator: ${val}</p>`;

  setTimeout(() => {
    let reply = `[${activeSpirit} Spirit]: In my decade, we managed every single byte by hand. Your modern frameworks are haunted by abstraction!`;
    log.innerHTML += `<p style="color: #00ff66;">${reply}</p>`;
    log.scrollTop = log.scrollHeight;
    playStaticBurst();
  }, 400);

  input.value = '';
}

function recoverFromBSOD() {
  document.getElementById('bsodOverlay').style.display = 'none';
  playStaticBurst();
}