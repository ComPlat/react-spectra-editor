import { LIST_LAYOUT } from "../../../constants/list_layout";
import { extractParams } from "../../../helpers/extractParams";

describe('Test extract paramaters helper', () => {
  describe('Extract params for MS layout', () => {
    //TODO: Need more implementations
    const entity = { 
      layout: LIST_LAYOUT.MS,
      features: {
        editPeak: []
      },
      spectra: [{
        data: []
      }]
    }
    const thresholdState = {}
    const scanState = {
      target: 1,
      isAuto: true
    }

    it('Extract MS params succeed', () => {
      const extractedData = extractParams(entity, thresholdState, scanState)
      expect(extractedData).not.toBeNull()
    })
  })
})