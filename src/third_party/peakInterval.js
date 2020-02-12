// https://github.com/mljs/global-spectral-deconvolution/blob/master/src/gsd.js

import SG from 'ml-savitzky-golay-generalized';

const options = {
  sgOptions: {
    windowSize: 9,
    polynomial: 3,
  },
  minMaxRatio: 0.00025,
  broadRatio: 0.0,
  maxCriteria: true,
  smoothY: true,
  realTopDetection: false,
  heightFactor: 0,
  boundaries: false,
  derivativeThreshold: -1,
};

const getPeakIntervals = (entity) => {
  const data = entity.spectrum.data[0];

  const X = data.x;
  const dX = X[1] - X[0];
  const Y = SG(data.y, data.x, {
    windowSize: options.sgOptions.windowSize,
    polynomial: options.sgOptions.polynomial,
    derivative: 0,
  });
  const dY = SG(data.y, data.x, {
    windowSize: options.sgOptions.windowSize,
    polynomial: options.sgOptions.polynomial,
    derivative: 1,
  });
  const ddY = SG(data.y, data.x, {
    windowSize: options.sgOptions.windowSize,
    polynomial: options.sgOptions.polynomial,
    derivative: 2,
  });
  let maxDdy = 0;
  let maxY = 0;
  for (let i = 0; i < Y.length; i++) {
    if (Math.abs(ddY[i]) > maxDdy) {
      maxDdy = Math.abs(ddY[i]);
    }
    if (Math.abs(Y[i]) > maxY) {
      maxY = Math.abs(Y[i]);
    }
  }
  let lastMax = null;
  let lastMin = null;
  let minddY = new Array(Y.length - 2);
  let intervalL = new Array(Y.length);
  let intervalR = new Array(Y.length);
  let broadMask = new Array(Y.length - 2);
  let minddYLen = 0;
  let intervalLLen = 0;
  let intervalRLen = 0;
  let broadMaskLen = 0;

  for (let i = 1; i < Y.length - 1; ++i) {
    // filter based on derivativeThreshold
    if (Math.abs(dY[i]) > options.derivativeThreshold) {
      // Minimum in first derivative
      if (
        (dY[i] < dY[i - 1] && dY[i] <= dY[i + 1]) ||
        (dY[i] <= dY[i - 1] && dY[i] < dY[i + 1])
      ) {
        lastMin = {
          x: X[i],
          index: i,
        };
        if (dX > 0 && lastMax !== null) {
          intervalL[intervalLLen++] = lastMax;
          intervalR[intervalRLen++] = lastMin;
        }
      }

      // Maximum in first derivative
      if (
        (dY[i] >= dY[i - 1] && dY[i] > dY[i + 1]) ||
        (dY[i] > dY[i - 1] && dY[i] >= dY[i + 1])
      ) {
        lastMax = {
          x: X[i],
          index: i,
        };
        if (dX < 0 && lastMin !== null) {
          intervalL[intervalLLen++] = lastMax;
          intervalR[intervalRLen++] = lastMin;
        }
      }
    }

    // Minimum in second derivative
    if (ddY[i] < ddY[i - 1] && ddY[i] < ddY[i + 1]) {
      // TODO should we change this to have 3 arrays ? Huge overhead creating arrays
      minddY[minddYLen++] = i; // ( [X[i], Y[i], i] );
      broadMask[broadMaskLen++] =
        Math.abs(ddY[i]) <= options.broadRatio * maxDdy;
    }
  }
  return { intervalL, intervalR };
};

export {
  getPeakIntervals, // eslint-disable-line
};
