import { selectCurve, setAllCurves } from "../../actions/curve";
import { CURVE } from "../../constants/action_type";

describe('Test redux actions for curve', () => {
  describe('Test select curve', () => {
    it('Select curve but invalid', () => {
      const result = selectCurve(null)
      const { payload, type } = result
      expect(type).toEqual(CURVE.SELECT_WORKING_CURVE)
      expect(payload).toEqual(null)
    })

    it('Select curve at index', () => {
      const result = selectCurve(1)
      const { payload, type } = result
      expect(type).toEqual(CURVE.SELECT_WORKING_CURVE)
      expect(payload).toEqual(1)
    })
  })

  describe('Test set all curves', () => {
    it('Set curve but invalid', () => {
      const result = setAllCurves(null)
      const { payload, type } = result
      expect(type).toEqual(CURVE.SET_ALL_CURVES)
      expect(payload).toEqual(null)
    })

    it('Set all curves', () => {
      const listCurves = [{ curve: 1 }, { curve: 2 }]
      const result = setAllCurves(listCurves)
      const { payload, type } = result
      expect(type).toEqual(CURVE.SET_ALL_CURVES)
      expect(payload).toEqual(listCurves)
    })
  })
})
