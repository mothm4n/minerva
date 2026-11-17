import { ready, type Game, type Reply } from './game';
import { t } from './i18n';

export const COMMAND_DURATION = 1200;
export const TOROID_DURATION = 3600;

export function commandFeedback(command: string, before: Game, after: Game, reply: Reply) {
  const clean = command.trim().replace(/\s+/g, ' ').toLowerCase();
  const prefix = clean.split(' ')[0];
  const system = ['ichidai', 'sandai', 'nidai'].includes(prefix) ? prefix : 'console';
  const targets = new Set<string>();
  let motion = 'read';
  if (clean.includes(' plug ')) motion = 'charge';
  if (clean === 'sandai show connections') motion = 'scan';
  if (/^sandai (select|tune) /.test(clean)) motion = 'tune';
  if (clean === 'sandai lock') motion = 'lock';
  if (clean === 'nidai set reader' || clean.startsWith('nidai connect ')) motion = 'link';
  if (clean === 'nidai start portal') motion = 'open';
  if (clean === 'nidai transfer') motion = 'transfer';
  if (reply.kind === 'error') motion = 'error';

  // Changes, rather than command intent, decide which readouts acknowledge success.
  if (reply.kind !== 'error') {
    for (const resource of ['energy', 'cooling', 'matter'] as const) {
      if (before[resource] !== after[resource]) targets.add(`.resource:has(#${resource})`);
    }
    if (ready(before, 'toroid') !== ready(after, 'toroid')) { targets.add('.toroid-state'); motion = 'toroid'; }
    if (ready(before, 'reader') !== ready(after, 'reader')) { targets.add('.reader-status'); targets.add('#wave-empty'); }
    if (before.stage === 'scan' && after.stage === 'tuning') targets.add('.signal-tabs');
    if (before.signal !== after.signal || clean.startsWith('sandai select ')) targets.add(`[data-signal="${after.signal}"]`);
    if (before.frequency !== after.frequency) targets.add('#frequency-value');
    if (before.amplitude !== after.amplitude) targets.add('#amplitude-value');
    if (system === 'sandai') targets.add('.sync-readout');
    if (before.stage !== after.stage && ['connect', 'portal'].includes(after.stage)) targets.add('.destination-status');
    if (before.stage !== after.stage && after.stage === 'open') {
      targets.add('.portal-status'); targets.add('.mission-time');
    }
    if (before.stage !== after.stage && after.stage === 'transfer') targets.add('#transfer-status');
    if (clean === 'ichidai show power') targets.add('.resource:has(#energy)');
    if (clean === 'ichidai show cooling') targets.add('.resource:has(#cooling)');
    if (clean === 'ichidai show w_matter') targets.add('.resource:has(#matter)');
    if (clean === 'status' || clean === 'begin') {
      targets.add('.resources'); targets.add('.sync-readout'); targets.add('.portal-status');
    }
    if (clean === 'pause' || clean === 'resume') { targets.add('#pause'); targets.add('.mission-time'); }
    if (clean === 'help' || clean === 'logs' || clean === 'hint') targets.add('.terminal-output');
  }
  // Repeated setup orders acknowledge the request without replaying activation.
  if (motion === 'charge' && before.stage === after.stage) motion = 'read';
  return { system, motion, targets: [...targets], kind: reply.kind, message: reply.lines[0] ?? '' };
}

export type CommandFeedback = ReturnType<typeof commandFeedback>;

export function createFeedback() {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const animations = new Map<Element, Animation>();
  const receipt = document.getElementById('command-feedback')!;
  const traces = new Map<Element, { trace: HTMLElement; stamp: HTMLElement }>();
  for (const panel of document.querySelectorAll('.panel')) {
    const trace = document.createElement('span');
    trace.className = 'command-trace';
    trace.setAttribute('aria-hidden', 'true');
    const stamp = document.createElement('b');
    stamp.className = 'command-stamp';
    stamp.setAttribute('aria-hidden', 'true');
    panel.append(trace, stamp);
    traces.set(panel, { trace, stamp });
  }

  function animate(node: Element, frames: Keyframe[], duration = COMMAND_DURATION) {
    animations.get(node)?.cancel();
    const animation = node.animate(frames, { duration, easing: 'linear' });
    animations.set(node, animation);
    animation.onfinish = () => { if (animations.get(node) === animation) animations.delete(node); };
  }
  function stop() { animations.forEach(animation => animation.cancel()); animations.clear(); }
  function hidden() { if (document.hidden) stop(); }
  reduced.addEventListener('change', stop);
  document.addEventListener('visibilitychange', hidden);

  return {
    stop,
    play(feedback: CommandFeedback, emergency = false) {
      const { system, motion, kind, targets, message } = feedback;
      const color = kind === 'error' ? '#ff3b45' : kind === 'success' ? '#37f8ab' : '#ffbe19';
      const duration = reduced.matches ? 300 : COMMAND_DURATION;
      receipt.dataset.kind = kind;
      receipt.dataset.motion = motion;
      document.getElementById('command-system')!.textContent = system === 'console' ? 'MINERVA' : system.toUpperCase();
      document.getElementById('command-result')!.textContent = message;
      if (emergency) { stop(); return; }
      const panels = new Set<Element>([document.getElementById('console')!]);
      if (system !== 'console') panels.add(document.getElementById(system)!);
      for (const selector of targets) {
        for (const node of document.querySelectorAll(selector)) {
          const panel = node.closest('.panel');
          if (panel) panels.add(panel);
          animate(node, [
            { boxShadow: `inset 0 0 0 100px ${color}50`, outline: `2px solid ${color}`, offset: 0 },
            { boxShadow: `inset 0 0 0 100px ${color}38`, outline: `2px solid ${color}`, offset: 0.65 },
            { boxShadow: `inset 0 0 0 100px ${color}00`, outline: `2px solid ${color}00` },
          ], duration);
        }
      }
      animate(receipt, [{ opacity: 0.55 }, { opacity: 1 }], 180);
      const hold = [{ opacity: 0.85 }, { opacity: 0.8, offset: 0.35 }, { opacity: 0.6, offset: 0.72 }, { opacity: 0 }];
      const fade = [{ opacity: 0.4 }, { opacity: 0 }];
      for (const panel of panels) {
        const { trace, stamp } = traces.get(panel)!;
        trace.style.color = stamp.style.color = color;
        trace.dataset.motion = motion;
        const captions: Record<string, string> = { read: 'READOUT', charge: 'POWER SUPPLY', scan: 'SIGNAL SCAN', tune: 'WAVE TUNING', lock: 'SIGNAL LOCKED', link: 'LINK CONFIRMED', open: 'PORTAL OPEN', transfer: 'TRANSFER', error: 'COMMAND REJECTED', toroid: 'TOROID / STARTUP' };
        stamp.textContent = panel.id === 'console' || motion === 'toroid' || motion === 'read' ? '' : t(motion === 'link' && targets.includes('.reader-status') ? 'READER ONLINE' : captions[motion]);
        const transform = motion === 'charge' ? 'translateY(75%)' : motion === 'lock' ? 'scaleX(0.65)' : 'translateX(-85%)';
        if (stamp.textContent) animate(stamp, reduced.matches ? fade : hold, duration);
        animate(trace, reduced.matches
          ? fade
          : hold.map((frame, index) => ({ ...frame, transform: index === 0 ? transform : 'none' })), duration);
      }
    },
    dispose() {
      stop(); traces.forEach(({ trace, stamp }) => { trace.remove(); stamp.remove(); });
      reduced.removeEventListener('change', stop);
      document.removeEventListener('visibilitychange', hidden);
    },
  };
}
