//#region node_modules/.nitro/vite/services/ssr/assets/sounds-DDZlDPLE.js
/**
* Soft audio notifications using the Web Audio API.
* No audio files needed — sounds are generated programmatically.
*/
var audioCtx = null;
function getAudioContext() {
	if (typeof window === "undefined") return null;
	if (!audioCtx) try {
		audioCtx = new AudioContext();
	} catch {
		return null;
	}
	return audioCtx;
}
/**
* Play a loud, 3-second bell notification sound (for incoming notifications).
*/
function playNotificationSound() {
	const ctx = getAudioContext();
	if (!ctx) return;
	if (ctx.state === "suspended") ctx.resume();
	const now = ctx.currentTime;
	const duration = 3;
	const osc1 = ctx.createOscillator();
	const gain1 = ctx.createGain();
	osc1.type = "sine";
	osc1.frequency.setValueAtTime(523, now);
	gain1.gain.setValueAtTime(.55, now);
	gain1.gain.exponentialRampToValueAtTime(1e-4, now + duration);
	osc1.connect(gain1);
	gain1.connect(ctx.destination);
	osc1.start(now);
	osc1.stop(now + duration);
	const osc2 = ctx.createOscillator();
	const gain2 = ctx.createGain();
	osc2.type = "sine";
	osc2.frequency.setValueAtTime(1046, now);
	gain2.gain.setValueAtTime(.3, now);
	gain2.gain.exponentialRampToValueAtTime(1e-4, now + duration * .7);
	osc2.connect(gain2);
	gain2.connect(ctx.destination);
	osc2.start(now);
	osc2.stop(now + duration * .7);
	const osc3 = ctx.createOscillator();
	const gain3 = ctx.createGain();
	osc3.type = "sine";
	osc3.frequency.setValueAtTime(1568, now);
	gain3.gain.setValueAtTime(.2, now);
	gain3.gain.exponentialRampToValueAtTime(1e-4, now + .6);
	osc3.connect(gain3);
	gain3.connect(ctx.destination);
	osc3.start(now);
	osc3.stop(now + .6);
	const osc4 = ctx.createOscillator();
	const gain4 = ctx.createGain();
	osc4.type = "sine";
	osc4.frequency.setValueAtTime(660, now + .4);
	gain4.gain.setValueAtTime(0, now);
	gain4.gain.setValueAtTime(.4, now + .4);
	gain4.gain.exponentialRampToValueAtTime(1e-4, now + duration);
	osc4.connect(gain4);
	gain4.connect(ctx.destination);
	osc4.start(now + .4);
	osc4.stop(now + duration);
}
/**
* Play a soft "pop" message sound (for incoming chat messages).
*/
function playMessageSound() {
	const ctx = getAudioContext();
	if (!ctx) return;
	if (ctx.state === "suspended") ctx.resume();
	const now = ctx.currentTime;
	const osc = ctx.createOscillator();
	const gain = ctx.createGain();
	osc.type = "sine";
	osc.frequency.setValueAtTime(600, now);
	osc.frequency.exponentialRampToValueAtTime(440, now + .12);
	gain.gain.setValueAtTime(.15, now);
	gain.gain.exponentialRampToValueAtTime(1e-4, now + .18);
	osc.connect(gain);
	gain.connect(ctx.destination);
	osc.start(now);
	osc.stop(now + .2);
}
//#endregion
export { playNotificationSound as n, playMessageSound as t };
