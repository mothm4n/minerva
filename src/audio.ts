import { Howl } from 'howler';
import { live, ready, type Game, type Stage } from './game';

const files = {
  CD: 'CD.wav', Pica: 'Pica.wav', alert: 'alert.wav',
  ambientPC: 'ambientPC.wav', electroON: 'electroON.wav', coolON: 'coolON.mp3',
  toroidStart: 'toroidStart.mp3', toroidLoop: 'toroidLoop.wav', toroidEnd: 'toroidend.wav',
  portalStart: 'portalStart.mp3', portalLoop: 'portalLoop.wav', portalAmbient: 'portalAmbient.ogg', portalEnd: 'portalEnd.wav',
  turnONpc: 'turnONpc.wav', turnONmonitors: 'turnONmonitors.mp3', powerDown: 'powerDown.mp3',
} as const;
type Sound = keyof typeof files;
interface Track { howl: Howl; id?: number; playing: boolean }
const loops = new Set<Sound>(['ambientPC', 'electroON', 'coolON', 'toroidLoop', 'portalLoop', 'portalAmbient']);
const volumes: Partial<Record<Sound, number>> = { ambientPC: 0.1, electroON: 0.12, coolON: 0.18, toroidLoop: 0.22, portalLoop: 0.3, portalAmbient: 0.16, Pica: 0.25 };
const tracks = new Map<Sound, Track>();
let enabled = false;
let previousStage: Stage | undefined;

export function stopAudio() {
  for (const track of tracks.values()) {
    track.howl.stop();
    track.id = undefined;
    track.playing = false;
  }
  previousStage = undefined;
}

export function setAudio(on: boolean, onError: () => void) {
  enabled = on;
  if (!on) { stopAudio(); return; }
  if (tracks.size) return;
  function fail() {
    enabled = false;
    stopAudio();
    tracks.forEach(track => track.howl.unload());
    tracks.clear();
    onError();
  }
  for (const name of Object.keys(files) as Sound[]) {
    const track: Track = {
      playing: false,
      howl: new Howl({
        src: [`${import.meta.env.BASE_URL}sounds/${files[name]}`],
        // El archivo original tiene extensión WAV, pero contiene audio MP3.
        format: name === 'turnONpc' ? ['mp3'] : undefined,
        loop: loops.has(name),
        volume: volumes[name] ?? 0.35,
        onloaderror: fail,
        onplayerror: fail,
        onend(id) {
          if (!loops.has(name) && track.id === id) { track.id = undefined; track.playing = false; }
        },
      }),
    };
    tracks.set(name, track);
  }
}

function play(track: Track) {
  track.id = track.howl.play(track.id);
  track.playing = true;
}

export function cue(name: Sound) {
  const track = tracks.get(name);
  if (!enabled || !track) return;
  if (track.id !== undefined) track.howl.stop(track.id);
  track.id = undefined;
  play(track);
}

export function syncAudio(game: Game) {
  const changed = previousStage !== undefined && previousStage !== game.stage;
  previousStage = game.stage;
  if (!enabled) return;
  if (game.paused) {
    for (const track of tracks.values()) if (track.playing) {
      track.howl.pause(track.id);
      track.playing = false;
    }
    return;
  }
  if (changed) {
    if (game.stage === 'reader') cue('toroidStart');
    if (game.stage === 'open') cue('portalStart');
    if (game.stage === 'won' || game.stage === 'lost') {
      stopAudio();
      cue('portalEnd'); cue('toroidEnd'); cue('powerDown');
      if (game.stage === 'lost') cue('alert');
    }
  }
  const active = live(game);
  const portal = game.stage === 'open' || game.stage === 'transfer';
  const wanted: Record<string, boolean> = {
    ambientPC: active,
    electroON: active && game.energy > 0,
    coolON: active && game.cooling > 0,
    toroidLoop: active && ready(game, 'toroid') && tracks.get('toroidStart')?.id === undefined,
    portalLoop: portal && tracks.get('portalStart')?.id === undefined,
    portalAmbient: portal && tracks.get('portalStart')?.id === undefined,
  };
  tracks.get('ambientPC')?.howl.volume(portal ? 0.01 : 0.1);
  for (const [name, track] of tracks) {
    if (loops.has(name) && !wanted[name]) {
      if (track.id !== undefined) { track.howl.stop(track.id); track.id = undefined; track.playing = false; }
    } else if (!track.playing && (loops.has(name) || track.id !== undefined)) {
      play(track);
    }
  }
}
