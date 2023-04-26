import { ToXY, IsSame, PksEdit, PeckersEdit } from "../../../helpers/converter";

describe('Test Converter', () => {
  type VoltammetryPeaks = { max: any, min: any, pecker: any}
  type EditPeaks = { selectedIdx: number, peaks: {}[]}

  describe('Convert peak to xy data', () => {
    it('ToXY without data', () => {
      const peaks = ToXY(null)
      expect(peaks).toEqual([])
    })

    it('ToXY with data', () => {
      const inputData = [{x: 1, y: 1}, {x: 2, y: 1}, {x: 2.14, y: 1.15}]
      const resultData = [[1, 1], [2, 1], [2.14, 1.15]]

      const peaks = ToXY(inputData)
      expect(peaks).toEqual(resultData)
    })
  })

  describe('Check two number is the same', () => {
    it('Not the same', () => {
      const val1 = 1.14
      const val2 = 1.15

      const isTheSame = IsSame(val1, val2)
      expect(isTheSame).toEqual(false)
    })

    it('Is the same', () => {
      const val1 = 1.14000001532
      const val2 = 1.14000005678

      const isTheSame = IsSame(val1, val2)
      expect(isTheSame).toEqual(true)
    })
  })


  

  describe('Get edit peaks', () => {
    let dataPeaks: {}[]
    let expectedPeaks: {}[]
    
    let editPeaks: EditPeaks

    beforeEach(() => {
      dataPeaks = [{x: 1, y: 1}, {x: 2, y: 1}, {x: 3.14, y: 1.15}, {x: 2.14, y: -1.15}]
      editPeaks = { selectedIdx: 0, peaks: [{pos: [{x: 1, y: 1}], neg: [{x: 2.14, y: -1.15}]}] }
      expectedPeaks = [{x: 1, y: 1}, {x: 2, y: 1}, {x: 3.14, y: 1.15}]
    })

    it('Cannot find edited peaks at index', () => {
      editPeaks.selectedIdx = 1
      
      const newEditPeaks = PksEdit(dataPeaks, editPeaks)
      expect(newEditPeaks).toEqual(dataPeaks)
    })

    it('No new edited peaks yet', () => {
      editPeaks.peaks = [{pos: null, neg: null}]
      
      const newEditPeaks = PksEdit(dataPeaks, editPeaks)
      expect(newEditPeaks).toEqual(dataPeaks)
    })

    it('Positive edited peaks are empty', () => {
      editPeaks.peaks = [{pos: null, neg: [{x: 2.14, y: -1.15}]}]
      
      const newEditPeaks = PksEdit(dataPeaks, editPeaks)
      expect(newEditPeaks).toEqual([{x: 1, y: 1}, {x: 2, y: 1}, {x: 3.14, y: 1.15}])
    })

    it('Negative edited peaks are empty', () => {
      editPeaks.peaks = [{pos: [{x: 1, y: 1}], neg: null}]
      
      const newEditPeaks = PksEdit(dataPeaks, editPeaks)
      expect(newEditPeaks).toEqual([{x: 1, y: 1}, {x: 2, y: 1}, {x: 2.14, y: -1.15}, {x: 3.14, y: 1.15}])
    })

    it('Get new edited peaks', () => {
      const newEditPeaks = PksEdit(dataPeaks, editPeaks)
      expect(newEditPeaks).toEqual(expectedPeaks)
    })

    it('Get new edited peaks as voltammetry', () => {
      const voltammetryPeak: VoltammetryPeaks[] = [
        {max: {x: 1.0, y: 2.0}, min: {x: 3.0, y: -2.0}, pecker: null},
        {max: {x: 2.0, y: 2.0}, min: {x: 1.5, y: -2.0}, pecker: null}
      ]
      const expectedData = [{x: 1.0, y: 2.0}, {x: 1.5, y: -2.0}, {x: 2.0, y: 2.0}, {x: 3.0, y: -2.0}]
      const newEditPeaks = PksEdit(dataPeaks, editPeaks, voltammetryPeak)
      expect(newEditPeaks).toEqual(expectedData)
    })
  })

  describe('Get voltammetry peckers', () => {
    it('Get peckers list empty', () => {
      const voltammetryPeak: VoltammetryPeaks[] = [{max: null, min: null, pecker: null}]
      const expectedData = [{x: 1.0, y: 2.0}, {x: 1.5, y: -2.0}, {x: 2.0, y: 2.0}, {x: 3.0, y: -2.0}]
      const peckers = PeckersEdit(voltammetryPeak)
      expect(peckers).toEqual([])
    })

    it('Get peckers list', () => {
      const voltammetryPeak: VoltammetryPeaks[] = [{max: null, min: null, pecker: {x: 1.0, y: 2.0}}]
      const expectedData = [{x: 1.0, y: 2.0}]
      const peckers = PeckersEdit(voltammetryPeak)
      expect(peckers).toEqual(expectedData)
    })
  })
})
