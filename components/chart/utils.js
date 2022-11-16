export function isNumber(value) {
  return typeof value === 'number';
}

export function nullableNumber(value) {
  const num = Number(value);
  if (!value || Number.isNaN(num)) return null;
  return num;
}

export function stringArray(value) {
  return value?.split(',').map(p => p.trim()).filter(Boolean);
}

export function sharpen(value) {
  return Math.round(value + 0.5) - 0.5;
}