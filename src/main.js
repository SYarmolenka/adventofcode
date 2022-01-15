import readline from 'readline';
import { times, inc, pipe, repeat, join, maxBy, length, map } from 'ramda';

import getDay1 from './day1/index.js';
import getDay2 from './day2/index.js';
import getDay3 from './day3/index.js';
import getDay4 from './day4/index.js';

const results = [getDay1, getDay2, getDay3, getDay4];

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const ask = () => {
  console.log(
    `To get tasks result, enter number of day (${pipe(
      length,
      times(inc),
      join(', ')
    )(results)}). To exit just enter 'exit'.`
  );

  rl.question('Your command: ', (value) => {
    if (value.toLowerCase() === 'exit') {
      rl.close();

      return;
    }

    const number = Number(value);
    console.log('number', number);
    const error = 'Incorrect input';
    const answers =
      number && results[number - 1]
        ? map(String, results[number - 1]())
        : [error];
    const line = pipe(
      ($) => maxBy(length, ...$),
      length,
      pipe(repeat('-'), join(''))
    )(answers);

    console.log(line);
    answers.forEach((answer, index) => {
      if (answer === error) {
        console.log(answer);
      } else {
        console.log(`Result of Day ${number}, task ${index + 1}: ${answer}`);
      }
    });
    console.log(line);

    ask();
  });
};

rl.on('close', () => {
  console.log('Good Bye!');
  process.exit(0);
});

ask();
