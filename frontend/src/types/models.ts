import *as THREE from 'three';

export interface ScoreEntry {
  id: string;
  playerName: string;
  score: number;
  eliminations: number;
  survivedSeconds: number;
  date: string;
}

export interface PlayerState {
  health: number;
  maxHealth: number;
  armor: number;
  ammo: number;
  maxAmmo: number;
  position: THREE.Vector3;
  rotation: THREE.Euler;
  isAlive: boolean;
}

export type EnemyAIPhase = 'patrol' | 'chase' | 'attack' | 'dead';

export interface EnemyState {
  id: string;
  health: number;
  maxHealth: number;
  position: THREE.Vector3;
  rotation: THREE.Euler;
  aiPhase: EnemyAIPhase;
  isAlive: boolean;
  targetPosition: THREE.Vector3; // For AI movement
  spawnPosition: THREE.Vector3; // To keep patrol range localized
  shootCooldown: number;
}

export interface BulletData {
  id: string;
  position: THREE.Vector3;
  direction: THREE.Vector3; // Velocity vector
  source: 'player' | 'enemy';
  damage: number;
}

export type LootType = 'ammo' | 'health' | 'armor';

export interface LootItem {
  id: string;
  type: LootType;
  position: THREE.Vector3;
  value: number; // Amount of ammo, health, or armor
  collected: boolean;
}

export interface AIAcions {
  moveDirection: THREE.Vector3 | null;
  shouldShoot: boolean;
}

export type GamePhase = 'menu' | 'playing' | 'paused' | 'gameover';

export interface GameSessionState {
  phase: GamePhase;
  score: number;
  playerEliminations: number;
  lootCollectedCount: number;
  enemies: EnemyState[];
  bullets: BulletData[];
  lootItems: LootItem[];
  player: PlayerState;
  safeZoneRadius: number;
  safeZoneTimer: number; // Placeholder for future zone timer UI
  survivedSeconds: number;
  collisionObjects: THREE.Object3[]; // Objects in scene for AI/bullet collision checks
}
