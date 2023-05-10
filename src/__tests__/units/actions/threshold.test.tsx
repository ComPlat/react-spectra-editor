import {
  resetThresholdValue, toggleThresholdIsEdit,
  updateLowerThresholdValue, updateThresholdValue, updateUpperThresholdValue,
} from "../../../actions/threshold";
import { THRESHOLD } from "../../../constants/action_type";

describe('Test redux action for threshold', () => {
  const threshold = 2.0

  it('Update threshold value', () => {
    const { type, payload } = updateThresholdValue(threshold)
    expect(type).toEqual(THRESHOLD.UPDATE_VALUE)
    expect(payload).toEqual(threshold)
  })

  it('Reset threshold value', () => {
    const { type, payload } = resetThresholdValue()
    expect(type).toEqual(THRESHOLD.RESET_VALUE)
    expect(payload).toEqual(false)
  })

  it('Toggle threshold to enable edit', () => {
    const { type, payload } = toggleThresholdIsEdit(true)
    expect(type).toEqual(THRESHOLD.TOGGLE_ISEDIT)
    expect(payload).toEqual(true)
  })

  it('Toggle threshold to disable edit', () => {
    const { type, payload } = toggleThresholdIsEdit(false)
    expect(type).toEqual(THRESHOLD.TOGGLE_ISEDIT)
    expect(payload).toEqual(false)
  })

  it('Update upper threshold value', () => {
    const { type, payload } = updateUpperThresholdValue(threshold)
    expect(type).toEqual(THRESHOLD.UPDATE_UPPER_VALUE)
    expect(payload).toEqual(threshold)
  })

  it('Update lower threshold value', () => {
    const { type, payload } = updateLowerThresholdValue(threshold)
    expect(type).toEqual(THRESHOLD.UPDATE_LOWER_VALUE)
    expect(payload).toEqual(threshold)
  })
})
