import { times, repeat, all, pipe, flatten, sum, map, sortBy, prop, head, last } from 'ramda';

import { numbers, templates } from './data.js';

const handleItem = (arr) => {
  const template = times(() => repeat(false, arr[0].length), arr.length);
  const result = {
    steps: numbers.length,
    answer: 0,
  };

  numbers.some(
    (number, index) => {
      arr.forEach((subArr, i) => {
        subArr.forEach((value, j) => {
          if (value === number) template[i][j] = true;
        });
      });

      if (index < 5) return false;

      const done = template.some((subArr, i) => {
        if (all(Boolean, subArr)) return true;

        const vertical = template.map((inside) => inside[i]);

        return all(Boolean, vertical);
      });

      if (done) {
        result.steps = index + 1;
        result.answer =
          pipe(flatten, sum)(template.map((subItem, i) => subItem.map((item, j) => (item ? 0 : arr[i][j])))) * number;
      }

      return done;
    },
    {
      index: numbers.length - 1,
      done: false,
    }
  );

  return result;
};

const task1 = pipe(map(handleItem), sortBy(prop('steps')), head, prop('answer'));

const task2 = pipe(map(handleItem), sortBy(prop('steps')), last, prop('answer'));

export default () => [task1(templates), task2(templates)];
