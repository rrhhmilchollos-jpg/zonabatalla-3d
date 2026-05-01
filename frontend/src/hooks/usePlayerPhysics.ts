import { useRef, useState, useEffect } from 'react';
import *as THREE from 'three';
import { useThree } from '@react-three/fiber';
import { KeyboardState } from './useKeyboardControls';
import { TouchState } from './useTouchControls';

const GRAVITY = -9.81; // m/s^2
const PLAYER_HEIGHT = 1.8; // Player height in meters
const PLAYER_RADIUS = 0.5; // Player radius in meters
const JUMP_VELOCITY = 6; // Initial vertical velocity for a jump
const PLAYER_SPEED = 5; // Base movement speed
const RUN_MULTIPLIER = 1.8; // Speed multiplier when running
const DRAG_FACTOR = 0.1; // Horizontal drag

export const usePlayerPhysics = (
  meshRef: React.RefObject<THREE.Mesh>,
  keyboardState: KeyboardState,
  touchState: TouchState,
  enableControls: boolean // Boolean to enable/disable player input processing
) => {
  const velocity = useRef(new THREE.Vector3(0, 0, 0));
  const isGrounded = useRef(false);
  const { camera } = useThree();

  // Raycaster for ground detection
  const raycaster = useRef(new THREE.Raycaster());
  const downVector = useRef(new THREE.Vector3(0, -1, 0));
  const tempVector = useRef(new THREE.Vector3());

  // Collision detection utility for terrain
  const onGroundCollision = (point: THREE.Vector3) => {
    // This is a placeholder. In a real game, you'd check against your Terrain mesh.
    // For now, simply assuming a flat ground at y=0 or slightly below.
    return point.y <= 0.01; 
  };

  const updatePhysics = (delta: number) => {
    if (!meshRef.current) return;

    const playerPosition = meshRef.current.position;

    // Apply gravity
    velocity.current.y += GRAVITY * delta;

    // Ground detection (simple raycast down)
    raycaster.current.set(playerPosition, downVector.current);
    const intersects = raycaster.current.intersectObjects(camera.parent ? (camera.parent as any).children : [], true); // Check against all objects in scene
    
    // Find the terrain or ground object if available
    const groundIntersect = intersects.find(obj => (obj.object as THREE.Mesh).userData.objectType === 'terrain' || (obj.object as THREE.Mesh).isMesh);

    isGrounded.current = false;
    if (groundIntersect && groundIntersect.distance < PLAYER_HEIGHT / 2 + 0.1) { // 0.1 is a small tolerance
      if (velocity.current.y < 0) {
        velocity.current.y = 0; // Stop falling
        playerPosition.y = groundIntersect.point.y + PLAYER_HEIGHT / 2;
        isGrounded.current = true;
      }
    }

    // Player input (only if enabled)
    if (enableControls) {
      const moveDirection = new THREE.Vector3();
      const speed = keyboardState.run || touchState.run ? PLAYER_SPEED * RUN_MULTIPLIER : PLAYER_SPEED;

      // Get camera's forward and right vectors
      const cameraForward = new THREE.Vector3();
      camera.getWorldDirection(cameraForward);
      cameraForward.y = 0; // Only care about horizontal direction
      cameraForward.normalize();

      const cameraRight = new THREE.Vector3().crossVectors(cameraForward, new THREE.Vector3(0, 1, 0));
      cameraRight.normalize();

      // Keyboard input
      if (keyboardState.forward) moveDirection.add(cameraForward);
      if (keyboardState.backward) moveDirection.sub(cameraForward);
      if (keyboardState.right) moveDirection.add(cameraRight);
      if (keyboardState.left) moveDirection.sub(cameraRight);

      // Touch joystick input
      if (touchState.x !== 0 || touchState.y !== 0) {
        const joystickForward = cameraForward.clone().multiplyScalar(touchState.y);
        const joystickRight = cameraRight.clone().multiplyScalar(touchState.x);
        moveDirection.add(joystickForward).add(joystickRight);
      }
      
      moveDirection.normalize().multiplyScalar(speed);

      // Apply movement to horizontal velocity
      velocity.current.x = lerp(velocity.current.x, moveDirection.x, DRAG_FACTOR);
      velocity.current.z = lerp(velocity.current.z, moveDirection.z, DRAG_FACTOR);

      // Jump
      if ((keyboardState.jump || touchState.jump) && isGrounded.current) {
        velocity.current.y = JUMP_VELOCITY;
        isGrounded.current = false; // Prevent multiple jumps
      }
    } else {
      // If controls are disabled, apply drag to horizontal velocity
      velocity.current.x = lerp(velocity.current.x, 0, DRAG_FACTOR * 5); // Faster stop
      velocity.current.z = lerp(velocity.current.z, 0, DRAG_FACTOR * 5);
    }

    // Update position based on velocity
    playerPosition.addScaledVector(velocity.current, delta);

    // Clamp player position to map boundaries (simplified)
    const MAP_BOUNDS = 240; // Roughly half of terrain size
    playerPosition.x = THREE.MathUtils.clamp(playerPosition.x, -MAP_BOUNDS, MAP_BOUNDS);
    playerPosition.z = THREE.MathUtils.clamp(playerPosition.z, -MAP_BOUNDS, MAP_BOUNDS);

    // Ensure player is above ground if no collision system is complex
    if (playerPosition.y < PLAYER_HEIGHT / 2) {
      playerPosition.y = PLAYER_HEIGHT / 2;
      velocity.current.y = Math.max(0, velocity.current.y); // Stop descending
      isGrounded.current = true;
    }
  };

  // Simple lerp function (can be moved to utils)
  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

  return {
    velocity: velocity.current,
    isGrounded: isGrounded.current,
    onGroundCollision,
    updatePhysics,
  };
};
