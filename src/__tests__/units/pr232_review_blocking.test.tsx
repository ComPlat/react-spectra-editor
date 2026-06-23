/* eslint-disable */
//
// Demonstration tests for the BLOCKING findings (B1–B7) of the PR #232 review.
//
// Each test asserts the CORRECT (expected, post-fix) behaviour, so on the current
// PR head (933df56) it FAILS — the failure IS the demonstration of the bug.
// They are written as regression tests: once the bug is fixed they turn green.
//
// Run: yarn test --watchAll=false src/__tests__/units/pr232_review_blocking.test.tsx
//
import managerSagas from '../../sagas/saga_ui';
import {
  UI, EDITPEAK, HPLC_MS,
} from '../../constants/action_type';
import { LIST_UI_SWEEP_TYPE } from '../../constants/list_ui';
import { LIST_LAYOUT } from '../../constants/list_layout';

import { getArea, getAbsoluteArea } from '../../helpers/integration';
import { Convert2Peak, convertThresEndPts } from '../../helpers/chem';
import MultiFocus from '../../components/d3_multi/multi_focus';
import RectFocus from '../../components/d3_line_rect/rect_focus';

// --- saga test helpers (mirrors src/__tests__/units/sagas/saga_ui_lcms.test.tsx) ---
const findSagaByActionType = (actionType) => {
  const entry = managerSagas.find((s) => s?.payload?.args?.[0] === actionType);
  if (!entry) throw new Error(`No saga registered for ${actionType}`);
  return entry.payload.args[1];
};
const clickUiTarget = findSagaByActionType(UI.CLICK_TARGET);

// Drain consecutive SELECT effects, feeding the provided mock values in order,
// and return the first non-SELECT effect (here, the first PUT the saga yields).
const drainSelects = (iter, values) => {
  let { value, done } = iter.next();
  let i = 0;
  while (!done && value && value.type === 'SELECT') {
    ({ value, done } = iter.next(values[i]));
    i += 1;
  }
  return { value, done };
};

describe('PR #232 review — blocking findings B1–B7', () => {
  // ------------------------------------------------------------------ B1
  // saga_ui.js:195 — PEAK_ADD must still add a positive edit-peak on a
  // NON-LCMS layout. The PR dispatches HPLC_MS.UPDATE_HPLCMS_PEAKS for every
  // layout, so peak-add silently no-ops on NMR/IR/MS.
  describe('B1 — peak-add on a non-LCMS layout', () => {
    it('dispatches EDITPEAK.ADD_POSITIVE (not UPDATE_HPLCMS_PEAKS)', () => {
      const action = {
        type: UI.CLICK_TARGET,
        payload: { x: 5, y: 10 },
        onPeak: false,
      };
      const iter = clickUiTarget(action);
      // select order: getUiSweepType, getCurveState, getHplcMsState, getLayoutState
      const { value } = drainSelects(iter, [
        LIST_UI_SWEEP_TYPE.PEAK_ADD,
        { curveIdx: 0 },
        { uvvis: { selectedWaveLength: null, currentSpectrum: { peaks: [] } } },
        LIST_LAYOUT.H1, // a normal NMR layout — not LC/MS
      ]);
      expect(value.payload.action.type).toEqual(EDITPEAK.ADD_POSITIVE);
    });
  });

  // ------------------------------------------------------------------ B2
  // integration.js:12 — getArea is fed calcXYK output whose `k` is the
  // CUMULATIVE running integral of the signal. The integral over [xL,xU] is
  // k(xU) - k(xL). The PR trapezoidally integrates `k` itself (a second
  // integration), which is wrong and depends on the integration constant.
  describe('B2 — getArea on cumulative-k (NMR/CV) data', () => {
    // x ramp, constant normalised signal => k increases by 1 each sample.
    const data = [
      { x: 0, y: 1, k: 0 },
      { x: 1, y: 1, k: 1 },
      { x: 2, y: 1, k: 2 },
      { x: 3, y: 1, k: 3 },
    ];

    it('equals the cumulative difference k(xU)-k(xL)', () => {
      expect(getArea(0, 3, data)).toBeCloseTo(3); // PR returns 4.5
    });

    it('is invariant to a constant baseline offset of the cumulative curve', () => {
      const shifted = data.map((p) => ({ ...p, k: p.k + 100 }));
      // The signal integral cannot depend on the integration constant.
      expect(getArea(0, 3, shifted)).toBeCloseTo(getArea(0, 3, data)); // PR: 304.5 vs 4.5
    });
  });

  // ------------------------------------------------------------------ B3
  // integration.js:31 — getAbsoluteArea must use the raw signal `y` for the
  // baseline-subtracted area. The PR uses `k` (cumulative) instead.
  describe('B3 — getAbsoluteArea on data carrying both y and k', () => {
    const data = [
      { x: 1, y: 1, k: 1 },
      { x: 2, y: 2, k: 3 }, // peak in the raw signal y
      { x: 3, y: 1, k: 4 },
    ];
    it('computes the area from raw y (1.0), not from cumulative k (0.5)', () => {
      expect(getAbsoluteArea(0, 4, data)).toBeCloseTo(1.0); // PR returns 0.5
    });
  });

  // ------------------------------------------------------------------ B4
  // chem.js:157 — for an LC/MS feature carrying edited peaks, Convert2Peak
  // must return those stored peaks with the offset applied. The PR's new
  // early branch recomputes peaks from raw data and ignores both.
  describe('B4 — Convert2Peak honours stored LC/MS peaks and offset', () => {
    const feature = {
      operation: { layout: 'LC/MS' },
      data: [{ x: [10, 11, 12], y: [1, 5, 1] }],
      peaks: [{ x: 5, y: 100 }], // user-edited / stored peaks
    };
    const offset = 2;
    it('returns stored peaks shifted by offset', () => {
      expect(Convert2Peak(feature, 0, offset)).toEqual([{ x: 3, y: 100 }]);
      // PR ignores feature.peaks and offset → returns [{ x: 11, y: 5 }]
    });
  });

  // ------------------------------------------------------------------ B5
  // multi_focus.js:164 — the CV current-density factor double-divides by 100
  // for mm². Physically 100 mm² == 1 cm², so the factor must be identical.
  describe('B5 — CV current-density factor for mm² vs cm²', () => {
    const compute = (cvSt) =>
      MultiFocus.prototype.computeYTransformFactor.call(
        {}, LIST_LAYOUT.CYCLIC_VOLTAMMETRY, cvSt, { yUnit: 'A' },
      );
    it('treats 100 mm² the same as 1 cm²', () => {
      const fMm2 = compute({ useCurrentDensity: true, areaValue: 100, areaUnit: 'mm²' });
      const fCm2 = compute({ useCurrentDensity: true, areaValue: 1, areaUnit: 'cm²' });
      expect(fMm2).toBeCloseTo(fCm2); // PR: 0.01 vs 1 (100x off)
    });
  });

  // ------------------------------------------------------------------ B6
  // d3_line_rect/index.js:401 — componentDidMount guards the UV-Vis feature
  // with `if (uvvisViewFeature?.data?.[0])`, but componentDidUpdate destructures
  // `data[0]` unguarded. extractUvvisView can return a feature without usable
  // data, which then crashes the re-render.
  // (ViewerLineRect is not exported, so we reproduce the two access forms
  //  verbatim from the source against the feature shape extractUvvisView can return.)
  describe('B6 — UV-Vis viewer update-path data[0] access', () => {
    const featureWithoutData = {}; // a feature object lacking `data`
    const mountStyleGuard = () => {
      if (featureWithoutData?.data?.[0]) {            // componentDidMount form
        const { x, y } = featureWithoutData.data[0];
        return [x, y];
      }
      return 'guarded';
    };
    const updateStyleAccess = () => {
      const { data } = featureWithoutData;            // componentDidUpdate form
      const currentData = data[0];
      const { x, y } = currentData;
      return [x, y];
    };
    it('the update path must not throw where the mount path is safe', () => {
      expect(mountStyleGuard).not.toThrow();
      expect(updateStyleAccess).not.toThrow(); // PR: throws TypeError on data[0]
    });
  });

  // ------------------------------------------------------------------ B7
  // rect_focus.js:143 — drawBar reads tTrEndPts[0].y with no length guard.
  // Clearing the threshold makes convertThresEndPts return [] while the MS
  // bars are still present, so drawBar crashes.
  describe('B7 — drawBar with an empty threshold-endpoint list', () => {
    it('convertThresEndPts returns [] when the threshold is cleared (precondition)', () => {
      const feature = { maxY: 100, maxX: 10, minX: 0, data: [{ x: [1, 2], y: [3, 4] }] };
      expect(convertThresEndPts(feature, '')).toEqual([]); // cleared input
    });

    it('drawBar does not crash when tTrEndPts is empty but bars exist', () => {
      const rf = Object.create(RectFocus.prototype);
      rf.bars = {};                       // truthy → passes the `if (!this.bars)` guard
      rf.scales = { x: (v) => v, y: (v) => v }; // TfRescale reads focus.scales.{x,y}
      rf.updatePathCall = () => {};       // stub out the d3 path update
      rf.data = [{ x: 1, y: 2 }];         // bars present
      rf.tTrEndPts = [];                  // cleared threshold → empty endpoints
      expect(() => rf.drawBar()).not.toThrow(); // PR: throws on tTrEndPts[0].y
    });
  });
});
