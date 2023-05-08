import {
  addOthers, clearAll, rmOthersOne, toggleShow,
} from "../../../actions/jcamp";
import { JCAMP } from "../../../constants/action_type";

describe('Test redux action for jcamp', () => {
  const payloadToBeSent = 'Just a randomly payload'

  it('Add list of comparisons', () => {
    const { type, payload } = addOthers(payloadToBeSent)
    expect(type).toEqual(JCAMP.ADD_OTHERS)
    expect(payload).toEqual(payloadToBeSent)
  })

  it('Remove from comparison', () => {
    const { type, payload } = rmOthersOne(payloadToBeSent)
    expect(type).toEqual(JCAMP.RM_OTHERS_ONE)
    expect(payload).toEqual(payloadToBeSent)
  })

  it('Toggle to show', () => {
    const { type, payload } = toggleShow(true)
    expect(type).toEqual(JCAMP.TOGGLE_SHOW)
    expect(payload).toEqual(true)
  })

  it('Toggle to hide', () => {
    const { type, payload } = toggleShow(false)
    expect(type).toEqual(JCAMP.TOGGLE_SHOW)
    expect(payload).toEqual(false)
  })

  it('Clear list of comparisons', () => {
    const { type, payload } = clearAll(payloadToBeSent)
    expect(type).toEqual(JCAMP.CLEAR_ALL)
    expect(payload).toEqual(payloadToBeSent)
  })
})
