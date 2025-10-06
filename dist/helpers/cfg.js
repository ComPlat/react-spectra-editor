"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _format = _interopRequireDefault(require("./format"));
const btnCmdAnaViewer = layoutSt => _format.default.isMsLayout(layoutSt) || _format.default.isRamanLayout(layoutSt) || _format.default.is19FLayout(layoutSt) || _format.default.isUvVisLayout(layoutSt) || _format.default.isHplcUvVisLayout(layoutSt) || _format.default.isTGALayout(layoutSt) || _format.default.isDSCLayout(layoutSt) || _format.default.isXRDLayout(layoutSt) || _format.default.is31PLayout(layoutSt) || _format.default.is15NLayout(layoutSt) || _format.default.is29SiLayout(layoutSt) || _format.default.isLSVLayout(layoutSt) || _format.default.isCyclicVoltaLayout(layoutSt) || _format.default.isCDSLayout(layoutSt) || _format.default.isSECLayout(layoutSt) || _format.default.isGCLayout(layoutSt);
const hideCmdAnaViewer = () => false;
const btnCmdAddPeak = layoutSt => _format.default.isMsLayout(layoutSt);
const btnCmdRmPeak = layoutSt => _format.default.isMsLayout(layoutSt);
const btnCmdSetRef = layoutSt => !_format.default.isNmrLayout(layoutSt); // eslint-disable-line

const btnCmdIntg = layoutSt => !(_format.default.isNmrLayout(layoutSt) || _format.default.isHplcUvVisLayout(layoutSt)); // eslint-disable-line

const btnCmdMpy = layoutSt => !_format.default.isNmrLayout(layoutSt);
const btnCmdMpyPeak = (layoutSt, mpySt, curveIdx = 0) => {
  const {
    multiplicities
  } = mpySt;
  let smExtextVal = false;
  if (multiplicities) {
    const selectedMultiplicity = multiplicities[curveIdx];
    if (selectedMultiplicity) {
      const {
        smExtext
      } = selectedMultiplicity;
      smExtextVal = smExtext;
    }
  }
  return btnCmdMpy(layoutSt) || !smExtextVal;
};
const hideCmdThres = layoutSt => _format.default.isMsLayout(layoutSt);
const btnCmdThres = thresVal => !thresVal;

// const hidePanelPeak = layoutSt => Format.isMsLayout(layoutSt);
const hidePanelPeak = layoutSt => !_format.default.isSECLayout(layoutSt); // eslint-disable-line

const hidePanelMpy = layoutSt => !_format.default.isNmrLayout(layoutSt);
const hidePanelCompare = layoutSt => !(_format.default.isIrLayout(layoutSt) || _format.default.isHplcUvVisLayout(layoutSt) || _format.default.isXRDLayout(layoutSt)); // eslint-disable-line

const hideSolvent = layoutSt => !_format.default.isNmrLayout(layoutSt);
const showTwoThreshold = layoutSt => _format.default.isCyclicVoltaLayout(layoutSt) || _format.default.isLSVLayout(layoutSt);
const hidePanelCyclicVolta = layoutSt => !(_format.default.isCyclicVoltaLayout(layoutSt) || _format.default.isLSVLayout(layoutSt));
const Config = {
  btnCmdAnaViewer,
  hideCmdAnaViewer,
  btnCmdAddPeak,
  btnCmdRmPeak,
  btnCmdSetRef,
  btnCmdIntg,
  btnCmdMpy,
  btnCmdMpyPeak,
  hideCmdThres,
  btnCmdThres,
  hidePanelPeak,
  hidePanelMpy,
  hidePanelCompare,
  hideSolvent,
  showTwoThreshold,
  hidePanelCyclicVolta
};
var _default = exports.default = Config;