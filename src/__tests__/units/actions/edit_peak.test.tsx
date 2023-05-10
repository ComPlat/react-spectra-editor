import { rmFromNegList, rmFromPosList } from "../../../actions/edit_peak";
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
})
