const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();

export const playBeep = (frequency = 440, type: OscillatorType = 'square', duration = 0.1) => {
  if (audioCtx.state === 'suspended') audioCtx.resume();
  
  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();
  
  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, audioCtx.currentTime);
  
  gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
  
  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);
  
  oscillator.start();
  oscillator.stop(audioCtx.currentTime + duration);
};

// === THE WEB 1.0 SOUNDBOARD ===

// 1. Standard UI Click (Dropdowns, generic buttons)
export const playUiClick = () => playBeep(1200, 'triangle', 0.03); 

// 2. Typing (Mechanical keyboard clack)
export const playTyping = () => playBeep(150 + Math.random() * 50, 'square', 0.015);

// 3. Navigation (Changing pages, opening profile) - A high, quick double-chirp
export const playNavSound = () => {
    playBeep(900, 'sine', 0.05);
    setTimeout(() => playBeep(1200, 'sine', 0.05), 50);
};

// 4. Warning / Destructive (Deleting, Disconnecting) - A low, harsh crunch
export const playWarningSound = () => playBeep(200, 'sawtooth', 0.15);