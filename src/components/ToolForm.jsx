import React from 'react';
import { Field } from './Field.jsx';
import { WorkflowBuilder } from './WorkflowBuilder.jsx';

/** File drop zone, options, run button, status, playback, and download. */
export function ToolForm({
  tool,
  submit,
  drag,
  setDrag,
  add,
  busy,
  queue,
  move,
  setQueue,
  options,
  setOptions,
  steps,
  setSteps,
  status,
  error,
  speaking,
  stopSpeech,
  setSpeaking,
  setStatus,
  download,
}) {
  return (
    <form className="editor-panel" onSubmit={submit}>
      <div className="editor-header">
        <div>
          <h2>{tool.noFile ? 'Document details' : 'Your files'}</h2>
          <p>
            {tool.noFile
              ? 'Fill in the fields below.'
              : 'Choose a file from this device to get started.'}
          </p>
        </div>
        <span className="format">{tool.format}</span>
      </div>
      {!tool.noFile && (
        <label
          className={'drop' + (drag ? ' over' : '')}
          onDragOver={event => {
            event.preventDefault();
            setDrag(true);
          }}
          onDragLeave={() => setDrag(false)}
          onDrop={event => {
            event.preventDefault();
            setDrag(false);
            add([...event.dataTransfer.files]);
          }}
        >
          <input
            aria-label={tool.multiple ? 'Choose files' : 'Choose a file'}
            type="file"
            accept={tool.accept}
            multiple={tool.multiple}
            capture={tool.capture ? 'environment' : undefined}
            disabled={busy}
            onChange={event => {
              add([...event.target.files]);
              event.target.value = '';
            }}
          />
          <span className="upload-mark" aria-hidden="true">
            ⇧
          </span>
          <b>{tool.multiple ? 'Choose files' : 'Choose a file'}</b>
          <span>or drag and drop here</span>
        </label>
      )}
      <ul id="queue">
        {queue.map((file, index) => (
          <li key={file.name + '-' + index}>
            <span>
              {file.name} · {Math.max(1, Math.round(file.size / 1024))} KB
            </span>
            {tool.multiple && (
              <>
                <button
                  type="button"
                  disabled={busy || index === 0}
                  onClick={() => move(index, -1)}
                >
                  Up
                </button>
                <button
                  type="button"
                  disabled={busy || index === queue.length - 1}
                  onClick={() => move(index, 1)}
                >
                  Down
                </button>
              </>
            )}
            <button
              type="button"
              disabled={busy}
              onClick={() => setQueue(queue.filter((_, i) => i !== index))}
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
      <fieldset id="options" disabled={busy} hidden={!tool.fields.length && !tool.workflow}>
        {tool.fields.map(field => (
          <Field
            key={field.key}
            field={field}
            value={options[field.key]}
            onChange={value => setOptions({ ...options, [field.key]: value })}
          />
        ))}
        {tool.workflow && <WorkflowBuilder steps={steps} update={setSteps} />}
      </fieldset>
      <button className="primary" disabled={busy}>
        {busy ? 'Working…' : tool.title}
      </button>
      <p id="status" role="status" className={error ? 'error' : ''}>
        {status}
      </p>
      {speaking && (
        <button
          type="button"
          onClick={() => {
            stopSpeech();
            setSpeaking(false);
            setStatus('Playback stopped.');
          }}
        >
          Stop playback
        </button>
      )}
      {download && (
        <div id="result">
          <a className="download-link" download={download.name} href={download.url}>
            Download {download.name}
          </a>
          {download.isPdf && <iframe title="Result PDF preview" src={download.url} />}
        </div>
      )}
    </form>
  );
}
