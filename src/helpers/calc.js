const almostEqual = (a, b) => Math.abs(a - b) < 0.00000001 * Math.abs(a + b);

export {
  almostEqual,  // eslint-disable-line
};
