/**
 * Web Audio API synthesizer for clean notification chimes without external assets.
 */
class SoundService {
  private audioCtx: AudioContext | null = null;

  private initAudioContext() {
    if (!this.audioCtx && typeof window !== 'undefined') {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        this.audioCtx = new AudioCtxClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  /**
   * Play an uplifting notification bell chime when a deal < $200k is spotted
   */
  public playDealAlertChime() {
    try {
      this.initAudioContext();
      if (!this.audioCtx) return;

      const ctx = this.audioCtx;
      const now = ctx.currentTime;

      // Two-note harmonic success chime (C6 -> G6: 1046.5Hz -> 1567.98Hz)
      const notes = [
        { freq: 880.0, time: 0, duration: 0.35, gain: 0.18 },
        { freq: 1318.5, time: 0.08, duration: 0.45, gain: 0.22 },
        { freq: 1760.0, time: 0.18, duration: 0.6, gain: 0.16 },
      ];

      notes.forEach((n) => {
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(n.freq, now + n.time);

        gainNode.gain.setValueAtTime(0, now + n.time);
        gainNode.gain.linearRampToValueAtTime(n.gain, now + n.time + 0.02);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, now + n.time + n.duration);

        osc.connect(gainNode);
        gainNode.connect(ctx.destination);

        osc.start(now + n.time);
        osc.stop(now + n.time + n.duration + 0.05);
      });
    } catch (e) {
      console.warn('Audio playback not allowed or failed:', e);
    }
  }

  /**
   * Quick click/ping tone for testing or action feedback
   */
  public playPing() {
    try {
      this.initAudioContext();
      if (!this.audioCtx) return;

      const ctx = this.audioCtx;
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1200, now);
      gainNode.gain.setValueAtTime(0.1, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.18);
    } catch (e) {
      console.warn('Ping audio failed:', e);
    }
  }
}

export const soundService = new SoundService();
