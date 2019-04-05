import React from 'react';

import { SpectraViewer, FN } from '../src/index';
import C13_CPD from './source/C13_CPD';

const entity = FN.ExtractJcamp(C13_CPD);

const DemoSingle = () => (
  <div style={{ width: '1200px' }}>
    <SpectraViewer
      entity={entity}
    />
  </div>
);

export default DemoSingle;
