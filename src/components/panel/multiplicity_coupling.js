import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import { withStyles } from '@mui/styles';
import {
  TextField, InputAdornment,
} from '@mui/material';

import { updateMpyJ } from '../../actions/multiplicity';

const styles = () => ({
  jDiv: {
    height: 28,
  },
  jTxt: {
    margin: '0 5px 4px 60px',
  },
  moExtTxt: {
    margin: '0 5px 0 5x',
    fontSize: '0.8rem',
    fontFamily: 'Helvetica',
  },
  txtField: {
    width: 260,
    margin: '0 3px 0 3px',
  },
  txtInput: {
    color: 'white',
    fontSize: '0.9rem',
    fontFamily: 'Helvetica',
    height: 24,
  },
});

const txtJ = () => (
  <InputAdornment position="start">
    <span className="txt-cmd-j">
      J&nbsp;=
    </span>
  </InputAdornment>
);

const txtHz = () => (
  <InputAdornment position="end">
    <span className="txt-cmd-hz">
      Hz
    </span>
  </InputAdornment>
);

class MpyCoupling extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      focus: false,
      tmpVal: false,
    };

    this.onFocus = this.onFocus.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  onFocus() {
    this.setState({ focus: true });
  }

  onBlur() {
    const { row, updateMpyJAct } = this.props;
    const { tmpVal } = this.state;
    const { xExtent } = row;
    this.setState({ focus: false, tmpVal: false });
    updateMpyJAct({ xExtent, value: tmpVal });
  }

  onChange(e) {
    this.setState({ tmpVal: e.target.value });
  }

  render() {
    const { classes, row } = this.props;
    const { focus, tmpVal } = this.state;
    const value = focus && (tmpVal || tmpVal === '') ? tmpVal : row.jStr;

    return (
      <div className={classNames(classes.jDiv)}>
        <span className={classNames(classes.moExtTxt, classes.jTxt, 'txt-sv-panel-head')}>
          <TextField
            className={classNames(classes.txtField, 'txt-cmd-field')}
            placeholder="-"
            value={value}
            margin="none"
            InputProps={{
              startAdornment: txtJ(),
              endAdornment: txtHz(),
              className: classNames(classes.txtInput, 'txt-sv-input-label'),
            }}
            onChange={this.onChange}
            onFocus={this.onFocus}
            onBlur={this.onBlur}
            variant="outlined"
          />
        </span>
      </div>
    );
  }
}

const mapStateToProps = (state, props) => ( // eslint-disable-line
  {
  }
);

const mapDispatchToProps = (dispatch) => (
  bindActionCreators({
    updateMpyJAct: updateMpyJ,
  }, dispatch)
);

MpyCoupling.propTypes = {
  classes: PropTypes.object.isRequired,
  row: PropTypes.object.isRequired,
  updateMpyJAct: PropTypes.func.isRequired,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withStyles(styles)(MpyCoupling));
