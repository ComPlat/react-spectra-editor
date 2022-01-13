const almostEqual = (a, b) => Math.abs(a - b) < 0.00000001 * Math.abs(a + b);

const calcSlope = (x1, y1, x2, y2) => {
  return ((y2 - y1) / (x2 - x1));
}

export {
  almostEqual, calcSlope,  // eslint-disable-line
};
