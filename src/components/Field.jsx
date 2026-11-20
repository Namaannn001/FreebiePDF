import React from 'react';

/** One tool option: a select, a textarea, or a text input. */
export function Field({ field, value, onChange }) {
  const { label, type, choices, placeholder } = field;
  return (
    <label>
      {label}
      {choices ? (
        <select value={value ?? choices[0]} onChange={event => onChange(event.target.value)}>
          {choices.map(choice => (
            <option key={choice}>{choice}</option>
          ))}
        </select>
      ) : type === 'textarea' ? (
        <textarea
          value={value ?? ''}
          placeholder={placeholder}
          onChange={event => onChange(event.target.value)}
        />
      ) : (
        <input
          type={type}
          step={type === 'number' ? 'any' : undefined}
          value={value ?? ''}
          placeholder={placeholder}
          onChange={event => onChange(event.target.value)}
        />
      )}
    </label>
  );
}
