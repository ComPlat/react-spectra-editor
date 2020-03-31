const mpyPatterns = ['s', 'd', 't', 'q', 'quint', 'h', 'sept', 'o', 'n'];

const getInterval = (peaks) => {
  let itvs = [];
  for (let idx = 0; idx < peaks.length - 1; idx += 1) {
    const itv = Math.abs(peaks[idx + 1].x - peaks[idx].x);
    itvs = [...itvs, itv];
  }
  return itvs;
};

const groupInterval = (itvs) => {
  let gitvs = [];
  itvs.forEach((vv) => {
    let applied = false;
    gitvs.forEach((gv, idx) => {
      if (applied) return;
      if (Math.abs((gv.c - vv) / gv.c) <= 0.03) {
        const c = (gv.c * gv.es.length + vv) / (gv.es.length + 1);
        const es = [...gv.es, vv];
        gitvs = [...gitvs.filter((v, i) => i !== idx), { c, es }];
        applied = true;
      }
    });
    if (!applied) {
      gitvs = [...gitvs, { c: vv, es: [vv] }];
    }
  });
  return gitvs;
};

const calcMpyComplat = (origPeaks) => {
  const peaks = origPeaks.sort((a, b) => a.x - b.x);
  const count = peaks.length;
  const itvs = getInterval(peaks);
  const gitvs = groupInterval(itvs);
  let type = 'm';
  let js = [];
  switch (count) {
    case 1:
      type = 's';
      js = [];
      break;
    case 2:
      if (gitvs.length === 1) {
        type = 'd';
        js = gitvs.map(g => g.c);
        break;
      }
      break;
    case 3:
      if (gitvs.length === 1) {
        type = 't';
        js = gitvs.map(g => g.c);
        break;
      }
      break;
    case 4:
      if (gitvs.length === 1) {
        type = 'q';
        js = gitvs.map(g => g.c);
        break;
      } else if (gitvs.length === 2) {
        type = 'dd';
        js = gitvs.map(g => g.c);
        break;
      }
      break;
    case 5:
      if (gitvs.length === 1) {
        type = 'quint';
        js = gitvs.map(g => g.c);
        break;
      }
      break;
    case 6:
      if (gitvs.length === 1) {
        type = 'h';
        js = gitvs.map(g => g.c);
        break;
      } else if (gitvs.length === 2) {
        type = 'dt';
        js = gitvs.map(g => g.c);
        break;
      }
      // td
      break;
    case 7:
      if (gitvs.length === 1) {
        type = 'sept';
        js = gitvs.map(g => g.c);
        break;
      } else if (gitvs.length === 3) {
        type = 'ddd';
        js = gitvs.map(g => g.c);
        break;
      }
      // td
      break;
    case 8:
      if (gitvs.length === 1) {
        type = 'o';
        js = gitvs.map(g => g.c);
        break;
      } else if (gitvs.length === 2) {
        type = 'dq';
        js = gitvs.map(g => g.c);
        break;
      } else if (gitvs.length === 3) {
        type = 'ddd';
        js = gitvs.map(g => g.c);
        break;
      }
      // td
      break;
    default:
      break;
  }
  return { type, js };
};

const calcMpyJ1 = (k, metaSt) => {
  const { observeFrequency } = metaSt.peaks;
  const freq = observeFrequency || 1.0;

  const { peaks } = k;
  const pxs = peaks.map(p => p.x).sort((a, b) => b - a);
  const dxs = pxs.map((x, idx, arr) => idx > 0 && arr[idx - 1] - arr[idx]);
  const intervals = (dxs.length - 1) || 1;
  const j1 = freq * dxs.reduce((sum, x) => sum + x) / intervals;
  return [j1];
};

// ---------------------------------------------------------------
// verifyTypePeakCount
// ---------------------------------------------------------------

const verifyTypePeakCount = (type, peaks) => {
  const isBasicWrong = (type === 's' && peaks.length > 1)
    || (type === 'd' && peaks.length > 2)
    || (type === 't' && peaks.length > 3)
    || (type === 'q' && peaks.length > 4)
    || (type === 'quint' && peaks.length > 5)
    || (type === 'h' && peaks.length > 6)
    || (type === 'sept' && peaks.length > 7)
    || (type === 'o' && peaks.length > 8)
    || (type === 'n' && peaks.length > 9);
  let limit = 1;
  let mStr = type;
  limit *= 5 ** (mStr.match(/quint/g) || []).length;
  mStr = mStr.replace(/quint/g, '');
  limit *= 7 ** (mStr.match(/sept/g) || []).length;
  mStr = mStr.replace(/sept/g, '');
  limit *= 2 ** (mStr.match(/d/g) || []).length;
  mStr = mStr.replace(/d/g, '');
  limit *= 3 ** (mStr.match(/t/g) || []).length;
  mStr = mStr.replace(/t/g, '');
  limit *= 4 ** (mStr.match(/q/g) || []).length;
  mStr = mStr.replace(/q/g, '');
  limit *= 6 ** (mStr.match(/h/g) || []).length;
  mStr = mStr.replace(/h/g, '');
  limit *= 8 ** (mStr.match(/o/g) || []).length;
  mStr = mStr.replace(/o/g, '');
  limit *= 9 ** (mStr.match(/n/g) || []).length;
  mStr = mStr.replace(/n/g, '');
  const isAdvanWrong = peaks.length > limit;
  return !(isBasicWrong || isAdvanWrong);
};

// ---------------------------------------------------------------
// Basic Multiplicity verification
// ---------------------------------------------------------------

const allowedTolerance = 0.15;

const faktor = 1.1;

const passRuleIntervalCounts = (oivs, limit) => oivs.length === limit;

const getRuleParams = (oivs, metaSt) => {
  const { deltaX, observeFrequency } = metaSt.peaks;
  const sivs = [...oivs].sort((a, b) => b - a);
  const ref = sivs[0];
  const rDeltaX = Math.abs(2 * deltaX / ref);
  const tTolerance = rDeltaX > allowedTolerance ? rDeltaX : allowedTolerance;
  const tolerance = Math.abs(tTolerance * faktor);
  const roivs = oivs.map(oiv => oiv / ref);
  const rsivs = sivs.map(siv => siv / ref);
  return {
    roivs, rsivs, tolerance, observeFrequency,
  };
};

const verifyTypeT = (type, js, oivs, metaSt) => {
  if (!passRuleIntervalCounts(oivs, 2)) return { type: 'm', js: [] };
  const { rsivs, tolerance } = getRuleParams(oivs, metaSt);
  const isT = Math.abs(rsivs[0] - rsivs[1]) < tolerance;
  if (isT) return { type, js };
  return { type: 'm', js: [] };
};

const verifyTypeQ = (type, js, oivs, metaSt) => {
  if (!passRuleIntervalCounts(oivs, 3)) return { type: 'm', js: [] };
  const {
    roivs, rsivs, tolerance, observeFrequency,
  } = getRuleParams(oivs, metaSt);
  const isQ = Math.abs(rsivs[0] - rsivs[2]) < tolerance;
  if (isQ) return { type, js };

  const isDD = Math.abs(roivs[0] - roivs[2]) < tolerance
    && Math.abs(roivs[0] - roivs[1]) >= tolerance;
  const ddJs = [
    oivs[0] * observeFrequency,
    (oivs[0] + oivs[1]) * observeFrequency,
  ];
  if (isDD) return { type: 'dd', js: ddJs };
  return { type: 'm', js: [] };
};

const verifyTypeQuint = (type, js, oivs, metaSt) => {
  if (!passRuleIntervalCounts(oivs, 4)) return { type: 'm', js: [] };
  const { rsivs, tolerance } = getRuleParams(oivs, metaSt);
  const isQuint = Math.abs(rsivs[0] - rsivs[3]) < tolerance;
  if (isQuint) return { type, js };
  return { type: 'm', js: [] };
};

const verifyTypeH = (type, js, oivs, metaSt) => {
  if (!passRuleIntervalCounts(oivs, 5)) return { type: 'm', js: [] };
  const {
    roivs, rsivs, tolerance, observeFrequency,
  } = getRuleParams(oivs, metaSt);
  const isH = Math.abs(rsivs[0] - rsivs[4]) < tolerance;
  if (isH) return { type, js };
  const isTD = (
    (Math.abs(roivs[0] - roivs[2]) < tolerance) && (Math.abs(roivs[0] - roivs[4]) < tolerance)
  ) && (
    Math.abs(roivs[1] - roivs[3]) < tolerance
  ) && (
    Math.abs(roivs[0] - roivs[1]) >= tolerance
  );
  const tdJs = [
    oivs[0] * observeFrequency,
    (oivs[0] + oivs[1]) * observeFrequency,
  ];
  if (isTD) return { type: 'td', js: tdJs };
  const isDT1 = (
    Math.abs(roivs[0] - roivs[1]) < tolerance
      && Math.abs(roivs[0] - roivs[3]) < tolerance
      && Math.abs(roivs[0] - roivs[4]) < tolerance
      && Math.abs(roivs[0] - roivs[2]) >= tolerance
  );
  const dt1Js = [
    oivs[0] * observeFrequency,
    (oivs[1] + oivs[2] + oivs[3]) * observeFrequency,
  ];
  if (isDT1) return { type: 'dt', js: dt1Js };
  const isDT2 = (
    Math.abs(roivs[0] - roivs[4]) < tolerance
      && Math.abs(roivs[0] - roivs[1] - roivs[2]) < tolerance
      && Math.abs(roivs[0] - roivs[2] - roivs[3]) < tolerance
      && Math.abs(roivs[0] - roivs[2]) >= tolerance
  );
  const dt2Js = [
    oivs[0] * observeFrequency,
    (oivs[1] + oivs[2] + oivs[3]) * observeFrequency,
  ];
  if (isDT2) return { type: 'dt', js: dt2Js };
  return { type: 'm', js: [] };
};

const verifyTypeSept = (type, js, oivs, metaSt) => {
  if (!passRuleIntervalCounts(oivs, 6)) return { type: 'm', js: [] };
  const {
    roivs, rsivs, tolerance, observeFrequency,
  } = getRuleParams(oivs, metaSt);
  const isSept = Math.abs(rsivs[0] - rsivs[5]) < tolerance;
  if (isSept) return { type, js };

  const isDDD = (
    (Math.abs(roivs[0] - roivs[2]) < tolerance)
      && (Math.abs(roivs[0] - roivs[3]) < tolerance)
      && (Math.abs(roivs[0] - roivs[5]) < tolerance)
  ) && (
    Math.abs(roivs[1] - roivs[4]) < tolerance
  ) && (
    Math.abs(roivs[0] - roivs[1]) >= tolerance
  );
  const dddJs = [
    oivs[0] * observeFrequency,
    (oivs[0] + oivs[1]) * observeFrequency,
    (oivs[0] + oivs[1] + oivs[2]) * observeFrequency,
  ];
  if (isDDD) return { type: 'ddd', js: dddJs };
  return { type: 'm', js: [] };
};

const verifyTypeO = (type, js, oivs, metaSt) => {
  if (!passRuleIntervalCounts(oivs, 7)) return { type: 'm', js: [] };
  const {
    roivs, rsivs, tolerance, observeFrequency,
  } = getRuleParams(oivs, metaSt);
  const isO = Math.abs(rsivs[0] - rsivs[6]) < tolerance;
  if (isO) return { type, js };

  const isQD = (
    (Math.abs(roivs[0] - roivs[2]) < tolerance)
      && (Math.abs(roivs[0] - roivs[4]) < tolerance)
      && (Math.abs(roivs[0] - roivs[6]) < tolerance)
  ) && (
    (Math.abs(roivs[1] - roivs[3]) < tolerance)
      && (Math.abs(roivs[1] - roivs[5]) < tolerance)
  );
  const qdJs = [
    oivs[0] * observeFrequency,
    (oivs[0] + oivs[1]) * observeFrequency,
  ];
  if (isQD) return { type: 'qd', js: qdJs };

  const isDQ1 = (
    (Math.abs(roivs[0] - roivs[1] - roivs[2]) < tolerance)
      && (Math.abs(roivs[0] - roivs[2] - roivs[3]) < tolerance)
      && (Math.abs(roivs[0] - roivs[3] - roivs[4]) < tolerance)
      && (Math.abs(roivs[0] - roivs[4] - roivs[5]) < tolerance)
      && (Math.abs(roivs[0] - roivs[6]) < tolerance)
  ) && (
    Math.abs(roivs[1] - roivs[5]) < tolerance
  );
  const dq1Js = [
    oivs[0] * observeFrequency,
    (oivs[0] + oivs[1]) * observeFrequency,
  ];
  if (isDQ1) return { type: 'dq', js: dq1Js };

  const isDQ2 = (
    (Math.abs(roivs[0] - roivs[1]) < tolerance)
      && (Math.abs(roivs[0] - roivs[2]) < tolerance)
      && (Math.abs(roivs[0] - roivs[4]) < tolerance)
      && (Math.abs(roivs[0] - roivs[5]) < tolerance)
      && (Math.abs(roivs[0] - roivs[6]) < tolerance)
  ) && (
    Math.abs(roivs[0] - roivs[3]) >= tolerance
  );
  const dq2Js = [
    oivs[0] * observeFrequency,
    (oivs[0] + oivs[1] + oivs[2] + oivs[3]) * observeFrequency,
  ];
  if (isDQ2) return { type: 'dq', js: dq2Js };

  const isDDD1 = (
    (Math.abs(roivs[0] - roivs[2]) < tolerance)
      && (Math.abs(roivs[0] - roivs[4]) < tolerance)
      && (Math.abs(roivs[0] - roivs[6]) < tolerance)
  ) && (
    Math.abs(roivs[1] - roivs[5]) < tolerance
  );
  const ddd1Js = [
    oivs[0] * observeFrequency,
    (oivs[0] + oivs[1]) * observeFrequency,
    (oivs[0] + oivs[1] + oivs[2] + oivs[3]) * observeFrequency,
  ];
  if (isDDD1) return { type: 'ddd', js: ddd1Js };

  const isDDD2 = (
    (Math.abs(roivs[0] - roivs[2] - roivs[3]) < tolerance)
      && (Math.abs(roivs[0] - roivs[3] - roivs[4]) < tolerance)
      && (Math.abs(roivs[0] - roivs[6]) < tolerance)
  ) && (
    Math.abs(roivs[1] - roivs[5]) < tolerance
  ) && (
    Math.abs(roivs[0] - roivs[1]) >= tolerance
  );
  const ddd2Js = [
    oivs[0] * observeFrequency,
    (oivs[0] + oivs[1]) * observeFrequency,
    (oivs[0] + oivs[1] + oivs[2]) * observeFrequency,
  ];
  if (isDDD2) return { type: 'ddd', js: ddd2Js };

  return { type: 'm', js: [] };
};

export {
  calcMpyComplat, mpyPatterns,
  calcMpyJ1, getInterval,
  verifyTypeT, verifyTypeQ, verifyTypeQuint, verifyTypeH,
  verifyTypeSept, verifyTypeO,
  verifyTypePeakCount,
};
