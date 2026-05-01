import { useEffect, useState, useRef } from 'react';

export interface KeyboardState {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
  jump: boolean;
  shoot: boolean;
  run: boolean;
}

const initialKeyboardState: KeyboardState = {
  forward: false,
  backward: false,
  left: false,
  right: false,
  jump: false,
  shoot: false,
  run: false,
};

export const useKeyboardControls = () => {
  const keyboardState = useRef(initialKeyboardState);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.code) {
        case 'KeyW':
        case 'ArrowUp':
          keyboardState.current.forward = true;
          break;
        case 'KeyS':
        case 'ArrowDown':
          keyboardState.current.backward = true;
          break;
        case 'KeyA':
        case 'ArrowLeft':
          keyboardState.current.left = true;
          break;
        case 'KeyD':
        case 'ArrowRight':
          keyboardState.current.right = true;
          break;
        case 'Space':
          keyboardState.current.jump = true;
          break;
        case 'ShiftLeft':
        case 'ShiftRight':
          keyboardState.current.run = true;
          break;
        case 'Mouse0': // Left mouse button
        case 'KeyR': // R for reload/shoot (simplified for now)
          keyboardState.current.shoot = true;
          break;
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      switch (event.code) {
        case 'KeyW':
        case 'ArrowUp':
          keyboardState.current.forward = false;
          break;
        case 'KeyS':
        case 'ArrowDown':
          keyboardState.current.backward = false;
          break;
        case 'KeyA':
        case 'ArrowLeft':
          keyboardState.current.left = false;
          break;
        case 'KeyD':
        case 'ArrowRight':
          keyboardState.current.right = false;
          break;
        case 'Space':
          keyboardState.current.jump = false;
          break;
        case 'ShiftLeft':
        case 'ShiftRight':
          keyboardState.current.run = false;
          break;
        case 'Mouse0':
        case 'KeyR':
          keyboardState.current.shoot = false;
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return keyboardState.current;
};
