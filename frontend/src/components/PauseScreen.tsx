import React from 'react';
import useGameStore from '../store/useGameStore';
import { Scoreboard } from './Scoreboard';
import { Play, RotateCw } from 'lucide-react';

export const PauseScreen: React.FC = () => {
  const resumeGame = useGameStore((state) => state.resumeGame);
  const resetGame = useGameStore((state) => state.resetGame);

  const handleResume = () => {
    resumeGame();
  };

  const handleRestart = () => {
    if (window.confirm('¿Estás seguro de que quieres reiniciar la partida? Perderás el progreso actual.')) {
      resetGame();
    }
  };

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/95 backdrop-blur-sm z-50 animate-fadeIn">
      <div className="bg-muted p-8 rounded-lg shadow-2xl max-w-lg w-full text-center border border-primary/20">
        <h2 className="text-4xl font-bold text-primary mb-6">Juego Pausado</h2>
        <p className="text-lg text-foreground mb-8">Tómate un respiro, la batalla espera.</p>

        <div className="flex flex-col gap-4 mb-8">
          <button
            onClick={handleResume}
            className="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-lg bg-secondary px-8 font-medium text-foreground shadow-md transition-all duration-300 ease-out hover:scale-105 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-secondary"
          >
            <span className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-12deg)_translateX(-100%)] group-hover:duration-1000 group-hover:[transform:skew(-12deg)_translateX(100%)] bg-primary opacity-20"></span>
            <Play className="mr-2 h-6 w-6 text-foreground group-hover:rotate-6 transition-transform duration-300" aria-hidden="true" />
            <span className="relative z-10">Continuar Juego</span>
          </button>

          <button
            onClick={handleRestart}
            className="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-lg bg-accent px-8 font-medium text-foreground shadow-md transition-all duration-300 ease-out hover:scale-105 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accent"
          >
            <span className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-12deg)_translateX(-100%)] group-hover:duration-1000 group-hover:[transform:skew(-12deg)_translateX(100%)] bg-primary opacity-20"></span>
            <RotateCw className="mr-2 h-6 w-6 text-foreground group-hover:rotate-6 transition-transform duration-300" aria-hidden="true" />
            <span className="relative z-10">Reiniciar Partida</span>
          </button>
        </div>

        <div className="mt-8">
          <h3 className="text-2xl font-semibold text-secondary mb-4">Mejores Récords</h3>
          <Scoreboard />
        </div>
      </div>
    </div>
  );
};
