import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import { withStyles } from '@material-ui/core/styles';

import { LIST_MPY } from '../../constants/list_mpy';
import { selectMpyType } from '../../actions/multiplicity';

const Styles = () => ({
  container: {
    margin: '0 0 0 0',
  },
  formControl: {
    minWidth: 50,
    margin: '2px 3px 0 3px',
  },
  select: {
    color: 'white',
    margin: '4px 0 4px 0',
    height: 20,
  },
  selectTxt: {
    fontSize: '0.8rem',
    fontFamily: 'Helvetica',
  },
});

const MpySelect = ({
  classes, target, selectMpyTypeAct,
}) => {
  const { mpyType, xExtent } = target;
  const onChange = e => selectMpyTypeAct({ xExtent, mpyType: e.target.value });

  return (
    <FormControl
      className={classNames(classes.formControl)}
      variant="outlined"
    >
      <Select
        className={classes.select}
        value={mpyType}
        onChange={onChange}
        input={<OutlinedInput labelWidth={0} />}
      >
        <MenuItem value={LIST_MPY.s}>
          <span className={classNames(classes.selectTxt, 'txt-sv-input-label')}>
            { LIST_MPY.s }
          </span>
        </MenuItem>
        <MenuItem value={LIST_MPY.d}>
          <span className={classNames(classes.selectTxt, 'txt-sv-input-label')}>
            { LIST_MPY.d }
          </span>
        </MenuItem>
        <MenuItem value={LIST_MPY.dd}>
          <span className={classNames(classes.selectTxt, 'txt-sv-input-label')}>
            { LIST_MPY.dd }
          </span>
        </MenuItem>
        <MenuItem value={LIST_MPY.t}>
          <span className={classNames(classes.selectTxt, 'txt-sv-input-label')}>
            { LIST_MPY.t }
          </span>
        </MenuItem>
      </Select>
    </FormControl>
  );
};

const mapStateToProps = (state, props) => ( // eslint-disable-line
  {}
);

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    selectMpyTypeAct: selectMpyType,
  }, dispatch)
);

MpySelect.propTypes = {
  classes: PropTypes.object.isRequired,
  target: PropTypes.object.isRequired,
  selectMpyTypeAct: PropTypes.func.isRequired,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withStyles(Styles)(MpySelect));
