import { match, pipe, map, filter, test, complement, split, reverse, prop, __, join, reduce, sort } from 'ramda';

import data from './data.js';

const getReducedStr = (str) => {
  const newStr = str.replace(/\(\)|\[\]|\{\}|<>/g, '');

  if (newStr.length !== str.length) return getReducedStr(newStr);

  return newStr.length === str.length ? str : getReducedStr(newStr);
};

const countErrValue = (reducedStr, regExpScore) => {
  const strMatch = match(/\([\]}>]{1}|\[[)}>]{1}|\{[)\]>]{1}|<[)\]}]{1}/, reducedStr);

  return strMatch[0]
    ? regExpScore.reduce((acc, [regexp, value]) => {
        if (regexp.test(strMatch[0])) return acc + value;

        return acc;
      }, 0)
    : 0;
};

const task1 = (d) => {
  const regExpScore = [
    [/\)/, 3],
    [/\]/, 57],
    [/\}/, 1197],
    [/>/, 25137],
  ];

  return d.reduce((acc, str) => acc + countErrValue(getReducedStr(str), regExpScore), 0);
};

const task2 = (d) => {
  const comparator = { '(': ')', '[': ']', '{': '}', '<': '>' };
  const score = { ')': 1, ']': 2, '}': 3, '>': 4 };

  return pipe(
    map(getReducedStr),
    filter(complement(test(/\([\]}>]{1}|\[[)}>]{1}|\{[)\]>]{1}|<[)\]}]{1}/))),
    map(
      pipe(
        split(''),
        reverse,
        map(prop(__, comparator)),
        join(''),
        reduce((acc, $) => acc * 5 + score[$], 0)
      )
    ),
    sort((a, b) => a - b),
    ($) => $[Math.floor($.length / 2)]
  )(d);
};

export default () => [task1(data), task2(data)];
