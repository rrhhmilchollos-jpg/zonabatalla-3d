import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import *as THREE from 'three';
import { EnemyState, BulletData } from '../types/models';
import useGameStore from '../store/useGameStore';
import { useEnemyAI } from '../hooks/useEnemyAI';
import { v4 as uuidv4 } from 'uuid';

interface EnemyProps {
  enemy: EnemyState;
}

const ENEMY_HEIGHT = 1.8;
const ENEMY_RADIUS = 0.4;

export const Enemy: React.FC<EnemyProps> = ({ enemy }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const setEnemyPosition = useGameStore((state) => state.setEnemyPosition);
  const setEnemyRotation = useGameStore((state) => state.setEnemyRotation);
  const takeDamage = useGameStore((state) => state.takeDamage);
  const shootBullet = useGameStore((state) => state.shootBullet);
  const playerPosition = useGameStore((state) => state.player.position);

  const { updateAI, currentTarget, lastShotTime } = useEnemyAI(enemy, playerPosition);
  const gamePhase = useGameStore((state) => state.phase);

  // Initialize position when component mounts or enemy data changes
  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.position.copy(enemy.position);
      meshRef.current.rotation.copy(enemy.rotation as any);
    }
  }, [enemy.position.x, enemy.position.y, enemy.position.z, enemy.rotation]);

  useFrame((state, delta) => {
    if (!meshRef.current || !enemy.isAlive || gamePhase !== 'playing') return;

    // Update AI state and get desired movement/action
    const aiResult = updateAI(state.clock.elapsedTime);
    let moveDirection = aiResult.moveDirection;
    let shouldShoot = aiResult.shouldShoot;

    // Basic movement towards target
    if (moveDirection && moveDirection.lengthSq() > 0.01) {
      const speed = enemy.aiPhase === 'chase' ? 3 : 1.5; // Faster when chasing
      const newPosition = meshRef.current.position.clone().add(moveDirection.multiplyScalar(speed * delta));

      // Simple terrain collision (prevent going below ground)
      if (newPosition.y < ENEMY_HEIGHT / 2) {
        newPosition.y = ENEMY_HEIGHT / 2;
      }
      meshRef.current.position.copy(newPosition);
      setEnemyPosition(enemy.id, meshRef.current.position);

      // Rotate to face direction of movement
      const targetQuaternion = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), moveDirection.normalize());
      meshRef.current.quaternion.slerp(targetQuaternion, 0.1);
      setEnemyRotation(enemy.id, meshRef.current.rotation);
    }

    // Enemy shooting logic
    if (shouldShoot && state.clock.elapsedTime - lastShotTime.current > enemy.shootCooldown) {
      const bulletOrigin = meshRef.current.position.clone().add(new THREE.Vector3(0, ENEMY_HEIGHT * 0.7, 0));
      const directionToPlayer = playerPosition.clone().sub(bulletOrigin).normalize();
      
      const bulletData: BulletData = {
        id: uuidv4(),
        position: bulletOrigin,
        direction: directionToPlayer.multiplyScalar(20), // Bullet speed
        source: 'enemy',
        damage: 5,
      };
      shootBullet(bulletData);
    }
  });

  // Check for damage (this could be optimized with a collision system)
  useEffect(() => {
    if (enemy.health <= 0 && enemy.isAlive) {
      takeDamage(enemy.id, 0); // Mark as dead (health already 0)
    }
  }, [enemy.health, enemy.isAlive, enemy.id, takeDamage]);

  return (
    <mesh ref={meshRef} position={enemy.position} castShadow userData={{ objectType: 'enemy', id: enemy.id, damage: (amount: number) => takeDamage(enemy.id, amount) }}>
      <capsuleGeometry args={[ENEMY_RADIUS, ENEMY_HEIGHT - ENEMY_RADIUS * 2, 4, 8]} />
      <meshStandardMaterial color={enemy.isAlive ? '#ff0000' : '#888888'} />
      {/* Health bar above enemy (simple representation) */}
      {enemy.isAlive && (
        <mesh position={[0, ENEMY_HEIGHT + 0.3, 0]}>
          <boxGeometry args={[1, 0.1, 0.1]} />
          <meshBasicMaterial color={'#555555'} />
          <mesh position={[-0.5 + (enemy.health / enemy.maxHealth) * 0.5, 0, 0.05]}>
            <boxGeometry args={[enemy.health / enemy.maxHealth, 0.08, 0.1]} />
            <meshBasicMaterial color={enemy.health > 20 ? '#00ff00' : '#ffcc00'} />
          </mesh>
        </mesh>
      )}
    </mesh>
  );
};
