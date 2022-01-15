import data from './data.js';

const task1 = (arr) => {
  const result = arr.reduce(
    (acc, [direction, value]) => {
      if (direction === 'forward') acc.horizontal += value;
      if (direction === 'down') acc.deep += value;
      if (direction === 'up') acc.deep -= value;

      return acc;
    },
    { deep: 0, horizontal: 0 }
  );

  return result.deep * result.horizontal;
};

const task2 = (arr) => {
  const result = arr.reduce(
    (acc, [direction, value]) => {
      if (direction === 'forward') {
        acc.horizontal += value;
        acc.deep += value * acc.aim;
      }
      if (direction === 'down') acc.aim += value;
      if (direction === 'up') acc.aim -= value;

      return acc;
    },
    { aim: 0, deep: 0, horizontal: 0 }
  );

  return result.horizontal * result.deep;
};

export default () => [task1(data), task2(data)];
