import React from 'react';
import { storiesOf } from '@storybook/react';

import DemoSingle from './demo_single';
import DemoEdit from './demo_edit';
import DemoSelect from './demo_select';
import DemoWritePeaks from './demo_write_peaks';

storiesOf('SpectraViewer', module)
  .add('single spectrum', () => (
    <DemoSingle />
  ))
  .add('edited spectrum', () => (
    <DemoEdit />
  ))
  .add('spectra with selection', () => (
    <DemoSelect />
  ))
  .add('write peaks to description', () => (
    <DemoWritePeaks />
  ));
