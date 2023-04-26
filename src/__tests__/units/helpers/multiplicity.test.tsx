import { getInterval, groupInterval } from "../../../helpers/multiplicity";

describe('Test helper for multiplicity', () => {
  describe('Get intervel from peak', () => {
    it('Do not have data', () => {
      const interval = getInterval([])
      expect(interval).toEqual([])
    })
  
    it('Get interval', () => {
      const peaks = [{x: 1, y: 1}, {x: 3, y: 3}, {x: 9, y: 9}]
      const expectedInterval = [2, 6]
      const interval = getInterval(peaks)
      expect(interval).toEqual(expectedInterval)
    })
  })

  describe('Get group of interval', () => {
    it('Do not have data', () => {
      const group = groupInterval([])
      expect(group).toEqual([])
    })

    it('Get group interval', () => {
      const arrayInterval = [[1,4], [2,6], [3,8]]
      const expectedGroup = [{c: [1,4], es: [[1,4]]}, {c: [2,6], es: [[2,6]]}, {c: [3,8], es: [[3,8]]}]
      const group = groupInterval(arrayInterval)
      expect(group).toEqual(expectedGroup)
    })
  })
})
