import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { Scene } from '../src/components/Scene';

vi.mock('@react-three/fiber', () => ({
  useFrame: vi.fn(),
  useThree: vi.fn(() => ({ camera: { position: { z: 5 } } })),
}));

vi.mock('@react-three/drei', () => ({
  Environment: () => null,
  Sky: () => null,
  Stars: () => null,
}));

vi.mock('../store/useGameStore', () => ({
  default: vi.fn(() => ({
    player: { position: { x: 0, y: 0, z: 0 } },
    phase: 'menu',
  })),
}));

describe('Scene', () => {
  it('renders scene without errors', () => {
    const { container } = render(<Scene />);
    expect(container).toBeTruthy();
  });
});
