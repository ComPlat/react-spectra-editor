const almostEqual = (a, b) => Math.abs(a - b) < 0.00000001 * Math.abs(a + b);

const calcSlope = (x1, y1, x2, y2) => {
  if (x2 === x1) {
    return 0;
  }
  return ((y2 - y1) / (x2 - x1));
};

export {
  almostEqual, calcSlope,  // eslint-disable-line
};
