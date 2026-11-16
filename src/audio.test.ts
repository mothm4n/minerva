import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { HowlOptions } from 'howler';
import { newGame, type Game } from './game';

const { MockHowl } = vi.hoisted(() => {
  let nextId = 0;
  class MockHowl {
    static instances = new Map<string, MockHowl>();
    play = vi.fn((id?: number) => id ?? ++nextId);
    pause = vi.fn();
    stop = vi.fn();
    volume = vi.fn();
    unload = vi.fn();
    constructor(public options: HowlOptions) {
      MockHowl.instances.set(String(options.src[0]).split('/').pop()!, this);
    }
    finish() { this.options.onend?.(this.play.mock.results.at(-1)!.value); }
  }
  return { MockHowl };
});
vi.mock('howler', () => ({ Howl: MockHowl }));
const sound = (filename: string) => MockHowl.instances.get(filename)!;
beforeEach(() => { vi.resetModules(); MockHowl.instances.clear(); });

describe('audio original de Minerva', () => {
  it('mantiene una única reproducción por capa aunque el audio siga cargando', async () => {
    const audio = await import('./audio');
    audio.setAudio(true, vi.fn());
    const game: Game = { ...newGame(), stage: 'matter' };
    for (let i = 0; i < 100; i++) audio.syncAudio(game);
    expect(sound('ambientPC.wav').play).toHaveBeenCalledTimes(1);
    expect(sound('electroON.wav').play).toHaveBeenCalledTimes(1);
    expect(sound('coolON.mp3').play).not.toHaveBeenCalled();
    expect(sound('turnONpc.wav').options.format).toEqual(['mp3']);
  });

  it('espera a cada arranque antes de activar los bucles y los detiene al terminar', async () => {
    const audio = await import('./audio');
    audio.setAudio(true, vi.fn());
    const game: Game = { ...newGame(), stage: 'toroid', cooling: 100, matter: 100 };
    audio.syncAudio(game);
    game.stage = 'reader'; audio.syncAudio(game);
    expect(sound('toroidStart.mp3').play).toHaveBeenCalledTimes(1);
    expect(sound('toroidLoop.wav').play).not.toHaveBeenCalled();
    sound('toroidStart.mp3').finish(); audio.syncAudio(game);
    expect(sound('toroidLoop.wav').play).toHaveBeenCalledTimes(1);
    game.stage = 'open'; audio.syncAudio(game);
    expect(sound('portalStart.mp3').play).toHaveBeenCalledTimes(1);
    expect(sound('portalLoop.wav').play).not.toHaveBeenCalled();
    sound('portalStart.mp3').finish(); audio.syncAudio(game);
    expect(sound('portalLoop.wav').play).toHaveBeenCalledTimes(1);
    expect(sound('portalAmbient.ogg').play).toHaveBeenCalledTimes(1);
    game.stage = 'won'; audio.syncAudio(game); audio.syncAudio(game);
    expect(sound('portalLoop.wav').stop).toHaveBeenCalled();
    expect(sound('portalEnd.wav').play).toHaveBeenCalledTimes(1);
    expect(sound('toroidend.wav').play).toHaveBeenCalledTimes(1);
    expect(sound('powerDown.mp3').play).toHaveBeenCalledTimes(1);
  });

  it('reanuda el mismo audio tras pausar y silencia también los efectos', async () => {
    const audio = await import('./audio');
    audio.setAudio(true, vi.fn());
    const game: Game = { ...newGame(), stage: 'matter' };
    audio.syncAudio(game); audio.cue('Pica');
    const id = sound('ambientPC.wav').play.mock.results[0].value;
    game.paused = true; audio.syncAudio(game); audio.syncAudio(game);
    expect(sound('ambientPC.wav').pause).toHaveBeenCalledTimes(1);
    expect(sound('Pica.wav').pause).toHaveBeenCalledTimes(1);
    game.paused = false; audio.syncAudio(game);
    expect(sound('ambientPC.wav').play).toHaveBeenLastCalledWith(id);
    audio.setAudio(false, vi.fn());
    const count = sound('Pica.wav').play.mock.calls.length;
    audio.cue('Pica'); audio.syncAudio(game);
    expect(sound('Pica.wav').play).toHaveBeenCalledTimes(count);
    expect(sound('ambientPC.wav').stop).toHaveBeenCalled();
  });

  it('descarta la carga fallida y permite reintentar', async () => {
    const audio = await import('./audio');
    const onError = vi.fn();
    audio.setAudio(true, onError);
    const failed = sound('portalAmbient.ogg');
    failed.options.onloaderror?.(1, 'Error de descarga');
    expect(onError).toHaveBeenCalledTimes(1);
    expect(failed.unload).toHaveBeenCalledTimes(1);
    audio.setAudio(true, onError);
    expect(sound('portalAmbient.ogg')).not.toBe(failed);
  });
});
