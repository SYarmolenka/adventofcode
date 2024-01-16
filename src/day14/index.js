import { repeat, values, keys } from 'ramda';

import { INIT, COMBINATIONS } from './data.js';

const addAndCountElements = (str, combinations, counter) => {
  let result = str[0];
  const acc = { ...counter };

  for (let i = 1; i < str.length; i += 1) {
    const key = str.substring(i - 1, i + 1);

    acc[combinations[key]] = acc[combinations[key]] ? acc[combinations[key]] + 1 : 1;

    result += `${combinations[key]}${key[1]}`;
  }

  return [result, acc];
};

const getDiff = (counter) => {
  const amounts = values(counter);

  return Math.max(...amounts) - Math.min(...amounts);
};

const task1 = (init, combinations) => {
  const initCounter = init.split('').reduce((acc, symbol) => {
    acc[symbol] = acc[symbol] ? acc[symbol] + 1 : 1;

    return acc;
  }, {});
  const counter = repeat(0, 10).reduce((acc) => addAndCountElements(acc[0], combinations, acc[1]), [init, initCounter])[1];

  return getDiff(counter);
};

const calculateCombinations = (initial, combinations) =>
  keys(initial.obj).reduce(
    (acc, pair) => {
      const symbol = combinations[pair];
      const prevValue = initial.obj[pair] || 0;

      acc.counter[symbol] = acc.counter[symbol] ? acc.counter[symbol] + prevValue : prevValue;

      const key1 = `${pair[0]}${symbol}`;
      const key2 = `${symbol}${pair[1]}`;

      acc.obj[key1] = acc.obj[key1] ? acc.obj[key1] + prevValue : prevValue;
      acc.obj[key2] = acc.obj[key2] ? acc.obj[key2] + prevValue : prevValue;

      return acc;
    },
    { obj: {}, counter: initial.counter }
  );

const task2 = (init, combinations) => {
  const initial = init.split('').reduce(
    (acc, symbol, index) => {
      acc.counter[symbol] = acc.counter[symbol] ? acc.counter[symbol] + 1 : 1;

      if (index === 0) return acc;

      const key = `${init[index - 1]}${symbol}`;

      acc.obj[key] = acc.obj[key] ? acc.obj[key] + 1 : 1;

      return acc;
    },
    { obj: {}, counter: {} }
  );

  const { counter } = repeat(0, 40).reduce((acc) => calculateCombinations(acc, combinations), initial);

  return getDiff(counter);
};

export default () => [task1(INIT, COMBINATIONS), task2(INIT, COMBINATIONS)];
