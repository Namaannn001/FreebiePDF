import { toolSeo } from './seo-content.js';

export function guide(tool) {
  const entry = toolSeo[tool.id];
  if (!entry) throw new Error('Missing guide for ' + tool.id);
  return { steps: entry.steps, questions: entry.faq };
}

export const documentedTools = Object.keys(toolSeo);
