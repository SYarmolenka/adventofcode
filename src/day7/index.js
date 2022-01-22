import { median, times, identity, map, pipe, sort, head, sum } from 'ramda';
import data from './data.js';

const task1 = (arr) => {
  const med = median(arr);
  let result = 0;

  arr.forEach((v) => {
    result += Math.abs(v - med);
  });

  return result;
};

const task2 = (arr) => {
  const maxElement = pipe(
    sort((a, b) => b - a),
    head
  )(arr);

  let acc = 0;
  const progressiveScale = pipe(
    times(identity),
    map((v) => {
      const result = acc + v;
      acc = result;

      return result;
    })
  )(maxElement + 1);

  return pipe(
    times((i) =>
      pipe(
        map((v) => progressiveScale[Math.abs(v - i)]),
        sum
      )(arr)
    ),
    sort((a, b) => a - b),
    head
  )(maxElement);
};

export default () => [task1(data), task2(data)];
