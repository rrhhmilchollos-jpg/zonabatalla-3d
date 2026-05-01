import *as THREE from 'three';

// Basic collision detection utilities
export const useCollision = {
  /**
   * Checks for collision between two spheres.
   * @param pos1 Position of sphere 1
   * @param radius1 Radius of sphere 1
   * @param pos2 Position of sphere 2
   * @param radius2 Radius of sphere 2
   * @returns True if spheres are colliding, false otherwise.
   */
  sphereSphere: (pos1: THREE.Vector3, radius1: number, pos2: THREE.Vector3, radius2: number): boolean => {
    const distance = pos1.distanceTo(pos2);
    return distance <= (radius1 + radius2);
  },

  /**
   * Checks for collision between a sphere and an AABB (Axis-Aligned Bounding Box).
   * Simplified for a 'flat' plane like terrain (y=0).
   * For full AABB, need min/max vectors.
   * @param spherePos Position of the sphere
   * @param sphereRadius Radius of the sphere
   * @param planeY Y-coordinate of the plane (e.g., ground)
   * @returns True if sphere collides with or is below the plane, false otherwise.
   */
  spherePlane: (spherePos: THREE.Vector3, sphereRadius: number, planeY: number): boolean => {
    return spherePos.y - sphereRadius <= planeY;
  },

  /**
   * Checks for collision between a sphere and a specific point (e.g., for loot proximity).
   * @param spherePos Position of the sphere
   * @param sphereRadius Radius of the sphere
   * @param point The point to check against
   * @param pointRadius A conceptual radius for the point (e.g. effective pickup range)
   * @returns True if the sphere is near the point, false otherwise.
   */
  spherePoint: (spherePos: THREE.Vector3, sphereRadius: number, point: THREE.Vector3, pointRadius: number): boolean => {
    const distance = spherePos.distanceTo(point);
    return distance <= (sphereRadius + pointRadius);
  },
};
