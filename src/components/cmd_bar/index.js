/* eslint-disable prefer-object-spread, function-paren-newline,
react/function-component-definition, react/require-default-props */
import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
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
import Detector from './r09_detector';
import CvDensityControls from './r10_cv_density';
import Format from '../../helpers/format';

const styles = () => (
  Object.assign(
    {},
    {
      cardFlex: {
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        columnGap: 8,
        rowGap: 4,
      },
      lcMsToolbarLeft: {
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        columnGap: 4,
        rowGap: 4,
        flex: '1 1 auto',
        minWidth: 0,
      },
      lcMsToolbarRight: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        flex: '0 1 auto',
        minWidth: 0,
      },
      lcMsToolbarRightCluster: {
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        columnGap: 8,
        rowGap: 4,
      },
    },
    commonStyle,
  )
);

const CmdBar = ({
  classes, feature, hasEdit, forecast, operations, editorOnly, jcampIdx, hideThreshold,
  hideMainEditTools,
  layoutSt,
  prependLcMsToolbar,
}) => {
  const isCvLayout = Format.isCyclicVoltaLayout(layoutSt);

  const rightCluster = (
    <>
      <Layout feature={feature} hasEdit={hasEdit} />
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
      <Wavelength />
      <CvDensityControls />
      <ChangeAxes />
      <Detector />
    </>
  );

  if (prependLcMsToolbar) {
    return (
      <div className={`${classes.card} ${classes.cardFlex}`}>
        <div className={classes.lcMsToolbarLeft}>
          { prependLcMsToolbar }
        </div>
        <div className={classes.lcMsToolbarRight}>
          <div className={classes.lcMsToolbarRightCluster}>
            { rightCluster }
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={classes.card}>
      {
        hideMainEditTools ? null : (
          <>
            <Viewer editorOnly={editorOnly} />
            <Zoom />
            <Peak jcampIdx={jcampIdx} feature={feature} />
            <Pecker jcampIdx={jcampIdx} />
            {isCvLayout ? null : <Integration />}
            {isCvLayout ? null : <Multiplicity />}
            <UndoRedo />
          </>
        )
      }
      { rightCluster }
    </div>
  );
};

const mapStateToProps = (state, _) => ( // eslint-disable-line
  {
    layoutSt: state.layout,
  }
);

CmdBar.propTypes = {
  classes: PropTypes.object.isRequired,
  feature: PropTypes.object.isRequired,
  forecast: PropTypes.object.isRequired,
  hasEdit: PropTypes.bool.isRequired,
  operations: PropTypes.array.isRequired,
  editorOnly: PropTypes.bool.isRequired,
  layoutSt: PropTypes.string.isRequired,
  jcampIdx: PropTypes.any,
  hideThreshold: PropTypes.bool,
  hideMainEditTools: PropTypes.bool,
  prependLcMsToolbar: PropTypes.node,
};

CmdBar.defaultProps = {
  prependLcMsToolbar: null,
};

export default compose(
  connect(mapStateToProps, null),
  withStyles(styles),
)(CmdBar);
