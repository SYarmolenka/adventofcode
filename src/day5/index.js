import { pipe, filter, map, times, reduce, values, lte, length } from 'ramda';

import data from './data.js';

// const data = [
//   [0, 9, 5, 9],
//   [8, 0, 0, 8],
//   [9, 4, 3, 4],
//   [2, 2, 2, 1],
//   [7, 0, 7, 4],
//   [6, 4, 2, 0],
//   [0, 9, 2, 9],
//   [3, 4, 1, 4],
//   [0, 0, 8, 8],
//   [5, 5, 8, 2],
// ];

const task1 = pipe(
  filter(([x1, y1, x2, y2]) => x1 === x2 || y1 === y2),
  map(
    ([x1, y1, x2, y2]) =>
      (x1 === x2 &&
        times((i) => [x1, y1 + (y2 > y1 ? i : -i)], Math.abs(y1 - y2) + 1)) ||
      (y1 === y2 &&
        times((i) => [x1 + (x2 > x1 ? i : -i), y1], Math.abs(x1 - x2) + 1)) ||
      []
  ),
  reduce((acc, arr) => [...acc, ...arr], []),
  reduce((acc, [x, y]) => {
    const key = `${x}-${y}`;
    acc[key] = acc[key] ? acc[key] + 1 : 1;

    return acc;
  }, {}),
  values,
  filter(lte(2)),
  length
);

const task2 = pipe(
  filter(
    ([x1, y1, x2, y2]) =>
      x1 === x2 || y1 === y2 || Math.abs(x1 - x2) === Math.abs(y1 - y2)
  ),
  map(
    ([x1, y1, x2, y2]) =>
      (x1 === x2 &&
        times((i) => [x1, y1 + (y2 > y1 ? i : -i)], Math.abs(y1 - y2) + 1)) ||
      (y1 === y2 &&
        times((i) => [x1 + (x2 > x1 ? i : -i), y1], Math.abs(x1 - x2) + 1)) ||
      times(
        (i) => [x1 + (x2 > x1 ? i : -i), y1 + (y2 > y1 ? i : -i)],
        Math.abs(x1 - x2) + 1
      )
  ),
  reduce((acc, arr) => [...acc, ...arr], []),
  reduce((acc, [x, y]) => {
    const key = `${x}-${y}`;
    acc[key] = acc[key] ? acc[key] + 1 : 1;

    return acc;
  }, {}),
  values,
  filter(lte(2)),
  length
);

export default () => [task1(data), task2(data)];
