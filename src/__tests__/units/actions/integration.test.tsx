import {
  clearIntegrationAll, setIntegrationFkr, sweepIntegration,
} from "../../../actions/integration";
import { INTEGRATION } from "../../../constants/action_type";

describe('Test redux action for integrations', () => {
  const payloadToBeSent = 'Just a randomly payload'

  it('Sweep on integration', () => {
    const { type, payload } = sweepIntegration(payloadToBeSent)
    expect(type).toEqual(INTEGRATION.SWEEP)
    expect(payload).toEqual(payloadToBeSent)
  })

  it('Set integration factor', () => {
    const { type, payload } = setIntegrationFkr(payloadToBeSent)
    expect(type).toEqual(INTEGRATION.SET_FKR)
    expect(payload).toEqual(payloadToBeSent)
  })

  it('Clear all integration', () => {
    const { type, payload } = clearIntegrationAll(payloadToBeSent)
    expect(type).toEqual(INTEGRATION.CLEAR_ALL)
    expect(payload).toEqual(payloadToBeSent)
  })
})
