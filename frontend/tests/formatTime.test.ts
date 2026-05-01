import { describe, it, expect } from 'vitest';
import { formatTime } from '../src/utils/formatTime';

describe('formatTime', () => {
  it('formats seconds to MM:SS', () => {
    expect(formatTime(0)).toBe('00:00');
    expect(formatTime(5)).toBe('00:05');
    expect(formatTime(59)).toBe('00:59');
    expect(formatTime(60)).toBe('01:00');
    expect(formatTime(65)).toBe('01:05');
    expect(formatTime(3600)).toBe('60:00'); // 1 hour
    expect(formatTime(3665)).toBe('61:05'); // 1 hour 1 minute 5 seconds
  });
});
