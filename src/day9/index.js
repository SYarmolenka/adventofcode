import {
  cond,
  pathOr,
  times,
  equals,
  T,
  keys,
  clone,
  map,
  pipe,
  sort,
  take,
  reduce,
  multiply,
} from 'ramda';

import data from './data.js';

const task1 = (d) => {
  let result = 0;

  d.map((v) => v.split('').map(Number)).forEach((arrStr, i, arr) => {
    arrStr.forEach((n, j) => {
      const top = pathOr(10, [i - 1, j], arr);
      const right = pathOr(10, [i, j + 1], arr);
      const bottom = pathOr(10, [i + 1, j], arr);
      const left = pathOr(10, [i, j - 1], arr);

      if (n < top && n < right && n < bottom && n < left) result += 1 + n;
    });
  });

  return result;
};

const getMinCoordinates = (initArr) => {
  const result = [];

  initArr.forEach((arrStr, i, arr) => {
    arrStr.forEach((n, j) => {
      const top = pathOr(10, [i - 1, j], arr);
      const right = pathOr(10, [i, j + 1], arr);
      const bottom = pathOr(10, [i + 1, j], arr);
      const left = pathOr(10, [i, j - 1], arr);

      if (n < top && n < right && n < bottom && n < left) {
        const key = `${i}-${j}`;

        result.push({ [key]: true });
      }
    });
  });

  return result;
};

const getIndexes = cond([
  [equals(0), (dir, i, p1, p2) => [p1 - i - 1, p2, p1 - i, p2]],
  [equals(1), (dir, i, p1, p2) => [p1, p2 + i + 1, p1, p2 + i]],
  [equals(2), (dir, i, p1, p2) => [p1 + i + 1, p2, p1 + i, p2]],
  [equals(3), (dir, i, p1, p2) => [p1, p2 - i - 1, p1, p2 - i]],
  [T, () => [-1, -1, -1, -1]],
]);

const getPoolForPoint = (point, arr, total) => {
  const result = clone(total);
  const [p1, p2] = point.split('-').map(Number);
  const startValue = arr[p1][p2];
  const stop = [];

  times((dir) => {
    times((index) => {
      if (stop[dir]) return;

      const [i, j, prevI, prevJ] = getIndexes(dir, index, p1, p2);
      const value = arr[i] && arr[i][j];
      const prevValue = arr[prevI] && arr[prevI][prevJ];

      if (!value || value > 8 || value < prevValue) {
        stop[dir] = true;

        return;
      }

      const key = `${i}-${j}`;

      if (!total[key]) result[key] = true;
    }, 9 - startValue);
  }, 4);

  return result;
};

const getPoolForPoints = (initPool, initArr) => {
  let pool = initPool;

  keys(pool).forEach((key) => {
    const res = getPoolForPoint(key, initArr, pool);

    pool = { ...pool, ...res };
  });

  return keys(initPool).length === keys(pool).length
    ? keys(pool).length
    : getPoolForPoints(pool, initArr);
};

const task2 = (d) => {
  const initArr = d.map((v) => v.split('').map(Number));

  return pipe(
    getMinCoordinates,
    map((value) => getPoolForPoints(value, initArr)),
    sort((a, b) => b - a),
    take(3),
    reduce(multiply, 1)
  )(initArr);
};

export default () => [task1(data), task2(data)];
