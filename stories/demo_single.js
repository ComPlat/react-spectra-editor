import React from 'react';

import { SpectraEditor, FN } from '../src/app';
import C13_CPD from './source/C13_CPD';

const entity = FN.ExtractJcamp(C13_CPD);

const DemoSingle = () => (
  <div style={{ width: '1200px' }}>
    <SpectraEditor
      entity={entity}
    />
  </div>
);

export default DemoSingle;
