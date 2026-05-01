import *as THREE from 'three';

export const randomInCircle = (radius: number): THREE.Vector3 => {
  const angle = Math.random() * Math.PI * 2;
  const r = Math.sqrt(Math.random()) * radius; // Ensure uniform distribution
  const x = r * Math.cos(angle);
  const z = r * Math.sin(angle);
  return new THREE.Vector3(x, 0, z);
};
