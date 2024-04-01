export const valueRound = (v: number, decimal = 2): number =>
  parseFloat(v.toFixed(decimal));
