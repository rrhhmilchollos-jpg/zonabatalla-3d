import { describe, it, expect } from 'vitest';
import { calculateScore } from '../src/utils/calculateScore';

describe('calculateScore', () => {
  it('calculates score based on eliminations, survival time, and loot collected', () => {
    // 1 elimination = 100 points
    // 1 second survived = 2 points
    // 1 loot collected = 10 points

    // Test case 1: No eliminations, 0 seconds, no loot
    expect(calculateScore(0, 0, 0)).toBe(0);

    // Test case 2: Some eliminations, seconds, and loot
    expect(calculateScore(5, 60, 3)).toBe(5 * 100 + 60 * 2 + 3 * 10); // 500 + 120 + 30 = 650

    // Test case 3: Only eliminations
    expect(calculateScore(10, 0, 0)).toBe(1000);

    // Test case 4: Only survival time
    expect(calculateScore(0, 120, 0)).toBe(240);

    // Test case 5: Only loot collected
    expect(calculateScore(0, 0, 5)).toBe(50);
  });
});
