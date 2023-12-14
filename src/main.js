import readline from 'readline';
import { times, inc, pipe, join, length, forEach } from 'ramda';

import getDay1 from './day1/index.js';
import getDay2 from './day2/index.js';
import getDay3 from './day3/index.js';
import getDay4 from './day4/index.js';
import getDay5 from './day5/index.js';
import getDay6 from './day6/index.js';
import getDay7 from './day7/index.js';
import getDay8 from './day8/index.js';
import getDay9 from './day9/index.js';
import getDay10 from './day10/index.js';
import getDay11 from './day11/index.js';
import getDay12 from './day12/index.js';
import getDay13 from './day13/index.js';

const results = [
  getDay1,
  getDay2,
  getDay3,
  getDay4,
  getDay5,
  getDay6,
  getDay7,
  getDay8,
  getDay9,
  getDay10,
  getDay11,
  getDay12,
  getDay13,
];

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const days = pipe(length, times(inc), join(', '))(results);

const ask = () => {
  console.log(`To get tasks result, enter number of day (${days}). To exit just enter 'q'.`);

  rl.question('Your command: ', (value) => {
    if (value.toLowerCase() === 'q') {
      rl.close();

      return;
    }

    const number = Number(value);
    const answers =
      number && typeof results[number - 1] === 'function'
        ? results[number - 1]().map((answer, index) => `Result of Day ${number}, task ${index + 1}: ${answer}`)
        : [`Incorrect input! Please enter one of ${days}.`];

    const line = '-'.repeat(process.stdout.columns);

    console.log(line);
    forEach(console.log, answers);
    console.log(line);

    ask();
  });
};

rl.on('close', () => {
  console.log('Good Bye!');
  process.exit(0);
});

ask();
