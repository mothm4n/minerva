import { describe, expect, it } from 'vitest';
import { commandFeedback } from './feedback';
import { commands, execute, newGame, start, type Game } from './game';

function run(game: Game, command: string) {
  const before = { ...game };
  const reply = execute(game, command);
  return commandFeedback(command, before, game, reply);
}

describe('respuesta visual de las órdenes', () => {
  it('señala los recursos reales y no repite una activación ya realizada', () => {
    const game = newGame(); start(game);
    const matter = run(game, '  ICHIDAI   plug W_MATTER ');
    expect(matter).toMatchObject({ system: 'ichidai', motion: 'charge', kind: 'success' });
    expect(matter.targets).toEqual(['.resource:has(#energy)', '.resource:has(#matter)']);
    expect(run(game, 'ichidai plug w_matter')).toMatchObject({ motion: 'read', targets: [], kind: 'info' });
    expect(run(game, 'ichidai plug cooling').targets).toContain('.resource:has(#cooling)');
    expect(run(game, 'ichidai plug toroid')).toMatchObject({motion:'toroid',targets:expect.arrayContaining(['.toroid-state'])});
    expect(run(game, 'ichidai plug toroid').motion).toBe('read');
    expect(run(game, 'nidai set reader').targets).toContain('.reader-status');
  });
  it('distingue escanear, ajustar, fijar, enlazar, abrir y transferir', () => {
    const game = { ...newGame(), stage: 'scan' as const } as Game;
    expect(run(game, 'sandai show connections').motion).toBe('scan');
    expect(run(game, 'sandai select 2').targets).toContain('[data-signal="1"]');
    const tune = run(game, 'sandai tune 3.4 0.62');
    expect(tune.motion).toBe('tune');
    expect(tune.targets).toEqual(['#frequency-value', '#amplitude-value', '.sync-readout']);
    const lock = run(game, 'sandai lock');
    expect(lock.motion).toBe('lock');
    expect(lock.targets).toContain('.destination-status');
    expect(run(game, 'nidai connect 532924').motion).toBe('link');
    expect(run(game, 'nidai start portal')).toMatchObject({ motion: 'open', targets: ['.portal-status', '.mission-time'] });
    expect(run(game, 'nidai transfer')).toMatchObject({ motion: 'transfer', targets: ['#transfer-status'] });
  });
  it('un rechazo nunca simula un cambio de recursos ni una activación', () => {
    const game = newGame(); start(game);
    expect(run(game, 'ichidai plug toroid')).toMatchObject({ motion: 'error', kind: 'error', targets: [] });
    expect(run(game, '<script>alert(1)</script>')).toMatchObject({ system: 'console', motion: 'error', targets: [] });
    expect(game.stage).toBe('matter');
  });
  it('las consultas identifican el recurso leído y la pausa el reloj', () => {
    const game = newGame(); start(game);
    for (const [command, resource] of [['power', 'energy'], ['cooling', 'cooling'], ['w_matter', 'matter']]) {
      expect(run(game, `ichidai show ${command}`).targets).toContain(`.resource:has(#${resource})`);
    }
    expect(run(game, 'pause').targets).toContain('.mission-time');
    expect(run(game, 'ichidai plug w_matter').targets).toEqual([]);
    expect(run(game, 'resume').targets).toContain('#pause');
  });
  it('todas las órdenes tienen respuesta, incluidas las utilidades y el reinicio interceptado por la UI', () => {
    const game = newGame(); start(game);
    for (const command of commands(game)) {
      const response = run({ ...game }, command);
      expect(response.message.length).toBeGreaterThan(0);
      expect(response.motion.length).toBeGreaterThan(0);
    }
    expect(commandFeedback('clear', game, game, { kind: 'info', lines: ['Historial borrado.'] }).system).toBe('console');
    expect(commandFeedback('restart', game, game, { kind: 'info', lines: ['Reinicio pendiente de confirmación.'] }).kind).toBe('info');
  });
});
