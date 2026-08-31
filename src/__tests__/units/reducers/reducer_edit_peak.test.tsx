import undoableEditPeakReducer from "../../../reducers/reducer_edit_peak";
import { EDITPEAK, MANAGER } from "../../../constants/action_type";
import { editPeakReducer } from "../../../reducers/reducer_edit_peak";

describe('Test redux reducer for edit peak', () => {
  interface PeaksState {
    selectedIdx: number,
    peaks: Object[]
  }

  interface PeaksAction {
    type: string
    payload: any
  }

  let peaksState: PeaksState
  let action: PeaksAction

  beforeEach(() => {
    peaksState = { peaks: [], selectedIdx: 0 }
    action = { type: "", payload: null }
  })

  it('Get default state', () => {
    const newState = undoableEditPeakReducer(peaksState, action)
    expect(newState.present).toEqual(peaksState)
  })

  it('Add new peak to positive peaks', () => {
    action.type = EDITPEAK.ADD_POSITIVE
    action.payload = { dataToAdd: {x: 1, y: 2}, curveIdx: 0 }

    const newState = editPeakReducer(peaksState, action)
    const expectedValue = [action.payload.dataToAdd]
    expect(newState.peaks[0].pos).toEqual(expectedValue)
  })

  it('Add new peak to negative peaks', () => {
    action.type = EDITPEAK.ADD_NEGATIVE
    action.payload = { dataToAdd: {x: 1, y: 2}, curveIdx: 0 }

    const newState = editPeakReducer(peaksState, action)
    const expectedValue = [action.payload.dataToAdd]
    expect(newState.peaks[0].neg).toEqual(expectedValue)
  })

  it('Remove a peak from positive peaks', () => {
    action.type = EDITPEAK.RM_POSITIVE
    action.payload = {x: 1, y: 2}

    peaksState = { peaks: [{pos: [{x: 1, y: 2}, {x: 3, y: 4}]}], selectedIdx: 0 }

    const newState = editPeakReducer(peaksState, action)
    const expectedValue = [{x: 3, y: 4}]
    expect(newState.peaks[0].pos).toEqual(expectedValue)
  })

  it('Remove a peak from negative peaks', () => {
    action.type = EDITPEAK.RM_NEGATIVE
    action.payload = {x: 1, y: 2}

    peaksState = { peaks: [{neg: [{x: 1, y: 2}, {x: 3, y: 4}]}], selectedIdx: 0 }

    const newState = editPeakReducer(peaksState, action)
    const expectedValue = [{x: 3, y: 4}]
    expect(newState.peaks[0].neg).toEqual(expectedValue)
  })

  it('Reset to default value', () => {
    action.type = MANAGER.RESETALL
    const expectedValue = {peaks: [{neg: [], pos: [], prevOffset: 0}], selectedIdx: 0}
    const newState = editPeakReducer(peaksState, action)
    expect(newState).toEqual(expectedValue)
  })

  it('Clear all peaks', () => {
    action.type = EDITPEAK.CLEAR_ALL
    action.payload = { curveIdx: 0, dataPeaks: [{x: 5, y: 6}] }
    peaksState = { peaks: [{pos: [{x: 1, y: 2}, {x: 3, y: 4}]}], selectedIdx: 0 }
    const expectedValue = {peaks: [{neg: [{x: 1, y: 2}, {x: 3, y: 4}, {x: 5, y: 6}], pos: []}], selectedIdx: 0}
    const newState = editPeakReducer(peaksState, action)
    expect(newState).toEqual(expectedValue)
  })

  it('Clear all peaks moves selectedIdx to the cleared curve, like the other peak mutators', () => {
    action.type = EDITPEAK.CLEAR_ALL
    action.payload = { curveIdx: 1, dataPeaks: [] }
    peaksState = {
      peaks: [{pos: [], neg: []}, {pos: [{x: 1, y: 2}], neg: []}],
      selectedIdx: 0,
    }
    const newState = editPeakReducer(peaksState, action)
    expect(newState.selectedIdx).toEqual(1)
    expect(newState.peaks[1]).toEqual({pos: [], neg: [{x: 1, y: 2}]})
  })

  it('Clear all peaks does not throw when peaks[curveIdx] does not exist yet', () => {
    action.type = EDITPEAK.CLEAR_ALL
    action.payload = { curveIdx: 2, dataPeaks: [{x: 5, y: 6}] }
    peaksState = { peaks: [{pos: [], neg: []}], selectedIdx: 0 }
    const newState = editPeakReducer(peaksState, action)
    expect(newState.selectedIdx).toEqual(2)
    expect(newState.peaks[2]).toEqual({prevOffset: 0, pos: [], neg: [{x: 5, y: 6}]})
  })
})
