import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Button from '@mui/material/Button';

import {
  VerifyMsExt, VerifyJcampExt,
} from '../utils/util_file';
import {
  submitForm,
} from '../actions/action_form';

// `sx`, not a JSS class: MUI's own button styles would otherwise win.
const btnSx = {
  borderRadius: '8px',
  fontSize: 15,
  height: 44,
  px: 3,
  textTransform: 'none',
};

const btnSubmit = (isValidExt, submitFormAct) => (
  <Button
    disabled={!isValidExt}
    variant="contained"
    color="primary"
    disableElevation
    className="txt-sv-subBtn"
    sx={btnSx}
    onClick={submitFormAct}
  >
    Submit
  </Button>
);

function InputForm({
  fileSt,
  submitFormAct,
}) {
  const { src } = fileSt;
  const isValidMsExt = VerifyMsExt(src);
  const isValidJcampExt = VerifyJcampExt(src);
  const isValidExt = isValidMsExt || isValidJcampExt;

  return (
    btnSubmit(isValidExt, submitFormAct)
  );
}

const mapStateToProps = (state, props) => ( // eslint-disable-line
  {
    fileSt: state.file,
  }
);

const mapDispatchToProps = (dispatch) => (
  bindActionCreators({
    submitFormAct: submitForm,
  }, dispatch)
);

InputForm.propTypes = {
  fileSt: PropTypes.object.isRequired,
  submitFormAct: PropTypes.func.isRequired,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(InputForm);
