import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Grid from '@material-ui/core/Grid';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Tooltip from '@material-ui/core/Tooltip';
import { withStyles } from '@material-ui/core/styles';

import { updateLayout } from '../../actions/layout';
import { LIST_LAYOUT } from '../../constants/list_layout';

const Styles = () => ({
  container: {
    margin: '12px 18px',
  },
  formControl: {
    margin: '10px 20px 0px 10px',
    minWidth: 150,
  },
});

const layoutSelect = (classes, layoutSt, onChange) => (
  <Tooltip
    title={<span className="txt-sv-tp">Layout</span>}
    placement="top"
    disableFocusListener
    disableTouchListener
  >
    <FormControl
      className={classNames(classes.formControl)}
    >
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
  </Tooltip>
);

const LayoutPanel = ({
  classes, layoutSt, updateLayoutAct,
}) => {
  const onChange = e => updateLayoutAct(e.target.value);

  return (
    <Grid
      className={classNames(classes.container)}
      container
      direction="row"
      justify="center"
      alignItems="center"
    >
      <Grid item xs={12}>
        { layoutSelect(classes, layoutSt, onChange) }
      </Grid>
    </Grid>
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
  layoutSt: PropTypes.string.isRequired,
  updateLayoutAct: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(Styles)(LayoutPanel));
