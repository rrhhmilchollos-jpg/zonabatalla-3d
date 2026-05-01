import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { GameCanvas } from '../src/components/GameCanvas';

vi.mock('@react-three/fiber', () => ({
  Canvas: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="canvas-mock">{children}</div>
  ),
  useFrame: vi.fn(),
  useThree: vi.fn(() => ({ camera: { position: { z: 5 } } }))
}));

vi.mock('../store/useGameStore', () => ({
  default: vi.fn(() => ({
    phase: 'playing',
    enemies: [],
    bullets: [],
    lootItems: [],
    // Mock player state to avoid errors in Player component if it tries to access it
    player: { position: { x: 0, y: 0, z: 0 }, rotation: { x: 0, y: 0, z: 0 } },
  })),
}));
vi.mock('../hooks/useGameLoop', () => ({ useGameLoop: vi.fn() }));
vi.mock('../hooks/useKeyboardControls', () => ({
  useKeyboardControls: vi.fn(() => ({ forward: false, backward: false, left: false, right: false, jump: false, shoot: false, run: false }))
}));
vi.mock('../hooks/useTouchControls', () => ({
  useTouchControls: vi.fn(() => ({ x: 0, y: 0, jump: false, shoot: false, run: false }))
}));
vi.mock('../components/Scene', () => ({ Scene: () => <div data-testid="scene-mock" /> }));
vi.mock('../components/Terrain', () => ({ Terrain: () => <div data-testid="terrain-mock" /> }));
vi.mock('../components/Player', () => ({ Player: () => <div data-testid="player-mock" /> }));
vi.mock('../components/Enemy', () => ({ Enemy: () => <div data-testid="enemy-mock" /> }));
vi.mock('../components/Loot', () => ({ Loot: () => <div data-testid="loot-mock" /> }));
vi.mock('../components/SafeZone', () => ({ SafeZone: () => <div data-testid="safezone-mock" /> }));
vi.mock('../components/Bullet', () => ({ Bullet: () => <div data-testid="bullet-mock" /> }));
vi.mock('../components/Crosshair', () => ({ Crosshair: () => <div data-testid="crosshair-mock" /> }));

describe('GameCanvas', () => {
  it('renders canvas container', () => {
    render(<GameCanvas />);
    const canvas = screen.getByTestId('canvas-mock');
    expect(canvas).toBeInTheDocument();
  });
});
