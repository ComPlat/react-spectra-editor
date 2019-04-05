import React from 'react';

import { SpectraViewer, FN } from '../src/index';
import MS from './source/MS';

const entity = FN.ExtractJcamp(MS);

const DemoSingleMs = () => (
  <div style={{ width: '1200px' }}>
    <SpectraViewer
      entity={entity}
    />
  </div>
);

export default DemoSingleMs;
