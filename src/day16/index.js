import { pipe, cond, propEq, sum, reduce, T, head } from 'ramda';

import { DATA } from './data.js';

const getBinaryString = (str) =>
  str.split('').reduce((acc, symbol) => {
    const binary = Number(`0x${symbol}`).toString(2);

    return `${acc}${'0'.repeat(4 - binary.length)}${binary}`;
  }, '');

const defineBundleConfig = (binaryString) => {
  const type = Number.parseInt(binaryString.slice(3, 6), 2);
  const operator = type !== 4 && binaryString[6];
  const lengthId = (operator === '0' && 15) || (operator === '1' && 11) || 0;

  return {
    version: Number.parseInt(binaryString.slice(0, 3), 2),
    type,
    operator,
    childrenLength: lengthId === 15 ? Number.parseInt(binaryString.slice(7, 7 + 15), 2) : 0,
    childrenAmount: lengthId === 11 ? Number.parseInt(binaryString.slice(7, 7 + 11), 2) : 0,
    headBits: binaryString.slice(0, type === 4 ? 6 : 7 + lengthId),
  };
};

const getBundleBits = ({ headBits, body, bits }) =>
  headBits +
  (body ? body.reduce((acc, subBundle) => acc + (subBundle.body ? getBundleBits(subBundle) : subBundle.bits), '') : bits);

const calculateBundle = (config, binaryString) => {
  const bits = binaryString.slice(config.headBits.length);
  let result = '';
  let continueRead = true;
  let bodyBits = '';

  for (let i = 0; continueRead; i += 1) {
    const value = bits.slice(i * 5, i * 5 + 5);

    result += value.slice(1);
    bodyBits += value;
    continueRead = value[0] !== '0';
  }

  return [{ bits: bodyBits, value: Number.parseInt(result, 2) }];
};

const calculateBundleWithSubBundles = (config, binaryString, handleBundle) => {
  const results = [];
  let continueRead = true;
  let bits = binaryString.slice(
    config.headBits.length,
    config.childrenLength ? config.headBits.length + config.childrenLength : undefined
  );

  for (; continueRead; ) {
    const subBundle = handleBundle(bits);
    const subBundleBits = getBundleBits(subBundle);

    results.push(subBundle);
    bits = bits.slice(subBundleBits.length);
    continueRead =
      (config.childrenLength > 0 && bits.length > 0 && bits.replace(/0/g, '').length > 0) ||
      (config.childrenAmount > 0 && results.length < config.childrenAmount);
  }

  return results;
};

const handleBundle = (binaryString) => {
  const config = defineBundleConfig(binaryString);

  config.body =
    config.type === 4 ? calculateBundle(config, binaryString) : calculateBundleWithSubBundles(config, binaryString, handleBundle);

  return config;
};

const deleteEmpty = (binaryString) =>
  binaryString.substring(0, 4) === '0000' ? deleteEmpty(binaryString.replace(/^0000/, '')) : binaryString;

const getRestBits = (bundle, binaryString) => {
  const bundleBits =
    ((bundle.type === 4 || bundle.childrenAmount > 0) && getBundleBits(bundle)) ||
    (bundle.type !== 4 && bundle.childrenLength > 0 && binaryString.slice(0, bundle.headBits.length + bundle.childrenLength)) ||
    null;

  return deleteEmpty(binaryString.slice(binaryString.slice(0, Math.ceil(bundleBits.length / 4) * 4).length));
};

const buildBundles = (binaryString) => {
  const bundles = [];
  const bundle = handleBundle(binaryString);
  const restBits = getRestBits(bundle, binaryString);

  bundles.push(bundle);

  return restBits.length ? [...bundles, ...buildBundles(restBits)] : bundles;
};

const getSumVersions = (bundles) =>
  bundles.reduce((acc, { version, body }) => acc + (version || 0) + (body ? getSumVersions(body) : 0), 0);

const task1 = pipe(getBinaryString, buildBundles, getSumVersions);

const extractValues =
  (extractor) =>
  ({ body }) =>
    body.map((subBundle) => (subBundle.type === 4 ? subBundle.body[0].value : extractor(subBundle)));

const reduceBundle = (bundle) => {
  const extract = extractValues(reduceBundle);

  return cond([
    [propEq(0, 'type'), pipe(extract, sum)],
    [
      propEq(1, 'type'),
      pipe(
        extract,
        reduce((acc, val) => acc * val, 1)
      ),
    ],
    [propEq(2, 'type'), pipe(extract, ($) => Math.min(...$))],
    [propEq(3, 'type'), pipe(extract, ($) => Math.max(...$))],
    [propEq(5, 'type'), pipe(extract, ([v1, v2]) => Number(v1 > v2))],
    [propEq(6, 'type'), pipe(extract, ([v1, v2]) => Number(v1 < v2))],
    [propEq(7, 'type'), pipe(extract, ([v1, v2]) => Number(v1 === v2))],
    [T, () => 0],
  ])(bundle);
};

const task2 = pipe(getBinaryString, buildBundles, head, reduceBundle);

export default () => [task1(DATA), task2(DATA)];
