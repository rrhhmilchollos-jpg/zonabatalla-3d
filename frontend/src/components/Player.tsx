import React, { useRef, useEffect } from 'react';
import { useSphere } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import *as THREE from 'three';
import useGameStore from '../store/useGameStore';
import { usePlayerPhysics } from '../hooks/usePlayerPhysics';
import { KeyboardState } from '../hooks/useKeyboardControls';
import { TouchState } from '../hooks/useTouchControls';
import { BulletData } from '../types/models';
import { v4 as uuidv4 } from 'uuid';

interface PlayerProps {
  keyboardState: KeyboardState;
  touchState: TouchState;
}

export const Player: React.FC<PlayerProps> = ({ keyboardState, touchState }) => {
  const playerState = useGameStore((state) => state.player);
  const setPlayerPosition = useGameStore((state) => state.setPlayerPosition);
  const setPlayerRotation = useGameStore((state) => state.setPlayerRotation);
  const shootBullet = useGameStore((state) => state.shootBullet);
  const removeAmmo = useGameStore((state) => state.removeAmmo);
  const gamePhase = useGameStore((state) => state.phase);
  const lastShotTime = useRef(0);
  const SHOOT_COOLDOWN = 0.3; // seconds

  // Player mesh ref, a simple capsule representation
  const meshRef = useRef<THREE.Mesh>(null);

  // Use usePlayerPhysics for movement and collision
  const {
    velocity,
    isGrounded,
    updatePhysics,
  } = usePlayerPhysics(meshRef, keyboardState, touchState, playerState.isAlive && gamePhase === 'playing');

  // Update player position in store on physics update
  useEffect(() => {
    if (meshRef.current) {
      setPlayerPosition(meshRef.current.position);
    }
  }, [meshRef.current?.position.x, meshRef.current?.position.y, meshRef.current?.position.z, setPlayerPosition]);

  const { camera } = useThree();
  const FWD = new THREE.Vector3(0, 0, -1);
  const RIGHT = new THREE.Vector3(1, 0, 0);
  const UP = new THREE.Vector3(0, 1, 0);

  useFrame((state, delta) => {
    if (!meshRef.current || gamePhase !== 'playing') return;

    updatePhysics(delta);

    // Rotate player capsule to match camera view for aiming
    // Only rotate around Y axis
    const cameraDirection = new THREE.Vector3();
    camera.getWorldDirection(cameraDirection);
    cameraDirection.y = 0; // Ignore vertical camera rotation for player body rotation
    cameraDirection.normalize();

    const targetQuaternion = new THREE.Quaternion().setFromUnitVectors(FWD, cameraDirection);
    meshRef.current.quaternion.slerp(targetQuaternion, 0.1); // Smooth rotation
    setPlayerRotation(meshRef.current.rotation);

    // Camera follow
    const cameraOffset = new THREE.Vector3(0, 2, 5); // Offset behind player
    cameraOffset.applyQuaternion(meshRef.current.quaternion);
    camera.position.lerp(meshRef.current.position.clone().add(cameraOffset), 0.1);
    camera.lookAt(meshRef.current.position.clone().add(new THREE.Vector3(0, 1.5, 0))); // Look slightly above player center

    // Shooting
    if (playerState.ammo > 0 && (keyboardState.shoot || touchState.shoot) && state.clock.elapsedTime - lastShotTime.current > SHOOT_COOLDOWN) {
      lastShotTime.current = state.clock.elapsedTime;
      removeAmmo();

      const bulletOrigin = meshRef.current.position.clone().add(new THREE.Vector3(0, 1.5, 0)); // From player's eye level
      const bulletDirection = new THREE.Vector3();
      camera.getWorldDirection(bulletDirection);

      const bulletData: BulletData = {
        id: uuidv4(),
        position: bulletOrigin,
        direction: bulletDirection.multiplyScalar(30), // Bullet speed
        source: 'player',
        damage: 10,
      };
      shootBullet(bulletData);
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 5, 0]} castShadow>
      <capsuleGeometry args={[0.5, 1, 4, 8]} /> {/* Capsule for player body */}
      <meshStandardMaterial color={playerState.isAlive ? '#007bff' : '#555555'} />
    </mesh>
  );
};
