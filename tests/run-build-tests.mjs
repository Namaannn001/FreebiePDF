// Builds the site with SITE_URL set (no env tooling needed, works on every OS), then runs tests/build/*.test.mjs.
// Pass --no-build to reuse an existing dist/.
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const env = { ...process.env, SITE_URL: process.env.SITE_URL ?? 'https://example.com/' };

function run(args) {
  const result = spawnSync(process.execPath, args, { cwd: root, env, stdio: 'inherit' });
  if (result.status !== 0) process.exit(result.status ?? 1);
}

if (!process.argv.includes('--no-build')) {
  run([fileURLToPath(new URL('../node_modules/vite/bin/vite.js', import.meta.url)), 'build']);
}
run(['--test', 'tests/build/*.test.mjs']);
