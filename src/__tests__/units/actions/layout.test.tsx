import { updateLayout } from "../../../actions/layout";
import { LAYOUT } from "../../../constants/action_type";

describe('Test redux action for layout', () => {
  it('Update new layout', () => {
    const layout = '1H'
    const { type, payload } = updateLayout(layout)
    expect(type).toEqual(LAYOUT.UPDATE)
    expect(payload).toEqual(layout)
  })
})
