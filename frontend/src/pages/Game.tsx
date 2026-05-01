import React, { useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { MainMenu } from '../components/MainMenu';
import { GameCanvas } from '../components/GameCanvas';
import { HUD } from '../components/HUD';
import { PauseScreen } from '../components/PauseScreen';
import { GameOver } from '../components/GameOver';
import useGameStore from '../store/useGameStore';
import { detectMobile } from '../utils/detectMobile';
import { JoystickVirtual } from '../components/JoystickVirtual';
import { useTouchControls } from '../hooks/useTouchControls';

const Game: React.FC = () => {
  const gamePhase = useGameStore((state) => state.phase);
  const isMobile = useRef(detectMobile());

  const {
    x: touchX,
    y: touchY,
    jump: touchJump,
    shoot: touchShoot,
    run: touchRun,
    setJoystickState,
    setShootButtonState,
  } = useTouchControls();
  const currentTouchState = { x: touchX, y: touchY, jump: touchJump, shoot: touchShoot, run: touchRun };

  useEffect(() => {
    // Lock pointer for desktop gameplay when in 'playing' phase
    const handlePointerLock = () => {
      if (gamePhase === 'playing' && !isMobile.current) {
        document.body.requestPointerLock = document.body.requestPointerLock ||
                                            (document.body as any).mozRequestPointerLock ||
                                            (document.body as any).webkitRequestPointerLock;
        document.body.requestPointerLock();
      } else {
        document.exitPointerLock = document.exitPointerLock ||
                                   (document.body as any).mozExitPointerLock ||
                                   (document.body as any).webkitExitPointerLock;
        document.exitPointerLock();
      }
    };

    // Add event listener for clicks to request pointer lock on desktop
    // For mobile, touch events will handle the initial interaction.
    if (!isMobile.current && gamePhase === 'playing') {
      document.addEventListener('click', handlePointerLock);
    }

    return () => {
      if (!isMobile.current) {
        document.removeEventListener('click', handlePointerLock);
        document.exitPointerLock(); // Ensure pointer is unlocked on unmount or phase change
      }
    };
  }, [gamePhase]);

  return (
    <div className="relative w-screen h-screen overflow-hidden cursor-none">
      {/* React Three Fiber Canvas */}
      <Canvas 
        dpr={[1, 2]} 
        linear 
        flat 
        camera={{ fov: 75, near: 0.1, far: 2000, position: [0, 10, 0] }}
        className="bg-background"
      >
        {/* Pass touchState to GameCanvas */}
        <GameCanvas touchState={currentTouchState} /> 
      </Canvas>

      {/* 2D UI Layers */}
      <HUD />

      {gamePhase === 'menu' && <MainMenu />}
      {gamePhase === 'paused' && <PauseScreen />}
      {gamePhase === 'gameover' && <GameOver />}

      {isMobile.current && gamePhase === 'playing' && (
        // Pass setters to JoystickVirtual
        <JoystickVirtual 
          setJoystickState={setJoystickState} 
          setShootButtonState={setShootButtonState} 
        />
      )}

      {/* Global overlay for pointer lock feedback (optional, for desktop) */}
      {!isMobile.current && gamePhase === 'playing' && (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <p className="text-foreground text-sm opacity-50 px-4 py-2 bg-background/50 rounded-lg">
            Haz clic para entrar en el juego
          </p>
        </div>
      )}
    </div>
  );
};

export default Game;
