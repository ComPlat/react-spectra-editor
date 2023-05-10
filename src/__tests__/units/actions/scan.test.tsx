import {
  resetScanTarget, setScanTarget, toggleScanIsAuto,
} from "../../../actions/scan";
import { SCAN } from "../../../constants/action_type";

describe('Test redux action for scan', () => {
  const payloadToBeSent = 'Just a randomly payload'

  it('Set target of scan', () => {
    const { type, payload } = setScanTarget(payloadToBeSent)
    expect(type).toEqual(SCAN.SET_TARGET)
    expect(payload).toEqual(payloadToBeSent) 
  })

  it('Reset target of scan', () => {
    const { type, payload } = resetScanTarget()
    expect(type).toEqual(SCAN.SET_TARGET)
    expect(payload).toEqual(false) 
  })

  it('Toggle auto for scan', () => {
    const { type, payload } = toggleScanIsAuto(payloadToBeSent)
    expect(type).toEqual(SCAN.TOGGLE_ISAUTO)
    expect(payload).toEqual(payloadToBeSent) 
  })
})
