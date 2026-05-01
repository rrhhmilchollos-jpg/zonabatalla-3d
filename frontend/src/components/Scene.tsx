import React, { useRef, useEffect } from 'react';
import { Environment, Sky, Stars } from '@react-three/drei';
import { useThree, useFrame } from '@react-three/fiber';
import *as THREE from 'three';
import useGameStore from '../store/useGameStore';

export const Scene: React.FC = () => {
  const { camera } = useThree();
  const playerPosition = useGameStore((state) => state.player.position);
  const gamePhase = useGameStore((state) => state.phase);
  const lookAtRef = useRef(new THREE.Vector3());

  useEffect(() => {
    // Initial camera setup for menu screen
    if (gamePhase === 'menu') {
      camera.position.set(0, 50, 80);
      camera.lookAt(0, 0, 0);
    }
  }, [gamePhase, camera]);

  useFrame(() => {
    if (gamePhase === 'playing') {
      // Smoothly follow player position horizontally
      lookAtRef.current.lerp(new THREE.Vector3(playerPosition.x, playerPosition.y + 10, playerPosition.z), 0.05);
      camera.lookAt(lookAtRef.current);
    }
  });

  return (
    <>
      <color attach="background" args={['#0b0b12']} /> {/* Background color for the scene */}

      <ambientLight intensity={0.5} color="#b0e0e6" />
      <directionalLight position={[10, 20, 10]} intensity={1.5} color="#ffd700" castShadow />
      <directionalLight position={[-10, 10, -10]} intensity={0.8} color="#add8e6" />

      {/* Skybox with gradient sky */}
      <Sky distance={450000} sunPosition={[0, 1, 0]} inclination={0.6} azimuth={0.1} />
      
      {/* Simple fog */}
      <fog attach="fog" args={['#0b0b12', 100, 500]} />

      {/* Stars in the background */}
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

      {/* Environment for reflections/indirect lighting, if needed. Can use HDRIs. */}
      <Environment preset="sunset" background />

      {/* Shadows configuration for the directional light */}
      {/* <directionalLight
        position={[10, 20, 10]}
        intensity={1.5}
        color="#ffd700"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={50}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      /> */}
    </>
  );
};
