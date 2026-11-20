/** @file Chaining PDF operations with the same dispatcher as standalone tools. */
import { PDF, read } from './shared.js';

/** Runs one to eight operations in sequence and returns the final PDF. */
async function workflow({ file, options, progress, runTool }) {
  const steps = options.steps ?? [];
  if (!steps.length || steps.length > 8) throw new Error('Add one to eight operations.');
  let { input } = await read(file, options.password);
  for (const step of steps) {
    progress('Running ' + step.label + '…');
    const processed = await runTool(step.id, [input], { ...step });
    input = new File([processed.blob], processed.name, { type: PDF });
  }
  return { name: 'workflow.pdf', blob: input };
}

export const workflowTools = { workflow };
