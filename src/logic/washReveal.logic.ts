export const calculateRevealPercentage = (coverageMap: boolean[][]): number => {
  if (coverageMap.length === 0) return 0;
  
  let totalCells = 0;
  let clearedCells = 0;
  
  for (let y = 0; y < coverageMap.length; y++) {
    for (let x = 0; x < coverageMap[y].length; x++) {
      totalCells++;
      if (coverageMap[y][x]) {
        clearedCells++;
      }
    }
  }
  
  return totalCells === 0 ? 0 : (clearedCells / totalCells) * 100;
};
