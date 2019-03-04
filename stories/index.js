import React from 'react';
import { storiesOf } from '@storybook/react';

import DemoSingle from './demo_single';
import DemoEdit from './demo_edit';
import DemoSelect from './demo_select';
import DemoWriteNmr from './demo_write_nmr';
import DemoWriteIr from './demo_write_ir';

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
  .add('write NMR peaks to description', () => (
    <DemoWriteNmr />
  ))
  .add('write IR peaks to description', () => (
    <DemoWriteIr />
  ));
