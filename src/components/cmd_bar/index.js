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

const styles = () => (
  Object.assign(
    {},
    {

    },
    commonStyle,
  )
);

const CmdBar = ({
  classes, feature, hasEdit, operations,
}) => (
  <div className={classes.card}>
    <Viewer />
    <Zoom />
    <Peak />
    <Integration />
    <Multiplicity />
    <UndoRedo />
    <Submit
      operations={operations}
      feature={feature}
      hideSwitch={false}
      disabled={false}
    />
    <Threshold feature={feature} hasEdit={hasEdit} />
    <Layout feature={feature} hasEdit={hasEdit} />
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
  hasEdit: PropTypes.bool.isRequired,
  operations: PropTypes.array.isRequired,
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withStyles(styles),
)(CmdBar);