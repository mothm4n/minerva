import { describe, expect, it } from 'vitest';
import { crtVerticalShift } from './crt';

describe('distorsión de televisión', () => {
  it('mantiene los saltos verticales dentro de unos píxeles', () => {
    const samples = Array.from({ length: 600 }, (_, i) => crtVerticalShift(i / 10));
    for (const y of [...samples, crtVerticalShift(1e8)]) {
      expect(y).toBeGreaterThanOrEqual(0);
      expect(y).toBeLessThanOrEqual(4.5);
    }
    expect(samples.some(y => y > 0)).toBe(true);
  });
});
