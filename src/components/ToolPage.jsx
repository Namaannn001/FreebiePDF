import React, { useEffect, useRef, useState } from 'react';
import { workflowTools } from '../catalog.js';
import { loadEngine } from '../run-tool.js';
import { beginReadAloud, speechVoices, useReadAloud } from '../hooks/useReadAloud.js';
import { load, store, workflowKey } from '../hooks/useStored.js';
import { initial } from '../lib/initial.js';
import { Icon, iconFor } from './Icon.jsx';
import { ToolForm } from './ToolForm.jsx';
import { ToolGuide } from './ToolGuide.jsx';
import { newStep } from './WorkflowBuilder.jsx';

/** Tool workspace: file queue, options, processing, and the how-to guide. */
export function ToolPage({ page }) {
  const { tool } = page;
  const [queue, setQueue] = useState([]);
  const [options, setOptions] = useState(() => initial(tool.fields));
  const [steps, setSteps] = useState(() => (tool.workflow ? [newStep('rotate-pdf')] : []));
  const [busy, setBusy] = useState(false);
  const [drag, setDrag] = useState(false);
  const [status, setStatus] = useState('');
  const [error, setError] = useState(false);
  const [download, setDownload] = useState(null);
  const { speaking, setSpeaking, stop, session, utterances } = useReadAloud();
  const running = useRef(false);
  const mounted = useRef(true);
  useEffect(() => {
    if (!tool.workflow) return;
    const list = load(workflowKey, []);
    const saved = Array.isArray(list)
      ? list
          .filter(item => workflowTools.includes(item?.id))
          .slice(0, 8)
          .map(item => ({ ...newStep(item.id), preset: item.preset }))
      : [];
    if (saved.length) setSteps(saved);
  }, [tool.workflow]);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);
  useEffect(
    () => () => {
      if (download) URL.revokeObjectURL(download.url);
    },
    [download],
  );
  function add(incoming) {
    if (running.current || !incoming.length) return;
    setQueue(current => (tool.multiple ? [...current, ...incoming] : incoming.slice(0, 1)));
  }
  function move(index, offset) {
    setQueue(current => {
      const next = [...current];
      [next[index], next[index + offset]] = [next[index + offset], next[index]];
      return next;
    });
  }
  async function submit(event) {
    event.preventDefault();
    if (running.current) return;
    setDownload(null);
    setError(false);
    stop();
    const speechGeneration = session.current;
    setSpeaking(false);
    setStatus('Processing in this browser…');
    setBusy(true);
    running.current = true;
    try {
      const { runTool } = await loadEngine();
      if (tool.workflow)
        store(
          workflowKey,
          steps.map(({ id, preset }) => ({ id, preset })),
        );
      const output = await runTool(tool.id, queue, { ...options, steps }, message => {
        if (mounted.current) setStatus(message);
      });
      if (!mounted.current) return;
      if (output.speech !== undefined) {
        const voices = await speechVoices();
        if (!mounted.current || session.current !== speechGeneration) return;
        const result = beginReadAloud({
          text: output.speech,
          voices,
          synth: window.speechSynthesis,
          Utterance: window.SpeechSynthesisUtterance,
          session,
          utterances,
          alive: () => mounted.current,
          onComplete: () => {
            setSpeaking(false);
            setStatus('Playback complete.');
          },
          onStop: () => {
            setSpeaking(false);
            setStatus('Playback stopped.');
          },
        });
        if (result.error) throw new Error(result.error);
        setSpeaking(true);
        setStatus('Reading aloud locally.');
      } else {
        setDownload({
          name: output.name,
          url: URL.createObjectURL(output.blob),
          isPdf: output.name.endsWith('.pdf'),
        });
        setStatus(output.note || 'Ready to download.');
      }
    } catch (err) {
      if (mounted.current) {
        setError(true);
        setStatus(err.message || 'This file could not be processed.');
      }
    } finally {
      if (mounted.current) setBusy(false);
      running.current = false;
    }
  }
  return (
    <section id="workspace">
      <div className="tool-intro">
        <span className="tool-badge">
          <Icon name={iconFor(tool.id)} size={24} />
        </span>
        <div>
          <h1>{page.h1}</h1>
          <p id="tool-description">{page.intro}</p>
          <ul className="promises">
            <li>
              <Icon name="shield" size={16} />
              Files stay on this device
            </li>
            <li>
              <Icon name="cloud" size={16} />
              Usable without internet
            </li>
            <li>
              <Icon name="file" size={16} />
              Output {tool.format}
            </li>
          </ul>
        </div>
      </div>
      <div className="tool-layout">
        <ToolForm
          tool={tool}
          submit={submit}
          drag={drag}
          setDrag={setDrag}
          add={add}
          busy={busy}
          queue={queue}
          move={move}
          setQueue={setQueue}
          options={options}
          setOptions={setOptions}
          steps={steps}
          setSteps={setSteps}
          status={status}
          error={error}
          speaking={speaking}
          stopSpeech={stop}
          setSpeaking={setSpeaking}
          setStatus={setStatus}
          download={download}
        />
        <ToolGuide page={page} />
      </div>
    </section>
  );
}
