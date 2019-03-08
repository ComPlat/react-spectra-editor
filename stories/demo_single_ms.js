import React from 'react';

import { SpectraViewer, FN } from '../src/index';
import MS from './source/MS';

const file = FN.ExtractJcamp(MS);

const noDataAvailable = () => (
  <div>
    No data available!
  </div>
);

const DemoSingleMs = () => {
  const { spectrum, peakObjs } = file;
  if (!spectrum) return noDataAvailable();
  const input = spectrum.data[0];
  const xLabel = 'X (m/z)';
  const yLabel = 'Y (Relative Abundance)';
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

export default DemoSingleMs;
