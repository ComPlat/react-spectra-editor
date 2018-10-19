import React from 'react';

import { SpectraViewer, ExtractJcamp } from '../src/index';
import TTC from './source/13C';

const file = ExtractJcamp(TTC);

const DemoSingle = () => {
  const { spectrum, peakObjs } = file;
  const input = spectrum.data[0];
  const xLabel = `X (${spectrum.xUnit})`;
  const yLabel = `Y (${spectrum.yUnit})`;
  const peakObj = peakObjs && peakObjs[0] ? peakObjs[0] : {};
  return (
    <div style={{ width: '1200px' }}>
      <SpectraViewer
        input={input}
        xLabel={xLabel}
        yLabel={yLabel}
        peakObj={peakObj}
      />
    </div>
  );
};

export default DemoSingle;
