import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Dropzone from 'react-dropzone';
import classNames from 'classnames';

import withStyles from '@mui/styles/withStyles';
import Tooltip from '@mui/material/Tooltip';

import { addFileInit } from '../actions/action_file';

const styles = () => ({
  root: {
    flexGrow: 1,
  },
  baseDD: {
    borderRadius: 5,
    height: 30,
    lineHeight: '30px',
    margin: '0 0 10px 0',
    textAlign: 'center',
    verticalAlign: 'middle',
    width: '90%',
  },
  enableDD: {
    border: '2px dashed #000',
    color: '#000',
  },
  disableDD: {
    border: '2px dashed #aaa',
    color: '#aaa',
  },
  tpCard: {
  },
  tpMoreTxt: {
    padding: '0 0 0 60px',
  },
  tpLabel: {
    fontSize: 16,
  },
});

const tpHint = classes => (
  <span className={classNames(classes.tpCard)}>
    <p className={classNames(classes.tpLabel, 'txt-sv-tp')}>
      - Accept *.dx, *.jdx, *.JCAMP,
    </p>
    <p className={classNames(classes.tpLabel, classes.tpMoreTxt, 'txt-sv-tp')}>
      *.RAW, *.mz(X)ML, *.cdf,
    </p>
    <p className={classNames(classes.tpLabel, classes.tpMoreTxt, 'txt-sv-tp')}>
      *.zip (Bruker FID folder)
    </p>
    <p className={classNames(classes.tpLabel, 'txt-sv-tp')}>
      - Max 30Mb
    </p>
  </span>
);

const msgDefault = 'Add Spectrum';

const content = (classes, desc) => (
  <Tooltip
    title={tpHint(classes)}
    placement="bottom"
  >
    <span>{desc}</span>
  </Tooltip>
);

const InputFile = ({
  classes, editorOnly, srcMolSt, srcFileSt, addFileInitAct,
}) => {
  const fileName = srcFileSt && srcFileSt.name;
  const onDrop = files => addFileInitAct({ file: files[0] });
  const enabled = editorOnly || srcMolSt;
  const addOnCls = enabled ? classes.enableDD : classes.disableDD;
  const desc = fileName || msgDefault;

  return (
    // <Dropzone
    //   className="dropbox"
    //   onDrop={onDrop}
    //   disabled={!enabled}
    // >
    <Dropzone
      className="dropbox"
      onDrop={onDrop}
      disabled={false}
    >
      {
        ({ getRootProps, getInputProps }) => (
          <div
            {...getRootProps()}
            className={classNames(classes.baseDD, addOnCls)}
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
    srcMolSt: state.mol.src,
    srcFileSt: state.file.src,
  }
);

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    addFileInitAct: addFileInit,
  }, dispatch)
);

InputFile.propTypes = {
  classes: PropTypes.object.isRequired,
  editorOnly: PropTypes.bool.isRequired,
  srcMolSt: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.bool,
  ]).isRequired,
  srcFileSt: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.bool,
  ]).isRequired,
  addFileInitAct: PropTypes.func.isRequired,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withStyles(styles)(InputFile));
