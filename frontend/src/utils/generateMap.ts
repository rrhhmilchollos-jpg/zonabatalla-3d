import *as THREE from 'three';
import { EnemyState, LootItem } from '../types/models';
import { randomInCircle } from './randomInCircle';
import { v4 as uuidv4 } from 'uuid';

const MAP_MAX_RADIUS = 220; // Max distance from center for spawns
const NUM_ENEMIES = 5;
const NUM_LOOT_ITEMS = 10;

export const generateMap = () => {
  const enemies: EnemyState[] = [];
  const lootItems: LootItem[] = [];

  // Generate Enemies
  for (let i = 0; i < NUM_ENEMIES; i++) {
    const spawnPos = randomInCircle(MAP_MAX_RADIUS);
    spawnPos.y = 1.0; // Place enemy slightly above ground

    enemies.push({
      id: uuidv4(),
      health: 100,
      maxHealth: 100,
      position: spawnPos,
      rotation: new THREE.Euler(0, Math.random() * Math.PI * 2, 0),
      aiPhase: 'patrol',
      isAlive: true,
      targetPosition: new THREE.Vector3(),
      spawnPosition: spawnPos.clone(),
      shootCooldown: 1.5 + Math.random() * 0.5, // slightly varied cooldown
    });
  }

  // Generate Loot Items
  const lootTypes: LootItem['type'][] = ['ammo', 'health', 'armor'];
  for (let i = 0; i < NUM_LOOT_ITEMS; i++) {
    const spawnPos = randomInCircle(MAP_MAX_RADIUS);
    spawnPos.y = 0.5; // Place loot slightly above ground
    const type = lootTypes[Math.floor(Math.random() * lootTypes.length)];
    const value = type === 'ammo' ? 30 : (type === 'health' ? 25 : 20); // Ammo, health, armor values

    lootItems.push({
      id: uuidv4(),
      type,
      position: spawnPos,
      value,
      collected: false,
    });
  }

  return { enemies, lootItems };
};
