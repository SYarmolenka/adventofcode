import { values, omit /* , last, reverse */ } from 'ramda';

import { DATA } from './data.js';

const getField = (data) => data.map((str) => str.split('').map(Number));

const getHeuristic = (x, y, goal) => {
  const [goalY, goalX] = goal.split('-').map(Number);

  return Math.abs(goalY - y) + Math.abs(goalX - x);
};

const getNeighbors = (cell, goal, closedList, field) => {
  const [y, x] = cell.split('-').map(Number);
  const result = [];

  const right = `${y}-${x + 1}`;
  if (x + 1 < field[y].length && !closedList[right]) {
    result.push({ cell: right, parent: cell, cost: field[y][x + 1], heuristic: getHeuristic(x + 1, y, goal) });
  }

  const bottom = `${y + 1}-${x}`;
  if (y + 1 < field.length && !closedList[bottom]) {
    result.push({ cell: bottom, parent: cell, cost: field[y + 1][x], heuristic: getHeuristic(x, y + 1, goal) });
  }

  const left = `${y}-${x - 1}`;
  if (x - 1 >= 0 && !closedList[left]) {
    result.push({ cell: left, parent: cell, cost: field[y][x - 1], heuristic: getHeuristic(x - 1, y, goal) });
  }

  const top = `${y - 1}-${x}`;
  if (y - 1 >= 0 && !closedList[top]) {
    result.push({ cell: top, parent: cell, cost: field[y - 1][x], heuristic: getHeuristic(x, y - 1, goal) });
  }

  return result;
};

const takeBestCell = (openedList) => {
  const sorted = values(openedList).sort((a, b) => a.weight - b.weight);

  if (sorted.length < 2) return sorted[0];

  if (sorted[0].weight === sorted[1].weight && sorted[0].cost > sorted[1].cost) {
    return sorted[1];
  }

  return sorted[0];
};

const handleStep = (active, openedList, closedList, goal, field) => {
  const neighbors = getNeighbors(active.cell, goal, closedList, field);
  const updatedOpenedList = { ...openedList };

  neighbors.forEach(({ cell: neighbor, cost, heuristic }) => {
    const totalCost = active.cost + cost;
    const totalWeight = totalCost + heuristic;

    if (!openedList[neighbor] || openedList[neighbor].weight > totalWeight) {
      updatedOpenedList[neighbor] = {
        cell: neighbor,
        parent: active.cell,
        cost: totalCost,
        heuristic,
        weight: totalWeight,
      };
    }
  });

  const bestCell = takeBestCell(updatedOpenedList);

  return {
    openedList: omit([bestCell.cell], updatedOpenedList),
    closedList: { ...closedList, [active.cell]: active },
    active: bestCell,
    anotherGraphs: [],
  };
};

// const calculateResult = (closedList, goal, field) => {
//   const { cost } = closedList[goal];
//   const route = [goal];
//   let calculatesCost = 0;

//   const run = () => {
//     const { cell, parent } = closedList[last(route)];
//     const [y, x] = cell.split('-').map(Number);

//     if (parent) {
//       route.push(parent);
//       calculatesCost += field[y][x];

//       return run();
//     }

//     return {
//       route: reverse(route),
//       cost,
//       calculatesCost,
//     };
//   };

//   return run();
// };

const aStarAlgorithm = (start, goal, field) => {
  let data = {
    openedList: {},
    closedList: {},
    active: {
      cell: start,
      parent: null,
      cost: 0,
      heuristic: 0,
      weight: 0,
    },
  };

  let counter = 0;

  const run = () => {
    counter += 1;
    data = handleStep(data.active, data.openedList, data.closedList, goal, field);

    if (counter > 3000) {
      counter = 0;
      return null;
    }

    if (data.active.cell === goal) {
      data.closedList = { ...data.closedList, [data.active.cell]: data.active };

      // console.log(calculateResult({ ...data.closedList, [data.active.cell]: data.active }, goal, field));

      return data.active.cost;
    }

    return run();
  };

  const repeat = () => run() || repeat();

  return repeat();
};

const task1 = (data) => {
  const field = getField(data);
  const goal = `${field.length - 1}-${field[0].length - 1}`;

  return aStarAlgorithm('0-0', goal, field);
};

const task2 = () => {};

export default () => [task1(DATA), task2(DATA)];
