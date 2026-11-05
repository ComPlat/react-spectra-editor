/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Dropzone from 'react-dropzone';
import classNames from 'classnames';

import withStyles from '@mui/styles/withStyles';
import Tooltip from '@mui/material/Tooltip';

import { dropBox, dropBoxMuted, hint } from './styles';

import { addPredJsonInit, addPredJsonFail } from '../actions/action_predict';
import { parsePredictionJson } from '../utils/util_predict';

const styles = () => ({
  baseDD: { ...dropBox, ...dropBoxMuted },
  hint,
});

const tpHint = (classes) => (
  <ul className={classNames(classes.hint, 'txt-sv-tp')}>
    <li>optional</li>
    <li>a prediction *.json saved by ChemSpectra</li>
    <li>up to 200 MB</li>
  </ul>
);

const msgDefault = '(Optional) Add Prediction';
const msgExist = 'Predicted';

const content = (classes, desc) => (
  <Tooltip
    title={tpHint(classes)}
    placement="bottom"
  >
    <span>{desc}</span>
  </Tooltip>
);

function InputPredJson({
  classes, addPredJsonInitAct, addPredJsonFailAct, predictSt,
}) {
  const hasPredict = predictSt.output.result.length !== 0;
  const desc = hasPredict ? msgExist : msgDefault;

  const onDrop = (files) => {
    const file = files[0];
    const reader = new FileReader();
    reader.onload = () => {
      const str = reader.result;
      const prediction = parsePredictionJson(str);
      if (prediction) {
        addPredJsonInitAct(prediction);
      } else {
        addPredJsonFailAct();
      }
    };
    reader.readAsBinaryString(file);
  };

  return (
    <Dropzone
      className="dropbox"
      onDrop={onDrop}
    >
      {
        ({ getRootProps, getInputProps }) => (
          <div
            {...getRootProps()}
            className={classNames(classes.baseDD)}
          >
            <input {...getInputProps()} />
            { content(classes, desc) }
          </div>
        )
      }
    </Dropzone>
  );
}

const mapStateToProps = (state, props) => ( // eslint-disable-line
  {
    predictSt: state.predict,
  }
);

const mapDispatchToProps = (dispatch) => (
  bindActionCreators({
    addPredJsonInitAct: addPredJsonInit,
    addPredJsonFailAct: addPredJsonFail,
  }, dispatch)
);

InputPredJson.propTypes = {
  classes: PropTypes.object.isRequired,
  predictSt: PropTypes.object.isRequired,
  addPredJsonInitAct: PropTypes.func.isRequired,
  addPredJsonFailAct: PropTypes.func.isRequired,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withStyles(styles)(InputPredJson));
