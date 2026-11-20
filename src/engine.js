/** @file Public entry point for running PDF tools. */
import { byId } from './catalog.js';
import { toolRegistry } from './engine/registry.js';
import { withRender as withPdfDocument } from './engine/render.js';

function withRender(file, options, work) {
  return withPdfDocument(file, options, work, import.meta.env.BASE_URL);
}

/** Runs a catalog tool with the supplied files, options, and progress callback. */
export async function runTool(id, files, options = {}, progress = () => {}) {
  if (!Object.hasOwn(toolRegistry, id)) throw new Error('Unknown PDF tool: ' + id);
  const file = files[0];
  if (!file && !byId.get(id)?.noFile) throw new Error('Choose a file first.');
  return toolRegistry[id]({ file, files, options, progress, withRender, runTool });
}
