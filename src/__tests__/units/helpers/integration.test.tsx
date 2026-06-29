import { calcArea, getAbsoluteArea, getArea } from "../../../helpers/integration";

describe('Test helper for integration', () => {
  describe('Test get area', () => {
    it('Do not have area', () => {
      const area = getArea(0, 1, [{x: 0, k: 0}, {x: 1, k: 0}])
      expect(area).toEqual(0.0)
    })

    it('Have area', () => {
      const area = getArea(0, 1, [{x: 0, k: 0}, {x: 1, k: 1}])
      expect(area).toEqual(1.0)
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

  // Review finding B2 (#232): NMR/CV integration data carries a cumulative
  // running integral `k` (from calcXYK). The integral over [xL,xU] is the
  // difference k(xU)-k(xL); getArea must NOT trapezoidally integrate `k` again.
  describe('getArea on cumulative-k (NMR/CV) data — review B2', () => {
    // x ramp, constant normalised signal => k increases by 1 each sample.
    const data = [
      { x: 0, y: 1, k: 0 },
      { x: 1, y: 1, k: 1 },
      { x: 2, y: 1, k: 2 },
      { x: 3, y: 1, k: 3 },
    ]

    it('equals the cumulative difference k(xU)-k(xL)', () => {
      expect(getArea(0, 3, data)).toBeCloseTo(3) // double-integrating k gives 4.5
    })

    it('is invariant to a constant baseline offset of the cumulative curve', () => {
      const shifted = data.map((p) => ({ ...p, k: p.k + 100 }))
      // The signal integral cannot depend on the integration constant of k.
      expect(getArea(0, 3, shifted)).toBeCloseTo(getArea(0, 3, data))
    })
  })

  // Review finding B3 (#232): getAbsoluteArea must use the raw signal `y`
  // (baseline-subtracted), not the cumulative `k`, when data carries both.
  describe('getAbsoluteArea on data carrying both y and k — review B3', () => {
    const data = [
      { x: 1, y: 1, k: 1 },
      { x: 2, y: 2, k: 3 }, // peak in the raw signal y
      { x: 3, y: 1, k: 4 },
    ]
    it('computes the area from raw y (1.0), not from cumulative k (0.5)', () => {
      expect(getAbsoluteArea(0, 4, data)).toBeCloseTo(1.0)
    })
  })
})