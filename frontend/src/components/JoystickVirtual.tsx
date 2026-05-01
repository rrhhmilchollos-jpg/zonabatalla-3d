import React, { useRef, useState, useEffect } from 'react';
import useGameStore from '../store/useGameStore';
import { Fwd, Hand } from 'lucide-react';

export const JoystickVirtual: React.FC = () => {
  const setJoystickState = useGameStore((state) => state.setJoystickState);
  const setShootButtonState = useGameStore((state) => state.setShootButtonState);

  const joystickRef = useRef<HTMLDivElement>(null);
  const stickRef = useRef<HTMLDivElement>(null);
  const startTouch = useRef<Touch | null>(null);
  const animationFrameId = useRef<number | null>(null);
  const [isPressingShoot, setIsPressingShoot] = useState(false);

  const JOYSTICK_RADIUS = 50;

  const handleTouchStart = (e: TouchEvent) => {
    e.preventDefault();
    startTouch.current = e.changedTouches[0];

    if (stickRef.current) {
      stickRef.current.style.transition = 'none';
    }

    const updatePosition = () => {
      if (!startTouch.current || !joystickRef.current || !stickRef.current) return;

      const currentTouch = Array.from(e.changedTouches).find(t => t.identifier === startTouch.current?.identifier);
      if (!currentTouch) return;

      const joystickRect = joystickRef.current.getBoundingClientRect();
      const centerX = joystickRect.left + joystickRect.width / 2;
      const centerY = joystickRect.top + joystickRect.height / 2;

      let deltaX = currentTouch.clientX - centerX;
      let deltaY = currentTouch.clientY - centerY;

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

      animationFrameId.current = requestAnimationFrame(updatePosition);
    };

    animationFrameId.current = requestAnimationFrame(updatePosition);
  };

  const handleTouchEnd = () => {
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
    }
    startTouch.current = null;
    if (stickRef.current) {
      stickRef.current.style.transition = 'transform 0.1s ease-out';
      stickRef.current.style.transform = 'translate(0px, 0px)';
    }
    setJoystickState({ x: 0, y: 0 });
  };

  // Shoot button logic
  const handleShootTouchStart = () => {
    setIsPressingShoot(true);
    setShootButtonState(true);
  };

  const handleShootTouchEnd = () => {
    setIsPressingShoot(false);
    setShootButtonState(false);
  };

  useEffect(() => {
    const joystickElement = joystickRef.current;
    if (joystickElement) {
      joystickElement.addEventListener('touchstart', handleTouchStart as EventListener, { passive: false });
      joystickElement.addEventListener('touchmove', handleTouchStart as EventListener, { passive: false }); // Continuously update on move
      joystickElement.addEventListener('touchend', handleTouchEnd as EventListener);
      joystickElement.addEventListener('touchcancel', handleTouchEnd as EventListener);
    }

    return () => {
      if (joystickElement) {
        joystickElement.removeEventListener('touchstart', handleTouchStart as EventListener);
        joystickElement.removeEventListener('touchmove', handleTouchStart as EventListener);
        joystickElement.removeEventListener('touchend', handleTouchEnd as EventListener);
        joystickElement.removeEventListener('touchcancel', handleTouchEnd as EventListener);
      }
    };
  }, []);

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
