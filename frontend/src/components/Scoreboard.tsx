import React from 'react';
import { useLocalScores } from '../hooks/useLocalScores';
import { formatTime } from '../utils/formatTime';
import { Trophy, Clock, Skull } from 'lucide-react';

export const Scoreboard: React.FC = () => {
  const { getScores } = useLocalScores();
  const scores = getScores();

  if (scores.length === 0) {
    return (
      <div className="text-center text-foreground/70 p-4 rounded-lg bg-background/50 border border-muted animate-fadeIn">
        <Trophy className="h-8 w-8 mx-auto mb-2 text-primary" aria-hidden="true" />
        <p>Aún no hay récords. ¡Sé el primero!</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-primary/20 bg-background/50 animate-fadeIn">
      <table className="min-w-full text-left text-sm text-foreground">
        <thead className="bg-muted/70 text-primary uppercase text-xs tracking-wider">
          <tr>
            <th scope="col" className="px-4 py-2">#</th>
            <th scope="col" className="px-4 py-2">Jugador</th>
            <th scope="col" className="px-4 py-2 text-center flex items-center justify-center gap-1"><Trophy className="h-4 w-4" aria-hidden="true" /> Puntuación</th>
            <th scope="col" className="px-4 py-2 text-center flex items-center justify-center gap-1"><Skull className="h-4 w-4" aria-hidden="true" /> Kills</th>
            <th scope="col" className="px-4 py-2 text-center flex items-center justify-center gap-1"><Clock className="h-4 w-4" aria-hidden="true" /> Tiempo</th>
          </tr>
        </thead>
        <tbody>
          {scores.map((scoreEntry, index) => (
            <tr key={scoreEntry.id} className="border-b border-muted/50 hover:bg-muted/30 transition-colors duration-150 ease-in-out">
              <td className="px-4 py-2 font-medium">{index + 1}</td>
              <td className="px-4 py-2 font-medium text-secondary">{scoreEntry.playerName}</td>
              <td className="px-4 py-2 text-center text-primary font-bold">{scoreEntry.score}</td>
              <td className="px-4 py-2 text-center">{scoreEntry.eliminations}</td>
              <td className="px-4 py-2 text-center">{formatTime(scoreEntry.survivedSeconds)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
