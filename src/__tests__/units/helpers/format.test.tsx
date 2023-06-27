import Format from "../../../helpers/format";
import { LIST_LAYOUT } from "../../../constants/list_layout";
import { LIST_SHIFT_1H } from "../../../constants/list_shift";

describe('Test format helper', () => {
  describe('Format peaks', () => {
    describe('Test toPeakStr', () => {
      it('Get string of empty peak list', () => {
        const peaks: any[] = []
        const expectedString = ''
        const peaksStr = Format.toPeakStr(peaks)
        expect(peaksStr).toEqual(expectedString)
      })

      it('Get string of peaks', () => {
        const peaks = [{x: 1, y:1}, {x: 2, y:2}]
        const expectedString = '1,1#2,2'
        const peaksStr = Format.toPeakStr(peaks)
        expect(peaksStr).toEqual(expectedString)
      })
    })

    describe('Test remove shift data from peaks', () => {
      const peaks = [{x: 1.04, y: 1}, {x: 2.04, y: 2}]
      const shift = { shifts: [{ ref: LIST_SHIFT_1H[1], peak: { x: 2, y: 2 } }] }

      it('Remove at default index', () => {
        const clearedPeaks = Format.rmShiftFromPeaks(peaks, shift)
        const expectedPeaks = [{x: 1.04, y: 1}]
        expect(clearedPeaks).toEqual(expectedPeaks)
      })

      it('Remove at defined index', () => {
        const clearedPeaks = Format.rmShiftFromPeaks(peaks, shift, 1)
        expect(clearedPeaks).toEqual(peaks)
      })
    })

    describe('Test format peak as string', () => {
      interface ParamForPeaks {
        peaks: any, layout: string, decimal: number, shift: any, isAscend: boolean,
        isIntensity: boolean, boundary: any,
        integration: any, atIndex: number
      }

      let params: ParamForPeaks
      beforeEach(() => {
        params = {
          peaks: [{x: 1, y: 1}, {x: 2, y: 2}], 
          layout: LIST_LAYOUT.H1,
          decimal: 1,
          shift: { shifts: [{ ref: LIST_SHIFT_1H[1], peak: { x: 2, y: 2 } }] },
          isAscend: false,
          isIntensity: false, boundary: {},
          integration: null, atIndex: 0
        }
      })

      describe('MS layout', () => {
        it('is ascend', () => {
          params.layout = LIST_LAYOUT.MS
          const body = Format.formatedMS(params.peaks, 2, 1, true)
          expect(body).toEqual('1.0 (50), 2.0 (100)')
        })

        it('is descend', () => {
          params.layout = LIST_LAYOUT.MS
          const body = Format.formatedMS(params.peaks, 2, 1, false)
          expect(body).toEqual('2.0 (100), 1.0 (50)')
        })
      })

      describe('Is one of EM layouts', () => {
        it('is ascend', () => {
          const body = Format.formatedEm(params.peaks, 2, 1, true)
          expect(body).toEqual('1.0, 2.0')
        })

        it('is descend', () => {
          params.layout = LIST_LAYOUT.MS
          const body = Format.formatedEm(params.peaks, 2, 1, false)
          expect(body).toEqual('2.0, 1.0')
        })
      })
      
    })

    describe('Test get peaks body as quill object editor', () => {
      interface ParamForPeaks {
        peaks: any, layout: string, decimal: number, shift: any, isAscend: boolean,
        isIntensity: boolean, boundary: any,
        integration: any, atIndex: number
      }
      let params: ParamForPeaks
      beforeEach(() => {
        params = {
          peaks: [{x: 1, y: 1}, {x: 2, y: 2}], 
          layout: LIST_LAYOUT.H1,
          decimal: 1,
          shift: { shifts: [{ ref: LIST_SHIFT_1H[1], peak: { x: 2, y: 2 } }] },
          isAscend: false,
          isIntensity: false, boundary: {},
          integration: null, atIndex: 0
        }
      })

      it('Get peaks for MS layout', () => {
        params.layout = LIST_LAYOUT.MS
        const body = Format.peaksBody(params)
        expect(body).toEqual('2.0 (100), 1.0 (50)')
      })

      it('Get peaks for IR layout', () => {
        params.layout = LIST_LAYOUT.IR
        const body = Format.peaksBody(params)
        expect(body).toEqual('2.0, 1.0')
      })

      it('Get peaks for XRD layout', () => {
        params.layout = LIST_LAYOUT.XRD
        const body = Format.peaksBody(params)
        expect(body).toEqual('2.0, 1.0')
      })

      it('Get peaks for UVVIS layout', () => {
        params.layout = LIST_LAYOUT.UVVIS
        const body = Format.peaksBody(params)
        expect(body).toEqual('2.0, 1.0')
      })

      it('Get peaks for HPLC layout', () => {
        params.layout = LIST_LAYOUT.HPLC_UVVIS
        const body = Format.peaksBody(params)
        expect(body).toEqual('2.0 (2.00), 1.0 (1.00)')
      })

      it('Get peaks for Emission layout', () => {
        params.layout = LIST_LAYOUT.EMISSIONS
        const body = Format.peaksBody(params)
        expect(body).toEqual('2.0 nm (2.00 a.u.), 1.0 nm (1.00 a.u.)')
      })

    })

    describe('Test get peak wrapper string', () => {
      const shift = {
        shifts: [{ref: LIST_SHIFT_1H[1]}]
      }
      it('Wrapper from plain', () => {
        const wrapper = Format.peaksWrapper(LIST_LAYOUT.PLAIN, shift, 0)
        expect(wrapper).toEqual({"head": "", "tail": ""})
      })

      it('Wrapper from specific layout', () => {
        const wrapper = Format.peaksWrapper(LIST_LAYOUT.H1, shift, 0)
        const expectedWrapper = {head: '1H (Actic acid-d4) = ', tail: '.'}
        expect(wrapper).toEqual(expectedWrapper)
      })
    })
  })

  describe('Get data from entity', () => {
    it('Cannot build data from invalid entity', () => {
      const data = Format.buildData(null)
      const expectedData = { isExist: false }
      expect(data).toEqual(expectedData)
    })

    it('Build data with x, y unit values', () => {
      const entity = {
        spectrum: { xUnit: 'This is x unit', yUnit: 'This is y unit'}
      }
      const data = Format.buildData(entity)
      const expectedData = {
        entity,
        xLabel: 'X (This is x unit)',
        yLabel: 'Y (This is y unit)',
        isExist: true
      }
      expect(data).toEqual(expectedData)
    })

    it('Build data without x, y unit values', () => {
      const entity = {
        spectrum: null
      }
      const data = Format.buildData(entity)
      const expectedData = {
        entity,
        xLabel: '',
        yLabel: '',
        isExist: true
      }
      expect(data).toEqual(expectedData)
    })
  })

  describe('Get digit number of spectra based on layout', () => {
    it('Layout digit 0', () => {
      const listLayout = [LIST_LAYOUT.IR, LIST_LAYOUT.RAMAN, LIST_LAYOUT.UVVIS, 
        LIST_LAYOUT.HPLC_UVVIS, LIST_LAYOUT.TGA, LIST_LAYOUT.XRD, 
        LIST_LAYOUT.CYCLIC_VOLTAMMETRY, LIST_LAYOUT.CDS, LIST_LAYOUT.SEC, LIST_LAYOUT.MS
      ];

      listLayout.forEach(layout => {
        const digit = Format.spectraDigit(layout)
        expect(digit).toEqual(0)
      })
    })

    it('Layout digit 1', () => {
      const listLayout = [LIST_LAYOUT.C13];

      listLayout.forEach(layout => {
        const digit = Format.spectraDigit(layout)
        expect(digit).toEqual(1)
      })
    })

    it('Layout digit 2', () => {
      const listLayout = [LIST_LAYOUT.H1, LIST_LAYOUT.F19, LIST_LAYOUT.P31, LIST_LAYOUT.N15, LIST_LAYOUT.Si29, LIST_LAYOUT.PLAIN];

      listLayout.forEach(layout => {
        const digit = Format.spectraDigit(layout)
        expect(digit).toEqual(2)
      })
    })
  })

  describe('Test format ref', () => {
    describe('Test remove ref', () => {
      const peaks = [{x: 1, y: 1}, {x: 2.04, y: 2}]
      it('Do not have shift information', () => {
        const removedPeaks = Format.rmRef(peaks, null)
        expect(removedPeaks).toEqual(peaks)
      })

      it('Remove ref peaks with ref data', () => {
        const shift = { shifts: [{ ref: LIST_SHIFT_1H[1]}] }
        const removedPeaks = Format.rmRef(peaks, shift)
        expect(removedPeaks).toEqual([{x: 1, y: 1}])
      })

      it('Remove ref peaks without ref data', () => {
        const shift = { shifts: [{ ref: false, peak: {x: 1, y: 1} }] }
        const removedPeaks = Format.rmRef(peaks, shift)
        expect(removedPeaks).toEqual([{x: 2.04, y: 2}])
      })
    })
  })

  describe('Test check layouts', () => {
    describe('Check NMR layout', () => {
      const nmrLayouts = [LIST_LAYOUT.H1, LIST_LAYOUT.C13, LIST_LAYOUT.F19, LIST_LAYOUT.P31, LIST_LAYOUT.N15, LIST_LAYOUT.Si29]
      it('Is NMR layout', () => {
        nmrLayouts.forEach(layout => {
          const isNMR = Format.isNmrLayout(layout)
          expect(isNMR).toEqual(true)
        })
      })

      it('Not NMR layout', () => {
        const allLayouts = Object.keys(LIST_LAYOUT)
        allLayouts.forEach(layout => {
          if (!nmrLayouts.includes(layout)) {
            const isNMR = Format.isNmrLayout(layout)
            expect(isNMR).toEqual(false)
          }
        })
      })
    })
  })

  describe('Test fix digit', () => {
    it('Get zero digit', () => {
      const value = 1.4
      const fixedValue = Format.fixDigit(value, 0)
      expect(fixedValue).toEqual('1')
    })

    it('Get 5 digit', () => {
      const value = 1.123456
      const fixedValue = Format.fixDigit(value, 5)
      expect(fixedValue).toEqual('1.12346')
    })
  })

  describe('Test format peaks by prediction', () => {
    const peaks = [{x: 1, y: 1}, {x: 2, y: 2}]
    it('No prediction value', () => {
      const body = Format.formatPeaksByPrediction(peaks, LIST_LAYOUT.H1, true, 1, [])
      expect(body).toEqual('1.0 (0H), 2.0 (0H)')
    })

    it('Has prediction value', () => {
      const body = Format.formatPeaksByPrediction(peaks, LIST_LAYOUT.H1, true, 1, [{ real: 1}])
      expect(body).toEqual('1.0, 2.0 (0H)')
    })
  })

  describe('Test get comparison colors', () => {
    it('Get the first color', () => {
      const index = 0
      const expectedColor = '#ABB2B9'
      const color = Format.compareColors(index)
      expect(color).toEqual(expectedColor)
    })

    it('Get the last color', () => {
      const index = 9
      const expectedColor = '#F9E79F'
      const color = Format.compareColors(index)
      expect(color).toEqual(expectedColor)
    })

    it('Get the middle color', () => {
      const index = 17
      const expectedColor = '#ABEBC6'
      const color = Format.compareColors(index)
      expect(color).toEqual(expectedColor)
    })
  })

  describe('Test get multi curves colors', () => {
    it('Get the first color', () => {
      const index = 7
      const expectedColor = '#fa8231'
      const color = Format.mutiEntitiesColors(index)
      expect(color).toEqual(expectedColor)
    })

    it('Get the last color', () => {
      const index = 20
      const expectedColor = '#4b6584'
      const color = Format.mutiEntitiesColors(index)
      expect(color).toEqual(expectedColor)
    })

    it('Get the middle color', () => {
      const index = 10
      const expectedColor = '#2d98da'
      const color = Format.mutiEntitiesColors(index)
      expect(color).toEqual(expectedColor)
    })
  })

  describe('Test layouts have multiple curves', () => {
    const layouts = [LIST_LAYOUT.CYCLIC_VOLTAMMETRY, LIST_LAYOUT.SEC, LIST_LAYOUT.AIF]
    it('Has multiple curves', () => {
      layouts.forEach(layout => {
        const hasMultipleCurves = Format.hasMultiCurves(layout)
        expect(hasMultipleCurves).toEqual(true)
      })
    })
  })

  describe('Test is SDM layout', () => {
    it('Is SDM layout', () => {
      const hasMultipleCurves = Format.isAIFLayout(LIST_LAYOUT.AIF)
      expect(hasMultipleCurves).toEqual(true)
    })
  })

})
