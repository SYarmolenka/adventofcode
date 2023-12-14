import { T, cond, equals, flatten, pipe, repeat, sum, takeLast } from 'ramda';

import { COORDS, FOLDS } from './data.js';

const buildList = (coords) => {
  const maxX = coords.map(([x]) => x).sort((a, b) => b - a)[0];
  const maxY = coords.map(([, y]) => y).sort((a, b) => b - a)[0];
  const result = repeat(0, maxY + 1).map(() => repeat(0, maxX + 1));

  return coords.reduce((acc, [x, y]) => {
    acc[y][x] = 1;

    return acc;
  }, result);
};

const foldY = (list, y) => {
  const up = list.slice(0, y);
  let down = list.slice(y + 1).reverse();

  if (up.length > down.length) {
    const extra = repeat(0, up.length - down.length).map(() => repeat(0, down[0].length));

    down.unshift(...extra);
  }
  if (up.length < down.length) {
    down = takeLast(up.length, down);
  }

  return up.map((arr, i) => arr.map((v, j) => Number(v || down[i][j])));
};

const foldX = (list, x) => {
  const left = list.map((arr) => arr.slice(0, x));
  let right = list.map((arr) => arr.slice(x + 1).reverse());

  if (left[0].length > right[0].length) {
    const extra = repeat(0, left[0].length - right[0].length);

    right = right.map((arr) => [...extra, ...arr]);
  }
  if (left[0].length < right[0].length) {
    right = right.map((arr) => takeLast(left[0].length, arr));
  }

  return left.map((arr, i) => arr.map((v, j) => Number(v || right[i][j])));
};

const fold = cond([
  [equals('x'), (axis, coord, list) => foldX(list, coord)],
  [equals('y'), (axis, coord, list) => foldY(list, coord)],
  [T, (axis, coord, list) => list],
]);

const getAmountOfDots = pipe(flatten, sum);

const task1 = (coords, folds) => getAmountOfDots(fold(...folds[0], buildList(coords)));

const task2 = (coords, folds) => {
  const list = buildList(coords);

  const result = folds.reduce((acc, [axis, coord]) => fold(axis, coord, acc), list);

  return `\n${result.map((arr) => arr.map((v) => (v ? '@' : ' ')).join('')).join('\n')}`;
};

export default () => [task1(COORDS, FOLDS), task2(COORDS, FOLDS)];
