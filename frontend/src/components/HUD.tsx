import React from 'react';
import useGameStore from '../store/useGameStore';
import { Heart, Bullet, Shield, Users, Timer, XCircle } from 'lucide-react'; // Changed 'Gun' to 'Bullet'
import { formatTime } from '../utils/formatTime';
import { MiniMap } from './MiniMap';

export const HUD: React.FC = () => {
  const { player, enemiesAlive, totalEnemies, score, survivedSeconds, gamePhase, togglePause } = useGameStore((state) => ({
    player: state.player,
    enemiesAlive: state.enemies.filter(e => e.isAlive).length,
    totalEnemies: state.enemies.length,
    score: state.score,
    survivedSeconds: state.survivedSeconds,
    gamePhase: state.phase,
    togglePause: state.togglePause,
  }));

  if (gamePhase !== 'playing' && gamePhase !== 'paused') return null;

  return (
    <div className="absolute inset-0 pointer-events-none p-4 text-foreground text-sm font-semibold z-40">
      {/* Top Left: Health, Ammo, Armor */}
      <div className="absolute top-4 left-4 bg-muted/70 backdrop-blur-sm rounded-lg p-3 flex flex-col gap-2 border border-primary/20 animate-fadeIn">
        <div className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-red-500" aria-hidden="true" />
          <span>Salud: {player.health}/{player.maxHealth}</span>
          <div className="w-24 h-2 bg-foreground/30 rounded-full overflow-hidden">
            <div className="h-full bg-red-500 rounded-full transition-all duration-200 ease-out" style={{ width: `${(player.health / player.maxHealth) * 100}%` }}></div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-secondary" aria-hidden="true" />
          <span>Armadura: {player.armor}%</span>
          <div className="w-24 h-2 bg-foreground/30 rounded-full overflow-hidden">
            <div className="h-full bg-secondary rounded-full transition-all duration-200 ease-out" style={{ width: `${player.armor}%` }}></div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Bullet className="h-5 w-5 text-accent" aria-hidden="true" /> {/* Changed 'Gun' to 'Bullet' */}
          <span>Munición: {player.ammo}/{player.maxAmmo}</span>
          <div className="w-24 h-2 bg-foreground/30 rounded-full overflow-hidden">
            <div className="h-full bg-accent rounded-full transition-all duration-200 ease-out" style={{ width: `${(player.ammo / player.maxAmmo) * 100}%` }}></div>
          </div>
        </div>
      </div>

      {/* Top Right: Enemies, Score, Time */}
      <div className="absolute top-4 right-4 bg-muted/70 backdrop-blur-sm rounded-lg p-3 flex flex-col gap-2 border border-primary/20 animate-fadeIn">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-orange-400" aria-hidden="true" />
          <span>Enemigos Vivos: {enemiesAlive}/{totalEnemies}</span>
        </div>
        <div className="flex items-center gap-2">
          <Timer className="h-5 w-5 text-cyan-400" aria-hidden="true" />
          <span>Tiempo: {formatTime(survivedSeconds)}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-primary">Puntuación: {score}</span>
        </div>
      </div>

      {/* MiniMap (Bottom Left) */}
      <div className="absolute bottom-4 left-4 bg-muted/70 backdrop-blur-sm rounded-lg p-2 border border-primary/20 animate-fadeIn">
        <MiniMap />
      </div>

      {/* Pause Button (Top Center) */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2">
        <button
          onClick={togglePause}
          className="pointer-events-auto bg-primary/70 hover:bg-primary text-foreground px-4 py-2 rounded-lg shadow-md flex items-center gap-2 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary"
          aria-label="Pausar juego"
        >
          <XCircle className="h-5 w-5" aria-hidden="true" />
          <span>{gamePhase === 'playing' ? 'Pausar' : 'Reanudar'}</span>
        </button>
      </div>

      {/* Game Over message */}
      {!player.isAlive && gamePhase === 'playing' && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm animate-fadeIn">
          <h2 className="text-5xl font-bold text-red-500 drop-shadow-lg">¡Has sido eliminado!</h2>
        </div>
      )}
    </div>
  );
};
