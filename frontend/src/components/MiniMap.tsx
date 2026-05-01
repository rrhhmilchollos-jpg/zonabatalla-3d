import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import *as THREE from 'three';
import useGameStore from '../store/useGameStore';

const MAP_SIZE = 128; // Pixels
const GAME_WORLD_SIZE = 500; // Corresponds to Terrain size

export const MiniMap: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const playerPosition = useGameStore((state) => state.player.position);
  const enemies = useGameStore((state) => state.enemies);
  const safeZoneRadius = useGameStore((state) => state.safeZoneRadius);
  const { gl, scene } = useThree();

  // Mini-map camera (Orthographic)
  const miniMapCamera = useRef(new THREE.OrthographicCamera(
    -GAME_WORLD_SIZE / 2, GAME_WORLD_SIZE / 2, // Left, Right
    GAME_WORLD_SIZE / 2, -GAME_WORLD_SIZE / 2, // Top, Bottom
    0.1, 1000 // Near, Far
  ));

  useEffect(() => {
    miniMapCamera.current.position.set(0, 200, 0); // Position high above the center
    miniMapCamera.current.lookAt(0, 0, 0); // Look down at the center
    miniMapCamera.current.rotation.z = Math.PI; // Invert to match typical map orientation
  }, []);

  useFrame(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, MAP_SIZE, MAP_SIZE);
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(0, 0, MAP_SIZE, MAP_SIZE);

    // Helper to convert world coordinates to minimap coordinates
    const worldToMap = (pos: THREE.Vector3) => ({
      x: ((pos.x / GAME_WORLD_SIZE) + 0.5) * MAP_SIZE,
      y: ((pos.z / GAME_WORLD_SIZE) + 0.5) * MAP_SIZE,
    });

    // Draw safe zone
    ctx.strokeStyle = '#4ade80'; // Primary color
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(MAP_SIZE / 2, MAP_SIZE / 2, (safeZoneRadius / GAME_WORLD_SIZE) * MAP_SIZE, 0, Math.PI * 2);
    ctx.stroke();

    // Draw player
    const playerMapPos = worldToMap(playerPosition);
    ctx.fillStyle = '#7c3aed'; // Player color
    ctx.beginPath();
    ctx.arc(playerMapPos.x, playerMapPos.y, 4, 0, Math.PI * 2);
    ctx.fill();

    // Draw enemies
    enemies.forEach((enemy) => {
      if (enemy.isAlive) {
        const enemyMapPos = worldToMap(enemy.position);
        ctx.fillStyle = '#ff0000'; // Enemy color
        ctx.beginPath();
        ctx.arc(enemyMapPos.x, enemyMapPos.y, 3, 0, Math.PI * 2);
        ctx.fill();
      }
    });
  });

  return (
    <canvas
      ref={canvasRef}
      width={MAP_SIZE}
      height={MAP_SIZE}
      className="rounded-lg border border-primary/20"
    />
  );
};
