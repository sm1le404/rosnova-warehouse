export const valueRound = (v: number, decimal = 2): number =>
  v ? parseFloat(v.toFixed(decimal)) : 0;
