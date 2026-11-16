import $ from 'jquery';
import installTerminal from 'jquery.terminal';
import 'jquery.terminal/css/jquery.terminal.min.css';
import './style.css';
import { commands, execute, index, live, newGame, next, ready, restore, SAVE_KEY, start, synchrony, target, tick, tune, type Game, type Reply } from './game';
import { cue, setAudio, stopAudio, syncAudio } from './audio';
import { createEffects } from './effects';
import { commandFeedback, createFeedback } from './feedback';
import { createCRT } from './crt';
import { LANGUAGE_KEY, language, setLanguage, t } from './i18n';

installTerminal(window, $);
const el = <T extends HTMLElement = HTMLElement>(id: string) => document.getElementById(id) as T;
const text = (id: string, value: string) => {
  const node = el(id);
  const translated = node.closest('#console') ? value : t(value);
  if (node.textContent !== translated) node.textContent = translated;
};
let game = newGame();
let storageProblem = '';
let restored = false;
let audioOn = false;
let audioFailed = false;
let emergency = false;
try { setLanguage(localStorage.getItem(LANGUAGE_KEY)); } catch { /* Keep the default when storage is unavailable. */ }
try {
  const raw = localStorage.getItem(SAVE_KEY);
  if (raw) {
    const saved = restore(raw);
    if (saved) { game = saved; restored = true; }
    else storageProblem = 'Invalid save. A new mission will start.';
  }
} catch { storageProblem = 'Saving is unavailable. You can play without saving.'; }

function save() {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify({ version: 1, game }));
    storageProblem = '';
  } catch { storageProblem = 'Could not save. Keep this page open.'; }
  text('save-status', storageProblem);
}

function print(reply: Reply) {
  const color = reply.kind === 'error' ? '#ff5065' : '#89f5c9';
  reply.lines.forEach(line => {
    // oxlint-disable-next-line no-control-regex -- Strip control characters before rendering terminal output.
    const safe = $.terminal.escape_formatting(line.replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, ''));
    terminal.echo(`[[;${color};]${safe}]`, { raw: false, exec: false, formatters: false });
  });
  output.scrollTop = output.scrollHeight;
}

function run(command: string) {
  if (!command.trim()) return;
  const clean = command.trim().replace(/\s+/g, ' ').toLowerCase();
  terminal.echo(`[[;#ffbe19;]> ${$.terminal.escape_formatting(command.slice(0, 300))}]`, { raw: false, exec: false, formatters: false });
  if (clean === 'clear') { terminal.clear(); acknowledge(clean, game, { kind: 'info', lines: ['Console history cleared.'] }); return; }
  if (clean === 'ichidai reset all' || clean === 'restart') { openReset(); return; }
  const before = { ...game };
  const reply = execute(game, command);
  print(reply);
  if (!game.paused) cue(reply.kind === 'error' ? 'alert' : 'CD');
  lastFrame = performance.now();
  render(); save();
  acknowledge(clean, before, reply);
}

const terminal = $('#terminal').terminal(run, {
  name: 'minerva',
  greetings: null,
  prompt: 'minerva > ',
  enabled: false,
  memory: true,
  historySize: 80,
  historyState: false,
  outputLimit: 180,
  echoCommand: false,
  exit: false,
  clear: false,
  completionEscape: false,
  wordAutocomplete: false,
  completion: (_input, callback) => callback(commands(game)),
  raw: false,
  invokeMethods: false,
  execHash: false,
  execHistory: false,
  anyLinks: false,
  convertLinks: false,
  scrollOnEcho: false,
  // The prompt is larger than the history; let CSS wrap history at its own size.
  wrap: false,
  onAfterRedraw() {
    const history = document.querySelector<HTMLElement>('#terminal .terminal-output');
    if (history) history.scrollTop = history.scrollHeight;
  },
  keydown(event) {
    const key = event.key?.toLowerCase();
    if (key === 'escape' || (key === 'tab' && event.shiftKey)) {
      terminal.disable();
      el('focus-terminal').focus();
      return false;
    }
    if (live(game) && !game.paused && event.key?.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) cue('Pica');
  },
});
terminal.find('textarea').attr('aria-label', 'Enter a Minerva command');
terminal.find('[role="log"]').attr('aria-label', 'Minerva responses');
// A deferred caret update can refocus a disabled terminal; disable its native input too.
document.addEventListener('focusin', event => {
  if (event.target instanceof Node && !terminal[0].contains(event.target)) {
    terminal.disable();
    terminal.find('textarea').prop('disabled', true);
  }
});
terminal[0].addEventListener('pointerdown', () => terminal.find('textarea').prop('disabled', false));
const output = terminal.find('.terminal-output')[0];
const effects = createEffects(el<HTMLCanvasElement>('wave-effects'), el<HTMLCanvasElement>('portal-effects'), el<HTMLImageElement>('portal-world'), el<HTMLCanvasElement>('toroid-effects'));
const feedback = createFeedback();
const crt = createCRT();
if (import.meta.hot) import.meta.hot.dispose(() => { effects.dispose(); feedback.dispose(); crt.dispose(); });

function acknowledge(command: string, before: Game, reply: Reply) {
  const response = commandFeedback(command, before, game, reply);
  feedback.play(response, emergency);
  effects.trigger(response, game);
}

function focusConsole() {
  if (el('guide').matches(':popover-open')) el('guide').hidePopover();
  if (game.stage === 'standby') { el('start').focus(); return; }
  terminal.find('textarea').prop('disabled', false);
  terminal.enable().focus();
  terminal.find('textarea').trigger('focus');
}

function setSound(on: boolean) {
  audioOn = on;
  audioFailed = false;
  setAudio(on, () => {
    audioOn = false;
    audioFailed = true;
    setAudio(false, () => {});
    text('sound', 'Sound unavailable');
    el('sound').setAttribute('aria-pressed', 'false');
    el('sound').title = t('Audio could not play. Press to retry.');
  });
  text('sound', on ? 'Sound on' : 'Sound off');
  el('sound').setAttribute('aria-pressed', String(on));
  syncAudio(game);
}

function begin() {
  const before = { ...game };
  start(game);
  render(); save(); focusConsole();
  setSound(true);
  cue('turnONmonitors'); cue('turnONpc');
  print({ kind: 'info', lines: [
    'MINERVA / return protocol started',
    'Ichidai, Nidai and Sandai are responding. The home beacon is still transmitting.',
    'Start with: ichidai plug w_matter',
    'Use logs to read the logbook, help for commands, or hint for guidance.',
  ] });
  acknowledge('begin', before, { kind: 'success', lines: ['Return protocol started. Systems awaiting commands.'] });
}

el('start').addEventListener('click', event => { event.stopPropagation(); begin(); });
el('focus-terminal').addEventListener('click', event => { event.stopPropagation(); focusConsole(); });
el('sound').addEventListener('click', () => setSound(!audioOn));
el('emergency').addEventListener('click', () => {
  emergency = !emergency;
  document.documentElement.classList.toggle('emergency', emergency);
  el('emergency').setAttribute('aria-pressed', String(emergency));
  renderLanguageControls();
  feedback.stop();
  feedback.play({ system: 'console', motion: 'read', targets: [], kind: 'info', message: emergency ? 'Emergency protocol active. Basic controls available.' : 'Main interface restored.' }, emergency);
  drawWave();
  render();
  effects.render(game, reducedMotion.matches || emergency, emergency);
  crt.render(performance.now(), emergency, game.paused, reducedMotion.matches);
  terminal.resize();
});
el('pause').addEventListener('click', () => { run(game.paused ? 'resume' : 'pause'); });
el('restart').addEventListener('click', openReset);
el('fullscreen').hidden = !document.fullscreenEnabled;
el('fullscreen').addEventListener('click', async () => {
  try {
    if (document.fullscreenElement) await document.exitFullscreen();
    else await document.documentElement.requestFullscreen();
  } catch { print({ kind: 'info', lines: ['Fullscreen unavailable. You can keep playing in this window.'] }); }
});
document.addEventListener('fullscreenchange', () => {
  renderLanguageControls();
  terminal.resize();
});
function openReset() {
  acknowledge('restart', game, { kind: 'info', lines: ['Restart awaiting confirmation.'] });
  terminal.disable(); el<HTMLDialogElement>('reset-dialog').showModal();
}
el('cancel-reset').addEventListener('click', () => { el<HTMLDialogElement>('reset-dialog').close(); focusConsole(); });
el('confirm-reset').addEventListener('click', () => { el<HTMLDialogElement>('reset-dialog').close(); reset(); });
function reset() {
  stopAudio();
  game = newGame();
  terminal.clear(); terminal.history().clear();
  lastFrame = performance.now();
  resultShown = false;
  begin();
}
el('replay').addEventListener('click', () => { el<HTMLDialogElement>('result-dialog').close(); reset(); });
el('close-result').addEventListener('click', () => { el<HTMLDialogElement>('result-dialog').close(); focusConsole(); });
for (const id of ['reset-dialog', 'result-dialog']) {
  el(id).addEventListener('click', event => event.stopPropagation());
  el<HTMLDialogElement>(id).addEventListener('close', () => { if (game.stage !== 'standby') focusConsole(); });
}

document.querySelectorAll<HTMLButtonElement>('[data-command]').forEach(button => button.addEventListener('click', () => {
  if (game.stage === 'standby') { focusConsole(); return; }
  terminal.exec(button.dataset.command!);
}));
el('insert-command').addEventListener('click', event => { event.stopPropagation(); terminal.set_command(next(game)[1]); focusConsole(); });
document.querySelectorAll<HTMLButtonElement>('[data-signal]').forEach(button => button.addEventListener('click', () => {
  run(`sandai select ${Number(button.dataset.signal) + 1}`);
}));
for (const id of ['frequency', 'amplitude']) el<HTMLInputElement>(id).addEventListener('input', () => {
  if (game.paused) return;
  const before = { ...game };
  const reply = tune(game, Number(el<HTMLInputElement>('frequency').value), Number(el<HTMLInputElement>('amplitude').value) / 100);
  render();
  acknowledge(`sandai tune ${game.frequency} ${game.amplitude}`, before, reply);
});
for (const id of ['frequency', 'amplitude']) el(id).addEventListener('change', save);
el('lock-signal').addEventListener('click', () => { terminal.exec('sandai lock'); });

function render() {
  const n = index(game);
  const active = live(game);
  document.body.dataset.standby = String(game.stage === 'standby');
  document.body.dataset.paused = String(game.paused);
  document.body.dataset.danger = String(['open', 'transfer'].includes(game.stage) && game.remaining <= 12);
  document.body.dataset.portalOpen = String(['open', 'transfer', 'won'].includes(game.stage));
  el('welcome').hidden = game.stage !== 'standby';
  el<HTMLButtonElement>('pause').disabled = !active;
  document.querySelectorAll<HTMLButtonElement>('[data-command]').forEach(button => { button.disabled = game.stage === 'standby'; });
  text('pause', game.paused ? 'Resume' : 'Pause');
  text('console-status', game.paused ? 'Mission paused' : 'Local connection');
  text('clock', `${String(Math.floor(Math.ceil(game.remaining) / 60)).padStart(2, '0')}:${String(Math.ceil(game.remaining) % 60).padStart(2, '0')}`);
  text('mission-state', game.paused ? 'Clock stopped' : game.stage === 'won' ? 'Returned home' : game.stage === 'lost' ? 'Window closed' : ['open', 'transfer'].includes(game.stage) ? 'Time remaining' : 'On portal opening');
  text('mission-summary', game.stage === 'standby' ? 'Three systems. One signal. One way home.' : next(game)[0]);
  for (const resource of ['energy', 'cooling', 'matter'] as const) {
    const value = Math.floor(game[resource]);
    text(`${resource}-value`, String(value));
    el<HTMLMeterElement>(resource).value = value;
    el(resource).textContent = `${value} %`;
    el(resource).parentElement!.style.setProperty('--level', String(value / 100));
  }
  text('magnet-state', effects.ignition(game, reducedMotion.matches || emergency).label);
  text('ichi-state', ready(game, 'toroid') ? 'Operational' : active ? 'Preparing' : 'Standby');
  el('ichidai').dataset.active = String(active && !ready(game, 'toroid'));
  const linked = n >= 8 && game.stage !== 'lost';
  text('nida-state', linked ? 'Linked' : 'No link');
  text('destination', linked ? '532924 / Home' : game.stage === 'connect' ? target(game).code : 'Unknown');
  text('reader-state', ready(game, 'reader') ? 'Online' : 'Offline');
  text('transfer-value', game.stage === 'won' ? 'Complete' : game.transferred > 0 ? `${Math.floor(game.transferred * 10)} %` : 'Standby');
  el('transfer-status').hidden = game.transferred === 0 && game.stage !== 'won';
  text('portal-state', ['open', 'transfer'].includes(game.stage) ? 'Open' : game.stage === 'won' ? 'Returned home' : 'Closed');
  el('nidai').dataset.active = String(['reader', 'portal', 'open', 'transfer'].includes(game.stage));
  document.getElementById('portal-progress')!.setAttribute('stroke-dasharray', `${game.stage === 'won' ? 100 : game.stage === 'transfer' ? game.transferred * 10 : game.stage === 'open' ? game.remaining / 45 * 100 : linked ? 100 : 0} 100`);
  const hasSignal = n >= 6;
  const tuning = game.stage === 'tuning';
  text('sanda-state', hasSignal ? game.stage === 'tuning' ? 'Tuning' : 'Signal locked' : 'No signal');
  text('sync-value', hasSignal ? `${synchrony(game)} %` : 'No data');
  el('sync-value').dataset.empty = String(!hasSignal);
  el('wave-empty').hidden = hasSignal;
  text('wave-empty', ready(game, 'reader') ? 'Reader online - scan for signals' : 'Enable the reader to scan');
  el('sandai').dataset.active = String(tuning);
  document.querySelectorAll<HTMLButtonElement>('[data-signal]').forEach(button => {
    button.disabled = game.paused || !['tuning', 'connect'].includes(game.stage);
    button.setAttribute('aria-pressed', String(Number(button.dataset.signal) === game.signal));
  });
  el('tuning').hidden = !tuning;
  el<HTMLInputElement>('frequency').value = String(game.frequency);
  el<HTMLInputElement>('amplitude').value = String(Math.round(game.amplitude * 100));
  for (const id of ['frequency', 'amplitude', 'lock-signal']) (el(id) as HTMLInputElement | HTMLButtonElement).disabled = game.paused;
  text('frequency-value', `${game.frequency.toFixed(1)} Hz`);
  text('amplitude-value', `${Math.round(game.amplitude * 100)} %`);
  text('frequency-control-value', `${game.frequency.toFixed(1)} Hz`);
  text('amplitude-control-value', `${Math.round(game.amplitude * 100)} %`);
  text('lock-signal', synchrony(game) >= 97 ? 'Lock signal · synchronized' : 'Lock signal');
  const completed = [n >= 4, n >= 5, n >= 6, n >= 7, n >= 8, n >= 9, game.stage === 'won'];
  let marked = false;
  document.querySelectorAll('#steps li').forEach((step, i) => {
    step.classList.toggle('done', completed[i]);
    const current = !completed[i] && !marked && active;
    step.classList.toggle('current', current);
    if (current) { marked = true; step.setAttribute('aria-current', 'step'); } else step.removeAttribute('aria-current');
  });
  text('step-count', `${completed.filter(Boolean).length} / 7`);
  text('next-title', game.paused ? 'Mission paused' : next(game)[0]);
  text('next-description', game.paused ? 'Press Resume to continue from here.' : next(game)[1]);
  el('insert-command').hidden = game.paused || !['matter', 'cooling', 'toroid', 'reader', 'scan', 'connect', 'portal', 'open'].includes(game.stage);
  syncAudio(game);
}

function renderResult() {
  const won = game.stage === 'won';
  text('result-heading', won ? 'You are home.' : 'The portal has closed.');
  text('result-description', won ? 'Across the portal, the base lights are still on. All three subsystems have completed the return. Welcome home.' : 'The return window has expired. Next time, start the transfer as soon as you open the portal. You can try again.');
  text('result-stats', t('Mission time: {minutes} min {seconds} s · Energy remaining: {energy}%', {
    minutes: Math.floor(game.elapsed / 60), seconds: Math.floor(game.elapsed % 60), energy: Math.floor(game.energy),
  }));
}

let resultShown = false;
function showResult() {
  if (resultShown || !['won', 'lost'].includes(game.stage)) return;
  resultShown = true;
  renderResult();
  terminal.disable();
  el<HTMLDialogElement>('result-dialog').showModal();
}

const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
function drawWave() {
  if (index(game) < 6) {
    document.getElementById('reference-wave')!.removeAttribute('d');
    document.getElementById('player-wave')!.removeAttribute('d');
    return;
  }
  const offset = reducedMotion.matches || emergency ? 0 : game.elapsed * 0.8;
  function path(frequency: number, amplitude: number) {
    let d = '';
    for (let x = 0; x <= 400; x += 3) {
      const y = 50 - Math.sin((x / 400 * frequency - offset) * Math.PI * 2) * amplitude * 50;
      d += `${x ? 'L' : 'M'}${x},${y.toFixed(2)} `;
    }
    return d;
  }
  document.getElementById('reference-wave')!.setAttribute('d', path(target(game).frequency, target(game).amplitude));
  document.getElementById('player-wave')!.setAttribute('d', path(game.frequency, game.amplitude));
}

let lastFrame = performance.now();
let lastPaint = 0;
let lastSave = 0;
function frame(now: number) {
  const reply = tick(game, (now - lastFrame) / 1000);
  lastFrame = now;
  if (reply) { print(reply); render(); save(); showResult(); }
  if (now - lastPaint >= 50) { drawWave(); render(); lastPaint = now; }
  effects.render(game, reducedMotion.matches || emergency, emergency);
  crt.render(now, emergency, game.paused, reducedMotion.matches);
  if (live(game) && !game.paused && now - lastSave >= 1000) { save(); lastSave = now; }
  requestAnimationFrame(frame);
}
document.addEventListener('visibilitychange', () => {
  if (document.hidden && live(game) && !game.paused) {
    game.paused = true;
    print({ kind: 'info', lines: ['Mission paused after leaving the tab. Type resume when you return.'] });
    render(); save();
  }
  lastFrame = performance.now();
});
window.addEventListener('pagehide', save);
function renderLanguageControls() {
  text('sound', audioFailed ? 'Sound unavailable' : audioOn ? 'Sound on' : 'Sound off');
  el('sound').title = audioFailed ? t('Audio could not play. Press to retry.') : '';
  el('emergency').title = t(emergency ? 'Disable emergency protocol' : 'Enable emergency protocol');
  text('protocol-name', emergency ? ' / Emergency protocol' : ' / Return protocol');
  el('wave').setAttribute('aria-label', t(emergency ? 'Comparison of the dashed cyan reference and your solid magenta signal' : 'Comparison of the cyan reference and your magenta signal'));
  el('fullscreen').setAttribute('aria-label', t(document.fullscreenElement ? 'Exit fullscreen' : 'Enter fullscreen'));
}

function applyLanguage() {
  document.documentElement.lang = language;
  document.title = t('Minerva · Return protocol');
  document.querySelector('meta[name="description"]')!.setAttribute('content', t('Minerva: a journey home through a console, three subsystems and a portal.'));
  document.querySelectorAll<HTMLElement>('[data-i18n]').forEach(node => { node.textContent = t(node.dataset.i18n!); });
  for (const attribute of ['aria-label', 'title']) {
    document.querySelectorAll(`[data-i18n-${attribute}]`).forEach(node => {
      node.setAttribute(attribute, t(node.getAttribute(`data-i18n-${attribute}`)!));
    });
  }
  el<HTMLSelectElement>('language').value = language;
  feedback.stop();
  renderLanguageControls();
  render();
  if (['won', 'lost'].includes(game.stage)) renderResult();
  terminal.resize();
}

el('language').addEventListener('change', () => {
  setLanguage(el<HTMLSelectElement>('language').value);
  applyLanguage();
  try {
    localStorage.setItem(LANGUAGE_KEY, language);
    text('language-status', '');
  } catch {
    text('language-status', 'The language could not be saved. It will last until you close this page.');
  }
});
applyLanguage();
text('save-status', storageProblem);
if (restored && game.stage !== 'standby') {
  terminal.enable();
  print({ kind: 'info', lines: ['Session restored.', live(game) ? 'Mission paused. Type resume to continue.' : next(game)[0], ...next(game)] });
} else terminal.disable();
document.fonts.ready.then(() => terminal.resize());
requestAnimationFrame(frame);
