import {
  clearMpyAll, clickMpyOne, resetMpyOne, rmMpyPeakByPanel, selectMpyType, updateMpyJ
} from "../../../actions/multiplicity";
import { MULTIPLICITY } from "../../../constants/action_type";

describe('Test redux action for multiplicity', () => {
  const payloadToBeSent = 'Just a randomly payload'

  it('Click on one multiplicity', () => {
    const { type, payload } = clickMpyOne(payloadToBeSent)
    expect(type).toEqual(MULTIPLICITY.ONE_CLICK)
    expect(payload).toEqual(payloadToBeSent) 
  })

  it('Remove one multiplicity from panel', () => {
    const { type, payload } = rmMpyPeakByPanel(payloadToBeSent)
    expect(type).toEqual(MULTIPLICITY.PEAK_RM_BY_PANEL)
    expect(payload).toEqual(payloadToBeSent) 
  })

  it('Select type of multiplicity', () => {
    const { type, payload } = selectMpyType(payloadToBeSent)
    expect(type).toEqual(MULTIPLICITY.TYPE_SELECT)
    expect(payload).toEqual(payloadToBeSent) 
  })

  it('Clear all multiplicity', () => {
    const { type, payload } = clearMpyAll(payloadToBeSent)
    expect(type).toEqual(MULTIPLICITY.CLEAR_ALL)
    expect(payload).toEqual(payloadToBeSent) 
  })

  it('Reset one multiplicity', () => {
    const { type, payload } = resetMpyOne(payloadToBeSent)
    expect(type).toEqual(MULTIPLICITY.RESET_ONE)
    expect(payload).toEqual(payloadToBeSent) 
  })

  it('Update J of multiplicity', () => {
    const { type, payload } = updateMpyJ(payloadToBeSent)
    expect(type).toEqual(MULTIPLICITY.UPDATE_J)
    expect(payload).toEqual(payloadToBeSent) 
  })
})
