import { useRef } from 'react';
import *as THREE from 'three';
import { EnemyState, AIAcions } from '../types/models';
import { useCollision } from '../hooks/useCollision';
import { randomInCircle } from '../utils/randomInCircle';
import { clamp } from '../utils/clamp';

const PATROL_RADIUS = 50; // How far enemies patrol from their spawn
const CHASE_RANGE = 40;  // Distance to start chasing player
const ATTACK_RANGE = 20; // Distance to start attacking player
const SHOOT_COOLDOWN_BASE = 1.5; // Base time between shots

export const useEnemyAI = (enemy: EnemyState, playerPosition: THREE.Vector3) => {
  const currentTarget = useRef(new THREE.Vector3());
  const lastActionTime = useRef(0);
  const lastShotTime = useRef(0);

  const updateAI = (currentTime: number): AIAcions => {
    if (!enemy.isAlive) return { moveDirection: null, shouldShoot: false };

    const distanceToPlayer = enemy.position.distanceTo(playerPosition);
    let moveDirection: THREE.Vector3 | null = null;
    let shouldShoot = false;

    // State machine logic
    let newAiPhase = enemy.aiPhase;

    if (distanceToPlayer <= ATTACK_RANGE) {
      newAiPhase = 'attack';
    } else if (distanceToPlayer <= CHASE_RANGE) {
      newAiPhase = 'chase';
    } else {
      newAiPhase = 'patrol';
    }

    // Ensure phase updates in store if changed
    if (enemy.aiPhase !== newAiPhase) {
      useGameStore.getState().setEnemyAiPhase(enemy.id, newAiPhase);
    }

    switch (newAiPhase) {
      case 'patrol':
        if (currentTime - lastActionTime.current > 5 || enemy.position.distanceTo(currentTarget.current) < 2) {
          // Pick a new random patrol target near spawn point
          currentTarget.current = randomInCircle(PATROL_RADIUS).add(enemy.spawnPosition);
          currentTarget.current.y = 0;
          lastActionTime.current = currentTime;
        }
        moveDirection = currentTarget.current.clone().sub(enemy.position).normalize();
        break;

      case 'chase':
        currentTarget.current = playerPosition.clone();
        moveDirection = currentTarget.current.clone().sub(enemy.position).normalize();
        break;

      case 'attack':
        // Stay put or strafe while attacking
        moveDirection = playerPosition.clone().sub(enemy.position);
        const angle = Math.atan2(moveDirection.z, moveDirection.x); // Angle to player

        // Try to keep a distance while attacking (simple circle movement)
        const preferredAttackDistance = ATTACK_RANGE * 0.7;
        if (distanceToPlayer < preferredAttackDistance - 5) { // Too close
          moveDirection = currentTarget.current.clone().sub(enemy.position).normalize().negate(); // Move away
        } else if (distanceToPlayer > preferredAttackDistance + 5) { // Too far
          moveDirection = currentTarget.current.clone().sub(enemy.position).normalize(); // Move closer
        } else {
          // Strafe or stand still, occasionally move sideways
          const strafeDirection = new THREE.Vector3(-moveDirection.z, 0, moveDirection.x).normalize(); // Perpendicular to player direction
          if (Math.random() < 0.01) { // Small chance to strafe
            moveDirection.add(strafeDirection.multiplyScalar(Math.random() > 0.5 ? 1 : -1));
          } else {
            moveDirection.set(0,0,0); // Stand still if within ideal range
          }
        }
        
        shouldShoot = true;
        break;

      case 'dead':
        // No actions when dead
        moveDirection = null;
        shouldShoot = false;
        break;
    }

    // Simple check if line of sight to player is clear (very basic, no complex occlusion)
    const rayToPlayer = new THREE.Raycaster(enemy.position.clone().add(new THREE.Vector3(0,1,0)), playerPosition.clone().sub(enemy.position).normalize());
    const obstacles = useGameStore.getState().collisionObjects;
    const intersects = rayToPlayer.intersectObjects(obstacles, true);

    if (intersects.length > 0 && intersects[0].distance < distanceToPlayer - 1) {
      // Obstacle between enemy and player, don't shoot.
      shouldShoot = false;
    }

    if (shouldShoot && currentTime - lastShotTime.current > SHOOT_COOLDOWN_BASE) {
        lastShotTime.current = currentTime;
        // return { moveDirection, shouldShoot: true }; // Let the component handle shooting
    }

    return { moveDirection, shouldShoot };
  };

  return { updateAI, currentTarget: currentTarget.current, lastShotTime: lastShotTime.current };
};
