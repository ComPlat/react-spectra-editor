import { rmShiftPeak, setShiftRef } from "../../../actions/shift";
import { SHIFT } from "../../../constants/action_type";

describe('Test redux action for shifts', () => {
  const payloadToBeSent = 'Just a randomly payload'

  it('Set ref for shift', () => {
    const { type, payload } = setShiftRef(payloadToBeSent)
    expect(type).toEqual(SHIFT.SET_REF)
    expect(payload).toEqual(payloadToBeSent) 
  })

  it('Remove shift peak', () => {
    const { type, payload } = rmShiftPeak()
    expect(type).toEqual(SHIFT.RM_PEAK)
    expect(payload).toEqual(null) 
  })
})
