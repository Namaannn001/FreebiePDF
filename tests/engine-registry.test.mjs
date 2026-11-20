import assert from 'node:assert/strict';
import test from 'node:test';
import { all } from '../src/catalog.js';
import { runTool } from '../src/engine.js';
import { toolRegistry } from '../src/engine/registry.js';

test('every catalog tool has a registered handler', () => {
  for (const { id } of all) {
    assert.ok(Object.hasOwn(toolRegistry, id), 'Missing handler for ' + id);
    assert.equal(typeof toolRegistry[id], 'function', id);
  }
});

test('runTool rejects unknown IDs', async () => {
  for (const id of ['unknown-tool', 'constructor']) {
    await assert.rejects(runTool(id, []), { message: 'Unknown PDF tool: ' + id });
  }
});
