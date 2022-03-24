import { isEmpty, times, flatten, sum } from 'ramda';

import data from './data.js';

const around = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, 1],
  [1, 1],
  [1, 0],
  [1, -1],
  [0, -1],
];

const checkStep = (d, initCount = 0) => {
  const flashMap = {};
  let count = initCount;

  d.forEach((subArr, i) => {
    subArr.forEach((num, j) => {
      if (num === 0) {
        count += 1;

        around.forEach(([x, y]) => {
          if (d[i + x] && d[i + x][j + y]) {
            const key = `${i + x}-${j + y}`;
            flashMap[key] = (flashMap[key] || 0) + 1;
          }
        });
      }
    });
  });

  if (isEmpty(flashMap)) return [d.map((subArr) => subArr.map((num) => (num === '*' ? 0 : num))), count];

  const next = d.map((subArr, i) =>
    subArr.map((num, j) => {
      const key = `${i}-${j}`;

      if (!flashMap[key]) return num === 0 ? '*' : num;
      if (num === '*') return num;

      const result = num + flashMap[key];

      return result > 9 ? 0 : result;
    })
  );

  return checkStep(next, count);
};

const doStep = (d) => checkStep(d.map((subArr) => subArr.map((num) => (num + 1 > 9 ? 0 : num + 1))));

const task1 = (d) => {
  const counter = { nextGeneration: d, count: 0 };

  times(() => {
    const [nextGeneration, count] = doStep(counter.nextGeneration);
    counter.nextGeneration = nextGeneration;
    counter.count += count;
  }, 100);

  return counter.count;
};

const task2 = (d, step = 0) => {
  if (sum(flatten(d)) === 0) return step;

  const [next] = doStep(d);

  return task2(next, step + 1);
};

export default () => [task1(data), task2(data)];
