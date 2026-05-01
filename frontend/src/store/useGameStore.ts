import { create } from 'zustand';
import *as THREE from 'three';
import { GameSessionState, PlayerState, EnemyState, BulletData, LootItem, GamePhase, EnemyAIPhase } from '../types/models';
import { generateMap } from '../utils/generateMap';
import { clamp } from '../utils/clamp';

const INITIAL_PLAYER_HEALTH = 100;
const INITIAL_PLAYER_AMMO = 60;
const INITIAL_PLAYER_ARMOR = 0; // % armor reduction

const resetInitialState = () => {
  const { enemies, lootItems } = generateMap();
  return {
    phase: 'menu' as GamePhase,
    score: 0,
    playerEliminations: 0,
    lootCollectedCount: 0,
    enemies: enemies,
    bullets: [],
    lootItems: lootItems,
    player: {
      health: INITIAL_PLAYER_HEALTH,
      maxHealth: INITIAL_PLAYER_HEALTH,
      armor: INITIAL_PLAYER_ARMOR,
      ammo: INITIAL_PLAYER_AMMO,
      maxAmmo: 120,
      position: new THREE.Vector3(0, 5, 0),
      rotation: new THREE.Euler(0, 0, 0),
      isAlive: true,
    },
    safeZoneRadius: 200,
    safeZoneTimer: 0,
    survivedSeconds: 0,
    collisionObjects: [], // Will be populated by Scene or Terrain component
  };
};

interface GameStore extends GameSessionState {
  startGame: () => void;
  endGame: () => void;
  togglePause: () => void;
  resumeGame: () => void;
  resetGame: () => void;

  // Player actions
  setPlayerPosition: (position: THREE.Vector3) => void;
  setPlayerRotation: (rotation: THREE.Euler) => void;
  takePlayerDamage: (amount: number) => void;
  healPlayer: (amount: number) => void;
  addArmor: (amount: number) => void;
  addAmmo: (amount: number) => void;
  removeAmmo: (amount?: number) => void;
  addElimination: () => void;
  collectLoot: (lootId: string) => void;

  // Enemy actions
  setEnemyPosition: (id: string, position: THREE.Vector3) => void;
  setEnemyRotation: (id: string, rotation: THREE.Euler) => void;
  setEnemyAiPhase: (id: string, phase: EnemyAIPhase) => void;
  takeDamage: (enemyId: string, amount: number) => void;

  // Bullet actions
  shootBullet: (bullet: BulletData) => void;
  removeBullet: (bulletId: string) => void;

  // Game state updates
  setScore: (newScore: number) => void;
  setSurvivedSeconds: (seconds: number) => void;
  setSafeZoneRadius: (radius: number) => void;

  // Touch controls (from JoystickVirtual)
  setJoystickState: (state: { x: number; y: number }) => void;
  setShootButtonState: (isPressing: boolean) => void;
}

const useGameStore = create<GameStore>((set, get) => ({
  ...resetInitialState(),

  startGame: () => set((state) => ({
    ...resetInitialState(), // Reset game state before starting
    phase: 'playing',
    // Re-generate map for new game
    ...generateMap(),
    player: { ...state.player, isAlive: true, health: INITIAL_PLAYER_HEALTH, ammo: INITIAL_PLAYER_AMMO, armor: INITIAL_PLAYER_ARMOR, position: new THREE.Vector3(0, 5, 0) },
  })),
  endGame: () => set({ phase: 'gameover' }),
  togglePause: () => set((state) => ({ phase: state.phase === 'playing' ? 'paused' : 'playing' })),
  resumeGame: () => set({ phase: 'playing' }),
  resetGame: () => set(resetInitialState()),

  setPlayerPosition: (position) => set((state) => ({ player: { ...state.player, position: position.clone() } })),
  setPlayerRotation: (rotation) => set((state) => ({ player: { ...state.player, rotation: rotation.clone() } })),
  takePlayerDamage: (amount) => set((state) => {
    if (!state.player.isAlive) return state; // Already dead

    const armorReduction = state.player.armor / 100;
    const actualDamage = amount * (1 - armorReduction);
    const newHealth = clamp(state.player.health - actualDamage, 0, state.player.maxHealth);
    const isAlive = newHealth > 0;
    return { player: { ...state.player, health: newHealth, isAlive } };
  }),
  healPlayer: (amount) => set((state) => ({
    player: { ...state.player, health: clamp(state.player.health + amount, 0, state.player.maxHealth) }
  })),
  addArmor: (amount) => set((state) => ({
    player: { ...state.player, armor: clamp(state.player.armor + amount, 0, 100) }
  })),
  addAmmo: (amount) => set((state) => ({
    player: { ...state.player, ammo: clamp(state.player.ammo + amount, 0, state.player.maxAmmo) }
  })),
  removeAmmo: (amount = 1) => set((state) => ({
    player: { ...state.player, ammo: clamp(state.player.ammo - amount, 0, state.player.maxAmmo) }
  })),
  addElimination: () => set((state) => ({ playerEliminations: state.playerEliminations + 1 })),
  collectLoot: (lootId) => set((state) => ({
    lootItems: state.lootItems.map(item => item.id === lootId ? { ...item, collected: true } : item),
    lootCollectedCount: state.lootCollectedCount + 1,
  })),

  setEnemyPosition: (id, position) => set((state) => ({
    enemies: state.enemies.map(enemy => enemy.id === id ? { ...enemy, position: position.clone() } : enemy)
  })),
  setEnemyRotation: (id, rotation) => set((state) => ({
    enemies: state.enemies.map(enemy => enemy.id === id ? { ...enemy, rotation: rotation.clone() } : enemy)
  })),
  setEnemyAiPhase: (id, phase) => set((state) => ({
    enemies: state.enemies.map(enemy => enemy.id === id ? { ...enemy, aiPhase: phase } : enemy)
  })),
  takeDamage: (enemyId, amount) => set((state) => {
    return {
      enemies: state.enemies.map(enemy => {
        if (enemy.id === enemyId && enemy.isAlive) {
          const newHealth = clamp(enemy.health - amount, 0, enemy.maxHealth);
          return { ...enemy, health: newHealth, isAlive: newHealth > 0 };
        }
        return enemy;
      }),
    };
  }),

  shootBullet: (bullet) => set((state) => ({
    bullets: [...state.bullets, bullet]
  })),
  removeBullet: (bulletId) => set((state) => ({
    bullets: state.bullets.filter(bullet => bullet.id !== bulletId)
  })),

  setScore: (newScore) => set({ score: newScore }),
  setSurvivedSeconds: (seconds) => set({ survivedSeconds: seconds }),
  setSafeZoneRadius: (radius) => set({ safeZoneRadius: radius }),

  // Joystick state (passed to usePlayerPhysics)
  setJoystickState: (state) => {
    // This is a direct update of a virtual 'keyboard' state for physics logic.
    // Might want to separate this into player-specific state.
    // For simplicity, we'll store it directly on the store for now, but not part of GameSessionState.
    // A better approach might be to have a separate Zustand slice for input.
    // Re-evaluating: touchState should be part of useTouchControls hook and passed down.
    // We'll remove these from global store and rely on hook return values.

  },
  setShootButtonState: (isPressing) => {
    // Same as above, best managed in the hook itself and passed.
  },
}));

// Extend Zustand with temporary `keyboardState` and `touchState` to make `useGameStore` conform to `GameStore` interface.
// This is a workaround for the `setJoystickState` and `setShootButtonState` which are not part of `GameSessionState`
// but are needed by the `useTouchControls` hook which is called outside of `useGameStore`.
// A more robust solution would be to make `useTouchControls` pass its state directly to `Player` component.
// For now, remove them from here to avoid confusion and let `useTouchControls` return the state.

export default useGameStore;
