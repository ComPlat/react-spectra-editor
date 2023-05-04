"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
/* eslint-disable */
// https://github.com/cheminfo-js/spectra/blob/master/packages/spectra-data/src/peakPicking/jAnalyzer.js

/*
 * This library implements the J analyser described by Cobas et al in the paper:
 * A two-stage approach to automatic determination of 1H NMR coupling constants
 */
const patterns = ['s', 'd', 't', 'q', 'quint', 'h', 'sept', 'o', 'n'];
let symRatio = 1.5;
let maxErrorIter1 = 2.5; // Hz
let maxErrorIter2 = 1; // Hz
var _default = {
  /**
   * The compilation process implements at the first stage a normalization procedure described by Golotvin et al.
   * embedding in peak-component-counting method described by Hoyes et al.
   * @param {object} signal
   * @private
   */
  compilePattern: function (signal) {
    signal.multiplicity = 'm';
    // 1.1 symmetrize
    // It will add a set of peaks(signal.peaksComp) to the signal that will be used during
    // the compilation process. The unit of those peaks will be in Hz
    signal.symRank = symmetrizeChoiseBest(signal, maxErrorIter1, 1);
    signal.asymmetric = true;
    // Is the signal symmetric?
    if (signal.symRank >= 0.95 && signal.peaksComp.length < 32) {
      signal.asymmetric = false;
      var i, j, n, P1, n2, maxFlagged;
      let k = 1;
      let Jc = [];

      // Loop over the possible number of coupling contributing to the multiplet
      for (n = 0; n < 9; n++) {
        // 1.2 Normalize. It makes a deep copy of the peaks before to modify them.
        let peaks = normalize(signal, n);
        // signal.peaksCompX = peaks;
        let validPattern = false; // It will change to true, when we find the good patter
        // Lets check if the signal could be a singulet.
        if (peaks.length === 1 && n === 0) {
          validPattern = true;
        } else {
          if (peaks.length <= 1) {
            continue;
          }
        }
        // 1.3 Establish a range for the Heights Hi [peaks.intensity*0.85,peaks.intensity*1.15];
        let ranges = getRanges(peaks);
        n2 = Math.pow(2, n);

        // 1.4 Find a combination of integer heights Hi, one from each Si, that sums to 2^n.
        let heights = null;
        let counter = 1;
        while (!validPattern && (heights = getNextCombination(ranges, n2)) !== null && counter < 400) {
          // 2.1 Number the components of the multiplet consecutively from 1 to 2n,
          // starting at peak 1
          let numbering = new Array(heights.length);
          k = 1;
          for (i = 0; i < heights.length; i++) {
            numbering[i] = new Array(heights[i]);
            for (j = 0; j < heights[i]; j++) {
              numbering[i][j] = k++;
            }
          }
          Jc = []; // The array to store the detected j-coupling
          // 2.2 Set j = 1; J1 = P2 - P1. Flag components 1 and 2 as accounted for.
          j = 1;
          Jc.push(peaks[1].x - peaks[0].x);
          P1 = peaks[0].x;
          numbering[0].splice(0, 1); // Flagged
          numbering[1].splice(0, 1); // Flagged
          k = 1;
          let nFlagged = 2;
          maxFlagged = Math.pow(2, n) - 1;
          while (Jc.length < n && nFlagged < maxFlagged && k < peaks.length) {
            counter += 1;
            // 4.1. Increment j. Set k to the number of the first unflagged component.
            j++;
            while (k < peaks.length && numbering[k].length === 0) {
              k++;
            }
            if (k < peaks.length) {
              // 4.2 Jj = Pk - P1.
              Jc.push(peaks[k].x - peaks[0].x);
              // Flag component k and, for each sum of the...
              numbering[k].splice(0, 1); // Flageed
              nFlagged++;
              // Flag the other components of the multiplet
              for (let u = 2; u <= j; u++) {
                // TODO improve those loops
                let jSum = 0;
                for (i = 0; i < u; i++) {
                  jSum += Jc[i];
                }
                for (i = 1; i < numbering.length; i++) {
                  // Maybe 0.25 Hz is too much?
                  if (Math.abs(peaks[i].x - (P1 + jSum)) < 0.25) {
                    numbering[i].splice(0, 1); // Flageed
                    nFlagged++;
                    break;
                  }
                }
              }
            }
          }
          // Calculate the ideal patter by using the extracted j-couplings
          let pattern = idealPattern(Jc);
          // Compare the ideal pattern with the proposed intensities.
          // All the intensities have to match to accept the multiplet
          validPattern = true;
          for (i = 0; i < pattern.length; i++) {
            if (pattern[i].intensity !== heights[i]) {
              validPattern = false;
            }
          }
        }
        // If we found a valid pattern we should inform about the pattern.
        if (validPattern) {
          updateSignal(signal, Jc);
        }
      }
    }
    // Before to return, change the units of peaksComp from Hz to PPM again
    for (i = 0; i < signal.peaksComp.length; i++) {
      signal.peaksComp[i].x /= signal.observe;
    }
  }
};
/**
 * @private
 * update the signal
 * @param {*} signal
 * @param {*} Jc
 */
exports.default = _default;
function updateSignal(signal, Jc) {
  // Update the limits of the signal
  let peaks = signal.peaksComp; // Always in Hz
  let nbPeaks = peaks.length;
  signal.startX = peaks[0].x / signal.observe - peaks[0].width;
  signal.stopX = peaks[nbPeaks - 1].x / signal.observe + peaks[nbPeaks - 1].width;

  // signal.integralData.from = peaks[0].x / signal.observe - peaks[0].width * 3;
  // signal.integralData.to =
  //   peaks[nbPeaks - 1].x / signal.observe + peaks[nbPeaks - 1].width * 3;

  // Compile the pattern and format the constant couplings
  signal.maskPattern = signal.mask2;
  signal.multiplicity = abstractPattern(signal, Jc);
  signal.pattern = signal.multiplicity; // Our library depends on this parameter, but it is old
  // console.log(signal);
  /* if (DEBUG)        {
        console.log('Final j-couplings: ' + JSON.stringify(Jc));
    }*/
}

/**
 * Returns the multiplet in the compact format
 * @param {object} signal
 * @param {object} Jc
 * @return {string}
 * @private
 */
function abstractPattern(signal, Jc) {
  let tol = 0.05;
  let i;
  let pattern = '';
  let cont = 1;
  let newNmrJs = [];
  if (Jc && Jc.length > 0) {
    Jc.sort(function (a, b) {
      return b - a;
    });
    for (i = 0; i < Jc.length - 1; i++) {
      if (Math.abs(Jc[i] - Jc[i + 1]) < tol) {
        cont++;
      } else {
        newNmrJs.push({
          coupling: Math.abs(Jc[i]),
          multiplicity: patterns[cont]
        });
        pattern += patterns[cont];
        cont = 1;
      }
    }
    newNmrJs.push({
      coupling: Math.abs(Jc[i]),
      multiplicity: patterns[cont]
    });
    pattern += patterns[cont];
    signal.nmrJs = newNmrJs;
  } else {
    pattern = 's';
    // if (Math.abs(signal.startX - signal.stopX) * signal.observe > 16) {
    //   pattern = 'br s';
    // }
  }

  return pattern;
}

/**
 * This function creates an ideal pattern from the given J-couplings
 * @private
 * @param {Array} Jc
 * @return {*[]}
 * @private
 */
function idealPattern(Jc) {
  let hsum = Math.pow(2, Jc.length);
  let i, j;
  let pattern = [{
    x: 0,
    intensity: hsum
  }];
  // To split the initial height
  for (i = 0; i < Jc.length; i++) {
    for (j = pattern.length - 1; j >= 0; j--) {
      pattern.push({
        x: pattern[j].x + Jc[i] / 2,
        intensity: pattern[j].intensity / 2
      });
      pattern[j].x = pattern[j].x - Jc[i] / 2;
      pattern[j].intensity = pattern[j].intensity / 2;
    }
  }
  // To sum the heights in the same positions
  pattern.sort(function compare(a, b) {
    return a.x - b.x;
  });
  for (j = pattern.length - 2; j >= 0; j--) {
    if (Math.abs(pattern[j].x - pattern[j + 1].x) < 0.1) {
      pattern[j].intensity += pattern[j + 1].intensity;
      pattern.splice(j + 1, 1);
    }
  }
  return pattern;
}

/**
 * Find a combination of integer heights Hi, one from each Si, that sums to 2n.
 * @param {object} ranges
 * @param {number} value
 * @return {*}
 * @private
 */
function getNextCombination(ranges, value) {
  let half = Math.ceil(ranges.values.length * 0.5);
  let lng = ranges.values.length;
  let sum = 0;
  let i, ok;
  while (sum !== value) {
    // Update the indexes to point at the next possible combination
    ok = false;
    while (!ok) {
      ok = true;
      ranges.currentIndex[ranges.active]++;
      if (ranges.currentIndex[ranges.active] >= ranges.values[ranges.active].length) {
        // In this case, there is no more possible combinations
        if (ranges.active + 1 === half) {
          return null;
        } else {
          // If this happens we need to try the next active peak
          ranges.currentIndex[ranges.active] = 0;
          ok = false;
          ranges.active++;
        }
      } else {
        ranges.active = 0;
      }
    }
    // Sum the heights for this combination
    sum = 0;
    for (i = 0; i < half; i++) {
      sum += ranges.values[i][ranges.currentIndex[i]] * 2;
    }
    if (ranges.values.length % 2 !== 0) {
      sum -= ranges.values[half - 1][ranges.currentIndex[half - 1]];
    }
  }
  // If the sum is equal to the expected value, fill the array to return
  if (sum === value) {
    let heights = new Array(lng);
    for (i = 0; i < half; i++) {
      heights[i] = ranges.values[i][ranges.currentIndex[i]];
      heights[lng - i - 1] = ranges.values[i][ranges.currentIndex[i]];
    }
    return heights;
  }
  return null;
}

/**
 * This function generates the possible values that each peak can contribute
 * to the multiplet.
 * @param {Array} peaks Array of objects with peaks information {intensity}
 * @return {{values: Array, currentIndex: Array, active: number}}
 * @private
 */
function getRanges(peaks) {
  let ranges = new Array(peaks.length);
  let currentIndex = new Array(peaks.length);
  let min, max;
  ranges[0] = [1];
  ranges[peaks.length - 1] = [1];
  currentIndex[0] = -1;
  currentIndex[peaks.length - 1] = 0;
  for (let i = 1; i < peaks.length - 1; i++) {
    min = Math.round(peaks[i].intensity * 0.85);
    max = Math.round(peaks[i].intensity * 1.15);
    ranges[i] = [];
    for (let j = min; j <= max; j++) {
      ranges[i].push(j);
    }
    currentIndex[i] = 0;
  }
  return {
    values: ranges,
    currentIndex: currentIndex,
    active: 0
  };
}
/**
 * Performs a symmetrization of the signal by using different aproximations to the center.
 * It will return the result of the symmetrization that removes less peaks from the signal
 * @param {object} signal
 * @param {number} maxError
 * @param {number} iteration
 * @return {*}
 * @private
 */
function symmetrizeChoiseBest(signal, maxError, iteration) {
  let symRank1 = symmetrize(signal, maxError, iteration);
  let tmpPeaks = signal.peaksComp;
  let tmpMask = signal.mask;
  let cs = signal.delta1;
  signal.delta1 = (signal.peaks[0].x + signal.peaks[signal.peaks.length - 1].x) / 2;
  let symRank2 = symmetrize(signal, maxError, iteration);
  if (signal.peaksComp.length > tmpPeaks.length) {
    return symRank2;
  } else {
    signal.delta1 = cs;
    signal.peaksComp = tmpPeaks;
    signal.mask = tmpMask;
    return symRank1;
  }
}

/**
 * This function will return a set of symmetric peaks that will
 * be the enter point for the patter compilation process.
 * @param {object} signal
 * @param {number} maxError
 * @param {number} iteration
 * @return {number}
 * @private
 */
function symmetrize(signal, maxError, iteration) {
  // Before to symmetrize we need to keep only the peaks that possibly conforms the multiplete
  let max, min, avg, ratio, avgWidth, i;
  let peaks = new Array(signal.peaks.length);
  // Make a deep copy of the peaks and convert PPM ot HZ
  for (i = 0; i < peaks.length; i++) {
    peaks[i] = {
      x: signal.peaks[i].x * signal.observe,
      intensity: signal.peaks[i].intensity,
      width: signal.peaks[i].width
    };
  }
  // Join the peaks that are closer than 0.25 Hz
  for (i = peaks.length - 2; i >= 0; i--) {
    if (Math.abs(peaks[i].x - peaks[i + 1].x) < 0.25) {
      peaks[i].x = peaks[i].x * peaks[i].intensity + peaks[i + 1].x * peaks[i + 1].intensity;
      peaks[i].intensity = peaks[i].intensity + peaks[i + 1].intensity;
      peaks[i].x /= peaks[i].intensity;
      peaks[i].intensity /= 2;
      peaks[i].width += peaks[i + 1].width;
      peaks.splice(i + 1, 1);
    }
  }
  signal.peaksComp = peaks;
  let nbPeaks = peaks.length;
  let mask = new Array(nbPeaks);
  signal.mask = mask;
  let left = 0;
  let right = peaks.length - 1;
  let cs = signal.delta1 * signal.observe;
  let middle = [(peaks[0].x + peaks[nbPeaks - 1].x) / 2, 1];
  maxError = error(Math.abs(cs - middle[0]));
  let heightSum = 0;
  // We try to symmetrize the extreme peaks. We consider as candidates for symmetricing those which have
  // ratio smaller than 3
  for (i = 0; i < nbPeaks; i++) {
    mask[i] = true;
    heightSum += signal.peaks[i].intensity;
  }
  while (left <= right) {
    mask[left] = true;
    mask[right] = true;
    if (left === right) {
      if (nbPeaks > 2 && Math.abs(peaks[left].x - cs) > maxError) {
        mask[left] = false;
      }
    } else {
      max = Math.max(peaks[left].intensity, peaks[right].intensity);
      min = Math.min(peaks[left].intensity, peaks[right].intensity);
      ratio = max / min;
      if (ratio > symRatio) {
        if (peaks[left].intensity === min) {
          mask[left] = false;
          right++;
        } else {
          mask[right] = false;
          left--;
        }
      } else {
        let diffL = Math.abs(peaks[left].x - cs);
        let diffR = Math.abs(peaks[right].x - cs);
        if (Math.abs(diffL - diffR) < maxError) {
          avg = Math.min(peaks[left].intensity, peaks[right].intensity);
          avgWidth = Math.min(peaks[left].width, peaks[right].width);
          peaks[left].intensity = peaks[right].intensity = avg;
          peaks[left].width = peaks[right].width = avgWidth;
          middle = [middle[0] + (peaks[right].x + peaks[left].x) / 2, middle[1] + 1];
        } else {
          if (Math.max(diffL, diffR) === diffR) {
            mask[right] = false;
            left--;
          } else {
            mask[left] = false;
            right++;
          }
        }
      }
    }
    left++;
    right--;
    // Only alter cs if it is the first iteration of the sym process.
    if (iteration === 1) {
      cs = chemicalShift(peaks, mask);
      // There is not more available peaks
      if (isNaN(cs)) {
        return 0;
      }
    }
    maxError = error(Math.abs(cs - middle[0] / middle[1]));
  }
  // To remove the weak peaks and recalculate the cs
  for (i = nbPeaks - 1; i >= 0; i--) {
    if (mask[i] === false) {
      peaks.splice(i, 1);
    }
  }
  cs = chemicalShift(peaks);
  if (isNaN(cs)) {
    return 0;
  }
  signal.delta1 = cs / signal.observe;
  // Now, the peak should be symmetric in heights, but we need to know if it is symmetric in x
  let symFactor = 0;
  let weight = 0;
  if (peaks.length > 1) {
    for (i = Math.ceil(peaks.length / 2) - 1; i >= 0; i--) {
      symFactor += (3 + Math.min(Math.abs(peaks[i].x - cs), Math.abs(peaks[peaks.length - 1 - i].x - cs))) / (3 + Math.max(Math.abs(peaks[i].x - cs), Math.abs(peaks[peaks.length - 1 - i].x - cs))) * peaks[i].intensity;
      weight += peaks[i].intensity;
    }
    symFactor /= weight;
  } else {
    if (peaks.length === 1) {
      symFactor = 1;
    }
  }
  let newSumHeights = 0;
  for (i = 0; i < peaks.length; i++) {
    newSumHeights += peaks[i].intensity;
  }
  symFactor -= (heightSum - newSumHeights) / heightSum * 0.12; // Removed peaks penalty
  // Sometimes we need a second opinion after the first symmetrization.
  if (symFactor > 0.8 && symFactor < 0.97 && iteration < 2) {
    return symmetrize(signal, maxErrorIter2, 2);
  } else {
    // Center the given pattern at cs and symmetrize x
    if (peaks.length > 1) {
      let dxi;
      for (i = Math.ceil(peaks.length / 2) - 1; i >= 0; i--) {
        dxi = (peaks[i].x - peaks[peaks.length - 1 - i].x) / 2.0;
        peaks[i].x = cs + dxi;
        peaks[peaks.length - 1 - i].x = cs - dxi;
      }
    }
  }
  return symFactor;
}
/**
 * Error validator
 * @param {number} value
 * @return {number}
 * @private
 */
function error(value) {
  let maxError = value * 2.5;
  if (maxError < 0.75) {
    maxError = 0.75;
  }
  if (maxError > 3) {
    maxError = 3;
  }
  return maxError;
}
/**
 * @private
 * 2 stages normalizarion of the peaks heights to Math.pow(2,n).
 * Creates a new mask with the peaks that could contribute to the multiplete
 * @param {object} signal
 * @param {number} n
 * @return {*}
 */
function normalize(signal, n) {
  // Perhaps this is slow
  let peaks = JSON.parse(JSON.stringify(signal.peaksComp));
  let norm = 0;
  let norm2 = 0;
  for (var i = 0; i < peaks.length; i++) {
    norm += peaks[i].intensity;
  }
  norm = Math.pow(2, n) / norm;
  signal.mask2 = JSON.parse(JSON.stringify(signal.mask));
  let index = signal.mask2.length - 1;
  for (i = peaks.length - 1; i >= 0; i--) {
    peaks[i].intensity *= norm;
    while (index >= 0 && signal.mask2[index] === false) {
      index--;
    }
    if (peaks[i].intensity < 0.75) {
      peaks.splice(i, 1);
      signal.mask2[index] = false;
    } else {
      norm2 += peaks[i].intensity;
    }
    index--;
  }
  norm2 = Math.pow(2, n) / norm2;
  for (i = peaks.length - 1; i >= 0; i--) {
    peaks[i].intensity *= norm2;
  }
  return peaks;
}

/**
 * @private
 * Calculates the chemical shift as the weighted sum of the peaks
 * @param {Array} peaks
 * @param {Array} mask
 * @return {number}
 */
function chemicalShift(peaks, mask) {
  let sum = 0;
  let cs = 0;
  let i, area;
  if (mask) {
    for (i = 0; i < peaks.length; i++) {
      if (mask[i] === true) {
        area = getArea(peaks[i]);
        sum += area;
        cs += area * peaks[i].x;
      }
    }
  } else {
    for (i = 0; i < peaks.length; i++) {
      area = getArea(peaks[i]);
      sum += area;
      cs += area * peaks[i].x;
    }
  }
  return cs / sum;
}

/**
 * Return the area of a Lorentzian function
 * @param {object} peak - object with peak information
 * @return {number}
 * @private
 */
function getArea(peak) {
  return Math.abs(peak.intensity * peak.width * 1.57); // 1.772453851);
}