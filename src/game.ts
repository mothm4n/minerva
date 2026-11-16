export const WORLDS = [
  // shortcut: shared placeholder art, replace each image when its world artwork is supplied.
  { code: '985656', frequency: 2.2, amplitude: 0.38, image: '/worlds/volcanic-citadel.png' },
  { code: '532924', frequency: 3.4, amplitude: 0.62, image: '/worlds/volcanic-citadel.png' },
  { code: '452876', frequency: 4.6, amplitude: 0.45, image: '/worlds/volcanic-citadel.png' },
  { code: '654321', frequency: 1.6, amplitude: 0.76, image: '/worlds/volcanic-citadel.png' },
  { code: '825459', frequency: 5.2, amplitude: 0.54, image: '/worlds/volcanic-citadel.png' },
] as const;

export const STAGES = ['standby', 'matter', 'cooling', 'toroid', 'reader', 'scan', 'tuning', 'connect', 'portal', 'open', 'transfer', 'won', 'lost'] as const;
export type Stage = typeof STAGES[number];
export interface Game {
  stage: Stage;
  energy: number;
  cooling: number;
  matter: number;
  signal: number;
  frequency: number;
  amplitude: number;
  remaining: number;
  transferred: number;
  elapsed: number;
  paused: boolean;
}
export interface Reply { lines: string[]; kind: 'info' | 'success' | 'error' }
const info = (...lines: string[]): Reply => ({ lines, kind: 'info' });
const success = (...lines: string[]): Reply => ({ lines, kind: 'success' });
const error = (...lines: string[]): Reply => ({ lines, kind: 'error' });

export function newGame(): Game {
  return { stage: 'standby', energy: 100, cooling: 0, matter: 0, signal: 0, frequency: 1, amplitude: 0.25, remaining: 45, transferred: 0, elapsed: 0, paused: false };
}
export const index = (game: Game) => STAGES.indexOf(game.stage);
export const live = (game: Game) => !['standby', 'won', 'lost'].includes(game.stage);
export const synchrony = (game: Game) => Math.max(0, Math.round(100 - Math.abs(game.frequency - WORLDS[game.signal].frequency) * 20 - Math.abs(game.amplitude - WORLDS[game.signal].amplitude) * 80));
export const target = (game: Game) => WORLDS[game.signal];
export const ready = (game: Game, stage: Stage) => index(game) > STAGES.indexOf(stage);

export function start(game: Game) {
  if (game.stage === 'standby') game.stage = 'matter';
}

const NEXT: Record<Stage, [string, string]> = {
  standby: ['Start the mission', 'Press “Start mission” to activate the console.'],
  matter: ['Load W matter', 'ichidai plug w_matter'],
  cooling: ['Enable cooling', 'ichidai plug cooling'],
  toroid: ['Power up the toroid', 'ichidai plug toroid'],
  reader: ['Enable the reader', 'nidai set reader'],
  scan: ['Scan for signals', 'sandai show connections'],
  tuning: ['Synchronize the home signal', 'Select signal 2. Adjust frequency and amplitude to reach 97%. Then: sandai lock'],
  connect: ['Connect to the destination', 'nidai connect '],
  portal: ['Open the portal', 'nidai start portal'],
  open: ['Start the transfer', 'nidai transfer'],
  transfer: ['Transfer in progress', 'Keep the link active. Transfer takes 10 seconds.'],
  won: ['You have returned home', 'Transfer is complete. All systems can rest.'],
  lost: ['The connection has closed', 'Restart the mission to try again.'],
};

export function next(game: Game): [string, string] {
  if (game.stage === 'connect') return ['Connect to the destination', `nidai connect ${target(game).code}`];
  return NEXT[game.stage];
}

const SETUP = [
  ['ichidai plug w_matter', 'matter', 'cooling', 12, 'W matter loaded. Reserve at 100%.'],
  ['ichidai plug cooling', 'cooling', 'toroid', 10, 'Cooling circuit active.'],
  ['ichidai plug toroid', 'toroid', 'reader', 18, 'Toroid powered up. Magnetic field stable.'],
  ['nidai set reader', 'reader', 'scan', 5, 'Beta spectrum reader online. Sandai can scan for signals.'],
] as const;

export function commands(game: Game): string[] {
  const list = ['help', 'hint', 'logs', 'status', 'clear', 'pause', 'resume', 'ichidai reset all', ...SETUP.map(s => s[0]), 'ichidai show power', 'ichidai show cooling', 'ichidai show w_matter', 'sandai show connections', 'sandai select', 'sandai tune', 'sandai lock', 'nidai start portal', 'nidai transfer'];
  if (['connect', 'portal'].includes(game.stage)) list.push(`nidai connect ${target(game).code}`);
  return list;
}

export function selectSignal(game: Game, signal: number): Reply {
  if (!['tuning', 'connect'].includes(game.stage)) return error('Scan for signals first: sandai show connections');
  if (!Number.isInteger(signal) || signal < 0 || signal >= WORLDS.length) return error('Choose a signal from 1 to 5.');
  game.signal = signal;
  game.stage = 'tuning';
  return info(`Signal ${signal + 1} selected. Match your magenta wave to the cyan reference.`);
}

export function tune(game: Game, frequency: number, amplitude: number): Reply {
  if (game.stage !== 'tuning') return error('Tuning is available after scanning for signals.');
  if (!Number.isFinite(frequency) || !Number.isFinite(amplitude) || frequency < 0.5 || frequency > 6 || amplitude < 0.1 || amplitude > 0.9) return error('Frequency: 0.5 to 6 Hz. Amplitude: 0.1 to 0.9. Example: sandai tune 2.5 0.4');
  game.frequency = Math.round(frequency * 10) / 10;
  game.amplitude = Math.round(amplitude * 100) / 100;
  return info(`Synchrony: ${synchrony(game)}%. Threshold: 97%.`);
}

export function execute(game: Game, input: string): Reply {
  const cmd = input.trim().replace(/\s+/g, ' ').toLowerCase();
  if (cmd === 'help') return info(
    'MINERVA / Operating manual',
    'Ichidai  - ichidai plug w_matter / cooling / toroid',
    '           ichidai show power / cooling / w_matter',
    'Nidai    - nidai set reader · nidai connect <code>',
    '           nidai start portal · nidai transfer',
    'Sandai   - sandai show connections · sandai select <1-5>',
    '           sandai tune <Hz> <amplitude> · sandai lock',
    'Utility  - logs · hint · status · clear · pause · resume',
    'Restart  - ichidai reset all (asks for confirmation)',
    'Tab completes commands. ↑/↓ recall history. Esc leaves the console.',
  );
  if (cmd === 'logs') return info(
    'LOGBOOK / last recovered entry',
    'The jump left us on the other side. We still have power, but the toroid is cold.',
    'Connect W matter, cooling and the toroid, in that order. Then enable the reader.',
    'Our beacon is still on the SECOND signal. The waveform is its signature.',
    'Match the reference frequency and amplitude. At 97% you can lock the destination.',
    'Once the portal opens, you have 45 seconds. The transfer takes 10.',
    'You are not alone: Ichidai supplies power, Sandai finds the way and Nidai takes you home.',
  );
  if (cmd === 'hint') return info(...next(game));
  if (cmd === 'status') return info(`Status: ${next(game)[0]}.`, `Energy ${Math.floor(game.energy)}% · Cooling ${Math.floor(game.cooling)}% · W matter ${Math.floor(game.matter)}%`, game.paused ? 'Mission paused. Type resume to continue.' : next(game)[1]);
  if (cmd === 'pause' || cmd === 'resume') {
    if (!live(game)) return error('There is no active mission.');
    game.paused = cmd === 'pause';
    return info(game.paused ? 'Mission paused. The clock has stopped.' : 'Mission resumed.');
  }
  if (game.stage === 'standby') return error('Press “Start mission” to begin.');
  if (game.paused) return error('The mission is paused. Type resume.');
  if (!live(game)) return error('This mission has ended. You can restart it.');
  const setup = SETUP.find(s => s[0] === cmd);
  if (setup) {
    const [, required, following, cost, message] = setup;
    if (ready(game, required)) return info('That system is already active. No resources were consumed.');
    if (game.stage !== required) return error('A previous step is missing.', ...next(game));
    if (game.energy < cost) return error('Insufficient energy. Restart the mission.');
    game.energy -= cost;
    if (required === 'matter') game.matter = 100;
    if (required === 'cooling') game.cooling = 100;
    game.stage = following;
    return success(message);
  }
  if (cmd === 'ichidai show power') return info(`Power reserve: ${Math.floor(game.energy)}%. No leaks detected.`);
  if (cmd === 'ichidai show cooling') return info(`Cooling: ${Math.floor(game.cooling)}%.`);
  if (cmd === 'ichidai show w_matter') return info(`W matter: ${Math.floor(game.matter)}%.`);
  if (cmd === 'sandai show connections') {
    if (index(game) < STAGES.indexOf('scan')) return error('The reader is not active yet.', ...next(game));
    if (index(game) > STAGES.indexOf('connect')) return error('The destination is already linked. Continue with Nidai.');
    game.stage = 'tuning';
    return success('Five signals detected. The logbook identifies signal 2 as home.', 'Tune with sandai tune <Hz> <amplitude> and confirm with sandai lock. Tuning controls are available in Help.');
  }
  const selection = /^sandai select (\d+)$/.exec(cmd);
  if (selection) return selectSignal(game, Number(selection[1]) - 1);
  const tuning = /^sandai tune ([\d.]+) ([\d.]+)$/.exec(cmd);
  if (tuning) return tune(game, Number(tuning[1]), Number(tuning[2]));
  if (cmd === 'sandai lock') {
    if (game.stage !== 'tuning') return error('Scan and tune a signal first.');
    if (synchrony(game) < 97) return error(`Synchrony too low: ${synchrony(game)}%. You need at least 97%.`, 'The cyan reference and your magenta signal must match in height and frequency.');
    game.stage = 'connect';
    return success(`Signal locked at ${synchrony(game)}%. Destination code recovered: ${target(game).code}`, `Connect with: nidai connect ${target(game).code}`);
  }
  const connection = /^nidai connect (\d{6})$/.exec(cmd);
  if (connection) {
    if (game.stage === 'portal' && connection[1] === target(game).code) return info('The destination is already linked.');
    if (game.stage !== 'connect') return error('Lock a signal with Sandai first.');
    if (connection[1] !== target(game).code) return error('That code does not match the locked signal.');
    if (game.signal !== 1) return error('This is not the home beacon. Select signal 2 and synchronize again.');
    game.stage = 'portal';
    return success('Base link confirmed. Return coordinates verified.', 'All ready. Open the portal: nidai start portal');
  }
  if (cmd === 'nidai start portal') {
    if (game.stage === 'open' || game.stage === 'transfer') return info('The portal is already open.');
    if (game.stage !== 'portal') return error('The portal is not ready yet.', ...next(game));
    game.stage = 'open';
    return success('PORTAL OPEN / 45-second window.', 'Start the return: nidai transfer');
  }
  if (cmd === 'nidai transfer') {
    if (game.stage === 'transfer') return info('The transfer is already in progress.');
    if (game.stage !== 'open') return error('Open the portal first.');
    game.stage = 'transfer';
    return success('Transfer started. Holding the link for 10 seconds…');
  }
  return error(`Unknown command: ${input.slice(0, 120)}`, 'Type help for commands or hint for the next step.');
}

export function tick(game: Game, seconds: number): Reply | null {
  if (!live(game) || game.paused || !Number.isFinite(seconds) || seconds <= 0) return null;
  game.elapsed += seconds;
  if (!['open', 'transfer'].includes(game.stage)) return null;
  const untilDone = game.stage === 'transfer' ? 10 - game.transferred : Infinity;
  const resourceTime = Math.min(game.energy, game.cooling / 0.6, game.matter / 0.8);
  const step = Math.min(seconds, game.remaining, untilDone, resourceTime);
  game.remaining = Math.max(0, game.remaining - step);
  game.energy = Math.max(0, game.energy - step);
  game.cooling = Math.max(0, game.cooling - step * 0.6);
  game.matter = Math.max(0, game.matter - step * 0.8);
  if (game.stage === 'transfer') game.transferred = Math.min(10, game.transferred + step);
  if (game.transferred >= 10) {
    game.stage = 'won';
    return success('TRANSFER COMPLETE / life signal confirmed.', 'You are home. Ichidai, Nidai and Sandai are standing down.');
  }
  if (game.remaining <= 0 || game.energy <= 0 || game.cooling <= 0 || game.matter <= 0) {
    game.stage = 'lost';
    return error('The return window has closed. The transfer did not complete.', 'Restart the mission to try again.');
  }
  return null;
}

export const SAVE_KEY = 'minerva.prototype.v1';
export function restore(raw: string): Game | null {
  try {
    const value = JSON.parse(raw);
    if (value.version !== 1 || typeof value.game !== 'object' || !value.game) return null;
    const g = value.game;
    if (!STAGES.includes(g.stage) || typeof g.paused !== 'boolean') return null;
    const bounds: Record<string, [number, number]> = { energy: [0, 100], cooling: [0, 100], matter: [0, 100], frequency: [0.5, 6], amplitude: [0.1, 0.9], remaining: [0, 45], transferred: [0, 10], elapsed: [0, 1e8], signal: [0, 4] };
    for (const [key, [min, max]] of Object.entries(bounds)) if (typeof g[key] !== 'number' || !Number.isFinite(g[key]) || g[key] < min || g[key] > max) return null;
    if (!Number.isInteger(g.signal)) return null;
    return { stage: g.stage, energy: g.energy, cooling: g.cooling, matter: g.matter, signal: g.signal, frequency: g.frequency, amplitude: g.amplitude, remaining: g.remaining, transferred: g.transferred, elapsed: g.elapsed, paused: live(g) };
  } catch { return null; }
}
