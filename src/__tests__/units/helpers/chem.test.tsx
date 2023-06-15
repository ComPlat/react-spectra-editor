import {
  ExtractJcamp, Topic2Seed, Convert2Peak, Feature2Peak, ToThresEndPts, ToShiftPeaks,
  ToFrequency, Convert2Scan, Convert2Thres, GetComparisons, Convert2DValue, GetCyclicVoltaRatio, GetCyclicVoltaPeakSeparate, convertTopic, Convert2MaxMinPeak, Feature2MaxMinPeak
} from "../../../helpers/chem";
import nmr1HJcamp from "../../fixtures/nmr1h_jcamp";
import aifJcamp1 from "../../fixtures/aif_jcamp_1";
import { LIST_SHIFT_1H } from "../../../constants/list_shift";
import { LIST_LAYOUT } from "../../../constants/list_layout";
import emissionsJcamp from "../../fixtures/emissions_jcamp";
import dlsAcfJcamp from "../../fixtures/dls_acf_jcamp";

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
  })

  describe('Feature2Peak', () => {
    //TODO: need more implementation
    it('Get peaks from feature', () => {
      const state = {
        curve: { curveIdx: 0 },
        shift: { shifts: [] },
        layout: LIST_LAYOUT.H1, threshold: { value: 55 } } // threshold at 55%
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
      const state = { shift: { ref: null }, layout: '1H', threshold: {value: 55} } // threshold at 55%
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
      LIST_LAYOUT.TGA, LIST_LAYOUT.CYCLIC_VOLTAMMETRY,
      LIST_LAYOUT.CDS, LIST_LAYOUT.SEC]

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
        expect(peaksList).toEqual({max: [{x: 2, y: 2}], min: [{x: -1, y: -1}], pecker: []})
      })

      it('Feature has voltammetry data', () => {
        const feature = { 
          data: [
            { x: [1, 2, -1], y: [1, 2, -1]}
          ],
          upperThres: 90.0, lowerThres: 90.0, maxY: 2, minY: -1,
          volammetryData: [{ max: { x: 1, y: 1 }, min: { x: -1, y: -1 }, pecker: { x: 3, y: 3 } }]
        }
        const peaksList = Convert2MaxMinPeak(LIST_LAYOUT.CYCLIC_VOLTAMMETRY, feature, 0)
        expect(peaksList).toEqual({max: [{x: 1, y: 1}], min: [{x: -1, y: -1}], pecker: [{ x: 3, y: 3 }]})
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
        volammetryData: [{ max: { x: 1, y: 1 }, min: { x: -1, y: -1 }, pecker: { x: 3, y: 3 } }]
      }
      const props = { feature: feature}
      const peaksList = Feature2MaxMinPeak(state, props)
      expect(peaksList).toEqual({max: [{x: 1, y: 1}], min: [{x: -1, y: -1}], pecker: [{ x: 3, y: 3 }]})
    })
  })

})