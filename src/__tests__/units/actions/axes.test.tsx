import { updateXAxis, updateYAxis } from "../../../actions/axes";
import { AXES } from "../../../constants/action_type";

describe('Test redux actions for axes', () => {
  it('Test set x-axis but invalid', () => {
    const { payload, type } = updateXAxis(null)
    expect(type).toEqual(AXES.UPDATE_X_AXIS)
    expect(payload).toEqual(null)
  })

  it('Test set x-axis', () => {
    const updateValue = { value: 'x-value', curveIndex: 0 }
    const { payload, type } = updateXAxis(updateValue)
    expect(type).toEqual(AXES.UPDATE_X_AXIS)
    expect(payload).toEqual(updateValue)
  })

  it('Test set y-axis', () => {
    const updateValue = { value: 'x-value', curveIndex: 0 }
    const { payload, type } = updateYAxis(updateValue)
    expect(type).toEqual(AXES.UPDATE_Y_AXIS)
    expect(payload).toEqual(updateValue)
  })
})
