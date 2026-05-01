import React from 'react';
import { Scene } from './Scene';
import { Player } from './Player';
import { Enemy } from './Enemy';
import { Loot } from './Loot';
import { SafeZone } from './SafeZone';
import { Bullet } from './Bullet';
import { Terrain } from './Terrain';
import useGameStore from '../store/useGameStore';
import { useGameLoop } from '../hooks/useGameLoop';
import { useKeyboardControls } from '../hooks/useKeyboardControls';
import { useTouchControls } from '../hooks/useTouchControls';
import { Crosshair } from './Crosshair';

export const GameCanvas: React.FC = () => {
  const gamePhase = useGameStore((state) => state.phase);
  const enemies = useGameStore((state) => state.enemies);
  const bullets = useGameStore((state) => state.bullets);
  const lootItems = useGameStore((state) => state.lootItems);

  // Game loop is only active when playing
  useGameLoop(gamePhase === 'playing');
  
  // Keyboard controls are always active for input buffering, but player movement only responds in 'playing'
  const keyboardState = useKeyboardControls();
  const touchState = useTouchControls();

  return (
    <>
      <Scene />
      <Terrain />

      {/* Render game elements only when playing or paused */}
      {(gamePhase === 'playing' || gamePhase === 'paused') && (
        <>
          <Player keyboardState={keyboardState} touchState={touchState} />
          {enemies.map((enemy) => enemy.isAlive && <Enemy key={enemy.id} enemy={enemy} />)}
          {lootItems.map((item) => !item.collected && <Loot key={item.id} item={item} />)}
          {bullets.map((bullet) => <Bullet key={bullet.id} bullet={bullet} />)}
          <SafeZone />
          <Crosshair />
        </>
      )}
    </>
  );
};
