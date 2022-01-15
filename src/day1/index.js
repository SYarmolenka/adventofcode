import data from './data.js';

const task1 = (arr) =>
  arr.reduce(
    (acc, n, index) => {
      if (index === 0) return acc;
      if (arr[index - 1] > n) acc.dec += 1;
      if (arr[index - 1] < n) acc.inc += 1;

      return acc;
    },
    { inc: 0, dec: 0 }
  );

const task2 = (arr) =>
  arr.reduce(
    (acc, n, index) => {
      if (index === 0 || index === 1 || index === acc.length - 1) return acc;

      const sum1 = arr[index - 2] + arr[index - 1] + n;
      const sum2 = arr[index - 1] + n + arr[index + 1];

      if (sum1 > sum2) acc.dec += 1;
      if (sum1 < sum2) acc.inc += 1;

      return acc;
    },
    { inc: 0, dec: 0 }
  );

export default () => [task1(data).inc, task2(data).inc];
