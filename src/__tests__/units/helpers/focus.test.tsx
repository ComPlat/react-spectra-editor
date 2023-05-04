import { itgIdTag, mpyIdTag } from "../../../helpers/focus";

describe('Test focus helper', () => {
  it('Get id tag of integration',  () => {
    const data = { xL: 1, xU: 10 }
    const idTag = itgIdTag(data)
    expect(idTag).toEqual('1000-10000')
  })

  it('Get id tag of multiplicity',  () => {
    const data = { xExtent: { xL: 1, xU: 10 } }
    const idTag = mpyIdTag(data)
    expect(idTag).toEqual('1000-10000')
  })
})
