import React from 'react';
import { byId, workflowTools } from '../catalog.js';
import { initial } from '../lib/initial.js';
import { Field } from './Field.jsx';

/** A workflow step with the tool's default choices filled in. */
export const newStep = id => ({ id, label: byId.get(id).title, ...initial(byId.get(id).fields) });

/** Ordered list of PDF operations, up to eight, with per-step fields. */
export function WorkflowBuilder({ steps, update }) {
  return (
    <div>
      {steps.map((step, index) => (
        <div className="workflow-step" key={index}>
          <label>
            Operation
            <select
              value={step.id}
              onChange={event =>
                update(steps.map((prev, i) => (i === index ? newStep(event.target.value) : prev)))
              }
            >
              {workflowTools.map(id => (
                <option key={id} value={id}>
                  {byId.get(id).title}
                </option>
              ))}
            </select>
          </label>
          {byId
            .get(step.id)
            .fields.filter(field => !['pages', 'password'].includes(field.key))
            .map(field => (
              <Field
                key={field.key}
                field={field}
                value={step[field.key]}
                onChange={value =>
                  update(
                    steps.map((prev, i) => (i === index ? { ...prev, [field.key]: value } : prev)),
                  )
                }
              />
            ))}
          <button
            type="button"
            disabled={steps.length === 1}
            onClick={() => update(steps.filter((_, i) => i !== index))}
          >
            Remove
          </button>
        </div>
      ))}
      <button
        type="button"
        disabled={steps.length >= 8}
        onClick={() => update([...steps, newStep('rotate-pdf')])}
      >
        Add operation
      </button>
    </div>
  );
}
