import {
  ExtractJcamp, Topic2Seed, Convert2Peak, Feature2Peak, ToThresEndPts, ToShiftPeaks,
  ToFrequency, Convert2Scan, Convert2Thres, GetComparisons, Convert2DValue,
  GetCyclicVoltaRatio, GetCyclicVoltaPeakSeparate, convertTopic,
  Convert2MaxMinPeak, Feature2MaxMinPeak, GetCyclicVoltaShiftOffset, GetCyclicVoltaPreviousShift,
  buildIntegFeature, convertThresEndPts,
} from "../../../helpers/chem";
import nmr1HJcamp from "../../fixtures/nmr1h_jcamp";
import nmr13cJcamp from "../../fixtures/nmr13c_jcamp";
import aifJcamp1 from "../../fixtures/aif_jcamp_1";
import dlsIntensityJcamp from '../../fixtures/dls_intensity_jcamp';
import { LIST_SHIFT_1H } from "../../../constants/list_shift";
import { LIST_LAYOUT } from "../../../constants/list_layout";
import emissionsJcamp from "../../fixtures/emissions_jcamp";
import dlsAcfJcamp from "../../fixtures/dls_acf_jcamp";
import lcMsTicChemstationJcamp from "../../fixtures/lc_ms_jcamp_tic_chemstation";
import lcMsMzChemstationJcamp from "../../fixtures/lc_ms_jcamp_mz_chemstation";

const buildTicJcamp = ({
  xUnits, unitsLine = '', xValues, yValues,
}: { xUnits: string, unitsLine?: string, xValues: number[], yValues: number[] }) => {
  const lines = [
    '##TITLE=Spectrum',
    '##JCAMP-DX=5.00',
    '##DATA TYPE=MASS TIC',
    '##DATA CLASS=XYPOINTS',
    `##XUNITS=${xUnits}`,
    '##YUNITS=COUNTS',
    ...(unitsLine ? [unitsLine] : []),
    `##FIRSTX=${xValues[0]}`,
    `##LASTX=${xValues[xValues.length - 1]}`,
    `##NPOINTS=${xValues.length}`,
    '##XYDATA=(XY..XY)',
    ...xValues.map((x, i) => `${x}, ${yValues[i]}`),
    '##END=',
  ];
  return `\n${lines.join('\n')}\n`;
};

function checkExtractSucceed(extractedData: any, forLayout: string) {
  const { spectra, features, layout } = extractedData
  expect(spectra).not.toBeNull()
  expect(features).not.toBeNull()
  expect(layout).toEqual(forLayout)
}

function checkSpectraInfo(extractedData: any, forLayout: string) {
  const { spectra} = extractedData
  expect(spectra).toHaveLength(1)

  const spectrum = spectra[0]
  expect(spectrum.dataType).toEqual(forLayout)
}

describe('Test for chem helper', () => {
  describe('Test extract jcamp file', () => {
    //TODO: need more implementation
    describe('Extract NMR', () => {
      let extractedData: { spectra: any, features: any, layout: any }

      beforeAll(() => {
        extractedData = ExtractJcamp(nmr1HJcamp)
      })

      it('Extract succeed ', () => {
        checkExtractSucceed(extractedData, LIST_LAYOUT.H1)
      })

      it('Check spectra info ', () => {
        checkSpectraInfo(extractedData, 'NMR SPECTRUM')
      })
    })

    describe('Extract SDM', () => {
      let extractedData: { spectra: any, features: any, layout: any }

      beforeAll(() => {
        extractedData = ExtractJcamp(aifJcamp1)
      })

      it('Extract succeed ', () => {
        checkExtractSucceed(extractedData, LIST_LAYOUT.AIF)
      })

      it('Check spectra info ', () => {
        checkSpectraInfo(extractedData, 'SORPTION-DESORPTION MEASUREMENT')
      })
    })

    describe('Extract Emission Spec', () => {
      let extractedData: { spectra: any, features: any, layout: any }

      beforeAll(() => {
        extractedData = ExtractJcamp(emissionsJcamp)
      })

      it('Extract succeed ', () => {
        checkExtractSucceed(extractedData, LIST_LAYOUT.EMISSIONS)
      })

      it('Check spectra info ', () => {
        checkSpectraInfo(extractedData, 'Emissions')
      })
    })
    

    describe('Extract DLS ACF', () => {
      let extractedData: { spectra: any, features: any, layout: any }

      beforeAll(() => {
        extractedData = ExtractJcamp(dlsAcfJcamp)
      })

      it('Extract succeed ', () => {
        checkExtractSucceed(extractedData, LIST_LAYOUT.DLS_ACF)
      })

      it('Check spectra info ', () => {
        checkSpectraInfo(extractedData, 'DLS ACF')
      })
    })
    

    describe('Extract DLS Intensity', () => {
      let extractedData: { spectra: any, features: any, layout: any }

      beforeAll(() => {
        extractedData = ExtractJcamp(dlsIntensityJcamp)
      })

      it('Extract succeed ', () => {
        checkExtractSucceed(extractedData, LIST_LAYOUT.DLS_INTENSITY)
      })

      it('Check spectra info ', () => {
        checkSpectraInfo(extractedData, 'DLS intensity')
      })
    })
    
  })

  describe('Test convert to topic', () => {
    it('Get topic without integration info', () => {
      const topic = { x: [1, 2], y: [1, 2] }
      const feature = { maxY: 2 }
      const convertedTopic = convertTopic(topic, 'IR', feature, 0)
      expect(convertedTopic).toEqual([{"x": 1, "y": 1}, {"x": 2, "y": 2}])
    })

    it('Get topic with integration info', () => {
      const topic = { x: [1, 2], y: [1, 2] }
      const feature = { maxY: 2 }
      const convertedTopic = convertTopic(topic, '1H', feature, 0)
      expect(convertedTopic).toEqual([{"k": 0.5, "x": 1, "y": 1}, {"k": 1.5, "x": 2, "y": 2}])
    })
  })

  describe('Test topic to seed', () => {
    //TODO: need more implementation
    it('Get seed from topic without integration info', () => {
      const state = {
        curve: { curveIdx: 0 },
        shift: { shifts: [] }
      }
      const props = { topic: { x: [1, 2], y: [1, 2] }, feature: { maxY: 2 } }
      const seed = Topic2Seed(state, props)
      expect(seed).toEqual([{"x": 1, "y": 1}, {"x": 2, "y": 2}])
    })

    it('Get seed from topic with integration info', () => {
      const state = {
        curve: { curveIdx: 0 },
        shift: { shifts: [{ ref: LIST_SHIFT_1H[1], peak: [{x: 2, y: 2}] }] },
        layout: '1H' }
      const props = { topic: { x: [1, 2], y: [1, 2] }, feature: { maxY: 2 } }
      const seed = Topic2Seed(state, props)
      expect(seed).toEqual([{"k": 0.5, "x": 1, "y": 1}, {"k": 1.5, "x": 2, "y": 2}])
    })
  })

  describe('Convert2Peak', () => {
    it('Convert without feature data', () => {
      const peaksList1 = Convert2Peak(null)
      expect(peaksList1).toEqual([])

      const peaksList2 = Convert2Peak({ data: null })
      expect(peaksList2).toEqual([])
    })

    it('Peaks above 1 threshold', () => {
      const feature = { data: [{ x: [1, 2], y: [1, 2] }],  operation: { layout: LIST_LAYOUT.H1 }, maxY: 2, peakUp: true }
      const threshold = 55
      const offset = 0
      const peaks = Convert2Peak(feature, threshold, offset)
      expect(peaks).toEqual([{x: 2, y: 2}])
    })

    it('Peaks below 1 threshold', () => {
      const feature = { data: [{ x: [1, 2], y: [1, 2] }],  operation: { layout: LIST_LAYOUT.H1 }, maxY: 2, peakUp: false }
      const threshold = 50
      const offset = 0
      const peaks = Convert2Peak(feature, threshold, offset)
      expect(peaks).toEqual([{x: 1, y: 1}])
    })

    it('Peaks with 2 threshold', () => {
      const feature = { data: [{ x: [1, 2, -1, -2], y: [1, 2, -1, -2] }],  operation: { layout: LIST_LAYOUT.CYCLIC_VOLTAMMETRY }, maxY: 2, minY: -2, peakUp: true, upperThres: 55, lowerThres: 55 }
      const threshold = 50
      const offset = 0
      const peaks = Convert2Peak(feature, threshold, offset)
      expect(peaks).toEqual([{x: 2, y: 2}, {x: -2, y: -2}])
    })

    it('Peaks with 2 threshold cds layout', () => {
      const feature = { data: [{ x: [1, 2, -1, -2], y: [1, 2, -1, -2] }],  operation: { layout: LIST_LAYOUT.CDS }, maxY: 2, minY: -2, peakUp: true, upperThres: 100, lowerThres: 100 }
      const threshold = 100
      const offset = 0
      const peaks = Convert2Peak(feature, threshold, offset)
      expect(peaks).toEqual([{x: 2, y: 2}, {x: -2, y: -2}])
    })

    // Review finding B4 (#232): for an LC/MS feature carrying edited/stored
    // peaks, Convert2Peak must return those peaks with the offset applied,
    // rather than recomputing them from the raw data and dropping the offset.
    it('honours stored LC/MS peaks and applies the offset', () => {
      const feature = {
        operation: { layout: 'LC/MS' },
        data: [{ x: [10, 11, 12], y: [1, 5, 1] }],
        peaks: [{ x: 5, y: 100 }], // user-edited / stored peaks
      }
      const peaks = Convert2Peak(feature, 0, 2)
      expect(peaks).toEqual([{ x: 3, y: 100 }])
    })
  })

  // Review finding B7 (#232) precondition: clearing the threshold input yields
  // an empty endpoint list (the state that made drawBar crash — the drawBar
  // guard itself is covered in components/d3_line_rect.test.js).
  describe('convertThresEndPts', () => {
    it('returns [] when the threshold is cleared', () => {
      const feature = { maxY: 100, maxX: 10, minX: 0, data: [{ x: [1, 2], y: [3, 4] }] }
      expect(convertThresEndPts(feature, '')).toEqual([])
    })
  })

  describe('Feature2Peak', () => {
    //TODO: need more implementation
    it('Get peaks from feature', () => {
      const state = {
        curve: { curveIdx: 0 },
        shift: { shifts: [] },
        layout: LIST_LAYOUT.H1, threshold: { selectedIdx: 0, list: [{ value: 55 }]} } // threshold at 55%
      const props = { feature: { data: [{ x: [1, 2], y: [1, 2] }],  operation: { layout: LIST_LAYOUT.H1 }, maxY: 2, peakUp: true }}
      const peaks = Feature2Peak(state, props)
      expect(peaks).toEqual([{x: 2, y: 2}])
    })

    it('Get peaks from feature with 2 thresholds', () => {
      const state = {
        curve: { curveIdx: 0 },
        shift: { shifts: [] },
        layout: LIST_LAYOUT.CYCLIC_VOLTAMMETRY } // threshold at 55%
      const props = { 
        feature: { data: [{ x: [1, 2, -1, -2], y: [1, 2, -1, -2] }],
        operation: { layout: LIST_LAYOUT.CYCLIC_VOLTAMMETRY },
        maxY: 2, minY: -2, peakUp: true, upperThres: 55, lowerThres: 55 }}
      const peaks = Feature2Peak(state, props)
      expect(peaks).toEqual([{x: 2, y: 2}, {x: -2, y: -2}])
    })
  })

  describe('Test get threshold position in the render view', () => {
    it('Get threshold position', () => {
      const state = {
        shift: { ref: null }, layout: '1H',
        curve: { curveIdx: 0 },
        threshold: { selectedIdx: 0, list: [{ value: 55 }]} } // threshold at 55%
      const props = { feature: { data: [{ x: [1, 2], y: [1, 2] }],  operation: { layout: '1H'}, maxY: 2, maxX: 2, minX: 1, peakUp: true }}
      const thresholdsAt = ToThresEndPts(state, props)
      expect(thresholdsAt).toEqual([{"x": -199, "y": 1.1}, {"x": 202, "y": 1.1}])
    })
  })

  describe('Test get shifted peaks', () => {
    //TODO: need more implementation
    describe('Get shifted peaks from single curve', () => {
      const props = { feature: { data: [{ x: [1, 2, 3], y: [1, 2, 3] }],  operation: { layout: '1H'}, maxY: 2, peakUp: true }}

      it('No shifted peaks', () => {
        const state = {
          curve: { curveIdx: 0 },
          shift: { shifts: [] }, layout: LIST_LAYOUT.H1, threshold: {value: 55} 
        } // threshold at 55%
        
        const peaks = ToShiftPeaks(state, props)
        expect(peaks).toEqual([])
      })

      it('Has shifted peaks', () => {
        const state = {
          curve: { curveIdx: 0 },
          shift: { shifts: [{ ref: LIST_SHIFT_1H[1], peak: {x: 2, y: 2 }}] }, layout: '1H', threshold: {value: 55} 
        } // threshold at 55%
        
        const peaks = ToShiftPeaks(state, props)
        expect(peaks).toEqual([{x: 2.04, y: 2}])
      })
    })
  })

  describe('Test get frequency', () => {
    const listNMRLayout = ['1H', '13C', '19F', '31P', '15N', '29Si']
    describe('Cannot get freqency', () => {
      it('Not the NMR layout', () => {
        const state = { layout: 'IR' }
        const props = { feature: null }
        const freq = ToFrequency(state, props)
        expect(freq).toEqual(false)
      })

      it('Is the NMR layout', () => {
        const props = { feature: {} }
        listNMRLayout.forEach(layout => {
          const state = { layout: layout }
          const freq = ToFrequency(state, props)
          expect(freq).toEqual(false)
        });
      })

      it('Invalid observered frequency', () => {
        const props = { feature: { observeFrequency: null }}
        listNMRLayout.forEach(layout => {
          const state = { layout: layout }
          const freq = ToFrequency(state, props)
          expect(freq).toEqual(false)
        });
      })
    })

    describe('Get the frequency', () => {
      const props = { feature: { observeFrequency: 10.5 }}
      listNMRLayout.forEach(layout => {
        const state = { layout: layout }
        const freq = ToFrequency(state, props)
        expect(freq).toEqual(10.5)
      });
    })
  })

  describe('Test get scan', () => {
    it('Get defaut scan auto index', () => {
      const feature = { scanAutoTarget: 0, scanEditTarget: 1 }
      const scanState = { isAuto: true }
      const scanIdx = Convert2Scan(feature, scanState)
      expect(scanIdx).toEqual(0)
    })

    it('Get scan index from target', () => {
      const feature = { scanAutoTarget: 0, scanEditTarget: 1 }
      const scanState = { target: 1, isAuto: true }
      const scanIdx = Convert2Scan(feature, scanState)
      expect(scanIdx).toEqual(1)
    })

    it('Get edited scan index', () => {
      const feature = { scanAutoTarget: 0, scanEditTarget: 2 }
      const scanState = { target: 2, isAuto: false }
      const scanIdx = Convert2Scan(feature, scanState)
      expect(scanIdx).toEqual(2)
    })
  })

  describe('Test convert to threshold', () => {
    it('Convert with threshold state data', () => {
      const threshold = Convert2Thres({}, { value: 50.1 })
      expect(threshold).toEqual(50.1)
    })

    it('Convert with feature data', () => {
      const threshold = Convert2Thres({thresRef: 40.1}, { value: null})
      expect(threshold).toEqual(40.1)
    })

    it('Convert with feature data and threshold state', () => {
      const threshold = Convert2Thres({thresRef: 40.1}, { value: 50.1})
      expect(threshold).toEqual(50.1)
    })
  })

  describe('Test get comparison spectra', () => {
    const layoutShouldView = [LIST_LAYOUT.IR, LIST_LAYOUT.HPLC_UVVIS, LIST_LAYOUT.XRD,]
    const layoutShouldHide = [LIST_LAYOUT.C13, LIST_LAYOUT.H1, LIST_LAYOUT.F19, LIST_LAYOUT.P31, LIST_LAYOUT.N15, LIST_LAYOUT.Si29,
      LIST_LAYOUT.RAMAN, LIST_LAYOUT.UVVIS, 
      LIST_LAYOUT.MS,
      LIST_LAYOUT.TGA, LIST_LAYOUT.DSC, LIST_LAYOUT.CYCLIC_VOLTAMMETRY,
      LIST_LAYOUT.CDS, LIST_LAYOUT.SEC, LIST_LAYOUT.GC]

    describe('Layouts do not have comparison', () => {
      it('No other spectra', () => {
        const state = {}
        const props = { feature: {} }
        const comparison = GetComparisons(state, props)
        expect(comparison).toEqual([])
      })

      it('Is not layout has comparison function', () => {
        const props = { feature: {}, comparisons: ['compare1'] }
        layoutShouldHide.forEach(layout => {
          const state = { layout: layout }
          const comparison = GetComparisons(state, props)
          expect(comparison).toEqual([])
        })
      })
    })

    describe('Layouts has comparison', () => {
      it('Get comparisons', () => {
        const comparisons = [
          {spectra: [{data: [{x: [1, 2], y: [1, 2]}]}], show: true},
          {spectra: [{data: [{x: [3, 4], y: [3, 4]}]}], show: false}
        ]
        const expectedData = [
          {data: [{x: 1, y: 1}], show: true},
          {data: [{x: 3, y: 1}], show: false}
        ]
        const props = { feature: { minY: 1, maxY: 2 }, comparisons: comparisons }
        layoutShouldView.forEach(layout => {
          const state = { layout: layout }
          const comparison = GetComparisons(state, props)
          expect(comparison).toEqual(expectedData)
        })
      })
    })
  })

  describe('Test get 2d value for XRD layout', () => {
    const doubleTheta = 4.0
    const lambda = 0.15406
    it('Get 2D value without radian', () => {
      const dValue = Convert2DValue(doubleTheta, lambda, false)
      expect(dValue.toFixed(3)).toEqual('0.085')
    })

    it('Get 2D value with radian', () => {
      const dValue = Convert2DValue(doubleTheta, lambda, true)
      expect(dValue.toFixed(3)).toEqual('2.207')
    })
  })

  describe('Test get ratio for CV layout', () => {
    it('Get 2D value without radian', () => {
      const y_max_peak = 2.0
      const y_min_peak = 1.0
      const y_pecker = 3.0
      const ratio = GetCyclicVoltaRatio(y_max_peak, y_min_peak, y_pecker).toFixed(4)
      expect(ratio).toEqual('1.3135')
    })
  })

  describe('Test get delta for CV layout', () => {
    it('Get 2D value without radian', () => {
      const x_max_peak = 2.0
      const x_min_peak = -1.5
      const delta = GetCyclicVoltaPeakSeparate(x_max_peak, x_min_peak)
      expect(delta).toEqual(3.5)
    })
  })

  describe('Test convert to max and min peak for CV layout', () => {
    describe('Do not have max min peaks', () => {
      it('Layout is not CV', () => {
        const peaksList = Convert2MaxMinPeak(LIST_LAYOUT.H1)
        expect(peaksList).toBeNull()
      })

      it('Layout is CV but does not have feature', () => {
        const peaksList = Convert2MaxMinPeak(LIST_LAYOUT.CYCLIC_VOLTAMMETRY)
        expect(peaksList).toBeNull()
      })

      it('Layout is CV but does not have feature data', () => {
        const feature = { data: null }
        const peaksList = Convert2MaxMinPeak(LIST_LAYOUT.CYCLIC_VOLTAMMETRY, feature)
        expect(peaksList).toBeNull()
      })
    })

    describe('Have max min peaks', () => {
      it('Feature does not have voltammetry data', () => {
        const feature = { 
          data: [
            { x: [1, 2, -1], y: [1, 2, -1]}
          ],
          upperThres: 90.0, lowerThres: 90.0, maxY: 2, minY: -1
        }
        const peaksList = Convert2MaxMinPeak(LIST_LAYOUT.CYCLIC_VOLTAMMETRY, feature, 0)
        expect(peaksList).toEqual({max: [], min: [], pecker: [], refIndex: -1})
      })

      it('Feature has voltammetry data but no ref info', () => {
        const feature = { 
          data: [
            { x: [1, 2, -1], y: [1, 2, -1]}
          ],
          upperThres: 90.0, lowerThres: 90.0, maxY: 2, minY: -1,
          volammetryData: [{ max: { x: 1, y: 1 }, min: { x: -1, y: -1 }, pecker: { x: 3, y: 3 } }]
        }
        const peaksList = Convert2MaxMinPeak(LIST_LAYOUT.CYCLIC_VOLTAMMETRY, feature, 0)
        expect(peaksList).toEqual({max: [{x: 1, y: 1}], min: [{x: -1, y: -1}], pecker: [{ x: 3, y: 3 }], refIndex: -1})
      })

      it('Feature has voltammetry data with ref info', () => {
        const feature = { 
          data: [
            { x: [1, 2, -1], y: [1, 2, -1]}
          ],
          upperThres: 90.0, lowerThres: 90.0, maxY: 2, minY: -1,
          volammetryData: [{ max: { x: 1, y: 1 }, min: { x: -1, y: -1 }, pecker: { x: 3, y: 3 }, isRef: true }]
        }
        const peaksList = Convert2MaxMinPeak(LIST_LAYOUT.CYCLIC_VOLTAMMETRY, feature, 0)
        expect(peaksList).toEqual({max: [{x: 1, y: 1}], min: [{x: -1, y: -1}], pecker: [{ x: 3, y: 3 }], refIndex: 0})
      })
    })
  })

  describe('Test convert feature to max and min peak for CV layout', () => {
    it('Get max min peaks from feature', () => {
      const state = {
        curve: { curveIdx: 0 },
        shift: { shifts: [] }, layout: LIST_LAYOUT.CYCLIC_VOLTAMMETRY,
      }
      const feature = { 
        data: [
          { x: [1, 2, -1], y: [1, 2, -1]}
        ],
        upperThres: 90.0, lowerThres: 90.0, maxY: 2, minY: -1,
        volammetryData: [{ max: { x: 1, y: 1 }, min: { x: -1, y: -1 }, pecker: { x: 3, y: 3 }, isRef: true }]
      }
      const props = { feature: feature}
      const peaksList = Feature2MaxMinPeak(state, props)
      expect(peaksList).toEqual({max: [{x: 1, y: 1}], min: [{x: -1, y: -1}], pecker: [{ x: 3, y: 3 }], refIndex: 0})
    })
  })

  describe('Test get offset CV layout', () => {
    const voltaData = {"spectraList":[{"list":[{"min":{"x":-1.5404,"y":-0.00000307144},"max":{"x":0.10003,"y":0.00000285434},"isRef":true,"e12":-0.720185,"pecker":{"x":0.380242,"y":0.00000164361}}],"selectedIdx":0,"isWorkMaxPeak":true,"jcampIdx":0,"shift":{"ref":{"min":{"x":-1.5404,"y":-0.00000307144},"max":{"x":0.10003,"y":0.00000285434},"isRef":true,"e12":-0.720185,"pecker":{"x":0.380242,"y":0.00000164361}},"val":0}},{"list":[{"min":{"x":-1.48904,"y":-0.000033747399999999995},"max":{"x":0.929483,"y":0.00023741},"isRef":true,"e12":-0.27977849999999993}],"selectedIdx":0,"isWorkMaxPeak":true,"jcampIdx":1,"shift":{"ref":{"min":{"x":-1.48904,"y":-0.000033747399999999995},"max":{"x":0.929483,"y":0.00023741},"isRef":true,"e12":-0.27977849999999993},"val":1.5}},{"list":[{"min":{"x":0.45977,"y":-0.000226347},"max":{"x":1.00943,"y":0.000371349},"isRef":false,"e12":0.7346}],"selectedIdx":0,"isWorkMaxPeak":true,"jcampIdx":2,"shift":{"ref":null,"val":0}}]}
    it('When it does not have volta data', () => {
      const offset = GetCyclicVoltaShiftOffset(null)
      expect(offset).toEqual(0.0)
    })

    it('When it has ref with Ref0V == 0', () => {
      const offset = GetCyclicVoltaShiftOffset(voltaData, 0)
      expect(offset).toEqual(-0.720185)
      expect(offset.toFixed(3)).toEqual("-0.720")
    })

    it('When it has ref with Ref0V == 1.5', () => {
      const offset = GetCyclicVoltaShiftOffset(voltaData, 1)
      expect(offset).toEqual(-1.7797785)
      expect(offset.toFixed(3)).toEqual("-1.780")
    })

    it('When it does not have ref value', () => {
      const offset = GetCyclicVoltaShiftOffset(voltaData, 2)
      expect(offset).toEqual(0.0)
    })
  })

  describe('Test build integration feature with persistent visualSplitGroupId', () => {
    const linearSpectra = [{ data: [{ x: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], y: [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0] }] }]
    const buildJcamp = (records: Record<string, string>) => ({
      info: { ...records },
      spectra: [{}],
    })

    it('returns integrations without groupId for legacy JCAMPs', () => {
      const jcamp: any = buildJcamp({
        $OBSERVEDINTEGRALS: '\n0, 10, 5, 5',
      })
      const feature = buildIntegFeature(jcamp, linearSpectra)
      expect(feature.stack).toHaveLength(1)
      expect(feature.stack[0]).toMatchObject({ xL: 0, xU: 10 })
      expect(feature.stack[0].visualSplitGroupId).toBeUndefined()
    })

    it('attaches a visualSplitGroupId from the JCAMP record', () => {
      const jcamp: any = buildJcamp({
        $OBSERVEDINTEGRALS: '\n0, 4, 2, 2\n4, 10, 3, 3',
        $OBSERVEDINTEGRALSGROUPS: '\n0, vsg-abc-1\n1, vsg-abc-1',
      })
      const feature = buildIntegFeature(jcamp, linearSpectra)
      expect(feature.stack[0].visualSplitGroupId).toBe('vsg-abc-1')
      expect(feature.stack[1].visualSplitGroupId).toBe('vsg-abc-1')
    })

    it('preserves alphanumeric and dash characters in the groupId token', () => {
      const jcamp: any = buildJcamp({
        $OBSERVEDINTEGRALS: '\n0, 10, 5, 5',
        $OBSERVEDINTEGRALSGROUPS: '\n0, vsg-token_42-XYZ',
      })
      const feature = buildIntegFeature(jcamp, linearSpectra)
      expect(feature.stack[0].visualSplitGroupId).toBe('vsg-token_42-XYZ')
    })

    it('ignores groupId rows pointing to non existing integrations', () => {
      const jcamp: any = buildJcamp({
        $OBSERVEDINTEGRALS: '\n0, 10, 5, 5',
        $OBSERVEDINTEGRALSGROUPS: '\n5, vsg-orphan',
      })
      const feature = buildIntegFeature(jcamp, linearSpectra)
      expect(feature.stack[0].visualSplitGroupId).toBeUndefined()
    })

    it('keeps the groupId after the area normalisation pass', () => {
      const jcamp: any = buildJcamp({
        $OBSERVEDINTEGRALS: '\n0, 10, 5, 5',
        $OBSERVEDINTEGRALSGROUPS: '\n0, vsg-abc',
      })
      const feature = buildIntegFeature(jcamp, linearSpectra)
      expect(feature.stack[0].visualSplitGroupId).toBe('vsg-abc')
      expect(feature.stack[0].area).toBeDefined()
    })

    it('parses GROUPS records that have no leading newline (header-less convention)', () => {
      const jcamp: any = buildJcamp({
        $OBSERVEDINTEGRALS: '\n0, 4, 2, 2\n4, 10, 3, 3',
        $OBSERVEDINTEGRALSGROUPS: '0, vsg-headerless\n1, vsg-headerless',
      })
      const feature = buildIntegFeature(jcamp, linearSpectra)
      expect(feature.stack[0].visualSplitGroupId).toBe('vsg-headerless')
      expect(feature.stack[1].visualSplitGroupId).toBe('vsg-headerless')
    })

    it('ignores an arbitrary header line and still maps all valid rows', () => {
      const jcamp: any = buildJcamp({
        $OBSERVEDINTEGRALS: '\n0, 4, 2, 2\n4, 10, 3, 3',
        $OBSERVEDINTEGRALSGROUPS: ' (X Y)\n0, vsg-hdr\n1, vsg-hdr',
      })
      const feature = buildIntegFeature(jcamp, linearSpectra)
      expect(feature.stack[0].visualSplitGroupId).toBe('vsg-hdr')
      expect(feature.stack[1].visualSplitGroupId).toBe('vsg-hdr')
    })
  })

  describe('Test get previous offset CV layout', () => {
    const voltaData = {"spectraList":[{"list":[{"min":{"x":-1.5404,"y":-0.00000307144},"max":{"x":0.10003,"y":0.00000285434},"isRef":true,"e12":-0.720185,"pecker":{"x":0.380242,"y":0.00000164361}}],"selectedIdx":0,"isWorkMaxPeak":true,"jcampIdx":0,"shift":{"ref":{"min":{"x":-1.5404,"y":-0.00000307144},"max":{"x":0.10003,"y":0.00000285434},"isRef":true,"e12":-0.720185,"pecker":{"x":0.380242,"y":0.00000164361}},"val":0, "prevValue":0.5},"hasRefPeak":true},{"list":[{"min":{"x":-1.48904,"y":-0.000033747399999999995},"max":{"x":0.929483,"y":0.00023741},"isRef":true,"e12":-0.27977849999999993}],"selectedIdx":0,"isWorkMaxPeak":true,"jcampIdx":1,"shift":{"ref":{"min":{"x":-1.48904,"y":-0.000033747399999999995},"max":{"x":0.929483,"y":0.00023741},"isRef":true,"e12":-0.27977849999999993},"val":1.5}},{"list":[{"min":{"x":0.45977,"y":-0.000226347},"max":{"x":1.00943,"y":0.000371349},"isRef":false,"e12":0.7346}],"selectedIdx":0,"isWorkMaxPeak":true,"jcampIdx":2,"shift":{"ref":null,"val":0}}]}
    const voltaDataNoRef = {"spectraList":[{"list":[{"min":{"x":-1.5404,"y":-0.00000307144},"max":{"x":0.10003,"y":0.00000285434},"isRef":false,"e12":-0.720185,"pecker":{"x":0.380242,"y":0.00000164361}}],"selectedIdx":0,"isWorkMaxPeak":true,"jcampIdx":0,"shift":{"ref":null,"val":0, "prevValue":0.5},"hasRefPeak":false},{"list":[{"min":{"x":-1.48904,"y":-0.000033747399999999995},"max":{"x":0.929483,"y":0.00023741},"isRef":true,"e12":-0.27977849999999993}],"selectedIdx":0,"isWorkMaxPeak":true,"jcampIdx":1,"shift":{"ref":null,"val":1.5}},{"list":[{"min":{"x":0.45977,"y":-0.000226347},"max":{"x":1.00943,"y":0.000371349},"isRef":false,"e12":0.7346}],"selectedIdx":0,"isWorkMaxPeak":true,"jcampIdx":2,"shift":{"ref":null,"val":0}}]}
    it('When it does not have volta data', () => {
      const offset = GetCyclicVoltaPreviousShift(null)
      expect(offset).toEqual(0.0)
    })

    it('When it has prev data', () => {
      const offset = GetCyclicVoltaPreviousShift(voltaData, 0)
      expect(offset).toEqual(0.5)
    })

    it('When it has prev data but volta data does not have any ref peaks', () => {
      const offset = GetCyclicVoltaPreviousShift(voltaDataNoRef, 0)
      expect(offset).toEqual(-0.5)
    })
  })

  describe('Test TIC seconds-to-minutes normalization (issue #619)', () => {
    it('leaves TIC x unchanged when XUNITS is explicit MINUTES, even past 60', () => {
      const jcamp = buildTicJcamp({
        xUnits: 'MINUTES',
        xValues: [61, 90, 120],
        yValues: [1, 2, 3],
      });
      const entity: any = ExtractJcamp(jcamp);
      expect(entity.features[0].data[0].x).toEqual([61, 90, 120]);
    });

    it('scales TIC x to minutes when XUNITS is explicit SECONDS, even under 60', () => {
      const jcamp = buildTicJcamp({
        xUnits: 'SECONDS',
        xValues: [6, 12, 18],
        yValues: [1, 2, 3],
      });
      const entity: any = ExtractJcamp(jcamp);
      const x = entity.features[0].data[0].x;
      [0.1, 0.2, 0.3].forEach((expected, i) => expect(x[i]).toBeCloseTo(expected));
    });

    it('does not scale an ambiguous RETENTION TIME tag when values already look like minutes (<=60)', () => {
      const jcamp = buildTicJcamp({
        xUnits: 'RETENTION TIME',
        xValues: [1.12, 7.5, 13.98],
        yValues: [1, 2, 3],
      });
      const entity: any = ExtractJcamp(jcamp);
      expect(entity.features[0].data[0].x).toEqual([1.12, 7.5, 13.98]);
    });

    it('scales an ambiguous RETENTION TIME tag when values look like seconds (>60)', () => {
      const jcamp = buildTicJcamp({
        xUnits: 'RETENTION TIME',
        xValues: [60, 300, 600],
        yValues: [1, 2, 3],
      });
      const entity: any = ExtractJcamp(jcamp);
      const x = entity.features[0].data[0].x;
      [1, 5, 10].forEach((expected, i) => expect(x[i]).toBeCloseTo(expected));
    });

    // Review finding S10: jcampUnitsIndicatesSeconds used to substring-scan the
    // *whole* ##UNITS= line (X and Y units concatenated), so a Y-unit like
    // "COUNTS PER SECOND" satisfied it and — because it short-circuits the
    // magnitude guard via `isExplicitSeconds || dataLooksLikeSeconds` — divided
    // an already-minutes, well-under-60 x-axis by 60 anyway. The fix resolves
    // only the ##SYMBOL=-indexed X token instead of the concatenated line.
    it("does not scale an already-minutes TIC x when only the Y unit's ##UNITS= token mentions seconds", () => {
      const jcamp = buildTicJcamp({
        xUnits: 'RETENTION TIME',
        unitsLine: '##SYMBOL=X, Y\n##UNITS=, RETENTION TIME, COUNTS PER SECOND',
        xValues: [1.12, 7.5, 13.98],
        yValues: [1, 2, 3],
      });
      const entity: any = ExtractJcamp(jcamp);
      expect(entity.features[0].data[0].x).toEqual([1.12, 7.5, 13.98]);
    });

    it('still scales when the X token itself (by ##SYMBOL= position) says seconds', () => {
      const jcamp = buildTicJcamp({
        xUnits: 'RETENTION TIME',
        unitsLine: '##SYMBOL=X, Y\n##UNITS=SECONDS, COUNTS',
        xValues: [6, 12, 18],
        yValues: [1, 2, 3],
      });
      const entity: any = ExtractJcamp(jcamp);
      const x = entity.features[0].data[0].x;
      [0.1, 0.2, 0.3].forEach((expected, i) => expect(x[i]).toBeCloseTo(expected));
    });

    it('regression: retagging the chemstation TIC fixture like its sibling UVVIS fixture must not collapse its native-minutes range', () => {
      // lc_ms_jcamp_uvvis_chemstation.js tags its (already-minutes) data this same way:
      // ##XUNITS=RETENTION TIME plus a global ##UNITS=, MINUTES, ARBITRARY UNITS line.
      const retagged = lcMsTicChemstationJcamp
        .replace(/##XUNITS=MINUTES/g, '##XUNITS=RETENTION TIME')
        .replace('##DATA CLASS=XYPOINTS', '##DATA CLASS=XYPOINTS\n##UNITS=, MINUTES, ARBITRARY UNITS');
      const entity: any = ExtractJcamp(retagged);
      const x = entity.features[0].data[0].x;
      expect(x[0]).toBeCloseTo(1.1228, 3);
      expect(x[x.length - 1]).toBeCloseTo(13.9829, 3);
    });
  })

  // Review finding B3: resolveSecToMinScale only rescaled a TIC/UVVIS
  // spectrum's data[0].x. An m/z entity's ##PAGE=T=... retention-time marker
  // goes through a separate path (parseChemstationPages / the ntuples
  // rebuild) that never touched it, so a seconds-tagged m/z sibling could
  // still carry a raw-seconds page value even after the TIC axis itself was
  // fixed — see the reducer-level regression in reducer_hplc_ms.test.tsx for
  // how that clobbered tic.currentPageValue.
  describe('Test m/z ##PAGE=T=... minute normalization (issue #619 / B3)', () => {
    it('leaves already-minutes ##PAGE values unchanged', () => {
      const entity: any = ExtractJcamp(lcMsMzChemstationJcamp);
      expect(entity.features[0].pageValue).toBeCloseTo(1.1228166666666666);
      expect(entity.features[1].pageValue).toBeCloseTo(1.1384333333333334);
    });

    it('scales ##PAGE values to minutes when they look like seconds (>60)', () => {
      const secondsTaggedMz = lcMsMzChemstationJcamp.replace(
        /##PAGE=T= ([\d.]+)/g,
        (_match, num) => `##PAGE=T= ${Number(num) * 60}`,
      );
      const entity: any = ExtractJcamp(secondsTaggedMz);
      expect(entity.features[0].pageValue).toBeCloseTo(1.1228166666666666);
      expect(entity.features[1].pageValue).toBeCloseTo(1.1384333333333334);
    });
  })

  // extrFeaturesNi used to pick editPeak/autoPeak by looking up
  // jcamp.info.$CSCATEGORY.indexOf('EDIT_PEAK'/'AUTO_PEAK') and using that
  // as an index into the UNRELATED jcamp.spectra array. That only worked by
  // coincidence when the two arrays happened to line up 1:1 - an extra
  // $CSCATEGORY LDR anywhere else in the file (e.g. on a non-spectrum
  // section, as real multi-file/bagit archives can carry) desyncs them.
  // See issue #329's blank-graph/NaN-MHz report for a real-world case.
  describe('Test extrFeaturesNi editPeak/autoPeak assignment is position-based, not $CSCATEGORY-index-based (issue #329)', () => {
    it('still assigns editPeak/autoPeak to their own PEAKTABLE blocks when an extra $CSCATEGORY LDR desyncs the two arrays', () => {
      const injected = nmr13cJcamp.replace('##BLOCKS=1', '##BLOCKS=1\n##$CSCATEGORY=SOMETHING_ELSE');
      expect(injected).not.toEqual(nmr13cJcamp);

      const entity: any = ExtractJcamp(injected);
      const { editPeak, autoPeak } = entity.features;

      expect(editPeak).toBeDefined();
      expect(autoPeak).toBeDefined();
      // EDIT_PEAK block's own ##PEAKTABLE= starts at x=-11.045182110091531;
      // AUTO_PEAK's own starts at x=104.69281295027619 (see nmr13c_jcamp.js).
      // A desynced index would either swap these or run off the end of
      // jcamp.spectra entirely.
      expect(editPeak.data[0].x[0]).toBeCloseTo(-11.045182110091531);
      expect(autoPeak.data[0].x[0]).toBeCloseTo(104.69281295027619);
    });
  })
})