/**
 * Sound notifications using Web Audio API with OGG file decoding.
 *
 * Why not HTMLAudioElement?
 * - HTMLAudioElement.play() is blocked until the *exact* user gesture that
 *   triggers it (not just "after" any gesture). This makes it unreliable for
 *   notifications that fire asynchronously.
 *
 * Why Web Audio API works better:
 * - AudioContext can be resumed after any prior user interaction.
 * - Once unlocked, AudioBufferSourceNode.start() never throws.
 * - We decode the OGG file once and cache the AudioBuffer.
 */

let audioCtx: AudioContext | null = null;
let notifBuffer: AudioBuffer | null = null;
let bufferLoading = false;

// ── Bootstrap AudioContext on first user gesture ──────────────────────────────
function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    try {
      audioCtx = new AudioContext();
    } catch {
      return null;
    }
  }
  return audioCtx;
}

async function ensureCtxRunning(): Promise<boolean> {
  const ctx = getCtx();
  if (!ctx) return false;
  if (ctx.state === "suspended") {
    try {
      await ctx.resume();
    } catch {
      return false;
    }
  }
  return ctx.state === "running";
}

// Load and decode the OGG file into an AudioBuffer (done once)
async function loadBuffer(): Promise<AudioBuffer | null> {
  if (notifBuffer) return notifBuffer;
  if (bufferLoading) return null;
  bufferLoading = true;

  const ctx = getCtx();
  if (!ctx) return null;

  try {
    const res = await fetch("/notif.ogg");
    if (!res.ok) throw new Error(`fetch failed: ${res.status}`);
    const arrayBuffer = await res.arrayBuffer();
    notifBuffer = await ctx.decodeAudioData(arrayBuffer);
    return notifBuffer;
  } catch (e) {
    console.warn("[sounds] Failed to load notif.ogg:", e);
    bufferLoading = false;
    return null;
  }
}

// Pre-load buffer + unlock AudioContext on first interaction
function setupOnInteraction() {
  if (typeof window === "undefined") return;

  const unlock = async () => {
    const ctx = getCtx();
    if (ctx && ctx.state === "suspended") await ctx.resume();
    // Pre-load buffer in background so first notification is instant
    loadBuffer();
  };

  const events = ["click", "touchstart", "keydown", "pointerdown", "scroll"];
  const handler = () => {
    unlock();
    events.forEach((e) => window.removeEventListener(e, handler));
  };
  events.forEach((e) =>
    window.addEventListener(e, handler, { once: true, passive: true }),
  );
}

setupOnInteraction();

// ── Play helpers ──────────────────────────────────────────────────────────────
async function playBuffer(volume: number) {
  const running = await ensureCtxRunning();
  if (!running) {
    playFallback(volume > 0.5 ? "notif" : "message");
    return;
  }

  const ctx = audioCtx!;
  const buffer = await loadBuffer();

  if (buffer) {
    const source = ctx.createBufferSource();
    const gainNode = ctx.createGain();
    source.buffer = buffer;
    gainNode.gain.value = volume;
    source.connect(gainNode);
    gainNode.connect(ctx.destination);
    source.start(0);
  } else {
    // OGG load failed — use synthesized fallback
    playFallback(volume > 0.5 ? "notif" : "message");
  }
}

function playFallback(type: "notif" | "message") {
  const ctx = getCtx();
  if (!ctx || ctx.state !== "running") return;

  const now = ctx.currentTime;

  if (type === "notif") {
    // Two-tone bell
    [[880, 523, 0.4, 0.6], [660, 440, 0.25, 0.5]].forEach(
      ([freqStart, freqEnd, gain, dur], i) => {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freqStart, now + i * 0.15);
        osc.frequency.exponentialRampToValueAtTime(freqEnd, now + i * 0.15 + 0.3);
        g.gain.setValueAtTime(gain, now + i * 0.15);
        g.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.15 + dur);
        osc.connect(g);
        g.connect(ctx.destination);
        osc.start(now + i * 0.15);
        osc.stop(now + i * 0.15 + dur);
      },
    );
  } else {
    // Soft pop
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.exponentialRampToValueAtTime(400, now + 0.12);
    g.gain.setValueAtTime(0.15, now);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);
    osc.connect(g);
    g.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.2);
  }
}

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Call this as early as possible (e.g. in app root) to pre-fetch and decode
 * the OGG file so the first notification sound plays instantly.
 */
export function preloadSounds() {
  // Trigger buffer load in background — safe to call before user gesture,
  // decoding will complete before the first notification arrives.
  if (typeof window !== "undefined") {
    loadBuffer();
  }
}

export function playNotificationSound() {
  playBuffer(0.8);
}

export function playMessageSound() {
  playBuffer(0.45);
}
