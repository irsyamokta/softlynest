/**
 * Sound notifications.
 *
 * Strategy:
 * - Primary: HTMLAudioElement — simpler, more reliable on mobile after unlock
 * - Fallback: Web Audio API — for browsers that block HTMLAudioElement
 *
 * Mobile audio rule: can only play after a direct user gesture.
 * We "unlock" the audio element on first interaction so subsequent
 * async calls (from realtime events) work reliably.
 */

// ── HTMLAudioElement pool ─────────────────────────────────────────────────────
let notifAudio: HTMLAudioElement | null = null;
let isUnlocked = false;

function getAudio(): HTMLAudioElement | null {
  if (typeof window === "undefined") return null;
  if (!notifAudio) {
    notifAudio = new Audio("/notif.ogg");
    notifAudio.preload = "auto";
    notifAudio.volume = 0.7;
    // Load the file immediately
    notifAudio.load();
  }
  return notifAudio;
}

// Unlock audio on first user gesture — required by all mobile browsers
function unlock() {
  if (isUnlocked) return;
  const audio = getAudio();
  if (!audio) return;

  // Play a silent/very short segment to unlock the element
  audio.volume = 0;
  const playPromise = audio.play();
  if (playPromise !== undefined) {
    playPromise
      .then(() => {
        audio.pause();
        audio.currentTime = 0;
        audio.volume = 0.7;
        isUnlocked = true;
      })
      .catch(() => {
        // Silently ignore — unlock failed, audio will try again next gesture
      });
  }
}

if (typeof window !== "undefined") {
  const events = ["click", "touchend", "keydown", "pointerup"];
  const handler = () => {
    unlock();
    // Keep listening — iOS sometimes needs multiple unlocks
  };
  events.forEach((e) => window.addEventListener(e, handler, { passive: true }));
}

// ── Web Audio API fallback ────────────────────────────────────────────────────
let audioCtx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    try { audioCtx = new AudioContext(); }
    catch { return null; }
  }
  return audioCtx;
}

function playFallbackTone() {
  const ctx = getCtx();
  if (!ctx) return;
  if (ctx.state === "suspended") {
    ctx.resume().then(() => playFallbackTone());
    return;
  }
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(880, now);
  osc.frequency.exponentialRampToValueAtTime(523, now + 0.3);
  gain.gain.setValueAtTime(0.35, now);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.6);
}

// ── Public API ────────────────────────────────────────────────────────────────
export function preloadSounds() {
  if (typeof window === "undefined") return;
  getAudio(); // Instantiate and load the audio element early
}

function playSound(volume = 0.7) {
  const audio = getAudio();
  if (!audio) return;

  // Reset to start for rapid back-to-back plays
  try {
    audio.volume = volume;
    audio.currentTime = 0;
    const p = audio.play();
    if (p !== undefined) {
      p.catch(() => {
        // HTMLAudioElement blocked — try Web Audio fallback
        playFallbackTone();
      });
    }
  } catch {
    playFallbackTone();
  }
}

export function playNotificationSound() {
  playSound(0.7);
}

export function playMessageSound() {
  playSound(0.5);
}
