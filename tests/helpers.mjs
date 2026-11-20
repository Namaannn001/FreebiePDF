import { existsSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
export const dist = join(root, 'dist');

// Fails with a clear message when the tests need a build that is not there.
export function requireDist(...files) {
  for (const file of ['index.html', ...files]) {
    if (!existsSync(join(dist, file))) {
      throw new Error(
        `dist/${file} is missing. Build first with SITE_URL set, for example "npm run test:build" ` +
          '(or SITE_URL=https://example.com/ npm run build).',
      );
    }
  }
}

// Creates a temp dir under os.tmpdir() and returns it with a cleanup function.
// Retries cover Chrome helper processes that write to the profile briefly after exit.
export function tempDir(prefix = 'anywherepdf-test-') {
  const dir = mkdtempSync(join(tmpdir(), prefix));
  return {
    dir,
    cleanup: () => rmSync(dir, { force: true, recursive: true, maxRetries: 10, retryDelay: 100 }),
  };
}
