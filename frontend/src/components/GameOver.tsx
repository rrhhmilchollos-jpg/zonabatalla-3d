import React, { useEffect, useState } from 'react';
import useGameStore from '../store/useGameStore';
import { useLocalScores } from '../hooks/useLocalScores';
import { formatTime } from '../utils/formatTime';
import { Scoreboard } from './Scoreboard';
import { Trophy, RefreshCcw } from 'lucide-react';

export const GameOver: React.FC = () => {
  const gameScore = useGameStore((state) => state.score);
  const eliminations = useGameStore((state) => state.playerEliminations);
  const survivedSeconds = useGameStore((state) => state.survivedSeconds);
  const resetGame = useGameStore((state) => state.resetGame);
  const { getScores, saveScore } = useLocalScores();
  const [playerName, setPlayerName] = useState('');
  const [scoreSaved, setScoreSaved] = useState(false);

  useEffect(() => {
    // Suggest a random Spanish name if not already set
    if (!playerName) {
      const names = ['Guerrero Anónimo', 'Leyenda', 'Pionero', 'Cazador', 'Gladiador'];
      setPlayerName(names[Math.floor(Math.random() * names.length)]);
    }
  }, [playerName]);

  const handleSaveScore = () => {
    if (playerName.trim() === '') {
      alert('Por favor, introduce un nombre para guardar tu récord.');
      return;
    }

    const newScore = {
      id: Date.now().toString(),
      playerName: playerName.trim(),
      score: gameScore,
      eliminations: eliminations,
      survivedSeconds: survivedSeconds,
      date: new Date().toISOString(),
    };
    saveScore(newScore);
    setScoreSaved(true);
    alert('¡Récord guardado con éxito!');
  };

  const handleRetry = () => {
    resetGame();
  };

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/95 backdrop-blur-sm z-50 animate-fadeIn">
      <div className="bg-muted p-8 rounded-lg shadow-2xl max-w-lg w-full text-center border border-primary/20">
        <h2 className="text-5xl font-bold text-accent mb-4 flex items-center justify-center gap-4">
          <Trophy className="h-10 w-10 text-yellow-400" aria-hidden="true" />
          ¡Fin de la Partida!
        </h2>
        <p className="text-lg text-foreground mb-6">Tus resultados finales:</p>

        <div className="grid grid-cols-2 gap-4 text-left mb-8">
          <p className="text-foreground text-xl font-semibold">Puntuación Final:</p>
          <p className="text-primary text-xl font-bold">{gameScore}</p>
          <p className="text-foreground">Enemigos Eliminados:</p>
          <p className="text-secondary">{eliminations}</p>
          <p className="text-foreground">Tiempo Sobrevivido:</p>
          <p className="text-accent">{formatTime(survivedSeconds)}</p>
        </div>

        {!scoreSaved && (
          <div className="mb-8 p-4 bg-background rounded-lg border border-primary/20">
            <label htmlFor="playerName" className="block text-foreground mb-2">Guarda tu récord:</label>
            <input
              type="text"
              id="playerName"
              className="w-full p-3 bg-muted border border-secondary/30 rounded-lg text-foreground placeholder:text-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary mb-4"
              placeholder="Introduce tu nombre..."
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}/
              maxLength={20}
            />
            <button
              onClick={handleSaveScore}
              className="group relative inline-flex h-10 w-full items-center justify-center overflow-hidden rounded-lg bg-primary px-6 font-medium text-foreground shadow-md transition-all duration-300 ease-out hover:scale-[1.02] hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary"
            >
              <span className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-12deg)_translateX(-100%)] group-hover:duration-1000 group-hover:[transform:skew(-12deg)_translateX(100%)] bg-secondary opacity-20"></span>
              <span className="relative z-10">Guardar Récord</span>
            </button>
          </div>
        )}

        <button
          onClick={handleRetry}
          className="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-lg bg-secondary px-8 font-medium text-foreground shadow-md transition-all duration-300 ease-out hover:scale-105 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-secondary"
        >
          <span className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-12deg)_translateX(-100%)] group-hover:duration-1000 group-hover:[transform:skew(-12deg)_translateX(100%)] bg-primary opacity-20"></span>
          <RefreshCcw className="mr-2 h-6 w-6 text-foreground group-hover:rotate-6 transition-transform duration-300" aria-hidden="true" />
          <span className="relative z-10">Reintentar</span>
        </button>

        <div className="mt-8">
          <h3 className="text-2xl font-semibold text-secondary mb-4">Mejores Récords</h3>
          <Scoreboard />
        </div>
      </div>
    </div>
  );
};
