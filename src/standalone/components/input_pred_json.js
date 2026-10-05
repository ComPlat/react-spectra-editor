import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Dropzone from 'react-dropzone';
import classNames from 'classnames';

import withStyles from '@mui/styles/withStyles';
import Tooltip from '@mui/material/Tooltip';

import { addPredJsonInit } from '../actions/action_predict';

const styles = () => ({
  root: {
    flexGrow: 1,
  },
  baseDD: {
    border: '2px dashed #aaa',
    borderRadius: 5,
    height: 30,
    lineHeight: '30px',
    margin: '0 0 10px 0',
    textAlign: 'center',
    verticalAlign: 'middle',
    width: '90%',
  },
  tpCard: {
  },
  tpLabel: {
    fontSize: 16,
  },
  tpContent: {
    color: '#aaa',
  },
});

const tpHint = classes => (
  <span className={classNames(classes.tpCard)}>
    <p className={classNames(classes.tpLabel, 'txt-sv-tp')}>
      - OPTIONAL
    </p>
    <p className={classNames(classes.tpLabel, 'txt-sv-tp')}>
      - Accept *.json
    </p>
    <p className={classNames(classes.tpLabel, 'txt-sv-tp')}>
      - Max 30Mb
    </p>
  </span>
);

const msgDefault = '(Optional) Add Prediction';
const msgExist = 'Predicted';

const content = (classes, desc) => (
  <Tooltip
    title={tpHint(classes)}
    placement="bottom"
  >
    <span className={classNames(classes.tpContent)}>{desc}</span>
  </Tooltip>
);

const InputPredJson = ({
  classes, addPredJsonInitAct, predictSt,
}) => {
  const hasPredict = predictSt.output.result.length !== 0;
  const desc = hasPredict ? msgExist : msgDefault;

  const onDrop = (files) => {
    const file = files[0];
    const reader = new FileReader();
    reader.onload = () => {
      const str = reader.result;
      addPredJsonInitAct(JSON.parse(str));
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
};

const mapStateToProps = (state, props) => ( // eslint-disable-line
  {
    predictSt: state.predict,
  }
);

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    addPredJsonInitAct: addPredJsonInit,
  }, dispatch)
);

InputPredJson.propTypes = {
  classes: PropTypes.object.isRequired,
  predictSt: PropTypes.object.isRequired,
  addPredJsonInitAct: PropTypes.func.isRequired,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withStyles(styles)(InputPredJson));
