let audioCtx = null;

export function initAudio() {
    if (audioCtx) return;
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
}

export function playClick(intensity = 1.0) {
    if (!audioCtx) return;
    try {
        const now = audioCtx.currentTime;

        const bufLen = audioCtx.sampleRate * 0.06;
        const buf = audioCtx.createBuffer(1, bufLen, audioCtx.sampleRate);
        const data = buf.getChannelData(0);
        for (let i = 0; i < bufLen; i++) {
            data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufLen * 0.12));
        }
        const src = audioCtx.createBufferSource();
        src.buffer = buf;

        const bp = audioCtx.createBiquadFilter();
        bp.type = 'bandpass';
        bp.frequency.value = 2800 + Math.random() * 400;
        bp.Q.value = 6;

        const osc = audioCtx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1200, now);
        osc.frequency.exponentialRampToValueAtTime(400, now + 0.04);

        const oscGain = audioCtx.createGain();
        oscGain.gain.setValueAtTime(0.18 * intensity, now);
        oscGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);

        const noiseGain = audioCtx.createGain();
        noiseGain.gain.setValueAtTime(0.25 * intensity, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.07);

        const master = audioCtx.createGain();
        master.gain.value = 0.6;

        src.connect(bp); bp.connect(noiseGain); noiseGain.connect(master);
        osc.connect(oscGain); oscGain.connect(master);
        master.connect(audioCtx.destination);

        src.start(now); src.stop(now + 0.1);
        osc.start(now); osc.stop(now + 0.15);
    } catch (e) { }
}

export function setupAudioListeners() {
    document.addEventListener('pointerdown', initAudio, { once: true });
}