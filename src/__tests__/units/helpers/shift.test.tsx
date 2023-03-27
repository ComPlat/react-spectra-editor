import { FromManualToOffset } from "../../../helpers/shift";
import { LIST_SHIFT_1H } from "../../../constants/list_shift";

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
})
