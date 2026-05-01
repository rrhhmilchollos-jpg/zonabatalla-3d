import React, { useRef, useMemo, useEffect } from 'react';
import *as THREE from 'three';
import { useTexture } from '@react-three/drei';
import useGameStore from '../store/useGameStore'; // Import game store

interface TerrainProps {
  size?: number;
  resolution?: number;
  heightScale?: number;
}

export const Terrain: React.FC<TerrainProps> = ({
  size = 500, // Total size of the terrain
  resolution = 128, // Number of segments per side
  heightScale = 30, // Maximum height variation
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const setCollisionObjects = useGameStore((state) => state.setCollisionObjects); // Setter for collision objects

  const [grassTexture, rockTexture] = useTexture([
    '/textures/grass_texture.jpg', // Replace with your own textures for a more detailed terrain.
    '/textures/rock_texture.jpg',  // Example: download free textures and place them in /public/textures/
  ]);

  const geometry = useMemo(() => {
    const planeGeometry = new THREE.PlaneGeometry(size, size, resolution, resolution);
    planeGeometry.rotateX(-Math.PI / 2); // Orient correctly

    const positionAttribute = planeGeometry.attributes.position;
    const vec3 = new THREE.Vector3();

    // Simple pseudo-random height generation (can be replaced with Perlin/Simplex noise for better results)
    for (let i = 0; i < positionAttribute.count; i++) {
      vec3.fromBufferAttribute(positionAttribute, i);
      // A simple sine wave approximation for hills
      const distance = Math.sqrt(vec3.x * vec3.x + vec3.z * vec3.z);
      vec3.y = Math.sin(distance * 0.1 + vec3.x * 0.05 + vec3.z * 0.03) * heightScale * 0.5;
      vec3.y += Math.sin(vec3.x * 0.02 + vec3.z * 0.01) * heightScale * 0.3;
      vec3.y += (Math.random() - 0.5) * heightScale * 0.1; // Add some small random noise
      positionAttribute.setY(i, vec3.y);
    }

    planeGeometry.computeVertexNormals(); // Recalculate normals after height modification
    return planeGeometry;
  }, [size, resolution, heightScale]);

  const material = useMemo(() => {
    if (grassTexture) grassTexture.wrapS = grassTexture.wrapT = THREE.RepeatWrapping;
    if (rockTexture) rockTexture.wrapS = rockTexture.wrapT = THREE.RepeatWrapping;

    return new THREE.MeshStandardMaterial({
      map: grassTexture, // Base texture
      roughness: 0.8,
      metalness: 0.1,
      // You can blend textures based on height or slope here for more realism
    });
  }, [grassTexture, rockTexture]);

  useEffect(() => {
    if (meshRef.current) {
      // Add terrain mesh to collision objects
      setCollisionObjects((prev) => [...prev, meshRef.current!]);
    }
    return () => {
      if (meshRef.current) {
        // Remove terrain mesh on unmount
        setCollisionObjects((prev) => prev.filter(obj => obj !== meshRef.current));
      }
    };
  }, [setCollisionObjects]);


  return (
    <mesh ref={meshRef} geometry={geometry} material={material} receiveShadow userData={{ objectType: 'terrain' }} />
  );
};
