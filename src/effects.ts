import { index, ready, synchrony, target, type Game } from './game';
import vertexSource from './shaders/instrument.vert?raw';
import fragmentSource from './shaders/instrument.frag?raw';
import portalSource from './shaders/portal.glsl?raw';
import reactorSource from './shaders/reactor.glsl?raw';
import { COMMAND_DURATION, TOROID_DURATION, type CommandFeedback } from './feedback';

export function toroidState(game: Game, startedAt: number | null, reducedMotion: boolean) {
  const energized = ready(game, 'toroid');
  const progress = startedAt === null || reducedMotion ? 1 : Math.min(1, Math.max(0, (game.elapsed - startedAt) * 1000 / TOROID_DURATION));
  const active = energized && !['lost', 'won'].includes(game.stage) && progress < 1;
  return { active, progress, label: !energized ? 'Inactive' : !active || progress >= 0.85 ? 'Stable' : progress < 0.35 ? 'Charging' : 'Confining' };
}

export function effectState(game: Game, reducedMotion: boolean) {
  const destination = target(game);
  const open = game.stage === 'open' || game.stage === 'transfer';
  const progress = game.stage === 'won' ? 1 : game.stage === 'transfer' ? game.transferred / 10 : open ? game.remaining / 45 : 0;
  return {
    image: destination.image,
    phase: reducedMotion ? 0 : game.elapsed * 0.8,
    visible: index(game) >= 6 ? 1 : 0,
    signal: [game.frequency, game.amplitude, destination.frequency, destination.amplitude],
    portal: [open ? 1 : 0, progress, open && game.remaining <= 12 ? 1 : 0, open ? reducedMotion ? 1 : Math.min(1, (45 - game.remaining) / 8) : 0],
    activity: [index(game) >= 4 && !['lost', 'won'].includes(game.stage) ? 1 : 0, synchrony(game) / 100, game.transferred / 10, reducedMotion ? 0 : 1],
  };
}

type EffectState = ReturnType<typeof effectState>;

function instrument(canvas: HTMLCanvasElement, mode: number) {
  let gl: WebGLRenderingContext | null;
  try {
    gl = canvas.getContext('webgl', { alpha: true, antialias: false, premultipliedAlpha: false, powerPreference: 'low-power' });
  } catch { return null; }
  if (!gl) return null;
  const context = gl;
  let program: WebGLProgram | null = null;
  let buffer: WebGLBuffer | null = null;
  let uniforms: Record<string, WebGLUniformLocation | null> = {};
  let dirty = true;
  let previous = '';
  let pixelRatio = 0;
  let disposed = false;
  let onScreen = true;

  function release() {
    if (program) context.deleteProgram(program);
    if (buffer) context.deleteBuffer(buffer);
    program = null; buffer = null;
    canvas.dataset.ready = 'false';
  }

  function compile(type: number, source: string) {
    const shader = context.createShader(type);
    if (!shader) throw new Error('No se pudo crear el shader.');
    context.shaderSource(shader, source);
    context.compileShader(shader);
    if (!context.getShaderParameter(shader, context.COMPILE_STATUS)) {
      const message = context.getShaderInfoLog(shader);
      context.deleteShader(shader);
      throw new Error(message || 'Shader no compatible.');
    }
    return shader;
  }

  function initialize() {
    if (disposed) return;
    const shaders: WebGLShader[] = [];
    try {
      release();
      shaders.push(compile(context.VERTEX_SHADER, vertexSource));
      shaders.push(compile(context.FRAGMENT_SHADER, fragmentSource.replace('// PORTAL_SHADER', portalSource).replace('// REACTOR_SHADER', reactorSource)));
      program = context.createProgram();
      if (!program) throw new Error('No se pudo crear el programa WebGL.');
      shaders.forEach(shader => context.attachShader(program!, shader));
      context.linkProgram(program);
      if (!context.getProgramParameter(program, context.LINK_STATUS)) throw new Error(context.getProgramInfoLog(program) || 'No se pudieron enlazar los shaders.');
      context.useProgram(program);
      buffer = context.createBuffer();
      if (!buffer) throw new Error('No se pudo crear el buffer WebGL.');
      context.bindBuffer(context.ARRAY_BUFFER, buffer);
      context.bufferData(context.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), context.STATIC_DRAW);
      const position = context.getAttribLocation(program, 'a_position');
      context.enableVertexAttribArray(position);
      context.vertexAttribPointer(position, 2, context.FLOAT, false, 0, 0);
      uniforms = Object.fromEntries(['resolution', 'mode', 'phase', 'signal', 'portal', 'visible', 'activity', 'command'].map(name => [name, context.getUniformLocation(program!, `u_${name}`)]));
      context.uniform1f(uniforms.mode, mode);
      dirty = true; previous = '';
    } catch (error) {
      release();
      if (!context.isContextLost()) console.warn('Minerva usa la visualización SVG:', error);
    } finally {
      shaders.forEach(shader => context.deleteShader(shader));
    }
  }

  function lost(event: Event) {
    event.preventDefault();
    program = null; buffer = null;
    canvas.dataset.ready = 'false';
  }
  canvas.addEventListener('webglcontextlost', lost);
  canvas.addEventListener('webglcontextrestored', initialize);
  const observer = new ResizeObserver(() => { dirty = true; });
  observer.observe(canvas);
  const visibility = new IntersectionObserver(([entry]) => { onScreen = entry.isIntersecting; dirty = true; });
  visibility.observe(canvas);
  initialize();

  return {
    draw(state: EffectState, command: number[]) {
      if (!program || document.hidden || !onScreen || disposed) return;
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
      const signature = `${state.phase},${state.visible},${state.signal},${state.portal},${state.activity},${command}`;
      if (!dirty && ratio === pixelRatio && signature === previous) return;
      if (dirty || ratio !== pixelRatio) {
        canvas.width = Math.max(1, Math.round(canvas.clientWidth * ratio));
        canvas.height = Math.max(1, Math.round(canvas.clientHeight * ratio));
        context.viewport(0, 0, canvas.width, canvas.height);
        context.uniform2f(uniforms.resolution, canvas.width, canvas.height);
        dirty = false; pixelRatio = ratio;
      }
      context.uniform1f(uniforms.phase, state.phase);
      context.uniform1f(uniforms.visible, state.visible);
      context.uniform4fv(uniforms.signal, state.signal);
      context.uniform4fv(uniforms.portal, state.portal);
      context.uniform4fv(uniforms.activity, state.activity);
      context.uniform4fv(uniforms.command, command);
      context.drawArrays(context.TRIANGLES, 0, 3);
      canvas.dataset.ready = 'true';
      previous = signature;
    },
    dispose() {
      disposed = true;
      observer.disconnect();
      visibility.disconnect();
      canvas.removeEventListener('webglcontextlost', lost);
      canvas.removeEventListener('webglcontextrestored', initialize);
      release();
    },
  };
}

export function createEffects(wave: HTMLCanvasElement, portal: HTMLCanvasElement, world: HTMLImageElement, toroid: HTMLCanvasElement) {
  const instruments = [instrument(wave, 0), instrument(portal, 1)];
  const reactor = instrument(toroid, 2);
  let ignitionStartedAt: number | null = null;
  let pulse: { time: number; mode: number; error: number; wave: boolean; portal: boolean } | null = null;
  return {
    ignition(game: Game, reducedMotion: boolean) { return toroidState(game, ignitionStartedAt, reducedMotion); },
    trigger(feedback: CommandFeedback, game: Game) {
      if (feedback.motion === 'toroid') ignitionStartedAt = game.elapsed;
      pulse = {
        time: game.elapsed,
        mode: ['read', 'charge', 'scan', 'tune', 'lock', 'link', 'open', 'transfer', 'error', 'toroid'].indexOf(feedback.motion),
        error: feedback.kind === 'error' ? 1 : 0,
        wave: feedback.system === 'sandai' || feedback.targets.includes('.reader-status'),
        portal: feedback.system === 'nidai' || feedback.targets.includes('.toroid-state'),
      };
    },
    render(game: Game, reducedMotion: boolean, emergency = false) {
      if (!ready(game, 'toroid') || ['lost', 'won'].includes(game.stage)) ignitionStartedAt = null;
      const ignition = toroidState(game, ignitionStartedAt, reducedMotion);
      toroid.parentElement!.dataset.active = String(ignition.active);
      toroid.parentElement!.style.setProperty('--ignition', String(ignition.progress));
      const state = effectState(game, reducedMotion);
      if (world.getAttribute('src') !== state.image) world.src = state.image;
      const reveal = state.portal[3] ** 2 * (3 - 2 * state.portal[3]);
      portal.parentElement!.style.setProperty('--portal-reveal', String(reveal));
      portal.parentElement!.dataset.open = String(state.portal[0] === 1);
      if (emergency) return;
      const progress = pulse ? Math.min(1, Math.max(0, (game.elapsed - pulse.time) * 1000 / COMMAND_DURATION)) : 1;
      instruments.forEach((effect, i) => {
        const active = pulse && !reducedMotion && (i === 0 ? pulse.wave : pulse.portal);
        const envelope = 1 - Math.max(0, (progress - 0.55) / 0.45) ** 2;
        effect?.draw(state, active && pulse ? [progress, envelope, pulse.mode, pulse.error] : [1, 0, 0, 0]);
      });
      if (ignition.active) reactor?.draw(state, [ignition.progress, 1, 0, 0]);
    },
    dispose() { instruments.forEach(effect => effect?.dispose()); reactor?.dispose(); },
  };
}
