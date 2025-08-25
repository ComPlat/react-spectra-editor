/* eslint-disable prefer-object-spread, default-param-last */
import { CYCLIC_VOLTA_METRY } from '../constants/action_type';
import { GetCyclicVoltaPeakSeparate } from '../helpers/chem';

const initialState = {
  spectraList: [],
  areaValue: 1.0,
  areaUnit: 'cm²',
  useCurrentDensity: false,
};

const initSpectra = {
  list: [],
  origin: [],
  selectedIdx: -1,
  isWorkMaxPeak: true,
  jcampIdx: -1,
  shift: {
    ref: null, val: 0, prevValue: 0,
  },
  hasRefPeak: false,
  history: [],
};

const addPairPeak = (state, action) => {
  const { payload } = action;
  const { spectraList } = state;
  if (payload !== undefined) {
    let spectra = spectraList[payload];
    if (!spectra) {
      spectra = initSpectra;
      spectraList.push(spectra);
    }
    const { list, selectedIdx } = spectra;
    let index = selectedIdx;
    index += 1;
    const newList = list.map((item) => {  // eslint-disable-line
      return { ...item };
    });
    newList.push({
      min: null, max: null, isRef: false, e12: null, createdAt: Date.now(),
    });

    spectraList[payload] = Object.assign({}, spectra, { list: newList, selectedIdx: index, origin: [...newList] }); // eslint-disable-line
    return Object.assign({}, state, { spectraList });
  }
  return state;
};

const removePairPeak = (state, action) => {
  const { payload } = action;
  const { spectraList } = state;
  if (payload !== undefined) {
    const { index, jcampIdx } = payload;
    const spectra = spectraList[jcampIdx];
    if (spectra) {
      const { list, origin } = spectra;
      list.splice(index, 1);
      origin.splice(index, 1);
      spectraList[jcampIdx] = Object.assign({}, spectra, { list, selectedIdx: index, origin });
      return Object.assign({}, state, { spectraList });
    }
    return state;
  }
  return state;
};

const getE12 = (data) => {
  if (data.max && data.min) {
    const { max, min } = data;
    const delta = GetCyclicVoltaPeakSeparate(max.x, min.x);
    return Math.min(max.x, min.x) + 0.5 * delta;
  }
  return null;
};

const addPeak = (state, action, isMax = true) => {
  const { payload } = action;
  const { spectraList } = state;
  if (payload) {
    const { peak, index, jcampIdx } = payload;
    const spectra = spectraList[jcampIdx];
    const { list } = spectra;
    const newList = list.map((item) => {  // eslint-disable-line
      return { ...item };
    });
    let pairPeak = newList[index];
    if (isMax) {
      pairPeak = Object.assign({}, pairPeak, { max: peak });
    } else {
      pairPeak = Object.assign({}, pairPeak, { min: peak });
    }
    pairPeak.e12 = getE12(pairPeak);
    pairPeak.updatedAt = Date.now();
    newList[index] = pairPeak;

    spectraList[jcampIdx] = Object.assign(
      {},
      spectra,
      {
        list: newList, selectedIdx: index, jcampIdx, origin: [...newList],
      },
    );
    return Object.assign({}, state, { spectraList });
  }
  return state;
};

const removePeak = (state, action, isMax = true) => {
  const { payload } = action;
  const { spectraList } = state;
  if (payload) {
    const { index, jcampIdx } = payload;
    const spectra = spectraList[jcampIdx];
    const { list } = spectra;
    const newList = list;
    const pairPeak = newList[index];
    if (isMax) {
      pairPeak.max = null;
    } else {
      pairPeak.min = null;
    }
    pairPeak.e12 = getE12(pairPeak);
    pairPeak.updatedAt = Date.now();
    newList[index] = pairPeak;

    spectraList[jcampIdx] = Object.assign(
      {},
      spectra,
      {
        list: newList, selectedIdx: index, jcampIdx, origin: [...newList],
      },
    );
    return Object.assign({}, state, { spectraList });
  }
  return state;
};

const selectPairPeak = (state, action) => {
  const { payload } = action;
  if (payload !== undefined) {
    const { spectraList } = state;
    const { index, jcampIdx } = payload;
    const spectra = spectraList[jcampIdx];
    if (spectra) {
      spectraList[jcampIdx] = Object.assign({}, spectra, { selectedIdx: index });
      return Object.assign({}, state, { spectraList });
    }
    return state;
  }
  return state;
};

const setWorkWithMaxPeak = (state, action) => {
  const { payload } = action;
  if (payload !== undefined) {
    const { spectraList } = state;
    const { isMax, jcampIdx } = payload;
    const spectra = spectraList[jcampIdx];
    if (spectra) {
      spectraList[jcampIdx] = Object.assign({}, spectra, { isWorkMaxPeak: isMax });
      return Object.assign({}, state, { spectraList });
    }
    return state;
  }
  return state;
};

const addPecker = (state, action) => {
  const { payload } = action;
  const { spectraList } = state;
  if (payload) {
    const { peak, index, jcampIdx } = payload;
    const spectra = spectraList[jcampIdx];
    const { list } = spectra;
    const newList = list;
    const pairPeak = newList[index];
    pairPeak.pecker = peak;
    pairPeak.updatedAt = Date.now();
    newList[index] = pairPeak;

    spectraList[jcampIdx] = Object.assign(
      {},
      spectra,
      {
        list: newList, selectedIdx: index, jcampIdx, origin: [...newList],
      },
    );
    return Object.assign({}, state, { spectraList });
  }
  return state;
};

const removePecker = (state, action) => {
  const { payload } = action;
  const { spectraList } = state;
  if (payload) {
    const { index, jcampIdx } = payload;
    const spectra = spectraList[jcampIdx];
    const { list } = spectra;
    const newList = list;
    const pairPeak = newList[index];
    pairPeak.pecker = null;
    pairPeak.updatedAt = Date.now();
    newList[index] = pairPeak;

    spectraList[jcampIdx] = Object.assign(
      {},
      spectra,
      {
        list: newList, selectedIdx: index, jcampIdx, origin: [...newList],
      },
    );
    return Object.assign({}, state, { spectraList });
  }
  return state;
};

const setRef = (state, action) => {
  const { payload } = action;
  const { spectraList } = state;
  if (payload) {
    const { jcampIdx } = payload;
    const spectra = spectraList[jcampIdx];
    const {
      list, shift, hasRefPeak, history,
    } = spectra;
    const newShift = Object.assign({}, shift);
    const refPeaks = list.filter((pairPeak) => pairPeak.isRef === true);
    let offset = 0.0;
    if (hasRefPeak) {
      const currRefPeaks = refPeaks[0];
      newShift.ref = currRefPeaks;
      const { val } = shift;
      const { e12 } = currRefPeaks;
      offset = e12 - val;
      const newList = spectra.list.map((pairPeak) => { //eslint-disable-line
        const {
          max, min, pecker, isRef,
        } = pairPeak;
        let newMax = null;
        let newMin = null;
        let newPecker = null;
        if (max) {
          newMax = hasRefPeak
            ? { x: max.x - offset, y: max.y } : { x: max.x + parseFloat(offset), y: max.y };
        }
        if (min) {
          newMin = hasRefPeak
            ? { x: min.x - offset, y: min.y } : { x: min.x + parseFloat(offset), y: min.y };
        }
        if (pecker) {
          newPecker = hasRefPeak
            ? { x: pecker.x - offset, y: pecker.y } : { x: pecker.x + parseFloat(offset), y: pecker.y }; //eslint-disable-line
        }
        const newPairPeak = Object.assign({}, pairPeak, { max: newMax , min: newMin, pecker: newPecker }); //eslint-disable-line
        newPairPeak.e12 = getE12(newPairPeak);
        newPairPeak.updatedAt = Date.now();
        if (isRef) {
          newShift.ref = newPairPeak;
          newShift.prevValue += offset;
        }
        return newPairPeak;
      });
      history.push(...[newList]);
      spectra.list = newList;
    } else {
      newShift.ref = null;
      const { val } = newShift;
      offset = val;

      const newList = spectra.origin.map((pairPeak) => { //eslint-disable-line
        const {
          max, min, pecker,
        } = pairPeak;
        let newMax = null;
        let newMin = null;
        let newPecker = null;
        if (max) {
          newMax = { x: max.x + parseFloat(val), y: max.y };
        }
        if (min) {
          newMin = { x: min.x + parseFloat(val), y: min.y };
        }
        if (pecker) {
          newPecker = { x: pecker.x + parseFloat(val), y: pecker.y };
        }
        const newPairPeak = Object.assign({}, pairPeak, { max: newMax , min: newMin, pecker: newPecker, isRef: false }); //eslint-disable-line
        newPairPeak.e12 = getE12(newPairPeak);
        newPairPeak.updatedAt = Date.now();
        return newPairPeak;
      });

      history.push(...[newList]);
      spectra.list = newList;
      newShift.prevValue = parseFloat(offset);
    }

    spectraList[jcampIdx] = Object.assign(
      {},
      spectra,
      { shift: newShift, jcampIdx },
    );
    return Object.assign({}, state, { spectraList });
  }
  return state;
};

const selectRefPeaks = (state, action) => {
  const { payload } = action;
  const { spectraList } = state;
  if (payload) {
    const { index, jcampIdx, checked } = payload;
    const spectra = spectraList[jcampIdx];
    const { list, shift, history } = spectra;
    const newShift = shift;
    const newList = list;
    newList.forEach((pairPeak, idx) => {
      const newPairPeak = pairPeak;
      newPairPeak.isRef = false;
      newPairPeak.updatedAt = Date.now();
      if (idx === index) {
        newPairPeak.isRef = checked;
        newList[index] = newPairPeak;
      }
    });
    const refPeaks = newList.filter((pairPeak) => pairPeak.isRef === true);
    const hasRefPeak = refPeaks.length > 0;
    history.push(...[newList]);
    spectraList[jcampIdx] = Object.assign(
      {},
      spectra,
      {
        list: newList, selectedIdx: index, jcampIdx, hasRefPeak, shift: newShift,
      },
    );
    return Object.assign({}, state, { spectraList });
  }
  return state;
};

const selectRefFactor = (state, action) => {
  const { payload } = action;
  const { spectraList } = state;
  if (payload) {
    const { factor, curveIdx } = payload;
    const spectra = spectraList[curveIdx];
    const { shift } = spectra;
    const newShift = Object.assign({}, shift);
    newShift.val = factor;
    spectraList[curveIdx] = Object.assign(
      {},
      spectra,
      { shift: newShift, jcampIdx: curveIdx },
    );
    return Object.assign({}, state, { spectraList });
  }
  return state;
};

const cyclicVoltaReducer = (state = initialState, action) => {
  switch (action.type) {
    case CYCLIC_VOLTA_METRY.ADD_PAIR_PEAKS:
      return addPairPeak(state, action);
    case CYCLIC_VOLTA_METRY.REMOVE_PAIR_PEAKS:
      return removePairPeak(state, action);
    case CYCLIC_VOLTA_METRY.ADD_MAX_PEAK:
      return addPeak(state, action);
    case CYCLIC_VOLTA_METRY.REMOVE_MAX_PEAK:
      return removePeak(state, action);
    case CYCLIC_VOLTA_METRY.ADD_MIN_PEAK:
      return addPeak(state, action, false);
    case CYCLIC_VOLTA_METRY.REMOVE_MIN_PEAK:
      return removePeak(state, action, false);
    case CYCLIC_VOLTA_METRY.WORK_WITH_MAX_PEAK:
      return setWorkWithMaxPeak(state, action);
    case CYCLIC_VOLTA_METRY.SELECT_PAIR_PEAK:
      return selectPairPeak(state, action);
    case CYCLIC_VOLTA_METRY.ADD_PECKER:
      return addPecker(state, action);
    case CYCLIC_VOLTA_METRY.REMOVE_PECKER:
      return removePecker(state, action);
    case CYCLIC_VOLTA_METRY.SET_REF:
      return setRef(state, action);
    case CYCLIC_VOLTA_METRY.SELECT_REF_PEAK:
      return selectRefPeaks(state, action);
    case CYCLIC_VOLTA_METRY.SET_FACTOR:
      return selectRefFactor(state, action);
    case CYCLIC_VOLTA_METRY.RESETALL:
      return Object.assign({}, state, { spectraList: [] });
    case CYCLIC_VOLTA_METRY.SET_AREA_VALUE: {
      const { value } = action.payload;
      if (value === '') {
        return Object.assign({}, state, { areaValue: '' });
      }
      const areaValue = Number.isFinite(value) ? value : state.areaValue;
      return Object.assign({}, state, { areaValue });
    }
    case CYCLIC_VOLTA_METRY.SET_AREA_UNIT: {
      const { unit } = action.payload;
      return Object.assign({}, state, { areaUnit: unit });
    }
    case CYCLIC_VOLTA_METRY.TOGGLE_DENSITY: {
      return Object.assign({}, state, { useCurrentDensity: !state.useCurrentDensity });
    }
    default:
      return state;
  }
};

export default cyclicVoltaReducer;
