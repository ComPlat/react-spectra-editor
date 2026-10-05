import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import withStyles from '@mui/styles/withStyles';
import Button from '@mui/material/Button';

import {
  VerifyMsExt, VerifyJcampExt,
} from '../utils/util_file';
import {
  submitForm,
} from '../actions/action_form';

const styles = () => ({
  root: {
    float: 'left',
  },
  btnRefresh: {
    borderRadius: 5,
    height: 34,
    padding: '4px 10px 4px 10px',
  },
  icon: {
  },
});

const btnSubmit = (
  classes, isValidExt, submitFormAct,
) => (
  <Button
    disabled={!isValidExt}
    size="small"
    variant="fab"
    color="primary"
    className={classNames(classes.btnRefresh)}
    onClick={submitFormAct}
  >
    <span className={classNames(classes.subBtn, 'txt-sv-subBtn')}>
      Submit
    </span>
  </Button>
);

const InputForm = ({
  classes, fileSt,
  submitFormAct,
}) => {
  const { src } = fileSt;
  const isValidMsExt = VerifyMsExt(src);
  const isValidJcampExt = VerifyJcampExt(src);
  const isValidExt = isValidMsExt || isValidJcampExt;

  return (
    <div className={classNames(classes.root)}>
      { btnSubmit(classes, isValidExt, submitFormAct) }
    </div>
  );
};

const mapStateToProps = (state, props) => ( // eslint-disable-line
  {
    fileSt: state.file,
  }
);

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    submitFormAct: submitForm,
  }, dispatch)
);

InputForm.propTypes = {
  fileSt: PropTypes.object.isRequired,
  submitFormAct: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withStyles(styles)(InputForm));
