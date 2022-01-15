import { times, identity } from 'ramda';

import data from './data.js';

const task1 = (arr) => {
  const result = times(identity, arr[0].length).reduce(
    (acc, index) => {
      let v0 = 0;
      let v1 = 0;

      arr.forEach((str) => {
        if (str[index] === '0') v0 += 1;
        if (str[index] === '1') v1 += 1;
      });

      acc.gamma = `${acc.gamma}${v0 > v1 ? 0 : 1}`;
      acc.upsilon = `${acc.upsilon}${v0 > v1 ? 1 : 0}`;

      return acc;
    },
    { gamma: '', upsilon: '' }
  );

  return parseInt(result.gamma, 2) * parseInt(result.upsilon, 2);
};

const defineRate = (arr, feature) => {
  const result = times(identity, arr[0].length).reduce(
    (acc, index) => {
      let v0 = 0;
      let v1 = 0;

      acc.forEach((str) => {
        if (str[index] === '0') v0 += 1;
        if (str[index] === '1') v1 += 1;
      });

      const argument =
        (feature === 'o2' && (v0 > v1 ? '0' : '1')) ||
        (feature === 'co2' && (v0 <= v1 ? '0' : '1'));
      let len = acc.length;

      return len === 1
        ? acc
        : acc.filter((str) => {
            if (str[index] !== argument) len -= 1;
            if (len < 1) return true;

            return str[index] === argument;
          });
    },
    [...arr]
  );

  return parseInt(result[0], 2);
};
const task2 = (arr) => defineRate(arr, 'o2') * defineRate(arr, 'co2');

export default () => [task1(data), task2(data)];
