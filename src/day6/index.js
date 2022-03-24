import { uniq, pipe, times, forEach, repeat, reduce, sum, drop } from 'ramda';

import data from './data.js';

const getAmountRecursive = (days, initAge) => {
  const restDays = initAge < days ? days - initAge : 0;

  if (restDays === 0) return 1;

  return 1 + sum(times((i) => getAmountRecursive(restDays - 1 - i * 7, 8), Math.ceil(restDays / 7)));
};

const task1 = (days, arr) => {
  let result = 0;

  const uniqKeys = pipe(
    uniq,
    reduce((acc, key) => {
      acc[key] = getAmountRecursive(days, key);

      return acc;
    }, [])
  )(arr);

  forEach((key) => {
    result += uniqKeys[key];
  }, arr);

  return result;
};

const task2 = (days, arr) => {
  const template = arr.reduce((acc, v) => {
    acc[v] += 1;

    return acc;
  }, repeat(0, 9));

  const result = repeat('', days).reduce((acc) => {
    const next = [...drop(1, acc), 0];
    if (acc[0]) {
      next[6] += acc[0];
      next[8] += acc[0];
    }
    return next;
  }, template);

  return sum(result);
};

export default () => [task1(80, data), task2(256, data)];
