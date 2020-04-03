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

export {
  mpyPatterns, getInterval, groupInterval,
};
