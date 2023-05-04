import { calcMpyCenter } from './multiplicity_calc';

const carbonFeatures = (peaksEdit, multiplicitySt) => {
    const { selectedIdx, multiplicities } = multiplicitySt;
    const selectedMultiplicity = multiplicities[selectedIdx];
    const { stack, shift } = selectedMultiplicity;
    const nmrMpyCenters = stack.map((stk) => {
      return {
        x: calcMpyCenter(stk.peaks, shift, stk.mpyType),
        y: 0,
      };
    });
    let targetIdxs = [];
    stack.forEach((stk) => { // find peak idxs to be removed
      stk.peaks.forEach((p) => {
        let targetIdx = -1;
        let minDiff = 999999999;
        peaksEdit.forEach((pe, idx) => {
          const xDiff = Math.abs(pe.x - p.x);
          if (xDiff < minDiff) {
            targetIdx = idx;
            minDiff = xDiff;
          }
        })
        targetIdxs = [...targetIdxs, targetIdx];
      })
    });
    let features = [...nmrMpyCenters];
    peaksEdit.forEach((pe, idx) => {
        if (targetIdxs.indexOf(idx) < 0) { features = [...features, pe] }
    });
  return features;
};

export { carbonFeatures }; // eslint-disable-line
