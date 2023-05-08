import {
  addNewCylicVoltaPairPeak, removeCylicVoltaPairPeak,
  addCylicVoltaMaxPeak, removeCylicVoltaMaxPeak,
  addCylicVoltaMinPeak, removeCylicVoltaMinPeak,
  setWorkWithMaxPeak, selectPairPeak,
  addCylicVoltaPecker, removeCylicVoltaPecker,
} from "../../actions/cyclic_voltammetry";
import { CYCLIC_VOLTA_METRY } from "../../constants/action_type";

describe('Test redux action for cyclic voltammetry', () => {
  describe('Test action pair of peaks', () => {
    it('Add pair of peaks', () => {
      const pairPeaks = { max: 1, min: 0, pecker: 2 }
      const result = addNewCylicVoltaPairPeak(pairPeaks)
      const { type, payload } = result
      expect(type).toEqual(CYCLIC_VOLTA_METRY.ADD_PAIR_PEAKS)
      expect(payload).toEqual(pairPeaks)
    })

    it('Remove pair of peaks', () => {
      const pairPeaks = { max: 1, min: 0, pecker: 2 }
      const result = removeCylicVoltaPairPeak(pairPeaks)
      const { type, payload } = result
      expect(type).toEqual(CYCLIC_VOLTA_METRY.REMOVE_PAIR_PEAKS)
      expect(payload).toEqual(pairPeaks)
    })

    it('Select pair of peaks', () => {
      const index = 2
      const result = selectPairPeak(index)
      const { type, payload } = result
      expect(type).toEqual(CYCLIC_VOLTA_METRY.SELECT_PAIR_PEAK)
      expect(payload).toEqual(index)
    })
  })

  describe('Test action max peak', () => {
    it('Add max peak', () => {
      const maxPeak = { x: 1, y: 2 }
      const result = addCylicVoltaMaxPeak(maxPeak)
      const { type, payload } = result
      expect(type).toEqual(CYCLIC_VOLTA_METRY.ADD_MAX_PEAK)
      expect(payload).toEqual(maxPeak)
    })

    it('Remove max peak', () => {
      const maxPeak = { x: 1, y: 2 }
      const result = removeCylicVoltaMaxPeak(maxPeak)
      const { type, payload } = result
      expect(type).toEqual(CYCLIC_VOLTA_METRY.REMOVE_MAX_PEAK)
      expect(payload).toEqual(maxPeak)
    })

    it('Set work with max peak', () => {
      const isOnMaxPeak = setWorkWithMaxPeak(true)
      const { type, payload } = isOnMaxPeak
      expect(type).toEqual(CYCLIC_VOLTA_METRY.WORK_WITH_MAX_PEAK)
      expect(payload).toEqual(true)
    })
  })

  describe('Test action min peak', () => {
    it('Add min peak', () => {
      const minPeak = { x: 1, y: 2 }
      const result = addCylicVoltaMinPeak(minPeak)
      const { type, payload } = result
      expect(type).toEqual(CYCLIC_VOLTA_METRY.ADD_MIN_PEAK)
      expect(payload).toEqual(minPeak)
    })

    it('Remove min peak', () => {
      const minPeak = { x: 1, y: 2 }
      const result = removeCylicVoltaMinPeak(minPeak)
      const { type, payload } = result
      expect(type).toEqual(CYCLIC_VOLTA_METRY.REMOVE_MIN_PEAK)
      expect(payload).toEqual(minPeak)
    })

    it('Set work with max peak', () => {
      const isOnMinPeak = setWorkWithMaxPeak(false)
      const { type, payload } = isOnMinPeak
      expect(type).toEqual(CYCLIC_VOLTA_METRY.WORK_WITH_MAX_PEAK)
      expect(payload).toEqual(false)
    })
  })

  describe('Test action pecker', () => {
    it('Add pecker', () => {
      const pecker = { x: 1, y: 2 }
      const result = addCylicVoltaPecker(pecker)
      const { type, payload } = result
      expect(type).toEqual(CYCLIC_VOLTA_METRY.ADD_PECKER)
      expect(payload).toEqual(pecker)
    })

    it('Remove pecker', () => {
      const pecker = { x: 1, y: 2 }
      const result = removeCylicVoltaPecker(pecker)
      const { type, payload } = result
      expect(type).toEqual(CYCLIC_VOLTA_METRY.REMOVE_PECKER)
      expect(payload).toEqual(pecker)
    })
  })
})
