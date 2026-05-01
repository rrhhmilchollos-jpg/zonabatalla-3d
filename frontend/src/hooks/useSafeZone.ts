import { useRef, useEffect } from 'react';
import useGameStore from '../store/useGameStore';
import *as THREE from 'three';

const INITIAL_ZONE_RADIUS = 200; // Start big
const MIN_ZONE_RADIUS = 50;    // Smallest zone
const SHRINK_INTERVAL = 30;    // Seconds between shrinks
const SHRINK_AMOUNT_PER_TICK = 0.5; // Meters per tick during shrink phase
const DAMAGE_PER_SECOND_OUTSIDE_ZONE = 5; // Player damage outside zone

export const useSafeZone = () => {
  const setSafeZoneRadius = useGameStore((state) => state.setSafeZoneRadius);
  const safeZoneRadius = useGameStore((state) => state.safeZoneRadius);
  const takePlayerDamage = useGameStore((state) => state.takePlayerDamage);
  const gamePhase = useGameStore((state) => state.phase);

  const lastShrinkTime = useRef(0);
  const isShrinking = useRef(false);
  const currentTargetRadius = useRef(INITIAL_ZONE_RADIUS);

  useEffect(() => {
    // Initialize or reset zone on game start
    if (gamePhase === 'playing') {
      setSafeZoneRadius(INITIAL_ZONE_RADIUS);
      lastShrinkTime.current = performance.now() / 1000; // Start timer
      isShrinking.current = false;
      currentTargetRadius.current = INITIAL_ZONE_RADIUS; // Ensure target is reset
    }
  }, [gamePhase, setSafeZoneRadius]);

  const updateSafeZone = (delta: number, playerPosition: THREE.Vector3) => {
    if (gamePhase !== 'playing') return;

    const currentTime = performance.now() / 1000;

    // Check if player is outside the safe zone
    const distanceToCenter = playerPosition.horizontalDistanceTo(new THREE.Vector3(0, playerPosition.y, 0));
    if (distanceToCenter > safeZoneRadius) {
      takePlayerDamage(DAMAGE_PER_SECOND_OUTSIDE_ZONE * delta);
    }

    // Manage zone shrinking
    if (!isShrinking.current && (currentTime - lastShrinkTime.current > SHRINK_INTERVAL)) {
      // Start a new shrink phase
      lastShrinkTime.current = currentTime;
      isShrinking.current = true;
      currentTargetRadius.current = Math.max(MIN_ZONE_RADIUS, safeZoneRadius * 0.7); // Shrink to 70% or min
    }

    if (isShrinking.current) {
      if (safeZoneRadius > currentTargetRadius.current) {
        setSafeZoneRadius(Math.max(currentTargetRadius.current, safeZoneRadius - SHRINK_AMOUNT_PER_TICK * delta));
      } else {
        isShrinking.current = false; // Stop shrinking once target reached
      }
    }
  };

  return { updateSafeZone };
};
