import { useEffect, useRef, useState } from 'react';

// Some browsers return no voices until 'voiceschanged' fires, so wait briefly for them.
export function speechVoices() {
  const synth = window.speechSynthesis;
  if (!synth) return Promise.resolve([]);
  if (synth.getVoices().length) return Promise.resolve(synth.getVoices());
  return new Promise(resolve => {
    const done = () => {
      clearTimeout(timer);
      synth.removeEventListener('voiceschanged', done);
      resolve(synth.getVoices());
    };
    const timer = setTimeout(done, 2000);
    synth.addEventListener('voiceschanged', done);
  });
}

// Split text on sentence or word boundaries so each utterance stays well under Chrome's ~15s cutoff.
export function speechChunks(text, max = 200) {
  const chunks = [];
  for (let rest = text.trim(); rest;) {
    if (rest.length <= max) {
      chunks.push(rest);
      break;
    }
    const head = rest.slice(0, max);
    const sentence = [...head.matchAll(/[.!?]\s/g)].pop();
    const space = head.search(/\s\S*$/);
    const cut = sentence ? sentence.index + 1 : space > 0 ? space : max;
    chunks.push(rest.slice(0, cut).trim());
    rest = rest.slice(cut).trim();
  }
  return chunks;
}

// Only a voice with localService===true is used. Remote voices stay unused so playback works offline and audio is not sent off-device.
export function beginReadAloud({
  text,
  voices,
  synth,
  Utterance,
  session,
  utterances,
  alive,
  onComplete,
  onStop,
}) {
  const local = (voices ?? []).filter(voice => voice.localService === true);
  if (!synth || typeof Utterance !== 'function' || !local.length)
    return {
      error:
        'No local speech voice is available on this device. Read aloud will not use a remote voice.',
    };
  if (!String(text ?? '').trim())
    return { error: 'This PDF has no searchable text to read aloud.' };
  const voice = local.find(item => item.lang?.toLowerCase().startsWith('en')) ?? local[0];
  const id = session.current;
  const parts = speechChunks(String(text));
  const queued = parts.map((part, index) => {
    const utterance = new Utterance(part);
    utterance.voice = voice;
    utterance.onend = () => {
      if (session.current !== id) return;
      const at = utterances.current.indexOf(utterance);
      if (at >= 0) utterances.current.splice(at, 1);
      if (index === parts.length - 1 && alive()) onComplete();
    };
    utterance.onerror = () => {
      if (session.current !== id) return;
      session.current += 1;
      utterances.current = [];
      synth.cancel();
      if (alive()) onStop();
    };
    return utterance;
  });
  utterances.current = queued;
  for (const utterance of queued) synth.speak(utterance);
  return { ok: true, voice };
}

/** Speech session refs, the speaking flag, and a stop that cancels the current playback. */
export function useReadAloud() {
  const [speaking, setSpeaking] = useState(false);
  const session = useRef(0);
  const utterances = useRef([]);
  function stop() {
    session.current += 1;
    utterances.current = [];
    window.speechSynthesis?.cancel();
  }
  useEffect(() => () => stop(), []);
  return { speaking, setSpeaking, stop, session, utterances };
}
