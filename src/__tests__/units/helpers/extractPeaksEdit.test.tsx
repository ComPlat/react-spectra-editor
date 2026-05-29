import {
  extractPeaksEdit,
  extractAreaUnderCurve,
  extractAutoPeaks,
  getLcmsMzPageData,
} from "../../../helpers/extractPeaksEdit";
import { LIST_LAYOUT } from "../../../constants/list_layout";
import { LIST_SHIFT_1H } from "../../../constants/list_shift";

describe('Test extract edited peaks and area under curve', () => {
  describe('Test extract edited peaks', () => {
    const editPeakSt = {
      peaks: { x: [1, 2], y: [1, 2] },
      selectedIdx: 0,
    }
    const feature = { data: [{ x: [1, 2, 3], y: [1, 2, 3] }], operation: { layout: '1H' }, maxY: 2, peakUp: true }
    const threshold = { value: 55 }
    const shiftSt = {
      shifts: [
        { ref: LIST_SHIFT_1H[1], peak: { x: 2, y: 2 } }
      ]
    }

    it('Extract with MS layout', () => {
      const peaks = extractPeaksEdit(feature, editPeakSt, threshold, shiftSt, LIST_LAYOUT.MS)
      const expectedPeaks = [{ x: 2, y: 2 }, { x: 3, y: 3 }]
      expect(peaks).toEqual(expectedPeaks)
    })

    it('Extract with non-MS layout', () => {
      const peaks = extractPeaksEdit(feature, editPeakSt, threshold, shiftSt, LIST_LAYOUT.H1)
      const expectedPeaks = [{ x: 2.04, y: 2 }, { x: 3.04, y: 3 }]
      expect(peaks).toEqual(expectedPeaks)
    })

    it('Return empty array for LC/MS layout', () => {
      const peaks = extractPeaksEdit(feature, editPeakSt, threshold, shiftSt, LIST_LAYOUT.LC_MS)
      expect(peaks).toEqual([])
    })
  })

  describe('Test extract auto peaks from feature', () => {
    const feature = { data: [{ x: [1, 2, 3], y: [1, 2, 3] }],  operation: { layout: '1H'}, maxY: 2, peakUp: true }
    const threshold = { value: 55 }
    const shiftSt = {
      shifts: [
        { ref: LIST_SHIFT_1H[1], peak: { x: 2, y: 2 } }
      ]
    }

    it('Extract with MS layout', () => {
      const peaks = extractAutoPeaks(feature, threshold, shiftSt, LIST_LAYOUT.MS)
      const expectedPeaks = [{x: 2, y: 2}, {x: 3, y: 3}]
      expect(peaks).toEqual(expectedPeaks)
    })

    it('Extract with non-MS layout', () => {
      const peaks = extractAutoPeaks(feature, threshold, shiftSt, LIST_LAYOUT.H1)
      const expectedPeaks = [{x: 2.04, y: 2}, {x: 3.04, y: 3}]
      expect(peaks).toEqual(expectedPeaks)
    })
  })

  describe('Test LCMS page extraction by retention time', () => {
    it('Get MS peaks by pageValues in single-page payload mode', () => {
      const hplcMsSt = {
        tic: {
          polarity: 'positive',
          currentPageValue: 7.2,
          positive: { data: { x: [0.1, 0.2, 0.3] } },
        },
        ms: {
          positive: {
            pageValues: [7.2],
            peaks: [[{ x: 101.1, y: 12 }]],
          },
        },
      }
      expect(getLcmsMzPageData(hplcMsSt as any)).toEqual([{ x: 101.1, y: 12 }])
    })
  })

  describe('Test extract AUC', () => {
    type IntegrationValue = { area: number }
    type Integration = { refArea: number, refFactor: number, stack: Array<IntegrationValue>}
    type IntegrationState = { integrations: Array<Integration>}
    const allIntegrationSt: IntegrationState[] = [
      { 
        integrations: [
          {
            stack: [],
            refArea: 1.0,
            refFactor: 1.0,
          },
        ],
      }
    ]
    const presentIntegrationSt = true
    it('Non-HPLC layout', () => {
      const auc = extractAreaUnderCurve(allIntegrationSt, presentIntegrationSt, LIST_LAYOUT.H1)
      expect(auc).toBeNull()
    })

    it('Get AUC value', () => {
      const auc = extractAreaUnderCurve(allIntegrationSt, presentIntegrationSt, LIST_LAYOUT.HPLC_UVVIS)
      expect(auc).not.toBeNull()
      expect(auc?.length).toEqual(1)
    })
  })
})
