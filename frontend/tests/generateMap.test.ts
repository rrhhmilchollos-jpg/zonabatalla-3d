import { describe, it, expect } from 'vitest';
import { generateMap } from '../src/utils/generateMap';

describe('generateMap', () => {
  it('generates enemies and loot items', () => {
    const { enemies, lootItems } = generateMap();
    expect(enemies).toBeDefined();
    expect(enemies.length).toBeGreaterThan(0);
    expect(lootItems).toBeDefined();
    expect(lootItems.length).toBeGreaterThan(0);

    const enemy = enemies[0];
    expect(enemy).toHaveProperty('id');
    expect(enemy).toHaveProperty('health');
    expect(enemy).toHaveProperty('position');
    expect(enemy.position.y).toBeCloseTo(1.0);

    const loot = lootItems[0];
    expect(loot).toHaveProperty('id');
    expect(loot).toHaveProperty('type');
    expect(loot).toHaveProperty('position');
    expect(loot.position.y).toBeCloseTo(0.5);
  });
});
