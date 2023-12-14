import { last } from 'ramda';

import data from './data.js';

const getStartPositions = (d) =>
  d.reduce((acc, route) => {
    const [r1, r2] = route.split('-');

    if (r1 === 'start') acc.push(route);
    if (r2 === 'start') acc.push(`${r2}-${r1}`);

    return acc;
  }, []);

const calculate = (d, commonResult, maxAmount, prevResult) => {
  const entrances = (prevResult || getStartPositions(d)).reduce((acc, position) => {
    const goal = last(position.split('-'));

    d.forEach((route) => {
      if (route.includes('start')) return;

      const [r1, r2] = route.split('-');

      if (r1 === goal) acc.push(`${position}-${r2}`);
      if (r2 === goal) acc.push(`${position}-${r1}`);
    });

    return acc;
  }, []);

  const result = entrances.filter((route) => {
    if (route.includes('end')) {
      commonResult.push(route);

      return false;
    }

    let amountOfRepeats = 0;

    route.split('-').forEach((str) => {
      if (amountOfRepeats >= maxAmount + 1) return;

      const match = str === str.toLowerCase() && route.match(new RegExp(str, 'g'))?.length > 1;

      if (match) {
        amountOfRepeats += 1;
      }
    });

    return amountOfRepeats < maxAmount + 1;
  });

  if (result.length > 0) {
    return calculate(d, commonResult, maxAmount, result);
  }

  return result;
};

const task1 = (d) => {
  const result = [];

  calculate(d, result, 1);

  return result.length;
};
const task2 = (d) => {
  const result = [];

  calculate(d, result, 2);

  return result.length;
};

export default () => [task1(data), task2(data)];
