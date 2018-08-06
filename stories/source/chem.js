import Jcampconverter from 'jcampconverter';
// import spf from 'simplify-js';

const Convert = (spectrum) => {
  const sp = [];
  for (let i = 0; i < spectrum.y.length; i += 1) {
    if (i % 2 === 0) {
      const x = spectrum.x[i];
      const y = spectrum.y[i];
      sp.push({ x, y });
    }
  }

  // const simple = spf(sp, 0.005, true);
  return sp;
};

const Extract = (input) => {
  const jcamp = Jcampconverter.convert(input, { xy: true });
  const subTyp = jcamp.xType ? ` - ${jcamp.xType}` : '';

  const targets = jcamp.spectra.map(s => (
    s.dataType && !s.dataType.includes('FID')
      ? Object.assign({ typ: s.dataType + subTyp }, s)
      : null
  )).filter(r => r != null);

  return targets;
};

export { Extract, Convert };
