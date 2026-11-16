import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, delimiter } from 'node:path';
import { fileURLToPath } from 'node:url';
import { expect, it } from 'vitest';

it('solo comprueba y permite subir un commit limpio que corresponde a la copia de trabajo', () => {
  const directory = mkdtempSync(join(tmpdir(), 'minerva-hook-'));
  const hook = fileURLToPath(new URL('../.githooks/pre-push', import.meta.url));
  // A pre-commit run must not pass its repository/index into this disposable fixture.
  const environment = Object.fromEntries(Object.entries(process.env).filter(([name]) => !name.startsWith('GIT_')));
  const git = (...args: string[]) => execFileSync('git', args, { cwd: directory, env: environment, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
  try {
    git('init', '-b', 'main');
    git('config', 'user.name', 'Minerva test');
    git('config', 'user.email', 'test@example.invalid');
    git('config', 'core.hooksPath', '/dev/null');
    git('-c', 'commit.gpgsign=false', 'commit', '--allow-empty', '-m', 'base');
    const previous = git('rev-parse', 'HEAD');
    writeFileSync(join(directory, 'game.txt'), 'original');
    git('add', 'game.txt');
    git('-c', 'commit.gpgsign=false', 'commit', '-m', 'game');
    const current = git('rev-parse', 'HEAD');
    const bin = join(directory, '.git', 'test-bin');
    mkdirSync(bin);
    const log = join(directory, '.git', 'checks.log');
    writeFileSync(join(bin, 'npm'), '#!/bin/sh\nprintf "%s\\n" "$*" >> .git/checks.log\n', { mode: 0o755 });
    const push = (sha = current) => spawnSync('sh', [hook], {
      cwd: directory,
      input: `refs/heads/main ${sha} refs/heads/main ${previous}\n`,
      env: { ...environment, PATH: `${bin}${delimiter}${environment.PATH}` },
      encoding: 'utf8',
    });
    expect(push().status).toBe(0);
    expect(readFileSync(log, 'utf8')).toBe('run ci:local\n');
    expect(push(previous).status).toBe(1);
    writeFileSync(join(directory, 'game.txt'), 'changed');
    expect(push().status).toBe(1);
    git('add', 'game.txt');
    expect(push().status).toBe(1);
    git('restore', '--source=HEAD', '--staged', '--worktree', 'game.txt');
    writeFileSync(join(directory, 'untracked.txt'), 'not committed');
    expect(push().status).toBe(1);
    expect(readFileSync(log, 'utf8')).toBe('run ci:local\n');
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});
