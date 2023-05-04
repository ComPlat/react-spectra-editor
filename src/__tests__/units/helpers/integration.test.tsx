import { calcArea, getAbsoluteArea, getArea } from "../../../helpers/integration";

describe('Test helper for integration', () => {
  describe('Test get area', () => {
    it('Do not have area', () => {
      const area = getArea(0, 1, [{k: 1}, {k: 1}])
      expect(area).toEqual(0)
    })

    it('Have area', () => {
      const area = getArea(0, 1, [{k: 2}, {k: 1}])
      expect(area).toEqual(1)
    })
  })

  describe('Test get absolute area', () => {
    it('Do not have area', () => {
      const area = getAbsoluteArea(0, 1, [{k: 1}, {k: 1}])
      expect(area).toEqual(0)
    })

    it('Have area', () => {
      const area = getAbsoluteArea(0, 3, [{x: 1.5, y: 1}, {x: 2, y: 2}, {x: 2.5, y: 2}])
      expect(area).toEqual(0.5)
    })
  })

  describe('Test calculate area', () => {
    it('Do not ignore ref', () => {
      const data = { area: 0.5 }
      const refFaktor = 0.5
      const refArea = 1.5
      const area = calcArea(data, refArea, refFaktor)
      expect(area).toEqual('0.17')
    })

    it('Ignore ref', () => {
      const data = { absoluteArea: 0.515469 }
      const refFaktor = 0.5
      const refArea = 1.5
      const area = calcArea(data, refArea, refFaktor, true)
      expect(area).toEqual('0.52')
    })
  })
})