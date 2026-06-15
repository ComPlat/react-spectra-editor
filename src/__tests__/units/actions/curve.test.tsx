import {
  selectCurve, setAllCurves, toggleShowAllCurves,
} from "../../../actions/curve";
import { CURVE } from "../../../constants/action_type";

describe('Test redux actions for curve', () => {
  describe('Test select curve', () => {
    it('Select curve but invalid', () => {
      const { payload, type } = selectCurve(null)
      expect(type).toEqual(CURVE.SELECT_WORKING_CURVE)
      expect(payload).toEqual(null)
    })

    it('Select curve at index', () => {
      const index = 1
      const { payload, type } = selectCurve(index)
      expect(type).toEqual(CURVE.SELECT_WORKING_CURVE)
      expect(payload).toEqual(index)
    })
  })

  describe('Test set all curves', () => {
    it('Set curve but invalid', () => {
      const { payload, type } = setAllCurves(null)
      expect(type).toEqual(CURVE.SET_ALL_CURVES)
      expect(payload).toEqual(null)
    })

    it('Set all curves', () => {
      const listCurves = [{ curve: 1 }, { curve: 2 }]
      const { payload, type } = setAllCurves(listCurves)
      expect(type).toEqual(CURVE.SET_ALL_CURVES)
      expect(payload).toEqual(listCurves)
    })

    it('Set all curves with optional meta (LC-MS hints)', () => {
      const listCurves = [{ curve: 1 }]
      const meta = { idDt: '42', lcmsUvvisWavelength: 254 }
      const action = setAllCurves(listCurves, meta)
      expect(action.type).toEqual(CURVE.SET_ALL_CURVES)
      expect(action.payload).toEqual(listCurves)
      expect(action.meta).toEqual(meta)
    })
  })

  describe('Test should display all curves', () => {
    it('Set should display all curves', () => {
      const { payload, type } = toggleShowAllCurves(true)
      expect(type).toEqual(CURVE.SET_SHOULD_SHOW_ALL_CURVES)
      expect(payload).toEqual(true)
    })

    it('Disable display all curves', () => {
      const { payload, type } = toggleShowAllCurves(false)
      expect(type).toEqual(CURVE.SET_SHOULD_SHOW_ALL_CURVES)
      expect(payload).toEqual(false)
    })
  })
})
