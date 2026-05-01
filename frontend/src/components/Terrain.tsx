import React, { useRef, useMemo } from 'react';
import *as THREE from 'three';
import { useTexture } from '@react-three/drei';

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

  const [grassTexture, rockTexture] = useTexture([
    '/textures/grass_texture.jpg', // Placeholder, ensure you have these textures or replace
    '/textures/rock_texture.jpg',
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

  return (
    <mesh ref={meshRef} geometry={geometry} material={material} receiveShadow />
  );
};

// Add placeholder textures in /public/textures/grass_texture.jpg and rock_texture.jpg
// For example, download from a free texture site or use a colored plane for now.
// e.g., https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/crate.gif for quick test
