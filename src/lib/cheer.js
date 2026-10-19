// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (C) 2026 freeLoad contributors

let context = null;
let lastPlayedAt = 0;

const MIN_GAP_MS = 1200;
const LENGTH = 2.4;

function audioContext() {
  const Ctor = window.AudioContext || window.webkitAudioContext;
  if (!Ctor) return null;
  if (!context) context = new Ctor();
  if (context.state === "suspended") context.resume();
  return context;
}

/** A second of white noise, the raw material the crowd roar is shaped from. */
function noiseBuffer(ac) {
  const frames = Math.floor(ac.sampleRate * LENGTH);
  const buffer = ac.createBuffer(1, frames, ac.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < frames; i += 1) data[i] = Math.random() * 2 - 1;
  return buffer;
}

/**
 * A short, happy crowd cheer — built with the Web Audio API so the app ships no
 * audio file and works offline. Filtered noise swells and falls away like a crowd
 * roaring, with a few bright whistles riding on top.
 *
 * Called from a click, which is what browsers require before they allow sound.
 */
export function playCheer() {
  const now = Date.now();
  if (now - lastPlayedAt < MIN_GAP_MS) return;

  try {
    const ac = audioContext();
    if (!ac) return;
    lastPlayedAt = now;

    const start = ac.currentTime;
    const cheer = ac.createGain();
    cheer.gain.setValueAtTime(0, start);
    cheer.gain.linearRampToValueAtTime(0.45, start + 0.12);
    cheer.gain.setValueAtTime(0.45, start + 0.9);
    cheer.gain.exponentialRampToValueAtTime(0.001, start + LENGTH);
    cheer.connect(ac.destination);

    // The roar: noise through a band-pass that opens up as the cheer builds.
    const roar = ac.createBufferSource();
    roar.buffer = noiseBuffer(ac);
    const band = ac.createBiquadFilter();
    band.type = "bandpass";
    band.Q.value = 0.7;
    band.frequency.setValueAtTime(500, start);
    band.frequency.linearRampToValueAtTime(1700, start + 0.5);
    band.frequency.linearRampToValueAtTime(900, start + LENGTH);
    roar.connect(band).connect(cheer);
    roar.start(start);
    roar.stop(start + LENGTH);

    // Whistles: short rising tones that make it read as delight, not noise.
    [0, 0.18, 0.42].forEach((offset, i) => {
      const osc = ac.createOscillator();
      const gain = ac.createGain();
      const at = start + offset;
      const from = 900 + i * 140;
      osc.type = "triangle";
      osc.frequency.setValueAtTime(from, at);
      osc.frequency.exponentialRampToValueAtTime(from * 1.5, at + 0.35);
      gain.gain.setValueAtTime(0, at);
      gain.gain.linearRampToValueAtTime(0.05, at + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, at + 0.4);
      osc.connect(gain).connect(cheer);
      osc.start(at);
      osc.stop(at + 0.45);
    });
  } catch {
    // Audio is a nicety: never let it interrupt logging a set.
  }
}