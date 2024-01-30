import { DATA } from './data.js';

export const defineBundleConfig = (binaryString) => {
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

const getBundleBits = (bundle) =>
  bundle.headBits +
  (bundle.body
    ? bundle.body.reduce((acc, subBundle) => acc + (subBundle.body ? getBundleBits(subBundle) : subBundle.bits), '')
    : bundle.bits);

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

const getBundleBitsAndOtherBits = (bundle, binaryString) => {
  const bundleBits =
    ((bundle.type === 4 || bundle.childrenAmount > 0) && getBundleBits(bundle)) ||
    (bundle.type !== 4 && bundle.childrenLength > 0 && binaryString.slice(0, bundle.headBits.length + bundle.childrenLength)) ||
    null;
  const fullBits = binaryString.slice(0, Math.ceil(bundleBits.length / 4) * 4);

  return [fullBits, deleteEmpty(binaryString.slice(fullBits.length))];
};

const buildBundles = (binaryString) => {
  const bundles = [];
  const bundle = handleBundle(binaryString);
  const [bundleBits, otherBits] = getBundleBitsAndOtherBits(bundle, binaryString);

  bundle.binary = bundleBits;
  bundles.push(bundle);

  return otherBits.length ? [...bundles, ...buildBundles(otherBits)] : bundles;
};

const getSumVersions = (bundles) =>
  bundles.reduce((acc, bundle) => acc + (bundle.version || 0) + (bundle.body ? getSumVersions(bundle.body) : 0), 0);

const task1 = (data) => {
  const binaryString = data.split('').reduce((acc, symbol) => {
    const binary = Number(`0x${symbol}`).toString(2);

    return `${acc}${'0'.repeat(4 - binary.length)}${binary}`;
  }, '');

  const bundles = buildBundles(binaryString);

  return getSumVersions(bundles);
};

const task2 = () => {};

export default () => [task1(DATA), task2(DATA)];
