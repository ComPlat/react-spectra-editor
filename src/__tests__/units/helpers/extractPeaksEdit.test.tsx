import { extractPeaksEdit, extractAreaUnderCurve } from "../../../helpers/extractPeaksEdit";
import { LIST_LAYOUT } from "../../../constants/list_layout";
import { LIST_SHIFT_1H } from "../../../constants/list_shift";

describe('Test extract edited peaks and area under curve', () => {
  describe('Test extract edited peaks', () => {
    const editPeakSt = {
      peaks: { x: [1, 2], y: [1, 2]},
      selectedIdx: 0
    }
    const feature = { data: [{ x: [1, 2, 3], y: [1, 2, 3] }],  operation: { layout: '1H'}, maxY: 2, peakUp: true }
    const threshold = { value: 55 }
    const shiftSt = {
      shifts: [
        { ref: LIST_SHIFT_1H[1], peak: { x: 2, y: 2 } }
      ]
    }

    it('Extract with MS layout', () => {
      const peaks = extractPeaksEdit(feature, editPeakSt, threshold, shiftSt, LIST_LAYOUT.MS)
      const expectedPeaks = [{x: 2, y: 2}, {x: 3, y: 3}]
      expect(peaks).toEqual(expectedPeaks)
    })

    it('Extract with non-MS layout', () => {
      const peaks = extractPeaksEdit(feature, editPeakSt, threshold, shiftSt, LIST_LAYOUT.H1)
      const expectedPeaks = [{x: 2.04, y: 2}, {x: 3.04, y: 3}]
      expect(peaks).toEqual(expectedPeaks)
    })
  })

  describe('Test extract AUC', () => {
    type Integration = { area: number }
    type IntegrationState = { refArea: number, refFactor: number, stack: Array<Integration>}
    const allIntegrationSt: IntegrationState[] = [
      { 
        refArea: 1.0,
        refFactor: 1.0,
        stack: [
          //TODO: need to check
          // { area: 5 },
          // { area: 6 }
        ]
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
