import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Hand } from 'lucide-react';

interface JoystickVirtualProps {
  setJoystickState: (state: { x: number; y: number }) => void;
  setShootButtonState: (isPressing: boolean) => void;
}

export const JoystickVirtual: React.FC<JoystickVirtualProps> = ({
  setJoystickState,
  setShootButtonState
}) => {
  const joystickRef = useRef<HTMLDivElement>(null);
  const stickRef = useRef<HTMLDivElement>(null);
  const activeJoystickTouchId = useRef<number | null>(null); // Track the identifier of the touch controlling the joystick
  const joystickCenter = useRef({ x: 0, y: 0 }); // Center of the joystick base
  const currentTouchCoords = useRef({ x: 0, y: 0 }); // Latest coordinates of the active touch

  const animationFrameId = useRef<number | null>(null);
  const [isPressingShoot, setIsPressingShoot] = useState(false);

  const JOYSTICK_RADIUS = 50;

  // Function to update the stick position and send state
  const updateStickPosition = useCallback(() => {
    if (!stickRef.current || activeJoystickTouchId.current === null) return;

    const { x: touchX, y: touchY } = currentTouchCoords.current;
    const { x: centerX, y: centerY } = joystickCenter.current;

    let deltaX = touchX - centerX;
    let deltaY = touchY - centerY;

    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    if (distance > JOYSTICK_RADIUS) {
      deltaX = (deltaX / distance) * JOYSTICK_RADIUS;
      deltaY = (deltaY / distance) * JOYSTICK_RADIUS;
    }

    stickRef.current.style.transform = `translate(${deltaX}px, ${deltaY}px)`;

    // Normalize values to -1 to 1
    const normalizedX = deltaX / JOYSTICK_RADIUS;
    const normalizedY = -deltaY / JOYSTICK_RADIUS; // Y-axis inverted for game controls
    setJoystickState({ x: normalizedX, y: normalizedY });

    animationFrameId.current = requestAnimationFrame(updateStickPosition);
  }, [setJoystickState]);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    e.preventDefault(); // Prevent scrolling

    if (!joystickRef.current || activeJoystickTouchId.current !== null) {
      // Joystick already being controlled by another touch, or ref not ready
      return;
    }

    const touch = e.changedTouches[0];
    activeJoystickTouchId.current = touch.identifier;

    const joystickRect = joystickRef.current.getBoundingClientRect();
    joystickCenter.current = {
      x: joystickRect.left + joystickRect.width / 2,
      y: joystickRect.top + joystickRect.height / 2,
    };

    currentTouchCoords.current = { x: touch.clientX, y: touch.clientY };

    if (stickRef.current) {
      stickRef.current.style.transition = 'none';
    }

    animationFrameId.current = requestAnimationFrame(updateStickPosition);
  }, [updateStickPosition]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    e.preventDefault(); // Prevent scrolling
    if (activeJoystickTouchId.current === null) return;

    const activeTouch = Array.from(e.changedTouches).find(
      (t) => t.identifier === activeJoystickTouchId.current
    );

    if (activeTouch) {
      currentTouchCoords.current = { x: activeTouch.clientX, y: activeTouch.clientY };
    }
  }, []);

  const handleTouchEnd = useCallback((e: TouchEvent) => {
    if (activeJoystickTouchId.current === null) return;

    const endedTouch = Array.from(e.changedTouches).find(
      (t) => t.identifier === activeJoystickTouchId.current
    );

    if (endedTouch) {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      activeJoystickTouchId.current = null;
      currentTouchCoords.current = { x: 0, y: 0 };
      
      if (stickRef.current) {
        stickRef.current.style.transition = 'transform 0.1s ease-out';
        stickRef.current.style.transform = 'translate(0px, 0px)';
      }
      setJoystickState({ x: 0, y: 0 });
    }
  }, [setJoystickState]);

  // Shoot button logic (remains similar, uses passed props)
  const handleShootTouchStart = useCallback(() => {
    setIsPressingShoot(true);
    setShootButtonState(true);
  }, [setShootButtonState]);

  const handleShootTouchEnd = useCallback(() => {
    setIsPressingShoot(false);
    setShootButtonState(false);
  }, [setShootButtonState]);

  useEffect(() => {
    const joystickElement = joystickRef.current;
    if (joystickElement) {
      joystickElement.addEventListener('touchstart', handleTouchStart as EventListener, { passive: false });
      // Use document for touchmove/touchend so movement outside joystick area is still captured
      document.addEventListener('touchmove', handleTouchMove as EventListener, { passive: false });
      document.addEventListener('touchend', handleTouchEnd as EventListener);
      document.addEventListener('touchcancel', handleTouchEnd as EventListener);
    }

    return () => {
      if (joystickElement) {
        joystickElement.removeEventListener('touchstart', handleTouchStart as EventListener);
      }
      document.removeEventListener('touchmove', handleTouchMove as EventListener);
      document.removeEventListener('touchend', handleTouchEnd as EventListener);
      document.removeEventListener('touchcancel', handleTouchEnd as EventListener);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd]);
  
  return (
    <div className="absolute bottom-4 left-4 right-4 flex justify-between pointer-events-none z-50">
      {/* Joystick area */}
      <div
        ref={joystickRef}
        className="relative w-[100px] h-[100px] bg-muted/70 rounded-full flex items-center justify-center border border-primary/20 pointer-events-auto touch-none"
      >
        <div
          ref={stickRef}
          className="absolute w-[60px] h-[60px] bg-primary/80 rounded-full shadow-lg"
        ></div>
      </div>

      {/* Shoot button */}
      <button
        onTouchStart={handleShootTouchStart}
        onTouchEnd={handleShootTouchEnd}
        onTouchCancel={handleShootTouchEnd}
        className={`w-20 h-20 bg-accent/70 ${isPressingShoot ? 'scale-90 bg-accent' : ''} rounded-full flex items-center justify-center border border-accent/20 shadow-lg transition-all duration-100 pointer-events-auto`}
        aria-label="Disparar"
      >
        <Hand className="w-10 h-10 text-foreground" aria-hidden="true" />
      </button>
    </div>
  );
};
