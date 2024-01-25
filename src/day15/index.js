import { values } from 'ramda';

import { DATA } from './data.js';

const getNeighbors = (y, x, field) => {
  const result = [];

  if (x + 1 < field[y].length) result.push(field[y][x + 1]);
  if (y + 1 < field.length) result.push(field[y + 1][x]);
  if (x - 1 >= 0) result.push(field[y][x - 1]);
  if (y - 1 >= 0) result.push(field[y - 1][x]);

  return result;
};

const getField = (data, goal) => {
  const field = data.map((str) => str.split('').map(Number));
  const expandedField = field.reduce(
    (acc, row, y) => [
      ...acc,
      row.map((cost, x) => {
        const coords = [y, x];

        return {
          cell: coords.join('-'),
          coords,
          cost,
          heuristic: Math.abs(goal[0] - y) + Math.abs(goal[1] - x),
        };
      }),
    ],
    []
  );

  expandedField.forEach((row, y) =>
    row.forEach(($, x) => {
      expandedField[y][x].neighbors = getNeighbors(y, x, expandedField);
    })
  );

  return expandedField;
};

const takeBestCell = (openedList) => {
  const sorted = values(openedList).sort((a, b) => a.weight - b.weight);

  if (sorted.length < 2) return sorted[0];
  if (sorted[0].weight === sorted[1].weight && sorted[0].cost > sorted[1].cost) {
    return sorted[1];
  }

  return sorted[0];
};

const handleStep = (data) => {
  const { active, openedList, closedList, field } = data;

  field[active.coords[0]][active.coords[1]].neighbors.forEach((neighbor) => {
    if (closedList[neighbor.cell]) return;

    const totalCost = active.cost + neighbor.cost;
    const totalWeight = totalCost + neighbor.heuristic;

    if (!openedList[neighbor.cell] || openedList[neighbor.cell].weight > totalWeight) {
      openedList[neighbor.cell] = {
        ...neighbor,
        parent: active.cell,
        cost: totalCost,
        weight: totalWeight,
      };
    }
  });

  const bestCell = takeBestCell(openedList);

  delete openedList[bestCell.cell];
  closedList[active.cell] = active;

  return {
    openedList,
    closedList,
    active: bestCell,
    field,
  };
};

const aStarAlgorithm = (start, goal, field) => {
  let data = {
    openedList: {},
    closedList: {},
    active: {
      cell: start,
      coords: start.split('-').map(Number),
      parent: null,
      cost: 0,
      heuristic: 0,
      weight: 0,
    },
    field,
  };
  let counter = 0;

  const run = () => {
    counter += 1;
    data = handleStep(data);

    if (data.active.cell === goal) return data.active.cost;
    if (counter > 1000) {
      counter = 0;

      return null;
    }

    return run();
  };
  const repeat = () => run() || repeat(); // avoid Maximum Call Stack Size Exceeded

  return repeat();
};

const task1 = (data) => {
  const goal = [data.length - 1, data[0].length - 1];
  const field = getField(data, goal);

  return aStarAlgorithm('0-0', goal.join('-'), field);
};

const task2 = () => {};

export default () => [task1(DATA), task2(DATA)];
