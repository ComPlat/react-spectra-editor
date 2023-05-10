import {
  clickUiTarget,
  scrollUiWheel,
  selectUiSweep, setUiSweepType, setUiViewerType,
} from "../../../actions/ui";
import { UI } from "../../../constants/action_type";

describe('Test redux action for ui', () => {
  const payloadToBeSent = 'Just a randomly payload'

  it('Set type of ui viewer', () => {
    const { type, payload } = setUiViewerType(payloadToBeSent)
    expect(type).toEqual(UI.VIEWER.SET_TYPE)
    expect(payload).toEqual(payloadToBeSent)
  })

  it('Set sweep type of ui viewer', () => {
    const { type, payload } = setUiSweepType(payloadToBeSent)
    expect(type).toEqual(UI.SWEEP.SET_TYPE)
    expect(payload).toEqual(payloadToBeSent)
  })

  it('select sweep of ui viewer', () => {
    const { type, payload } = selectUiSweep(payloadToBeSent)
    expect(type).toEqual(UI.SWEEP.SELECT)
    expect(payload).toEqual(payloadToBeSent)
  })

  it('scroll ui view', () => {
    const { type, payload } = scrollUiWheel(payloadToBeSent)
    expect(type).toEqual(UI.WHEEL.SCROLL)
    expect(payload).toEqual(payloadToBeSent)
  })

  it('click on ui target', () => {
    const { type, payload } = clickUiTarget(payloadToBeSent)
    expect(type).toEqual(UI.CLICK_TARGET)
    expect(payload).toEqual(payloadToBeSent)
  })
})
