import { useState } from 'react';

export interface TouchState {
  x: number; // -1 to 1 horizontal movement
  y: number; // -1 to 1 vertical movement
  jump: boolean;
  shoot: boolean; // Currently holding shoot button
  run: boolean; // Not typically used with joystick, but placeholder
}

const initialTouchState: TouchState = {
  x: 0,
  y: 0,
  jump: false,
  shoot: false,
  run: false,
};

export const useTouchControls = () => {
  const [touchState, setTouchState] = useState<TouchState>(initialTouchState);

  // Functions to be called by the JoystickVirtual component
  const setJoystickState = (newState: { x: number; y: number }) => {
    setTouchState((prev) => ({ ...prev, x: newState.x, y: newState.y }));
  };

  const setShootButtonState = (isPressing: boolean) => {
    setTouchState((prev) => ({ ...prev, shoot: isPressing }));
  };

  // You could add similar functions for a dedicated jump button, etc.

  return { ...touchState, setJoystickState, setShootButtonState };
};
