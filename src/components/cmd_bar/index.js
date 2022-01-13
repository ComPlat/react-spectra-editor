import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';

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

const styles = () => (
  Object.assign(
    {},
    {

    },
    commonStyle,
  )
);

const CmdBar = ({
  classes, feature, hasEdit, forecast, operations, editorOnly,
}) => (
  <div className={classes.card}>
    <Viewer editorOnly={editorOnly} />
    <Zoom />
    <Peak />
    <Integration />
    <Multiplicity />
    <UndoRedo />
    <Submit
      operations={operations}
      feature={feature}
      forecast={forecast}
      editorOnly={editorOnly}
      hideSwitch={false}
      disabled={false}
    />
    <Threshold feature={feature} hasEdit={hasEdit} />
    <Layout feature={feature} hasEdit={hasEdit} />
    <Wavelength />
  </div>
);

const mapStateToProps = (state, _) => ( // eslint-disable-line
  {
  }
);

const mapDispatchToProps = dispatch => (
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
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withStyles(styles),
)(CmdBar);
