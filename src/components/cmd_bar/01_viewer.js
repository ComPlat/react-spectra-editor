/* eslint-disable prefer-object-spread, react/function-component-definition */
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import withStyles from '@mui/styles/withStyles';
import SpellcheckOutlinedIcon from '@mui/icons-material/SpellcheckOutlined';
import TimelineOutlinedIcon from '@mui/icons-material/TimelineOutlined';
import Tooltip from '@mui/material/Tooltip';

import { setUiViewerType } from '../../actions/ui';
import Cfg from '../../helpers/cfg';
import { MuButton, commonStyle, focusStyle } from './common';
import { LIST_UI_VIEWER_TYPE } from '../../constants/list_ui';

const styles = () => (
  Object.assign(
    {},
    commonStyle,
  )
);

const Viewer = ({
  classes, isfocusSpectrumSt, isfocusAnalysisSt,
  hideCmdAnaViewerSt, disableCmdAnaViewerSt,
  setUiViewerTypeAct,
}) => {
  const onViewSpectrum = () => setUiViewerTypeAct(LIST_UI_VIEWER_TYPE.SPECTRUM);
  const onViewAnalysis = () => setUiViewerTypeAct(LIST_UI_VIEWER_TYPE.ANALYSIS);

  return (
    <span className={classes.group} data-testid="Viewer">
      <Tooltip title={<span className="txt-sv-tp">Spectrum Viewer</span>}>
        <MuButton
          className={
            classNames(
              focusStyle(isfocusSpectrumSt, classes),
              'btn-sv-bar-spctrum',
            )
          }
          onClick={onViewSpectrum}
        >
          <TimelineOutlinedIcon className={classes.icon} />
        </MuButton>
      </Tooltip>
      {
        hideCmdAnaViewerSt
          ? null
          : (
            <Tooltip title={<span className="txt-sv-tp">Analysis Viewer</span>}>
              <MuButton
                className={
                  classNames(
                    focusStyle(isfocusAnalysisSt, classes),
                    'btn-sv-bar-analysis',
                  )
                }
                disabled={disableCmdAnaViewerSt}
                onClick={onViewAnalysis}
              >
                <SpellcheckOutlinedIcon className={classes.icon} />
              </MuButton>
            </Tooltip>
          )
      }
    </span>
  );
};

const mapStateToProps = (state, props) => ( // eslint-disable-line
  {
    isfocusSpectrumSt: state.ui.viewer === LIST_UI_VIEWER_TYPE.SPECTRUM,
    isfocusAnalysisSt: state.ui.viewer === LIST_UI_VIEWER_TYPE.ANALYSIS,
    hideCmdAnaViewerSt: Cfg.hideCmdAnaViewer(state.layout) || props.editorOnly,
    disableCmdAnaViewerSt: Cfg.btnCmdAnaViewer(state.layout),
  }
);

const mapDispatchToProps = (dispatch) => (
  bindActionCreators({
    setUiViewerTypeAct: setUiViewerType,
  }, dispatch)
);

Viewer.propTypes = {
  classes: PropTypes.object.isRequired,
  isfocusSpectrumSt: PropTypes.bool.isRequired,
  isfocusAnalysisSt: PropTypes.bool.isRequired,
  hideCmdAnaViewerSt: PropTypes.bool.isRequired,
  disableCmdAnaViewerSt: PropTypes.bool.isRequired,
  setUiViewerTypeAct: PropTypes.func.isRequired,
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withStyles(styles),
)(Viewer);
