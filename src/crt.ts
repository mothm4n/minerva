// TV distortion adapted from the shader supplied by the user, 2026-11-15.
// Simplex noise: Ian McEwan / Ashima Arts, MIT. See public/licenses/Ashima-noise-MIT.txt.
const mod289 = (x: number) => x - Math.floor(x / 289) * 289;
const permute = (x: number) => mod289((x * 34 + 1) * x);

function noise(x: number, y: number) {
  const skew = (x + y) * 0.366025403784439;
  const ix = Math.floor(x + skew), iy = Math.floor(y + skew);
  const unskew = (ix + iy) * 0.211324865405187;
  const x0 = x - ix + unskew, y0 = y - iy + unskew;
  const first = x0 > y0 ? 1 : 0;
  let sum = 0;
  for (let corner = 0; corner < 3; corner++) {
    const dx = corner === 1 ? first : corner === 2 ? 1 : 0;
    const dy = corner === 1 ? 1 - first : corner === 2 ? 1 : 0;
    const px = x0 - dx + corner * 0.211324865405187;
    const py = y0 - dy + corner * 0.211324865405187;
    const p = permute(permute(mod289(iy) + dy) + mod289(ix) + dx) / 41;
    const gradient = 2 * (p - Math.floor(p)) - 1;
    const h = Math.abs(gradient) - 0.5;
    const a = gradient - Math.floor(gradient + 0.5);
    const m = Math.max(0.5 - px * px - py * py, 0);
    sum += m ** 4 * (1.79284291400159 - 0.85373472095314 * (a * a + h * h)) * (a * px + h * py);
  }
  return 130 * sum;
}

export function crtVerticalShift(time: number) {
  const movement = noise(time * 0.2, 8) > 0.4;
  const jerk = noise(time * 1.5, 5) > 0.6 && noise(time * 5.5, 5) > 0.2;
  // Keep the shader's timing, with pixel-sized offsets so controls stay usable.
  return (movement ? Math.abs(Math.sin(time)) * 1.5 : 0) + (jerk ? 3 : 0);
}

export function createCRT() {
  const root = document.documentElement;
  const rows = document.getElementById('crt-noise')!;
  const shift = document.getElementById('crt-shift')!;
  const snow = document.createElement('canvas');
  snow.width = 128; snow.height = 64;
  const snowContext = snow.getContext('2d');
  const snowPixels = snowContext?.createImageData(128, 64);
  let time = 0;
  let previous = 0;
  let painted = -Infinity;
  let failed = false;
  let lastMode = '';

  function reset() {
    root.removeAttribute('data-crt');
    root.style.removeProperty('--crt-snow');
    root.style.removeProperty('--crt-scan-y');
    time = 0; painted = -Infinity;
  }

  return {
    render(now: number, enabled: boolean, paused: boolean, reducedMotion: boolean) {
      const mode = !enabled ? 'off' : reducedMotion || failed || !snowContext ? 'still' : 'on';
      if (mode !== lastMode) {
        reset();
        lastMode = mode;
        if (mode !== 'off') root.dataset.crt = mode;
      }
      const delta = previous ? Math.min(0.1, Math.max(0, (now - previous) / 1000)) : 0;
      previous = now;
      if (mode !== 'on' || document.hidden) return;
      if (!paused) time += delta;
      if ((paused && painted !== -Infinity) || now - painted < 1000 / 24) return;
      painted = now;
      try {
        rows.setAttribute('seed', String(Math.floor(time * 24)));
        shift.setAttribute('dy', crtVerticalShift(time).toFixed(2));

        const t = time % 100;
        const height = noise(9, t * 1.2 + 3) * 0.3 + 5;
        const amount = noise(1, t * 1.2 - 6) * 0.1 + 0.3;
        const strength = noise(-9.75, t * 0.6 - 3) * 2 + 2;
        for (let y = 0; y < 64; y++) {
          for (let x = 0; x < 128; x++) {
            const value = noise(5 * t * t + (x / 127 * 7) ** 1.2, ((t + 100) * (1 - y / 63) * 0.3 + 3) ** height);
            snowPixels!.data.set([210, 235, 218, value > amount ? Math.min(90, strength * 30) : 0], (y * 128 + x) * 4);
          }
        }
        snowContext!.putImageData(snowPixels!, 0, 0);
        root.style.setProperty('--crt-snow', `url("${snow.toDataURL()}")`);
        root.style.setProperty('--crt-scan-y', `${(time * 35) % 900 - 200}px`);
      } catch {
        failed = true;
        reset();
        root.dataset.crt = 'still';
      }
    },
    dispose: reset,
  };
}
