import {
  toggleIsAscend, toggleIsIntensity, updateDecimal, updateOperation,
} from "../../../actions/submit";
import { SUBMIT } from "../../../constants/action_type";

describe('Test redux action for submit', () => {
  it('Toggle is ascend', () => {
    const { type, payload } = toggleIsAscend()
    expect(type).toEqual(SUBMIT.TOGGLE_IS_ASCEND)
    expect(payload).toEqual(false)
  })

  it('Toggle is intensity', () => {
    const { type, payload } = toggleIsIntensity()
    expect(type).toEqual(SUBMIT.TOGGLE_IS_INTENSITY)
    expect(payload).toEqual(false)
  })

  const payloadToBeSent = 'Just a randomly payload'

  it('Update opreation', () => {
    const { type, payload } = updateOperation(payloadToBeSent)
    expect(type).toEqual(SUBMIT.UPDATE_OPERATION)
    expect(payload).toEqual(payloadToBeSent)
  })

  it('Update decimal', () => {
    const { type, payload } = updateDecimal(payloadToBeSent)
    expect(type).toEqual(SUBMIT.UPDATE_DECIMAL)
    expect(payload).toEqual(payloadToBeSent)
  })
})
