import { afterEach, describe, expect, it } from 'vitest';
import { language, setLanguage, t, translations } from './i18n';
import { execute, newGame, next, STAGES, start } from './game';
import markup from '../index.html?raw';

afterEach(() => setLanguage('es'));

describe('interface languages and English console', () => {
  it('accepts only supported saved preferences', () => {
    for (const value of ['en', 'ja', 'es']) expect(setLanguage(value)).toBe(value);
    for (const value of [null, '', 'fr', '<script>', 'constructor']) expect(setLanguage(value)).toBe('es');
  });

  it('translates labels and interpolates results without altering command syntax', () => {
    setLanguage('ja');
    expect(t('Help')).toBe('ヘルプ');
    expect(t('Mission time: {minutes} min {seconds} s · Energy remaining: {energy}%', { minutes: 1, seconds: 23, energy: 45 })).toBe('所要時間：1分23秒 · 残り電力：45%');
    expect(t('nidai connect 532924')).toBe('nidai connect 532924');
    setLanguage('es');
    expect(t('Help')).toBe('Ayuda');
    setLanguage('en');
    expect(t('Help')).toBe('Help');
  });

  it('covers the marked interface, every guide step and interpolation tokens', () => {
    const keys = [...markup.matchAll(/data-i18n(?:-aria-label|-title)?="([^"]+)"/g)].map(match => match[1]);
    for (const stage of STAGES) {
      const [title, description] = next({ ...newGame(), stage });
      keys.push(title);
      if (!/^(ichidai|nidai|sandai) /.test(description)) keys.push(description);
    }
    for (const key of keys) expect(translations, key).toHaveProperty(key);
    for (const [source, locales] of Object.entries(translations)) {
      const tokens = (value: string) => [...value.matchAll(/\{\w+\}/g)].map(match => match[0]).sort();
      for (const translation of Object.values(locales)) {
        expect(translation.trim(), source).not.toBe('');
        expect(tokens(translation), source).toEqual(tokens(source));
      }
    }
  });

  it('keeps console replies in English when the interface language changes', () => {
    const game = newGame(); start(game);
    for (const locale of ['es', 'ja', 'en']) {
      setLanguage(locale);
      expect(execute(game, 'help').lines[0]).toBe('MINERVA / Operating manual');
      expect(execute(game, 'logs').lines[0]).toBe('LOGBOOK / last recovered entry');
      expect(execute(game, 'hint').lines[0]).toBe('Load W matter');
      expect(execute(game, 'unknown').lines[0]).toBe('Unknown command: unknown');
      expect(game.stage).toBe('matter');
      expect(language).toBe(locale);
    }
    expect(execute(game, 'ichidai plug w_matter').lines[0]).toBe('W matter loaded. Reserve at 100%.');
    expect(game.energy).toBe(88);
  });
});
