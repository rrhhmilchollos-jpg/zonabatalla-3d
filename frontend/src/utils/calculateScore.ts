export const calculateScore = (
  eliminations: number,
  survivedSeconds: number,
  lootCollected: number
): number => {
  const eliminationPoints = eliminations * 100;
  const survivalPoints = Math.floor(survivedSeconds * 2);
  const lootPoints = lootCollected * 10;

  return eliminationPoints + survivalPoints + lootPoints;
};
