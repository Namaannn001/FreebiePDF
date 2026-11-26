import React from 'react';
import { Field } from './Field.jsx';
import { Icon } from './Icon.jsx';
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
          <span className="upload-mark">
            <Icon name="upload" size={24} />
          </span>
          <b>{tool.multiple ? 'Choose files' : 'Choose a file'}</b>
          <span>or drag and drop {tool.multiple ? 'them' : 'it'} here</span>
        </label>
      )}
      <ul id="queue">
        {queue.map((file, index) => (
          <li key={file.name + '-' + index}>
            <Icon name="file" size={18} className="queue-icon" />
            <span>
              {file.name}
              <small>{Math.max(1, Math.round(file.size / 1024))} KB</small>
            </span>
            {tool.multiple && (
              <>
                <button
                  className="icon-button"
                  type="button"
                  aria-label={'Move ' + file.name + ' up'}
                  title="Move up"
                  disabled={busy || index === 0}
                  onClick={() => move(index, -1)}
                >
                  <Icon name="up" size={16} />
                </button>
                <button
                  className="icon-button"
                  type="button"
                  aria-label={'Move ' + file.name + ' down'}
                  title="Move down"
                  disabled={busy || index === queue.length - 1}
                  onClick={() => move(index, 1)}
                >
                  <Icon name="down" size={16} />
                </button>
              </>
            )}
            <button
              className="icon-button"
              type="button"
              aria-label={'Remove ' + file.name}
              title="Remove"
              disabled={busy}
              onClick={() => setQueue(queue.filter((_, i) => i !== index))}
            >
              <Icon name="trash" size={16} />
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
          <div className="result-head">
            <span className="result-check">
              <Icon name="check" size={18} />
            </span>
            <span className="result-name">{download.name}</span>
            <a className="download-link" download={download.name} href={download.url}>
              <Icon name="download" size={17} />
              Download
            </a>
          </div>
          {download.isPdf && <iframe title="Result PDF preview" src={download.url} />}
        </div>
      )}
    </form>
  );
}
