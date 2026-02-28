import { CYCLIC_VOLTA_METRY } from '../constants/action_type';

const addNewCylicVoltaPairPeak = (payload) => (
  {
    type: CYCLIC_VOLTA_METRY.ADD_PAIR_PEAKS,
    payload,
  }
);

const removeCylicVoltaPairPeak = (payload) => (
  {
    type: CYCLIC_VOLTA_METRY.REMOVE_PAIR_PEAKS,
    payload,
  }
);

const addCylicVoltaMaxPeak = (payload) => (
  {
    type: CYCLIC_VOLTA_METRY.ADD_MAX_PEAK,
    payload,
  }
);

const removeCylicVoltaMaxPeak = (payload) => (
  {
    type: CYCLIC_VOLTA_METRY.REMOVE_MAX_PEAK,
    payload,
  }
);

const addCylicVoltaMinPeak = (payload) => (
  {
    type: CYCLIC_VOLTA_METRY.ADD_MIN_PEAK,
    payload,
  }
);

const removeCylicVoltaMinPeak = (payload) => (
  {
    type: CYCLIC_VOLTA_METRY.REMOVE_MIN_PEAK,
    payload,
  }
);

const setWorkWithMaxPeak = (payload) => (
  {
    type: CYCLIC_VOLTA_METRY.WORK_WITH_MAX_PEAK,
    payload,
  }
);

const selectPairPeak = (payload) => (
  {
    type: CYCLIC_VOLTA_METRY.SELECT_PAIR_PEAK,
    payload,
  }
);

const addCylicVoltaPecker = (payload) => (
  {
    type: CYCLIC_VOLTA_METRY.ADD_PECKER,
    payload,
  }
);

const removeCylicVoltaPecker = (payload) => (
  {
    type: CYCLIC_VOLTA_METRY.REMOVE_PECKER,
    payload,
  }
);

const selectRefPeaks = (payload) => (
  {
    type: CYCLIC_VOLTA_METRY.SELECT_REF_PEAK,
    payload,
  }
);

const setCylicVoltaRefFactor = (payload) => (
  {
    type: CYCLIC_VOLTA_METRY.SET_FACTOR,
    payload,
  }
);

const setCylicVoltaRef = (payload) => (
  {
    type: CYCLIC_VOLTA_METRY.SET_REF,
    payload,
  }
);

const setCyclicVoltaAreaValue = (value) => ({
  type: CYCLIC_VOLTA_METRY.SET_AREA_VALUE,
  payload: { value },
});

const setCyclicVoltaAreaUnit = (unit) => ({
  type: CYCLIC_VOLTA_METRY.SET_AREA_UNIT,
  payload: { unit },
});

const toggleCyclicVoltaDensity = (payload) => ({
  type: CYCLIC_VOLTA_METRY.TOGGLE_DENSITY,
  payload,
});

export {
  addNewCylicVoltaPairPeak, removeCylicVoltaPairPeak,
  addCylicVoltaMaxPeak, removeCylicVoltaMaxPeak,
  addCylicVoltaMinPeak, removeCylicVoltaMinPeak,
  setWorkWithMaxPeak, selectPairPeak,
  addCylicVoltaPecker, removeCylicVoltaPecker,
  selectRefPeaks, setCylicVoltaRefFactor,
  setCylicVoltaRef,
  setCyclicVoltaAreaValue,
  setCyclicVoltaAreaUnit,
  toggleCyclicVoltaDensity,
};
