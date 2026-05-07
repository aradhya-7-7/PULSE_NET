const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();

// Retro console-style beep generator
export const playBeep = (
  frequency = 440,
  type: OscillatorType = 'square',
  duration = 0.08,
  volume = 0.08
) => {
  if (audioCtx.state === 'suspended') audioCtx.resume();

  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();

  // Optional lo-fi filter for NES/GameBoy vibe
  const filter = audioCtx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 1800;

  oscillator.type = type;

  // Quantized frequency = more 8-bit feel
  const quantizedFreq = Math.round(frequency / 20) * 20;

  oscillator.frequency.setValueAtTime(
    quantizedFreq,
    audioCtx.currentTime
  );

  // Tiny retro pitch drop
  oscillator.frequency.exponentialRampToValueAtTime(
    quantizedFreq * 0.92,
    audioCtx.currentTime + duration
  );

  // Sharp arcade envelope
  gainNode.gain.setValueAtTime(volume, audioCtx.currentTime);

  gainNode.gain.exponentialRampToValueAtTime(
    0.0001,
    audioCtx.currentTime + duration
  );

  oscillator.connect(filter);
  filter.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  oscillator.start();
  oscillator.stop(audioCtx.currentTime + duration);
};

// === ULTRA RETRO 8-BIT SOUNDBOARD ===

// UI Click → crisp GameBoy menu tick
export const playUiClick = () => {
  playBeep(1400, 'square', 0.025, 0.05);
};

// Typing → chunky terminal keyboard sound
export const playTyping = () => {
  playBeep(
    180 + Math.random() * 40,
    'square',
    0.01,
    0.03
  );
};

// Navigation → classic arcade confirm chirp
export const playNavSound = () => {
  playBeep(700, 'square', 0.04, 0.05);

  setTimeout(() => {
    playBeep(1100, 'square', 0.05, 0.05);
  }, 40);
};

// Warning → corrupted cartridge death buzz
export const playWarningSound = () => {
  playBeep(180, 'sawtooth', 0.12, 0.07);

  setTimeout(() => {
    playBeep(120, 'square', 0.08, 0.05);
  }, 50);
};

// Coin pickup sound
export const playCoinSound = () => {
  playBeep(900, 'square', 0.04, 0.05);

  setTimeout(() => {
    playBeep(1400, 'square', 0.06, 0.05);
  }, 35);
};

// Retro jump sound
export const playJumpSound = () => {
  if (audioCtx.state === 'suspended') audioCtx.resume();

  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.type = 'square';

  osc.frequency.setValueAtTime(250, audioCtx.currentTime);

  osc.frequency.exponentialRampToValueAtTime(
    700,
    audioCtx.currentTime + 0.12
  );

  gain.gain.setValueAtTime(0.07, audioCtx.currentTime);

  gain.gain.exponentialRampToValueAtTime(
    0.0001,
    audioCtx.currentTime + 0.12
  );

  osc.connect(gain);
  gain.connect(audioCtx.destination);

  osc.start();
  osc.stop(audioCtx.currentTime + 0.12);
};