import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Grid from '@material-ui/core/Grid';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import { withStyles } from '@material-ui/core/styles';

import BtnWritePeaks from './panel_layout_btn';
import { updateLayout } from './actions/layout';
import { LIST_LAYOUT } from './constants/list_layout';

const Styles = () => ({
  formControl: {
    margin: '10px 20px 0px 10px',
    minWidth: 150,
  },
});

const txtInputLabel = () => (
  <InputLabel>
    <span className="txt-input-label">
      Write Peaks Layout
    </span>
  </InputLabel>
);

const LayoutPanel = ({
  classes, writePeaks, peakObj, layoutSt,
  updateLayoutAct,
}) => {
  if (!writePeaks) return null;
  const onChange = e => updateLayoutAct(e.target.value);

  return (
    <ExpansionPanelDetails>
      <Grid
        container
        direction="row"
        justify="center"
        alignItems="center"
      >
        <Grid item xs={8}>
          <FormControl
            variant="outlined"
            className={classNames(classes.formControl)}
          >
            { txtInputLabel() }
            <Select value={layoutSt} onChange={onChange}>
              <MenuItem value={LIST_LAYOUT.PLAIN}>
                <span className="txt-sv-input-label">plain</span>
              </MenuItem>
              <MenuItem value={LIST_LAYOUT.IR}>
                <span className="txt-sv-input-label">IR</span>
              </MenuItem>
              <MenuItem value={LIST_LAYOUT.H1}>
                <span className="txt-sv-input-label">
                  <sup>1</sup>
                  H
                </span>
              </MenuItem>
              <MenuItem value={LIST_LAYOUT.C13}>
                <span className="txt-sv-input-label">
                  <sup>13</sup>
                  C
                </span>
              </MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={4}>
          <BtnWritePeaks
            peakObj={peakObj}
            writePeaks={writePeaks}
          />
        </Grid>
      </Grid>
    </ExpansionPanelDetails>
  );
};

const mapStateToProps = (state, props) => ( // eslint-disable-line
  {
    layoutSt: state.layout,
  }
);

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    updateLayoutAct: updateLayout,
  }, dispatch)
);

LayoutPanel.propTypes = {
  classes: PropTypes.object.isRequired,
  peakObj: PropTypes.object.isRequired,
  writePeaks: PropTypes.oneOfType(
    [
      PropTypes.func,
      PropTypes.bool,
    ],
  ).isRequired,
  layoutSt: PropTypes.string.isRequired,
  updateLayoutAct: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(Styles)(LayoutPanel));
