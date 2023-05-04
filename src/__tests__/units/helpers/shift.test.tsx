import { CalcResidualX, FromManualToOffset, RealPts, VirtalPts } from "../../../helpers/shift";
import { LIST_SHIFT_1H, LIST_SHIFT_13C } from "../../../constants/list_shift";

describe('Test helper for shift', () => {
  describe('Test from manual to offset', () => {
    it('Do not have peaks', () => {
      const offset = FromManualToOffset(null, null)
      expect(offset).toEqual(0)
    })

    it('Have peaks but ref is none', () => {
      const offset = FromManualToOffset(LIST_SHIFT_1H[0], {x: 1.5, y: 2})
      expect(offset).toEqual(0)
    })

    it('Get offset', () => {
      const offset = FromManualToOffset(LIST_SHIFT_1H[1], {x: 1.5, y: 2})
      expect(offset).toEqual(-0.54)
    })
  })

  describe('Test Calculate residual X', () => {
    it('nextApex is false', () => {
      const resX = CalcResidualX("", "", false)
      expect(resX).toEqual(0.0)
    })

    it('origin ref is none', () => {
      const origRef = LIST_SHIFT_13C[0]
      const resX = CalcResidualX(origRef, "", true)
      expect(resX).toEqual(0.0)
    })

    it('origin ref is not none but do not have origApex', () => {
      const origRef = LIST_SHIFT_13C[1]
      const resX = CalcResidualX(origRef, "", true)
      expect(resX).toEqual(0.0)
    })

    it('calculate residual X', () => {
      const origRef = LIST_SHIFT_13C[1]
      const origApex = {x: 2.0}
      const resX = CalcResidualX(origRef, origApex, true)
      expect(resX).toEqual(18.0)
    })
  })

  describe('Test get virtual points', () => {
    it('No points', () => {
      const virtualPoints = VirtalPts([], 18.0)
      expect(virtualPoints).toEqual([])
    })

    it('Get virtual point', () => {
      const points = [
        { x: 1, y: 2 },
        { x: 1.5, y: 2.5 }
      ]
      const expected = [
        { x: 19.5, y: 2 },
        { x: 20, y: 2.5 }
      ]
      const virtualPoints = VirtalPts(points, 18.5)
      expect(virtualPoints).toEqual(expected)
    })
  })

  describe('Test get real points', () => {
    it('No points', () => {
      const virtualPoints = RealPts([], 18.0)
      expect(virtualPoints).toEqual([])
    })

    it('Get real point', () => {
      const points = [
        { x: 1, y: 2 },
        { x: 1.5, y: 2.5 }
      ]
      const expected = [
        { x: -17.5, y: 2 },
        { x: -17.0, y: 2.5 }
      ]
      const virtualPoints = RealPts(points, 18.5)
      expect(virtualPoints).toEqual(expected)
    })
  })
})
