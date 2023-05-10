import { updateMetaPeaks } from "../../../actions/meta";
import { META } from "../../../constants/action_type";

describe('Test redux action for meta', () => {
  it('Update meta peaks', () => {
    const payloadToBeSent = 'Just a randomly payload'
    const { type, payload } = updateMetaPeaks(payloadToBeSent)
    expect(type).toEqual(META.UPDATE_PEAKS)
    expect(payload).toEqual(payloadToBeSent) 
  })
})
