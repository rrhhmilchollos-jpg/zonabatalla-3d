import React, { useState } from 'react';
import useGameStore from '../store/useGameStore';
import { Scoreboard } from './Scoreboard';
import { Play, Info, X, Zap } from 'lucide-react';

export const MainMenu: React.FC = () => {
  const startGame = useGameStore((state) => state.startGame);
  const [showCredits, setShowCredits] = useState(false);

  const handlePlayClick = () => {
    startGame();
  };

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/95 backdrop-blur-sm z-50 animate-fadeIn">
      <div className="bg-muted p-8 rounded-lg shadow-2xl max-w-lg w-full text-center border border-primary/20">
        <h1 className="text-5xl font-bold text-primary mb-6 tracking-tighter flex items-center justify-center gap-4">
          <Zap className="h-12 w-12 text-accent" aria-hidden="true" />
          ZonaBatalla 3D
        </h1>
        <p className="text-lg text-foreground mb-8">Sobrevive a la arena de combate.</p>

        <button
          onClick={handlePlayClick}
          className="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-lg bg-primary px-8 font-medium text-foreground shadow-md transition-all duration-300 ease-out hover:scale-105 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary"
        >
          <span className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-12deg)_translateX(-100%)] group-hover:duration-1000 group-hover:[transform:skew(-12deg)_translateX(100%)] bg-secondary opacity-20"></span>
          <Play className="mr-2 h-6 w-6 text-foreground group-hover:rotate-6 transition-transform duration-300" aria-hidden="true" />
          <span className="relative z-10">¡Jugar ahora!</span>
        </button>

        <div className="mt-8">
          <h2 className="text-2xl font-semibold text-secondary mb-4">Mejores Récords</h2>
          <Scoreboard />
        </div>

        <button
          onClick={() => setShowCredits(true)}
          className="mt-8 text-sm text-foreground/70 hover:text-foreground transition-colors duration-200 flex items-center justify-center gap-2 mx-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary"
        >
          <Info className="h-4 w-4" aria-hidden="true" />
          <span>Créditos</span>
        </button>
      </div>

      {showCredits && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/90 backdrop-blur-sm z-50 animate-fadeIn">
          <div className="bg-muted p-8 rounded-lg shadow-2xl max-w-md w-full text-center border border-primary/20 relative">
            <button
              onClick={() => setShowCredits(false)}
              className="absolute top-4 right-4 text-foreground/70 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary p-2 rounded-full transition-colors duration-200"
              aria-label="Cerrar créditos"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
            <h2 className="text-3xl font-bold text-primary mb-4">Créditos</h2>
            <p className="text-foreground mb-2">Desarrollo: Maris AI</p>
            <p className="text-foreground mb-2">Concepto: Inspirado en juegos Battle Royale</p>
            <p className="text-foreground mb-2">Tecnologías: React, Three.js, Zustand, TailwindCSS</p>
            <p className="text-foreground text-sm mt-4">Gracias por jugar a ZonaBatalla 3D.</p>
          </div>
        </div>
      )}
    </div>
  );
};
