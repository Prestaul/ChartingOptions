export function isNumber(value) {
  return typeof value === 'number' && !Number.isNaN(value);
}

export function nullableNumber(value) {
  return isNumber(value) ? value : null;
}

export const round = Math.round;
export function sharpen(value) {
  return Math.round(value + 0.5) - 0.5;
}