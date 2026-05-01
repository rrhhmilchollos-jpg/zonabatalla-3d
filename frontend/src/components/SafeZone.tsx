import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import *as THREE from 'three';
import useGameStore from '../store/useGameStore';

export const SafeZone: React.FC = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const safeZoneRadius = useGameStore((state) => state.safeZoneRadius);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.scale.set(safeZoneRadius, 1, safeZoneRadius);
      meshRef.current.position.y = -0.01; // Slightly below ground to avoid z-fighting
    }
  });

  return (
    <mesh ref={meshRef} rotation-x={-Math.PI / 2} >
      <ringGeometry args={[safeZoneRadius - 1, safeZoneRadius, 64]} /> {/* Inner and outer radius define thickness */}
      <meshBasicMaterial color={'#4ade80'} transparent opacity={0.2} side={THREE.DoubleSide} />
      {/* Small inner ring to mark the absolute limit */}
      <mesh>
        <ringGeometry args={[safeZoneRadius - 0.2, safeZoneRadius + 0.2, 64]} />
        <meshBasicMaterial color={'#4ade80'} transparent opacity={0.4} side={THREE.DoubleSide} />
      </mesh>
    </mesh>
  );
};
