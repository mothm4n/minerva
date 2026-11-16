import { describe, expect, it } from 'vitest';
import { execute, newGame, restore, selectSignal, start, tick, tune, type Game } from './game';

function prepared(): Game {
  const g = newGame();
  start(g);
  for (const cmd of ['ichidai plug w_matter', 'ichidai plug cooling', 'ichidai plug toroid', 'nidai set reader', 'sandai show connections']) expect(execute(g, cmd).kind).toBe('success');
  return g;
}
function portal(): Game {
  const g = prepared();
  selectSignal(g, 1);
  tune(g, 3.4, 0.62);
  for (const cmd of ['sandai lock', 'nidai connect 532924', 'nidai start portal']) expect(execute(g, cmd).kind).toBe('success');
  return g;
}
describe('misión de Minerva', () => {
  it('se completa sin master y consume recursos por tiempo real', () => {
    const g = portal();
    execute(g, 'nidai transfer');
    tick(g, 3);
    expect(g.stage).toBe('transfer');
    tick(g, 9);
    expect(g.stage).toBe('won');
    expect(g.transferred).toBe(10);
    expect(g.energy).toBe(45);
    expect(g.remaining).toBe(35);
  });
  it('rechaza saltos de pasos y órdenes parciales sin efectos secundarios', () => {
    const g = newGame(); start(g);
    for (const cmd of ['nidai start portal', 'ichidai plug cooling', 'prefix ichidai plug w_matter', 'ichidai plug w_matter extra']) expect(execute(g, cmd).kind).toBe('error');
    expect(g.energy).toBe(100);
    expect(g.stage).toBe('matter');
  });
  it('repetir una preparación no gasta recursos ni revierte progreso', () => {
    const g = prepared();
    execute(g, 'ichidai plug w_matter');
    expect(g.energy).toBe(55);
    expect(g.stage).toBe('tuning');
  });
  it('exige sincronización y el destino de casa', () => {
    const g = prepared();
    expect(execute(g, 'sandai lock').kind).toBe('error');
    tune(g, 2.2, 0.38); execute(g, 'sandai lock');
    expect(execute(g, 'nidai connect 985656').kind).toBe('error');
    expect(selectSignal(g, 1).kind).toBe('info');
    tune(g, 3.4, 0.62); execute(g, 'sandai lock');
    expect(execute(g, 'nidai connect 985656').kind).toBe('error');
    expect(execute(g, 'nidai connect 532924').kind).toBe('success');
  });
  it('la pausa congela el reloj y bloquea acciones', () => {
    const g = portal(); execute(g, 'pause'); tick(g, 120);
    expect(g.remaining).toBe(45);
    expect(execute(g, 'nidai transfer').kind).toBe('error');
    execute(g, 'resume'); tick(g, 2);
    expect(g.remaining).toBe(43);
  });
  it('vence el plazo antes de una transferencia demasiado tardía', () => {
    const g = portal(); tick(g, 40); execute(g, 'nidai transfer'); tick(g, 30);
    expect(g.stage).toBe('lost'); expect(g.transferred).toBe(5);
    expect(g.remaining).toBe(0); expect(g.energy).toBeGreaterThanOrEqual(0);
  });
  it('rechaza números inválidos y señales fuera del rango', () => {
    const g = prepared();
    for (const n of [NaN, Infinity, -1, 5, 0.5]) expect(selectSignal(g, n).kind).toBe('error');
    expect(tune(g, NaN, 0.4).kind).toBe('error');
    expect(tune(g, 3, 4).kind).toBe('error');
    tick(g, NaN); expect(g.elapsed).toBe(0);
  });
  it('recupera el guardado en pausa y rechaza datos corruptos', () => {
    const g = portal(); tick(g, 2);
    expect(restore(JSON.stringify({ version: 1, game: g }))).toEqual({ ...g, paused: true });
    for (const raw of ['invalid', '{}', 'null', JSON.stringify({ version: 2, game: g }), JSON.stringify({ version: 1, game: { ...g, energy: '50' } }), JSON.stringify({ version: 1, game: { ...g, signal: 8 } })]) expect(restore(raw)).toBeNull();
  });
});
