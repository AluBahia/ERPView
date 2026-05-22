import { describe, test, expect } from 'vitest';
import manifest from '../../../public/manifest.json';

describe('PWA Manifest', () => {
  test('manifest.json contém name, short_name, icons, display, start_url', () => {
    expect(manifest).toHaveProperty('name');
    expect(manifest).toHaveProperty('short_name');
    expect(manifest).toHaveProperty('icons');
    expect(manifest.icons.length).toBeGreaterThan(0);
    expect(manifest).toHaveProperty('display');
    expect(manifest).toHaveProperty('start_url');
  });
});
