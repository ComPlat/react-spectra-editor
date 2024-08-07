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
        integration: any, atIndex: number,
        temperature: string,
        waveLength: any,
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
          integration: null, atIndex: 0,
          temperature: '300',
          waveLength: {label: "Cu Kα", name: "CuKalpha", unit: "nm", value: 0.15406 }
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
        integration: any, atIndex: number,
        temperature: string,
        waveLength: any,
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
          integration: null, atIndex: 0,
          temperature: '300',
          waveLength: {label: "Cu Kα", name: "CuKalpha", unit: "nm", value: 0.15406 }
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
        expect(body).toEqual('(Cu Kα, 0.15406 nm, 300 °C), 2θ [°] (d [nm]): 2.0 (2.00), 1.0 (1.00)')
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


      it('Get peaks for DLS intensity layout', () => {
        params.layout = LIST_LAYOUT.DLS_INTENSITY
        const body = Format.peaksBody(params)
        expect(body).toEqual('2.0 nm (2.00 %), 1.0 nm (1.00 %)')
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
        const expectedWrapper = {head: '1H (Acetic acid-d4) = ', tail: '.'}
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
        LIST_LAYOUT.HPLC_UVVIS, LIST_LAYOUT.TGA, LIST_LAYOUT.DSC, LIST_LAYOUT.XRD,
        LIST_LAYOUT.CDS, LIST_LAYOUT.SEC, LIST_LAYOUT.GC, LIST_LAYOUT.MS
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
      const listLayout = [LIST_LAYOUT.H1, LIST_LAYOUT.F19, LIST_LAYOUT.P31, LIST_LAYOUT.N15, LIST_LAYOUT.Si29, LIST_LAYOUT.PLAIN, 
        LIST_LAYOUT.CYCLIC_VOLTAMMETRY];

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
      const expectedColor = '#d35400'
      const color = Format.mutiEntitiesColors(index)
      expect(color).toEqual(expectedColor)
    })

    it('Get the last color', () => {
      const index = 20
      const expectedColor = '#BDC581'
      const color = Format.mutiEntitiesColors(index)
      expect(color).toEqual(expectedColor)
    })

    it('Get the middle color', () => {
      const index = 10
      const expectedColor = '#2c3e50'
      const color = Format.mutiEntitiesColors(index)
      expect(color).toEqual(expectedColor)
    })
  })

  describe('Test layouts have multiple curves', () => {
    const layouts = [LIST_LAYOUT.CYCLIC_VOLTAMMETRY, LIST_LAYOUT.SEC, LIST_LAYOUT.GC, LIST_LAYOUT.AIF]
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

  describe('Test format string number', () => {
    describe('.strNumberFixedDecimal()', () => {
      it('number without fixed', () => {
        const strNumber = Format.strNumberFixedDecimal(2.50);
        const expected = '2.5'
        expect(strNumber).toEqual(expected)
      })

      it('number with at least 1 decimal', () => {
        const strNumber = Format.strNumberFixedDecimal(2.5, 1);
        const expected = '2.5'
        expect(strNumber).toEqual(expected)
      })

      it('number with at least 2 decimal', () => {
        const strNumber = Format.strNumberFixedDecimal(2.5, 2);
        const expected = '2.50'
        expect(strNumber).toEqual(expected)
      })

      it('long number with at least 2 decimal', () => {
        const strNumber = Format.strNumberFixedDecimal(2.567, 2);
        const expected = '2.567'
        expect(strNumber).toEqual(expected)
      })
    })
  })

  describe('.strNumberFixedLength()', () => {
    it('number without fixed', () => {
      const strNumber = Format.strNumberFixedLength(2.50);
      const expected = '2.5'
      expect(strNumber).toEqual(expected)
    })

    it('round the number when length is smaller that the lenght of the interger part', () => {
      const strNumber = Format.strNumberFixedLength(12.5, 1);
      const expected = '13'
      expect(strNumber).toEqual(expected)
    })

    it('round the number when length is equal that the length of the interger part', () => {
      const strNumber = Format.strNumberFixedLength(12.5, 2);
      const expected = '13'
      expect(strNumber).toEqual(expected)
    })

    it('return the number when it is an integer', () => {
      const strNumber = Format.strNumberFixedLength(12, 1);
      const expected = '12'
      expect(strNumber).toEqual(expected)
    })

    it('return the number when it is an integer but lenght is longer', () => {
      const strNumber = Format.strNumberFixedLength(12, 3);
      const expected = '12.0'
      expect(strNumber).toEqual(expected)
    })

    it('return the number when it is a negative integer but lenght is longer', () => {
      const strNumber = Format.strNumberFixedLength(-12, 3);
      const expected = '-12.0'
      expect(strNumber).toEqual(expected)
    })

    it('format the number with length', () => {
      const strNumber1 = Format.strNumberFixedLength(1.733, 3);
      const expected1 = '1.73'
      expect(strNumber1).toEqual(expected1)

      const strNumber2 = Format.strNumberFixedLength(90.007, 3);
      const expected2 = '90.0'
      expect(strNumber2).toEqual(expected2)
    })
  })

  describe('Format inline notation', () => {
    it('Inline notation for Cyclic voltammetry layout', () => {
      const expectedString = "CV (<conc. of sample> mM in <solvent> vs. Ref (Fc+/Fc) = -0.72 V, v = 0.10 V/s, to neg.):\nE1/2 = ([Cu(TMGqu)] , ΔEp) = -0.73 V (1650 mV)"
      const expectedQuillData = [
        {
          insert: "CV (<conc. of sample> mM in <solvent> vs. Ref "
        },
        {
          insert: "(Fc"
        },
        {
          insert: "+", attributes: { script: 'super' }
        },
        {
          insert: "/Fc) "
        },
        {
          insert: "= -0.72 V, v = 0.10 V/s, to neg.):"
        },
        {
          insert: "\nE"
        },
        {
          insert: "1/2", attributes: { script: 'sub' }
        },
        {
          insert: " = ([Cu(TMGqu)] , ΔE"
        },
        {
          insert: "p", attributes: { script: 'sub' }
        },
        {
          insert: ") = -0.73 V (1650 mV)"
        },
      ]
      const layout = LIST_LAYOUT.CYCLIC_VOLTAMMETRY
      const data = {
        scanRate: 0.1,
        voltaData: {
          listPeaks: [{"min":{"x":-1.5404,"y":-0.00000307144},"max":{"x":0.10003,"y":0.00000285434},"isRef":true,"e12":-0.720185,"createdAt":1716803991732,"updatedAt":1716803991733,"pecker":{"x":0.380242,"y":0.00000164361}},{"max":{"x":0.10002,"y":0.00000283434},"e12":-0.72519,"updatedAt":1716803991733,"min":{"x":-1.5504,"y":-0.00000317144},"pecker":{"x":0.480242,"y":0.00000174361},"isRef":false}],
          xyData: {
              x: [1.49048, 1.48049],
              y: [0.00000534724, 0.00000481545]
          }
        }
      }
      const formattedData = Format.inlineNotation(layout, data, 'Cu(TMGqu)')
      const { formattedString, quillData } = formattedData;
      expect(formattedString).toEqual(expectedString)
      expect(quillData).toEqual(expectedQuillData)
    })
  })
})
