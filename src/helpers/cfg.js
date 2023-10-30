import Format from './format';

const btnCmdAnaViewer = (layoutSt) => (
  Format.isMsLayout(layoutSt)
    || Format.isRamanLayout(layoutSt)
    || Format.is19FLayout(layoutSt)
    || Format.isUvVisLayout(layoutSt)
    || Format.isHplcUvVisLayout(layoutSt)
    || Format.isTGALayout(layoutSt)
    || Format.isXRDLayout(layoutSt)
    || Format.is31PLayout(layoutSt)
    || Format.is15NLayout(layoutSt)
    || Format.is29SiLayout(layoutSt)
    || Format.isCyclicVoltaLayout(layoutSt)
    || Format.isCDSLayout(layoutSt)
    || Format.isSECLayout(layoutSt)
);

const hideCmdAnaViewer = () => false;

const btnCmdAddPeak = (layoutSt) => Format.isMsLayout(layoutSt);

const btnCmdRmPeak = (layoutSt) => Format.isMsLayout(layoutSt);

const btnCmdSetRef = (layoutSt) => !Format.isNmrLayout(layoutSt); // eslint-disable-line

const btnCmdIntg = (layoutSt) => !(Format.isNmrLayout(layoutSt)|| Format.isHplcUvVisLayout(layoutSt));  // eslint-disable-line

const btnCmdMpy = (layoutSt) => !Format.isNmrLayout(layoutSt);

const btnCmdMpyPeak = (layoutSt, mpySt, curveIdx = 0) => {
  const { multiplicities } = mpySt;
  let smExtextVal = false;
  if (multiplicities) {
    const selectedMultiplicity = multiplicities[curveIdx];
    if (selectedMultiplicity) {
      const { smExtext } = selectedMultiplicity;
      smExtextVal = smExtext;
    }
  }
  return btnCmdMpy(layoutSt) || !smExtextVal;
};

const hideCmdThres = (layoutSt) => Format.isMsLayout(layoutSt);

const btnCmdThres = (thresVal) => !thresVal;

// const hidePanelPeak = layoutSt => Format.isMsLayout(layoutSt);
const hidePanelPeak = layoutSt => !(Format.isSECLayout(layoutSt));  // eslint-disable-line

const hidePanelMpy = (layoutSt) => !Format.isNmrLayout(layoutSt);

const hidePanelCompare = (layoutSt) => !(Format.isIrLayout(layoutSt) || Format.isHplcUvVisLayout(layoutSt) || Format.isXRDLayout(layoutSt));  // eslint-disable-line

const hideSolvent = (layoutSt) => !Format.isNmrLayout(layoutSt);

const showTwoThreshold = (layoutSt) => Format.isCyclicVoltaLayout(layoutSt);

const hidePanelCyclicVolta = (layoutSt) => !Format.isCyclicVoltaLayout(layoutSt);

const btnCmdOffset = (layoutSt) => !Format.isTGALayout(layoutSt);

const hidePanelTGA = (layoutSt) => !Format.isTGALayout(layoutSt);

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
  hidePanelCyclicVolta,
  btnCmdOffset,
  hidePanelTGA,
};

export default Config;
