import { pipe, keys, map, join, sum } from 'ramda';

import data from './data.js';

const task1 = (arr) => {
  let result = 0;
  arr.forEach(([, output]) => {
    output.forEach(({ length }) => {
      if (length === 2 || length === 3 || length === 4 || length === 7)
        result += 1;
    });
  });

  return result;
};

const sortString = (str) => str.split('').sort().join('');

const define1478 = (arr) =>
  arr.reduce(
    (acc, v) => {
      if (v.length === 2) {
        acc.template[1] = sortString(v);
      } else if (v.length === 3) {
        acc.template[7] = sortString(v);
      } else if (v.length === 4) {
        acc.template[4] = sortString(v);
      } else if (v.length === 7) {
        acc.template[8] = sortString(v);
      } else {
        acc.rest.push(v);
      }

      return acc;
    },
    { rest: [], template: {} }
  );
const define069 = (d) => {
  const regExp4 = new RegExp(`.*${d.template[4].split('').join('.*')}.*`);
  const regExp7 = new RegExp(`.*${d.template[7].split('').join('.*')}.*`);

  return d.rest.reduce(
    (acc, v) => {
      if (v.length !== 6) return acc;

      const sorted = sortString(v);

      if (!regExp7.test(sorted)) {
        acc.template[6] = sorted;
      } else if (regExp4.test(sorted)) {
        acc.template[9] = sorted;
      } else {
        acc.template[0] = sorted;
      }

      return acc;
    },
    {
      rest: d.rest.filter(({ length }) => length !== 6),
      template: { ...d.template },
    }
  );
};
const define235 = (d) => {
  const regExp7 = new RegExp(`.*${d.template[7].split('').join('.*')}.*`);
  const missedSymbol = d.template[8]
    .split('')
    .find((v) => !RegExp(v).test(d.template[9]));
  const number5 = d.template[6]
    .split('')
    .filter((v) => v !== missedSymbol)
    .sort()
    .join('');

  return d.rest.reduce(
    (acc, v) => {
      const sorted = sortString(v);

      if (sorted === number5) {
        acc[5] = sorted;
      } else if (regExp7.test(sorted)) {
        acc[3] = sorted;
      } else {
        acc[2] = sorted;
      }

      return acc;
    },
    { ...d.template }
  );
};
const defineNumbers = pipe(define1478, define069, define235);

const task2 = pipe(
  map(([input, output]) => {
    const numbers = defineNumbers(input);
    const numberKeys = keys(numbers);

    return pipe(
      map((v) => numberKeys.find((key) => sortString(v) === numbers[key])),
      join(''),
      Number
    )(output);
  }),
  sum
);

export default () => [task1(data), task2(data)];
