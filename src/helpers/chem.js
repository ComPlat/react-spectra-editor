import Jcampconverter from 'jcampconverter';
import { createSelector } from 'reselect';

const getSpectrum = (_, props) => props.input;

const convertSpectrum = (spectrum) => {
  const sp = [];
  for (let i = 0; i < spectrum.y.length; i += 1) {
    if (i % 2 === 0) {
      const x = spectrum.x[i];
      const y = spectrum.y[i];
      sp.push({ x, y });
    }
  }
  return sp;
};

const Spectrum2Seed = createSelector(
  getSpectrum,
  convertSpectrum,
);

const getPeakObj = (_, props) => props.peakObj;

const convertPeak = (peakObj) => {
  const peak = [];
  const data = peakObj.data[0];
  for (let i = 0; i < data.y.length; i += 1) {
    const x = data.x[i];
    const y = data.y[i];
    peak.push({ x, y });
  }
  return peak;
};

const Spectrum2Peak = createSelector(
  getPeakObj,
  convertPeak,
);

const Extract = (input) => {
  const jcamp = Jcampconverter.convert(input, { xy: true });
  const subTyp = jcamp.xType ? ` - ${jcamp.xType}` : '';

  const spectrum = jcamp.spectra.map(s => (
    s.dataType
      && (
        s.dataType.includes('NMR SPECTRUM')
        || s.dataType.includes('INFRARED SPECTRUM')
      )
      ? Object.assign({ typ: s.dataType + subTyp }, s)
      : null
  )).filter(r => r != null)[0];

  const peakObjs = jcamp.spectra.map(s => (
    s.dataType && s.dataType.includes('PEAK ASSIGNMENTS')
      ? Object.assign({ typ: s.dataType + subTyp }, s)
      : null
  )).filter(r => r != null);

  return { spectrum, peakObjs };
};

export { Extract, Spectrum2Seed, Spectrum2Peak };
