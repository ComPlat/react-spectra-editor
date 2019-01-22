import React from 'react';

import { SpectraViewer, FN } from '../src/index';
import C13_CPD from './source/C13_CPD';

const file = FN.ExtractJcamp(C13_CPD);

const noDataAvailable = () => (
  <div>
    No data available!
  </div>
);

const DemoSingle = () => {
  const { spectrum, peakObjs } = file;
  if (!spectrum) return noDataAvailable();
  const input = spectrum.data[0];
  const xLabel = `X (${spectrum.xUnit})`;
  const yLabel = `Y (${spectrum.yUnit})`;
  return (
    <div style={{ width: '1200px' }}>
      <SpectraViewer
        input={input}
        xLabel={xLabel}
        yLabel={yLabel}
        peakObjs={peakObjs}
      />
    </div>
  );
};

export default DemoSingle;
