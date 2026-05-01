import { useEffect, useState, useCallback } from 'react';
import { ScoreEntry } from '../types/models';

const LOCAL_STORAGE_KEY = 'zonaBatalla3DScores';
const MAX_SCORES = 10; // Top 10 records

export const useLocalScores = () => {
  const [scores, setScores] = useState<ScoreEntry[]>([]);

  const loadScores = useCallback((): ScoreEntry[] => {
    try {
      const storedScores = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedScores) {
        const parsedScores: ScoreEntry[] = JSON.parse(storedScores);
        // Ensure scores are sorted by score in descending order
        return parsedScores.sort((a, b) => b.score - a.score);
      }
    } catch (error) {
      console.error('Error al cargar los récords de localStorage:', error);
    }K
    return [];
  }, []);

  useEffect(() => {
    setScores(loadScores());
  }, [loadScores]);

  const getScores = useCallback(() => scores, [scores]);

  const saveScore = useCallback((newEntry: ScoreEntry) => {
    const currentScores = loadScores();
    const updatedScores = [...currentScores, newEntry];
    updatedScores.sort((a, b) => b.score - a.score);
    const topScores = updatedScores.slice(0, MAX_SCORES);

    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(topScores));
      setScores(topScores); // Update state to trigger re-render
    } catch (error) {
      console.error('Error al guardar el récord en localStorage:', error);
    }
  }, [loadScores, scores]);

  const clearScores = useCallback(() => {
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      setScores([]);
    } catch (error) {
      console.error('Error al limpiar los récords de localStorage:', error);
    }
  }, []);

  return { getScores, saveScore, clearScores };
};
