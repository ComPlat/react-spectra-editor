import {
  clearForecastStatus, initForecastStatus, setIrStatus, setNmrStatus,
} from "../../../actions/forecast";
import { FORECAST } from "../../../constants/action_type";

describe('Test redux action for forecast', () => {
  const payloadToBeSent = 'Just a randomly payload'

  it('Init forecase status', () => {
    const { type, payload } = initForecastStatus(payloadToBeSent)
    expect(type).toEqual(FORECAST.INIT_STATUS)
    expect(payload).toEqual(payloadToBeSent)
  })

  it('Set IR status', () => {
    const { type, payload } = setIrStatus(payloadToBeSent)
    expect(type).toEqual(FORECAST.SET_IR_STATUS)
    expect(payload).toEqual(payloadToBeSent)
  })

  it('Set NMR status', () => {
    const { type, payload } = setNmrStatus(payloadToBeSent)
    expect(type).toEqual(FORECAST.SET_NMR_STATUS)
    expect(payload).toEqual(payloadToBeSent)
  })

  it('Clear forecase status', () => {
    const { type, payload } = clearForecastStatus(payloadToBeSent)
    expect(type).toEqual(FORECAST.CLEAR_STATUS)
    expect(payload).toEqual(payloadToBeSent)
  })
})
