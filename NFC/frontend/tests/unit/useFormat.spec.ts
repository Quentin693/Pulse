import { describe, it, expect } from 'vitest';
import {
  formatPrice,
  formatDuration,
  formatDate,
  formatRelative,
} from '~/composables/useFormat';

describe('formatPrice', () => {
  it('formate les centimes en euros', () => {
    expect(formatPrice(4900)).toContain('49');
    expect(formatPrice(4900)).toContain('€');
  });

  it('gère 0 centimes', () => {
    expect(formatPrice(0)).toContain('0');
  });

  it('gère undefined/null', () => {
    expect(formatPrice(undefined as any)).toContain('0');
  });

  it('supporte une devise personnalisée', () => {
    expect(formatPrice(5000, 'USD')).toContain('$');
  });
});

describe('formatDuration', () => {
  it('retourne 0 min pour une durée nulle', () => {
    expect(formatDuration(0)).toBe('0 min');
  });

  it('formate les minutes seules', () => {
    expect(formatDuration(45)).toBe('45 min');
  });

  it('formate les heures entières', () => {
    expect(formatDuration(60)).toBe('1h');
    expect(formatDuration(120)).toBe('2h');
  });

  it('formate heures et minutes', () => {
    expect(formatDuration(90)).toBe('1h30');
    expect(formatDuration(75)).toBe('1h15');
  });

  it('pad les minutes à un chiffre', () => {
    expect(formatDuration(65)).toBe('1h05');
  });
});

describe('formatDate', () => {
  it('retourne une chaîne vide si pas de date', () => {
    expect(formatDate(undefined)).toBe('');
    expect(formatDate('')).toBe('');
  });

  it('formate une date ISO en français', () => {
    const result = formatDate('2025-01-15');
    expect(result).toMatch(/2025/);
    expect(result).toMatch(/15/);
  });

  it('accepte un objet Date', () => {
    const result = formatDate(new Date('2025-06-01'));
    expect(result).toMatch(/2025/);
  });
});

describe('formatRelative', () => {
  it('retourne une chaîne vide si pas de date', () => {
    expect(formatRelative(undefined)).toBe('');
  });

  it('retourne "à l\'instant" pour une date très récente', () => {
    const now = new Date();
    expect(formatRelative(now)).toBe("à l'instant");
  });

  it('retourne "il y a N min" pour une date récente', () => {
    const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000);
    expect(formatRelative(fiveMinAgo)).toBe('il y a 5 min');
  });

  it('retourne "il y a Nh" pour des heures', () => {
    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
    expect(formatRelative(twoHoursAgo)).toBe('il y a 2h');
  });

  it('retourne "il y a N j" pour des jours', () => {
    const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
    expect(formatRelative(threeDaysAgo)).toBe('il y a 3 j');
  });
});
