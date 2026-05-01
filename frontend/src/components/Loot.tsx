import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import *as THREE from 'three';
import { LootItem } from '../types/models';
import useGameStore from '../store/useGameStore';
import { useCollision } from '../hooks/useCollision';
import { useGLTF } from '@react-three/drei'; // For loading simple models

interface LootProps {
  item: LootItem;
}

export const Loot: React.FC<LootProps> = ({ item }) => {
  const meshRef = useRef<THREE.Group>(null);
  const playerPosition = useGameStore((state) => state.player.position);
  const collectLoot = useGameStore((state) => state.collectLoot);
  const addAmmo = useGameStore((state) => state.addAmmo);
  const healPlayer = useGameStore((state) => state.healPlayer);
  const addArmor = useGameStore((state) => state.addArmor);

  // Example of using useGLTF for a simple model. You'd need actual .glb files.
  // For now, we'll use primitive meshes.
  // const { scene } = useGLTF('/models/crate.glb');

  useFrame(() => {
    if (!meshRef.current || item.collected) return;

    // Animate rotation
    meshRef.current.rotation.y += 0.02;

    // Check for player proximity to collect
    const playerCenter = playerPosition.clone().add(new THREE.Vector3(0, 0.9, 0)); // Player's center approx
    if (useCollision.sphereSphere(playerCenter, 0.8, item.position, 0.7)) { // Player radius 0.8, loot radius 0.7
      collectLoot(item.id);
      // Apply loot effect
      if (item.type === 'ammo') {
        addAmmo(item.value);
      } else if (item.type === 'health') {
        healPlayer(item.value);
      } else if (item.type === 'armor') {
        addArmor(item.value);
      }
    }
  });

  // Determine color and shape based on loot type
  let color = '#ffffff';
  let shape: React.ReactNode = <boxGeometry args={[0.8, 0.8, 0.8]} />;
  if (item.type === 'ammo') {
    color = '#f97316'; // Accent color for ammo
    shape = <octahedronGeometry args={[0.5, 0]} />;
  } else if (item.type === 'health') {
    color = '#ef4444'; // Red for health
    shape = <boxGeometry args={[0.8, 0.8, 0.8]} />;
  } else if (item.type === 'armor') {
    color = '#22d3ee'; // Secondary color for armor
    shape = <torusGeometry args={[0.5, 0.2, 8, 16]} />;
  }

  return (
    <group ref={meshRef} position={item.position} scale={1} userData={{ objectType: 'loot', id: item.id }}>
      <mesh castShadow>
        {shape}
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} />
      </mesh>
      {/* Optional: Add a light or glowing effect to loot */}
      <pointLight distance={3} intensity={5} color={color} />
    </group>
  );
};
