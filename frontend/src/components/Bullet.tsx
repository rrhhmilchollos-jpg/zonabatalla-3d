import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import *as THREE from 'three';
import { BulletData, EnemyState, PlayerState } from '../types/models';
import useGameStore from '../store/useGameStore';
import { useCollision } from '../hooks/useCollision';

interface BulletProps {
  bullet: BulletData;
}

const BULLET_RADIUS = 0.1;

export const Bullet: React.FC<BulletProps> = ({ bullet }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const removeBullet = useGameStore((state) => state.removeBullet);
  const takeDamage = useGameStore((state) => state.takeDamage);
  const takePlayerDamage = useGameStore((state) => state.takePlayerDamage);
  const addElimination = useGameStore((state) => state.addElimination);

  // Initial position setup
  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.position.copy(bullet.position);
    }
  }, [bullet.position]);

  const allEnemies = useGameStore((state) => state.enemies);
  const player = useGameStore((state) => state.player);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    // Move bullet
    meshRef.current.position.addScaledVector(bullet.direction, delta);

    // Check for collisions (simplified)
    const currentPos = meshRef.current.position;

    // Check collision with enemies if it's a player bullet
    if (bullet.source === 'player') {
      for (const enemy of allEnemies) {
        if (enemy.isAlive && useCollision.sphereSphere(currentPos, BULLET_RADIUS, enemy.position, 0.4)) { // 0.4 is enemy radius
          takeDamage(enemy.id, bullet.damage);
          removeBullet(bullet.id);
          if (enemy.health - bullet.damage <= 0) {
            addElimination(); // Award elimination if enemy dies
          }
          return; // Bullet hit, stop processing
        }
      }
    }

    // Check collision with player if it's an enemy bullet
    if (bullet.source === 'enemy' && player.isAlive) {
      if (useCollision.sphereSphere(currentPos, BULLET_RADIUS, player.position.clone().add(new THREE.Vector3(0, 0.9, 0)), 0.5)) { // 0.5 is player radius
        takePlayerDamage(bullet.damage);
        removeBullet(bullet.id);
        return;
      }
    }

    // Check collision with terrain (simplified: just below Y=0)
    if (currentPos.y < 0) {
      removeBullet(bullet.id);
      return;
    }

    // Remove bullet after a certain distance or time to live
    if (bullet.position.distanceTo(currentPos) > 300) {
      removeBullet(bullet.id);
    }
  });

  return (
    <mesh ref={meshRef} castShadow>
      <sphereGeometry args={[BULLET_RADIUS, 8, 8]} />
      <meshBasicMaterial color={bullet.source === 'player' ? '#ffcc00' : '#ffa500'} />
    </mesh>
  );
};
