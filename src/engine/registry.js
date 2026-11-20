/** @file Maps catalog tool IDs to handlers that share a single invocation context. */
import { analyzeTools } from './analyze.js';
import { convertFromTools } from './convert-from.js';
import { convertToTools } from './convert-to.js';
import { editTools } from './edit.js';
import { organizeTools } from './organize.js';
import { securityTools } from './security.js';
import { workflowTools } from './workflow.js';

/**
 * @typedef {object} ToolContext
 * @property {File[]} files Selected input files in their original order.
 * @property {File | undefined} file The first file, when the tool requires one.
 * @property {Record<string, any>} options Tool-specific settings.
 * @property {(message: string) => void} progress Reports the current operation.
 * @property {typeof import('../engine.js').runTool} runTool Dispatches workflow steps.
 * @property {<T>(file: File, options: Record<string, any>, work: (doc: any) => T | Promise<T>) => Promise<T>} withRender Opens a PDF.js document for the callback.
 */

/** @typedef {{ name: string, blob: Blob, note?: string } | { speech: string }} ToolResult */
/** @typedef {(context: ToolContext) => Promise<ToolResult>} ToolHandler */

/** @type {Record<string, ToolHandler>} */
export const toolRegistry = {
  ...organizeTools,
  ...editTools,
  ...securityTools,
  ...convertToTools,
  ...convertFromTools,
  ...analyzeTools,
  ...workflowTools,
};
