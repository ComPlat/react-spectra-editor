import {
  resetAll, resetInitCommon, resetInitCommonWithIntergation, resetInitMs, resetInitNmr,
} from "../../../actions/manager";
import { MANAGER } from "../../../constants/action_type";

describe('Test redux action for manager', () => {
  const payloadToBeSent = 'Just a randomly payload'

  it('Reset all', () => {
    const { type, payload } = resetAll(payloadToBeSent)
    expect(type).toEqual(MANAGER.RESETALL)
    expect(payload).toEqual(payloadToBeSent)
  })

  it('Reset init common', () => {
    const { type, payload } = resetInitCommon(payloadToBeSent)
    expect(type).toEqual(MANAGER.RESET_INIT_COMMON)
    expect(payload).toEqual(payloadToBeSent)
  })

  it('Reset init NMR', () => {
    const { type, payload } = resetInitNmr(payloadToBeSent)
    expect(type).toEqual(MANAGER.RESET_INIT_NMR)
    expect(payload).toEqual(payloadToBeSent)
  })

  it('Reset init MS', () => {
    const { type, payload } = resetInitMs(payloadToBeSent)
    expect(type).toEqual(MANAGER.RESET_INIT_MS)
    expect(payload).toEqual(payloadToBeSent)
  })

  it('Reset init common with integration', () => {
    const { type, payload } = resetInitCommonWithIntergation(payloadToBeSent)
    expect(type).toEqual(MANAGER.RESET_INIT_COMMON_WITH_INTERGATION)
    expect(payload).toEqual(payloadToBeSent)
  })
})
