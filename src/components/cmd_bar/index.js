/* eslint-disable prefer-object-spread, function-paren-newline,
react/function-component-definition, react/require-default-props */
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import PropTypes from 'prop-types';

import withStyles from '@mui/styles/withStyles';

import { commonStyle } from './common';
import Viewer from './01_viewer';
import Zoom from './02_zoom';
import Peak from './03_peak';
import Integration from './04_integration';
import Multiplicity from './05_multiplicity';
import UndoRedo from './06_undo_redo';
import Layout from './r01_layout';
import Threshold from './r03_threshold';
import Submit from './r04_submit';
import Wavelength from './r07_wavelength_btn';
import Pecker from './07_pecker';
import ChangeAxes from './r08_change_axes';
import Offset from './08_offsets';

const styles = () => (
  Object.assign(
    {},
    {

    },
    commonStyle,
  )
);

const CmdBar = ({
  classes, feature, hasEdit, forecast, operations, editorOnly, jcampIdx, hideThreshold,
}) => (
  <div className={classes.card}>
    <Viewer editorOnly={editorOnly} />
    <Zoom />
    <Peak jcampIdx={jcampIdx} />
    <Pecker jcampIdx={jcampIdx} />
    <Integration />
    <Multiplicity />
    <Offset />
    <UndoRedo />
    <Submit
      operations={operations}
      feature={feature}
      forecast={forecast}
      editorOnly={editorOnly}
      hideSwitch={false}
      disabled={false}
    />
    {
      hideThreshold ? null : (<Threshold feature={feature} hasEdit={hasEdit} />)
    }
    <Layout feature={feature} hasEdit={hasEdit} />
    <Wavelength />
    <ChangeAxes />
  </div>
);

const mapStateToProps = (state, _) => ( // eslint-disable-line
  {
  }
);

const mapDispatchToProps = (dispatch) => (
  bindActionCreators({
  }, dispatch)
);

CmdBar.propTypes = {
  classes: PropTypes.object.isRequired,
  feature: PropTypes.object.isRequired,
  forecast: PropTypes.object.isRequired,
  hasEdit: PropTypes.bool.isRequired,
  operations: PropTypes.array.isRequired,
  editorOnly: PropTypes.bool.isRequired,
  jcampIdx: PropTypes.any,
  hideThreshold: PropTypes.bool,
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withStyles(styles),
)(CmdBar);
