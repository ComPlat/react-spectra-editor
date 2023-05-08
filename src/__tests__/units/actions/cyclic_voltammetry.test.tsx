import {
  addNewCylicVoltaPairPeak, removeCylicVoltaPairPeak,
  addCylicVoltaMaxPeak, removeCylicVoltaMaxPeak,
  addCylicVoltaMinPeak, removeCylicVoltaMinPeak,
  setWorkWithMaxPeak, selectPairPeak,
  addCylicVoltaPecker, removeCylicVoltaPecker,
} from "../../../actions/cyclic_voltammetry";
import { CYCLIC_VOLTA_METRY } from "../../../constants/action_type";

describe('Test redux action for cyclic voltammetry', () => {
  describe('Test action pair of peaks', () => {
    it('Add pair of peaks', () => {
      const pairPeaks = { max: 1, min: 0, pecker: 2 }
      const { type, payload } = addNewCylicVoltaPairPeak(pairPeaks)
      expect(type).toEqual(CYCLIC_VOLTA_METRY.ADD_PAIR_PEAKS)
      expect(payload).toEqual(pairPeaks)
    })

    it('Remove pair of peaks', () => {
      const pairPeaks = { max: 1, min: 0, pecker: 2 }
      const { type, payload } = removeCylicVoltaPairPeak(pairPeaks)
      expect(type).toEqual(CYCLIC_VOLTA_METRY.REMOVE_PAIR_PEAKS)
      expect(payload).toEqual(pairPeaks)
    })

    it('Select pair of peaks', () => {
      const index = 2
      const { type, payload } = selectPairPeak(index)
      expect(type).toEqual(CYCLIC_VOLTA_METRY.SELECT_PAIR_PEAK)
      expect(payload).toEqual(index)
    })
  })

  describe('Test action max peak', () => {
    it('Add max peak', () => {
      const maxPeak = { x: 1, y: 2 }
      const { type, payload } = addCylicVoltaMaxPeak(maxPeak)
      expect(type).toEqual(CYCLIC_VOLTA_METRY.ADD_MAX_PEAK)
      expect(payload).toEqual(maxPeak)
    })

    it('Remove max peak', () => {
      const maxPeak = { x: 1, y: 2 }
      const { type, payload } = removeCylicVoltaMaxPeak(maxPeak)
      expect(type).toEqual(CYCLIC_VOLTA_METRY.REMOVE_MAX_PEAK)
      expect(payload).toEqual(maxPeak)
    })

    it('Set work with max peak', () => {
      const { type, payload } = setWorkWithMaxPeak(true)
      expect(type).toEqual(CYCLIC_VOLTA_METRY.WORK_WITH_MAX_PEAK)
      expect(payload).toEqual(true)
    })
  })

  describe('Test action min peak', () => {
    it('Add min peak', () => {
      const minPeak = { x: 1, y: 2 }
      const { type, payload } = addCylicVoltaMinPeak(minPeak)
      expect(type).toEqual(CYCLIC_VOLTA_METRY.ADD_MIN_PEAK)
      expect(payload).toEqual(minPeak)
    })

    it('Remove min peak', () => {
      const minPeak = { x: 1, y: 2 }
      const { type, payload } = removeCylicVoltaMinPeak(minPeak)
      expect(type).toEqual(CYCLIC_VOLTA_METRY.REMOVE_MIN_PEAK)
      expect(payload).toEqual(minPeak)
    })

    it('Set work with max peak', () => {
      const { type, payload } = setWorkWithMaxPeak(false)
      expect(type).toEqual(CYCLIC_VOLTA_METRY.WORK_WITH_MAX_PEAK)
      expect(payload).toEqual(false)
    })
  })

  describe('Test action pecker', () => {
    it('Add pecker', () => {
      const pecker = { x: 1, y: 2 }
      const { type, payload } = addCylicVoltaPecker(pecker)
      expect(type).toEqual(CYCLIC_VOLTA_METRY.ADD_PECKER)
      expect(payload).toEqual(pecker)
    })

    it('Remove pecker', () => {
      const pecker = { x: 1, y: 2 }
      const { type, payload } = removeCylicVoltaPecker(pecker)
      expect(type).toEqual(CYCLIC_VOLTA_METRY.REMOVE_PECKER)
      expect(payload).toEqual(pecker)
    })
  })
})
