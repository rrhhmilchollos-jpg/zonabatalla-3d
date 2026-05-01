import { useFrame } from '@react-three/fiber';
import useGameStore from '../store/useGameStore';
import { useEnemyAI } from './useEnemyAI';
import { useSafeZone } from './useSafeZone';
import { calculateScore } from '../utils/calculateScore';

export const useGameLoop = (isActive: boolean) => {
  const gamePhase = useGameStore((state) => state.phase);
  const enemies = useGameStore((state) => state.enemies);
  const player = useGameStore((state) => state.player);
  const survivedSeconds = useGameStore((state) => state.survivedSeconds);
  const playerEliminations = useGameStore((state) => state.playerEliminations);
  const lootCollectedCount = useGameStore((state) => state.lootCollectedCount);
  const setSurvivedSeconds = useGameStore((state) => state.setSurvivedSeconds);
  const setScore = useGameStore((state) => state.setScore);
  const endGame = useGameStore((state) => state.endGame);

  const { updateSafeZone } = useSafeZone();

  // Game timer
  useFrame((state, delta) => {
    if (!isActive || gamePhase !== 'playing') return;

    // Update survived time
    setSurvivedSeconds(state.clock.elapsedTime);

    // Update score continuously
    setScore(calculateScore(playerEliminations, survivedSeconds, lootCollectedCount));

    // Update safe zone
    updateSafeZone(delta, player.position);

    // Check game over conditions
    if (!player.isAlive) {
      endGame();
    }

    // Check for win condition (all enemies eliminated - optional)
    const aliveEnemies = enemies.filter(e => e.isAlive).length;
    if (aliveEnemies === 0 && enemies.length > 0) {
        // If all initial enemies are defeated, you might want to trigger a win condition
        // For a battle royale, usually it's 'last man standing'. If player is only survivor, that's win.
        // If there were other players (NPCs), this implies player has won against all NPCs.
        // For simplicity, let's assume the game ends if player is the last one alive.
        if (player.isAlive) {
            // endGame('win'); // Could add a 'win' state
        }
    }
  });
};
