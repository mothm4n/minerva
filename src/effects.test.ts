import { afterEach, describe, expect, it, vi } from 'vitest';
import { createEffects, effectState, toroidState } from './effects';
import { commandFeedback } from './feedback';
import { execute, newGame, tick, WORLDS } from './game';

describe('estado visual de los instrumentos', () => {
  afterEach(() => vi.unstubAllEnvs());
  it('abre en 8 segundos y congela la apertura al pausar', () => {
    const game = { ...newGame(), stage: 'open' as const, energy: 55, cooling: 100, matter: 100 };
    expect(effectState(game, false).portal[3]).toBe(0);
    tick(game, 4);
    expect(effectState(game, false).portal[3]).toBeCloseTo(0.5);
    game.paused = true;
    tick(game, 10);
    expect(effectState(game, false).portal[3]).toBeCloseTo(0.5);
    expect(effectState(game, true).portal[3]).toBe(1);
    game.paused = false;
    tick(game, 4);
    expect(effectState(game, false).portal[3]).toBeCloseTo(1);
  });
  it('asigna la imagen al destino y mantiene la apertura sin WebGL', () => {
    vi.stubEnv('BASE_URL', '/minerva/');
    let source = '';
    const style = { setProperty: vi.fn() };
    const container = { style, dataset: { open: '' } };
    const canvas = { getContext: () => null, parentElement: container } as unknown as HTMLCanvasElement;
    const world = { getAttribute: () => source, set src(value: string) { source = value; } } as unknown as HTMLImageElement;
    const effects = createEffects(canvas, canvas, world, canvas);
    const game = { ...newGame(), stage: 'open' as const, remaining: 37 };
    for (let signal = 0; signal < WORLDS.length; signal++) {
      game.signal = signal;
      expect(effectState(game, false).image).toBe(`/minerva${WORLDS[signal].image}`);
      effects.render(game, false);
      expect(source).toBe(`/minerva${WORLDS[signal].image}`);
    }
    expect(container.dataset.open).toBe('true');
    expect(style.setProperty).toHaveBeenLastCalledWith('--portal-reveal', '1');
    game.remaining = 45;
    effects.render(game, false);
    expect(style.setProperty).toHaveBeenLastCalledWith('--portal-reveal', '0');
    effects.render(game, true);
    expect(style.setProperty).toHaveBeenLastCalledWith('--portal-reveal', '1');
    for (const stage of ['portal', 'lost', 'won', 'standby'] as const) {
      effects.render({ ...game, stage }, false);
      expect(container.dataset.open).toBe('false');
      expect(style.setProperty).toHaveBeenLastCalledWith('--portal-reveal', '0');
    }
    effects.dispose();
  });
  it('oculta la señal antes del escaneo y usa la señal seleccionada', () => {
    const game = newGame();
    expect(effectState(game, false).visible).toBe(0);
    Object.assign(game, { stage: 'tuning', signal: 1, frequency: 3.2, amplitude: 0.57 });
    expect(effectState(game, false).signal).toEqual([3.2, 0.57, 3.4, 0.62]);
    expect(effectState(game, false).visible).toBe(1);
    expect(effectState(game, false).portal).toEqual([0, 0, 0, 0]);
  });
  it('representa tiempo restante, progreso de transferencia y cierre', () => {
    const game = { ...newGame(), stage: 'open' as const, remaining: 9 };
    expect(effectState(game, false).portal).toEqual([1, 0.2, 1, 1]);
    expect(effectState({ ...game, stage: 'transfer', transferred: 4 }, false).portal[1]).toBe(0.4);
    expect(effectState({ ...game, stage: 'lost' }, false).portal).toEqual([0, 0, 0, 0]);
    expect(effectState({ ...game, stage: 'won' }, false).portal[1]).toBe(1);
  });
  it('congela el movimiento en pausa y con movimiento reducido sin ocultar cambios de valor', () => {
    const game = { ...newGame(), stage: 'tuning' as const, elapsed: 8, paused: true };
    const before = effectState(game, false);
    tick(game, 10);
    expect(effectState(game, false)).toEqual(before);
    expect(effectState(game, true).phase).toBe(0);
    expect(effectState({ ...game, stage: 'open', remaining: 45 }, true).portal[3]).toBe(1);
    game.frequency = 4.1;
    expect(effectState(game, true).signal[0]).toBe(4.1);
  });
  it('activa el campo solo con el toroide y vincula la transferencia al progreso real', () => {
    expect(effectState(newGame(), false).activity[0]).toBe(0);
    const game = { ...newGame(), stage: 'transfer' as const, signal: 1, frequency: 3.4, amplitude: 0.62, transferred: 4 };
    expect(effectState(game, false).activity).toEqual([1, 1, 0.4, 1]);
    expect(effectState(game, true).activity).toEqual([1, 1, 0.4, 0]);
    expect(effectState({ ...game, stage: 'won' }, false).activity[0]).toBe(0);
    expect(effectState({ ...game, stage: 'lost' }, false).activity[0]).toBe(0);
  });
});

describe('arranque del toroide', () => {
  it('recorre carga, confinamiento y estabilización en 3,6 s, con pausa y movimiento reducido', () => {
    const game = { ...newGame(), stage: 'reader' as const, elapsed: 5 };
    expect(toroidState(game, 5, false)).toEqual({active:true,progress:0,label:'Charging'});
    tick(game, 1.8);
    expect(toroidState(game, 5, false).progress).toBeCloseTo(0.5);
    expect(toroidState(game, 5, false).label).toBe('Confining');
    game.paused = true;
    tick(game, 10);
    expect(toroidState(game, 5, false).progress).toBeCloseTo(0.5);
    expect(toroidState(game, 5, true)).toEqual({active:false,progress:1,label:'Stable'});
    game.paused = false;
    tick(game, 2);
    expect(toroidState(game, 5, false)).toEqual({active:false,progress:1,label:'Stable'});
    expect(toroidState(newGame(), null, false).label).toBe('Inactive');
  });
  it('conserva el arranque al recibir otras órdenes, no lo repite y lo borra al reiniciar, también sin WebGL', () => {
    const parent = {style:{setProperty:vi.fn()},dataset:{active:''}};
    const canvas = {getContext:()=>null,parentElement:parent} as unknown as HTMLCanvasElement;
    const world = {getAttribute:()=>WORLDS[0].image} as unknown as HTMLImageElement;
    const effects = createEffects(canvas,canvas,world,canvas);
    const game = { ...newGame(),stage:'toroid' as const,elapsed:2 } as ReturnType<typeof newGame>;
    function run(command:string) {const before={...game};const reply=execute(game,command);effects.trigger(commandFeedback(command,before,game,reply),game);}
    run('ichidai plug toroid');
    tick(game,1);
    run('status'); run('nidai set reader'); run('ichidai plug toroid');
    expect(effects.ignition(game,false).progress).toBeCloseTo(1/3.6);
    effects.render(game,false);
    expect(parent.dataset.active).toBe('true');
    effects.render(game,true);
    expect(parent.dataset.active).toBe('false');
    effects.render(newGame(),false);
    expect(effects.ignition({...game,elapsed:0},false).active).toBe(false);
    effects.dispose();
  });
});
