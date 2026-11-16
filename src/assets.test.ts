import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { expect, it } from 'vitest';
import originals from '../public/sounds/originals.json';

it.each(originals.files)('conserva el audio original $name', ({ name, size, sha }) => {
  const bytes = readFileSync(new URL(`../public/sounds/${name}`, import.meta.url));
  expect(bytes.length).toBe(size);
  const gitBlob = createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex');
  expect(gitBlob).toBe(sha);
});
