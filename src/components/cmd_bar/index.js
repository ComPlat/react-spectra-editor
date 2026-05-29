/* eslint-disable prefer-object-spread, function-paren-newline,
react/function-component-definition, react/require-default-props */
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import PropTypes from 'prop-types';

import withStyles from '@mui/styles/withStyles';

import {
  commonStyle, TOOLBAR_CONTROL_H, TOOLBAR_LABEL_SLOT, TOOLBAR_GROUP_MARGIN_LEFT,
} from './common';
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
import Cfg from '../../helpers/cfg';

const styles = () => (
  Object.assign(
    {
      toolbarTrack: {
        alignItems: 'flex-end',
        display: 'flex',
        flexWrap: 'nowrap',
        minHeight: TOOLBAR_CONTROL_H + TOOLBAR_LABEL_SLOT,
        overflowX: 'auto',
        overflowY: 'hidden',
        paddingBottom: 8,
        paddingRight: 6,
        width: '100%',
        '& > .group:empty, & > .groupRight:empty, & > .groupRightMost:empty': {
          display: 'none',
        },
        '& > span:first-child': {
          marginLeft: 0,
          paddingLeft: 0,
          '&::before': {
            display: 'none',
          },
        },
        '& > .groupRightMost': {
          marginLeft: TOOLBAR_GROUP_MARGIN_LEFT,
          paddingLeft: 0,
        },
        '&::-webkit-scrollbar': {
          height: 6,
        },
        '&::-webkit-scrollbar:vertical': {
          width: 0,
        },
        '&::-webkit-scrollbar-corner': {
          backgroundColor: 'transparent',
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: '#cbd5df',
          borderRadius: 6,
        },
      },
      toolbarSpacer: {
        flex: '1 1 12px',
        minWidth: 8,
      },
    },
    commonStyle,
  )
);

const CmdBar = ({
  classes, feature, hasEdit, forecast, operations, editorOnly, jcampIdx, hideThreshold, layoutSt,
}) => {
  const isCvLayout = Format.isCyclicVoltaLayout(layoutSt);
  const hideIntegration = isCvLayout || Cfg.btnCmdIntg(layoutSt);
  const hideMultiplicity = isCvLayout || Cfg.btnCmdMpy(layoutSt);

  return (
    <div className={classes.card}>
      <div className={classes.toolbarTrack}>
        <Viewer editorOnly={editorOnly} />
        <Zoom />
        <Peak jcampIdx={jcampIdx} feature={feature} />
        <Pecker jcampIdx={jcampIdx} />
        {hideIntegration ? null : <Integration />}
        {hideMultiplicity ? null : <Multiplicity />}
        <UndoRedo />
        <div className={classes.toolbarSpacer} aria-hidden="true" data-toolbar-spacer />
        {
          hideThreshold ? null : (<Threshold feature={feature} hasEdit={hasEdit} />)
        }
        <Layout feature={feature} hasEdit={hasEdit} />
        <Wavelength />
        <CvDensityControls />
        <ChangeAxes />
        <Detector />
        <Submit
          operations={operations}
          feature={feature}
          forecast={forecast}
          editorOnly={editorOnly}
          hideSwitch={false}
          disabled={false}
        />
      </div>
    </div>
  );
};

const mapStateToProps = (state, _) => ( // eslint-disable-line
  {
    layoutSt: state.layout,
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
  layoutSt: PropTypes.string.isRequired,
  jcampIdx: PropTypes.any,
  hideThreshold: PropTypes.bool,
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withStyles(styles),
)(CmdBar);
