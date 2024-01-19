import { rmFromNegList, rmFromPosList, clearAllPeaks } from "../../../actions/edit_peak";
import { EDITPEAK } from "../../../constants/action_type";

describe('Test redux action for edit peaks', () => {
  it('Remove from positive peaks list', () => {
    const peak = { x: 1, y: 2 }
    const { type, payload } = rmFromPosList(peak)
    expect(type).toEqual(EDITPEAK.RM_POSITIVE)
    expect(payload).toEqual(peak)
  })

  it('Remove from negative peaks list', () => {
    const peak = { x: 1, y: 2 }
    const { type, payload } = rmFromNegList(peak)
    expect(type).toEqual(EDITPEAK.RM_NEGATIVE)
    expect(payload).toEqual(peak)
  })

  it('Remove all peaks', () => {
    const curveIdx = 0
    const { type, payload } = clearAllPeaks(curveIdx)
    expect(type).toEqual(EDITPEAK.CLEAR_ALL)
    expect(payload).toEqual(curveIdx)
  })
})
