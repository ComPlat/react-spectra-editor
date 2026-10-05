/* eslint-disable no-shadow, react/no-unused-prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { SpectraEditor, FN } from '@complat/react-spectra-editor';
// import { CopyToClipboard } from 'react-copy-to-clipboard';

// import Tooltip from '@mui/material/Tooltip';
// import Button from '@mui/material/Button';
// import FileCopyOutlinedIcon from '@mui/icons-material/FileCopyOutlined';

import { saveFileInit, refreshFileInit } from '../actions/action_file';
import { predictInit, predictToWriteInit } from '../actions/action_predict';
import { updateDesc } from '../actions/action_desc';
import { addOthersInit } from '../actions/action_jcamp';
import { RmDollarSign } from '../utils/helper';

const titleStyle = {
  backgroundColor: '#f5f5f5',
  border: '2px solid #e3e3e3',
  borderRadius: '10px',
  height: 250,
  lineHeight: '250px',
  marginTop: 100,
  textAlign: 'center',
};

const txtStyle = {
  lineHeight: '200px',
};

const containerStyle = {
  margin: '5px 0 0 0',
};

const W = Math.round(window.innerWidth * 0.90 * 9 / 12); // ROI

const editorStyle = {
  border: '1px solid gray',
  borderRadius: '8px 0 0 8px',
  margin: '0 0 0 60px',
  width: W - 80,
};

// const editorBtnStyle = {
//   border: '1px solid gray',
//   borderRadius: '0 8px 8px 0',
//   margin: '0 0 0 0',
//   width: 40,
//   verticalAlign: 'top',
// };

const renderTitle = () => (
  <div style={titleStyle}>
    <h1 style={txtStyle}>
      <p>Welcome to ChemSpectra</p>
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="https://github.com/ComPlat/react-spectra-editor/blob/master/DEMO_MANUAL.md"
      >
        Step by step demo
      </a>
    </h1>
  </div>
);

class Content extends React.Component {
  constructor(props) {
    super(props);

    this.writeMpy = this.writeMpy.bind(this);
    this.writePeak = this.writePeak.bind(this);
    this.formatPks = this.formatPks.bind(this);
    this.formatMpy = this.formatMpy.bind(this);
    this.checkWriteOp = this.checkWriteOp.bind(this);
    this.saveOp = this.saveOp.bind(this);
    this.refreshOp = this.refreshOp.bind(this);
    this.predictOp = this.predictOp.bind(this);
    // this.updatInput = this.updatInput.bind(this);
    this.buildOpsByLayout = this.buildOpsByLayout.bind(this);
    this.buildForecast = this.buildForecast.bind(this);
    this.buildOthers = this.buildOthers.bind(this);
  }

  getPeaksByLayout(peaks, layout, multiplicity, curveIdx = 0) {
    if (['IR'].indexOf(layout) >= 0) return peaks;
    if (['13C'].indexOf(layout) >= 0) return FN.CarbonFeatures(peaks, multiplicity);
    const { multiplicities } = multiplicity;
    const selectedMultiplicity = multiplicities[curveIdx];
    const { stack, shift } = selectedMultiplicity;
    const nmrMpyCenters = stack.map((stk) => {
      const { mpyType } = stk;
      const centers = stk.peaks;
      return {
        x: FN.CalcMpyCenter(centers, shift, mpyType),
        y: 0,
      };
    });

    const defaultCenters = [{ x: -1000.0, y: 0 }];
    return nmrMpyCenters.length > 0 ? nmrMpyCenters : defaultCenters;
  }

  formatPks({
    peaks, layout, shift, isAscend, decimal, isIntensity, integration, curveSt, waveLength,
  }) {
    const { fileSt } = this.props;
    const { jcamp, jcampList } = fileSt;
    let data = null;
    if (jcamp) {
      data = FN.buildData(jcamp);
    } else {
      const { curveIdx } = curveSt;
      const selectedJcamp = jcampList[curveIdx];
      data = FN.buildData(selectedJcamp);
    }
    const { entity } = data;
    const { features } = entity;
    const { temperature } = entity;
    const { maxY, minY } = Array.isArray(features) ? {} : (features.editPeak || features.autoPeak);
    const boundary = { maxY, minY };
    const body = FN.peaksBody({ peaks, layout, decimal, shift, isAscend, isIntensity, boundary, integration, waveLength, temperature,}); //eslint-disable-line
    const wrapper = FN.peaksWrapper(layout, shift);
    const desc = RmDollarSign(wrapper.head) + body + wrapper.tail;
    return desc;
  }

  formatMpy({
    multiplicity, integration, shift, isAscend, decimal, layout, curveSt,
  }) {
    const { curveIdx } = curveSt;
    // obsv freq
    const { fileSt } = this.props;
    const { entity } = FN.buildData(fileSt.jcamp);
    const { features } = entity;
    const { observeFrequency } = Array.isArray(features)
      ? features[0]
      : (features.editPeak || features.autoPeak);
    const freq = observeFrequency;
    const freqStr = freq ? `${parseInt(freq, 10)} MHz, ` : '';
    // multiplicity
    const { integrations } = integration;
    const selectedIntegration = integrations[curveIdx];
    const { refArea, refFactor } = selectedIntegration;
    const { multiplicities } = multiplicity;
    const selectedMultiplicity = multiplicities[curveIdx];
    const shiftVal = selectedMultiplicity.shift;
    const ms = selectedMultiplicity.stack;
    const is = selectedIntegration.stack;

    const macs = ms.map((m) => {
      const { peaks, mpyType, xExtent } = m;
      const { xL, xU } = xExtent;
      const it = is.filter(i => i.xL === xL && i.xU === xU)[0] || { area: 0 };
      const area = it.area * refFactor / refArea;
      const center = FN.calcMpyCenter(peaks, shiftVal, mpyType);
      const xs = m.peaks.map(p => p.x).sort((a, b) => a - b);
      const [aIdx, bIdx] = isAscend ? [0, xs.length - 1] : [xs.length - 1, 0];
      const mxA = mpyType === 'm' ? (xs[aIdx] - shiftVal).toFixed(decimal) : 0;
      const mxB = mpyType === 'm' ? (xs[bIdx] - shiftVal).toFixed(decimal) : 0;
      return Object.assign({}, m, {
        area, center, mxA, mxB,
      });
    }).sort((a, b) => (isAscend ? a.center - b.center : b.center - a.center));
    const str = macs.map((m) => {
      const c = m.center;
      const type = m.mpyType;
      const it = Math.round(m.area);
      const js = m.js.map(j => `J = ${j.toFixed(1)} Hz`).join(', ');
      const atomCount = layout === '1H' ? `, ${it}H` : '';
      const location = type === 'm' ? `${m.mxA}–${m.mxB}` : `${c.toFixed(decimal)}`;
      return m.js.length === 0
        ? `${location} (${type}${atomCount})`
        : `${location} (${type}, ${js}${atomCount})`;
    }).join(', ');

    const { shifts } = shift;
    const selectedShift = shifts[curveIdx];
    const { label, value, name } = selectedShift.ref;
    const solvent = label ? `${name.split('(')[0].trim()} [${value.toFixed(decimal)} ppm], ` : '';
    return `${layout} NMR (${freqStr}${solvent}ppm) δ = ${str}.`;
  }

  writeMpy({
    layout, shift, isAscend, decimal,
    multiplicity, integration, curveSt,
  }) {
    if (['1H', '13C', '19F'].indexOf(layout) < 0) return;
    const desc = this.formatMpy({
      multiplicity, integration, shift, isAscend, decimal, layout, curveSt,
    });
    const { updateDescAct } = this.props;
    updateDescAct(desc);
  }

  writePeak({
    peaks, layout, shift, isAscend, decimal, isIntensity, integration, curveSt, waveLength,
  }) {
    const desc = this.formatPks({
      peaks, layout, shift, isAscend, decimal, isIntensity, integration, curveSt, waveLength,
    });
    const { updateDescAct } = this.props;
    updateDescAct(desc);
  }

  checkWriteOp({
    peaks, layout, shift, isAscend, decimal,
  }) {
    const {
      predictToWriteInitAct, molSt, fileSt,
    } = this.props;
    const molfile = molSt.src;
    const cleanPeaks = FN.rmShiftFromPeaks(peaks, shift);
    predictToWriteInitAct({
      molfile,
      layout,
      shift,
      isAscend,
      decimal,
      peaks: cleanPeaks,
      spectrum: fileSt.src,
    });
  }

  saveOp({
    peaks, shift, scan, thres, analysis, integration,
    multiplicity, waveLength, cyclicvoltaSt, curveSt,
    dscMetaData,
  }) {
    const {
      saveFileInitAct, molSt,
    } = this.props;
    const { mass } = molSt;
    const { curveIdx } = curveSt;
    const selectedShift = shift.shifts[curveIdx];
    const fPeaks = FN.rmRef(peaks, shift);
    const peakStr = FN.toPeakStr(fPeaks);
    const predict = JSON.stringify(analysis);

    saveFileInitAct({
      peakStr,
      shift: selectedShift,
      mass,
      scan,
      thres,
      predict,
      integration: JSON.stringify(integration),
      multiplicity: JSON.stringify(multiplicity),
      waveLength: JSON.stringify(waveLength),
      cyclicvolta: JSON.stringify(cyclicvoltaSt),
      dscMetaData: JSON.stringify(dscMetaData),
    });
  }

  refreshOp({
    peaks, scan, shift, thres, analysis, integration, multiplicity, curveSt,
  }) {
    const {
      refreshFileInitAct, molSt,
    } = this.props;
    const { mass } = molSt;
    const fPeaks = FN.rmRef(peaks, shift);
    const peakStr = FN.toPeakStr(fPeaks);
    const predict = JSON.stringify(analysis);

    const { curveIdx } = curveSt;
    const { shifts } = shift;
    const selectedShift = shifts[curveIdx];
    const { integrations } = integration;
    const selectedIntegration = integrations[curveIdx];
    const { multiplicities } = multiplicity;
    const selectedMultiplicity = multiplicities[curveIdx];

    refreshFileInitAct({
      peakStr,
      shift: selectedShift,
      mass,
      scan,
      thres,
      predict,
      integration: JSON.stringify(selectedIntegration),
      multiplicity: JSON.stringify(selectedMultiplicity),
    });
  }

  predictOp({
    peaks, layout, shift, multiplicity, curveSt,
  }) {
    const { predictInitAct, molSt, fileSt } = this.props;
    const molfile = molSt.src;

    const { curveIdx } = curveSt;

    const targetPeaks = this.getPeaksByLayout(peaks, layout, multiplicity, curveIdx);

    const { shifts } = shift;
    const selectedShift = shifts[curveIdx];

    predictInitAct({
      molfile, peaks: targetPeaks, layout, shift: selectedShift, spectrum: fileSt.src,
    });
  }

  // updatInput(e) {
  //   const molecule = e.target.value;
  //   this.setState({ molecule });
  // }

  buildForecast() {
    const { molSt, predictSt } = this.props;

    const predictObj = {
      btnCb: this.predictOp,
      refreshCb: this.refreshOp,
      molecule: molSt.src ? molSt.src.name : '',
      predictions: predictSt,
    };
    return predictObj;
  }

  buildOpsByLayout(entity, editorOnly) { // eslint-disable-line
    let ops = [
      { name: 'write peaks', value: this.writePeak },
      { name: 'save', value: this.saveOp },
    ];
    if (['1H', '13C', '19F'].indexOf(entity.layout) >= 0) {
      ops = [
        { name: 'write multiplicity', value: this.writeMpy },
        ...ops,
      ];
    }
    return ops;
    // { name: 'check & write', value: this.checkWriteOp },
  }

  buildOthers() {
    const { addOthersInitAct, othersSt } = this.props;

    return {
      others: othersSt,
      addOthersCb: addOthersInitAct,
    };
  }

  render() {
    const {
      fileSt, descSt, editorOnly, molSt,
    } = this.props;
    if (!fileSt) return renderTitle();

    const {
      entity, xLabel, yLabel, isExist,
    } = FN.buildData(fileSt.jcamp);

    let currEntity = entity;
    let currXLabel = xLabel;
    let currYLabel = yLabel;

    let multiEntities = false;
    if (!isExist) {
      const { jcampList } = fileSt;
      if (!jcampList || jcampList.length === 0) return renderTitle();
      multiEntities = jcampList.map((jcamp) => {
        const {
          entity, xLabel, yLabel,
        } = FN.buildData(jcamp);
        currEntity = entity;
        currXLabel = xLabel;
        currYLabel = yLabel;
        return entity;
      });
    }

    // if (!isExist) return renderTitle();

    const { svg } = molSt;
    const operations = this.buildOpsByLayout(currEntity, editorOnly);
    const forecast = this.buildForecast();
    const others = this.buildOthers();

    return (
      <div style={containerStyle}>
        <SpectraEditor
          entity={currEntity}
          multiEntities={multiEntities}
          others={others}
          xLabel={currXLabel}
          yLabel={currYLabel}
          forecast={forecast}
          operations={operations}
          editorOnly={editorOnly}
          molSvg={svg}
        />
        <div>
          <textarea
            rows="2"
            cols="180"
            placeholder="peaks"
            style={editorStyle}
            value={descSt}
            readOnly
          />
          {/* <Tooltip title="Copy to clipboard">
            <CopyToClipboard text={descSt}>
              <Button
                style={editorBtnStyle}
                variant="outlined"
              >
                <FileCopyOutlinedIcon />
              </Button>
            </CopyToClipboard>
          </Tooltip> */}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, props) => ( // eslint-disable-line
  {
    molSt: state.mol,
    fileSt: state.file,
    predictSt: state.predict,
    descSt: state.desc,
    othersSt: state.jcamp.others,
  }
);

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    saveFileInitAct: saveFileInit,
    refreshFileInitAct: refreshFileInit,
    predictInitAct: predictInit,
    predictToWriteInitAct: predictToWriteInit,
    updateDescAct: updateDesc,
    addOthersInitAct: addOthersInit,
  }, dispatch)
);

Content.propTypes = {
  molSt: PropTypes.object.isRequired,
  fileSt: PropTypes.object.isRequired,
  predictSt: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.bool,
  ]).isRequired,
  descSt: PropTypes.string.isRequired,
  othersSt: PropTypes.array.isRequired,
  saveFileInitAct: PropTypes.func.isRequired,
  refreshFileInitAct: PropTypes.func.isRequired,
  predictInitAct: PropTypes.func.isRequired,
  predictToWriteInitAct: PropTypes.func.isRequired,
  updateDescAct: PropTypes.func.isRequired,
  addOthersAct: PropTypes.func.isRequired,
  editorOnly: PropTypes.bool.isRequired,
  addOthersInitAct: PropTypes.func.isRequired,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Content);
