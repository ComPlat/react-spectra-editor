const mpyPatterns = ['s', 'd', 't', 'q', 'quint', 'h', 'sept', 'o', 'n'];

const getInterval = (peaks) => {
  let itvs = [];
  for (let idx = 0; idx < peaks.length - 1; idx += 1) {
    const itv = peaks[idx + 1].x - peaks[idx].x;
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

export {
  calcMpyComplat, mpyPatterns,
  calcMpyJ1,
};
