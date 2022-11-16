import seedrandom from './seedrandom.js';

export function randomWalk({
  startAt = null,
  variation = null,
  min = null,
  max = null,
  length = 100,
  seed = null,
} = {}) {
  const rng = seedrandom(seed);
  const rand = (size = 1, min = 0) => () => size * rng() + min;

  if (min == null) min = max == null ? 0 : max === 0 ? -100 : max > 0 ? -max : max * 2;
  if (max == null) max = min === 0 ? 100 : min < 0 ? -min : min * 2;
  if (variation == null) variation = 5 * (max - min) / length;
  
  let last = startAt;
  if (last == null) last = rand(max == null ? 100 : max - min, min)();
  
  const step = rand(2 * variation, -variation);

  const series = new Array(length);
  let i = length;
  while(i--) series[i] = last = Math.min(max, Math.max(last + step(), min));

  return series;
}

const DATE_STEPS = {
  day: dt => dt.setDate(dt.getDate() - 1),
  week: dt => dt.setDate(dt.getDate() - 7),
  month: dt => dt.setMonth(dt.getMonth() - 1),
  year: dt => dt.setFullYear(dt.getFullYear() - 1),
};

export function randomDataset(shape, {
  length = 100,
  interval = 'day', 
  lastDate = null,
  seed = null,
} = {}) {
  const series = Object.entries(shape)
    .map(([key, options]) => [key, randomWalk({ ...options, length, seed: seed && `${seed}:${key}` })]);
  
  const dt = lastDate ? new Date(lastDate) : new Date();
  const dateStep = DATE_STEPS[interval] ?? (d => d.setTime(d.getTime() - interval));
  
  const dataset = new Array(length);
  let i = length;
  while(i--) {
    dataset[i] = {
      timestamp: dt.getTime(),
      ...Object.fromEntries(series.map(([key, data]) => [key, data[i]]))
    };
    dateStep(dt);
  }

  return dataset;
}
