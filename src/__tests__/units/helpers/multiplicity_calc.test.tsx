import { calcMpyCenter, calcMpyCoup, calcMpyJStr } from "../../../helpers/multiplicity_calc";

describe('Test calculate multiplicity', () => {
  type PointData = {x: number, y: number}
  let ps: PointData[] = []
  beforeEach(() => {
    ps = [{x: 1, y: 1}, {x: 2, y: 2}]
  })

  describe('Test calculate center of multiplicity', () => {
    it('Type is m without shift', () => {
      const expectedCenter = 1.5
      const center = calcMpyCenter(ps, 0, 'm')
      expect(center).toEqual(expectedCenter)
    })

    it('Type is m with shift', () => {
      const expectedCenter = 0.5
      const shift = 1
      const center = calcMpyCenter(ps, shift, 'm')
      expect(center).toEqual(expectedCenter)
    })

    it('Type is not m without shift and is even number', () => {
      const expectedCenter = 1.5
      const center = calcMpyCenter(ps, 0, 't')
      expect(center).toEqual(expectedCenter)
    })

    it('Type is not m with shift and is even number', () => {
      const expectedCenter = 0.5
      const shift = 1
      const center = calcMpyCenter(ps, shift, 't')
      expect(center).toEqual(expectedCenter)
    })

    it('Type is not m without shift and is odd number', () => {
      ps = [{x: 1, y: 1}, {x: 2, y: 2}, {x: 3, y: 3}]
      const expectedCenter = 2
      const center = calcMpyCenter(ps, 0, 't')
      expect(center).toEqual(expectedCenter)
    })

    it('Type is not m with shift and is odd number', () => {
      ps = [{x: 1, y: 1}, {x: 2, y: 2}, {x: 3, y: 3}]
      const expectedCenter = 1.5
      const shift = 0.5
      const center = calcMpyCenter(ps, shift, 't')
      expect(center).toEqual(expectedCenter)
    })
  })

  describe('Test get multiplicity j string', () => {
    it('js value is not an array', () => {
      const jStr = calcMpyJStr(null)
      expect(jStr).toEqual(' - ')
    })

    it('js value is an empty array', () => {
      const jStr = calcMpyJStr([])
      expect(jStr).toEqual(' - ')
    })

    it('Get j string', () => {
      const js = [1.11111, 2.22222222, 3.33333333]
      const expectedJstr = '1.111, 2.222, 3.333'
      const jStr = calcMpyJStr(js)
      expect(jStr).toEqual(expectedJstr)
    })
  })

  describe('Test calculate coup of multiplicty', () => {
    //TODO: need more tests
    it('Do not have any peak', () => {
      const coup = calcMpyCoup([], null)
      const expectedCoup = { type: '', js: '' }
      expect(coup).toEqual(expectedCoup)
    })
  })
})