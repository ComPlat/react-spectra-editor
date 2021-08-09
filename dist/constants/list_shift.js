'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getListShift = exports.LIST_SHIFT_29Si = exports.LIST_SHIFT_15N = exports.LIST_SHIFT_31P = exports.LIST_SHIFT_19F = exports.LIST_SHIFT_1H = exports.LIST_SHIFT_13C = undefined;

var _list_layout = require('./list_layout');

var noReference = {
  name: '- - -',
  value: 0.0,
  label: false
};

var cActicAcidD4Sept = {
  name: 'Actic acid-d4 (sept)',
  value: 20.0,
  label: 'Actic acid-d4'
};

var cActicAcidD4S = {
  name: 'Actic acid-d4 (s)',
  value: 178.990,
  label: 'Actic acid-d4'
};

var cAcetoneD6Sep = {
  name: 'Acetone-d6 (sep)',
  value: 29.920,
  label: 'Acetone-d6',
  nsdb: 'Acetone-D6 ((CD3)2CO)'
};

var cAcetoneD6Broad = {
  name: 'Acetone-d6 (broad)',
  value: 206.68,
  label: 'Acetone-d6',
  nsdb: 'Acetone-D6 ((CD3)2CO)'
};

var cAcetonitrileD3Sep = {
  name: 'Acetonitrile-d3 (sep)',
  value: 1.39,
  label: 'Acetonitrile-d3',
  nsdb: 'Acetonitrile-D3(CD3CN)'
};

var cAcetonitrileD3S = {
  name: 'Acetonitrile-d3 (s)',
  value: 118.69,
  label: 'Acetonitrile-d3',
  nsdb: 'Acetonitrile-D3(CD3CN)'
};

var cBenzeneT = {
  name: 'Benzene (t)',
  value: 128.390,
  label: 'Benzene-d6',
  nsdb: 'Benzene-D6 (C6D6)'
};

var cChloroformDT = {
  name: 'Chloroform-d (t)',
  value: 77.00,
  label: 'CDCl$3',
  nsdb: 'Chloroform-D1 (CDCl3)'
};

var cCyclohexaneD12Quin = {
  name: 'Cyclohexane-d12 (quin)',
  value: 26.430,
  label: 'C$6D$1$2'
};

var cDichloromethaneD2Quin = {
  name: 'Dichloromethane-d2 (quin)',
  value: 54.0,
  label: 'CD$2Cl$2'
};

var cDmfD7Sep1 = {
  name: 'DMF-d7 (sep)-1',
  value: 29.76,
  label: 'DMF-d7'
};

var cDmfD7Sep2 = {
  name: 'DMF-d7 (sep)-2',
  value: 34.89,
  label: 'DMF-d7'
};

var cDmfD7T3 = {
  name: 'DMF-d7 (t)-3',
  value: 163.15,
  label: 'DMF-d7'
};

var cDioxaneD8Quin = {
  name: 'Dioxane-d8 (quin)',
  value: 66.660,
  label: 'Dioxane-d8'
};

var cDmsoD6 = {
  name: 'DMSO-d6',
  value: 39.51,
  label: 'DMSO-d6',
  nsdb: 'Dimethylsulphoxide-D6 (DMSO-D6, C2D6SO))'
};

var cEthanolD6Sep = {
  name: 'Ethanol-d6 (sep)',
  value: 17.3,
  label: 'Ethanol-d6'
};

var cEthanolD6Quin = {
  name: 'Ethanol-d6 (quin)',
  value: 56.96,
  label: 'Ethanol-d6'
};

var cMethanolD4Sep = {
  name: 'Methanol-d4 (sep)',
  value: 49.15,
  label: 'Methanol-d4',
  nsdb: 'Methanol-D4 (CD3OD)'
};

var cPyridineD5T1 = {
  name: 'Pyridine-d5 (t)-1',
  value: 123.87,
  label: 'Pyridine-d5',
  nsdb: 'Pyridin-D5 (C5D5N)'
};

var cPyridineD5T2 = {
  name: 'Pyridine-d5 (t)-2',
  value: 135.91,
  label: 'Pyridine-d5',
  nsdb: 'Pyridin-D5 (C5D5N)'
};

var cPyridineD5T3 = {
  name: 'Pyridine-d5 (t)-3',
  value: 150.35,
  label: 'Pyridine-d5',
  nsdb: 'Pyridin-D5 (C5D5N)'
};

var cThfD8Quin1 = {
  name: 'THF-d8 (quin)-1',
  value: 25.37,
  label: 'THF-d8 ',
  nsdb: 'Tetrahydrofuran-D8 (THF-D8, C4D4O)'
};

var cThfD8Quin2 = {
  name: 'THF-d8 (quin)-2',
  value: 67.57,
  label: 'THF-d8 ',
  nsdb: 'Tetrahydrofuran-D8 (THF-D8, C4D4O)'
};

var cTmsS = {
  name: 'TMS (s)',
  value: 0.00,
  label: 'TMS'
};

var cTolueneD8Sep1 = {
  name: 'Toluene-d8 (sep)-1',
  value: 20.4,
  label: 'Toluene-d8'
};

var cTolueneD8T2 = {
  name: 'Toluene-d8 (t)-2',
  value: 125.49,
  label: 'Toluene-d8'
};

var cTolueneD8T3 = {
  name: 'Toluene-d8 (t)-3',
  value: 128.33,
  label: 'Toluene-d8'
};

var cTolueneD8T4 = {
  name: 'Toluene-d8 (t)-4',
  value: 129.24,
  label: 'Toluene-d8'
};

var cTolueneD8T5 = {
  name: 'Toluene-d8 (s)-5',
  value: 137.86,
  label: 'Toluene-d8'
};

var cTfaDQ1 = {
  name: 'TFA-d (q)-1',
  value: 116.60,
  label: 'TFA-d'
};

var cTfaDQ2 = {
  name: 'TFA-d (q)-2',
  value: 164.20,
  label: 'TFA-d'
};

var cTrifluoroethanolD3Quin = {
  name: 'Trifluoroethanol-d3 (quin)',
  value: 61.50,
  label: 'Trifluoroethanol-d3'
};

var cTrifluoroethanolD3Broad = {
  name: 'Trifluoroethanol-d3 (broad)',
  value: 126.3,
  label: 'Trifluoroethanol-d3'
};

var LIST_SHIFT_13C = [noReference, cActicAcidD4Sept, cActicAcidD4S, cAcetoneD6Sep, cAcetoneD6Broad, cAcetonitrileD3Sep, cAcetonitrileD3S, cBenzeneT, cChloroformDT, cCyclohexaneD12Quin, cDichloromethaneD2Quin, cDmfD7Sep1, cDmfD7Sep2, cDmfD7T3, cDioxaneD8Quin, cDmsoD6, cEthanolD6Sep, cEthanolD6Quin, cMethanolD4Sep, cPyridineD5T1, cPyridineD5T2, cPyridineD5T3, cThfD8Quin1, cThfD8Quin2, cTmsS, cTolueneD8Sep1, cTolueneD8T2, cTolueneD8T3, cTolueneD8T4, cTolueneD8T5, cTfaDQ1, cTfaDQ2, cTrifluoroethanolD3Quin, cTrifluoroethanolD3Broad];

var hActicAcidD4Quin = {
  name: 'Actic acid-d4 (quin)',
  value: 2.04,
  label: 'Actic acid-d4'
};

var hActicAcidD4S = {
  name: 'Actic acid-d4 (s)',
  value: 11.65,
  label: 'Actic acid-d4'
};

var hAcetoneD6Quin = {
  name: 'Acetone-d6 (quin)',
  value: 2.05,
  label: 'Acetone-d6',
  nsdb: 'Acetone-D6 ((CD3)2CO)'
};

var hAcetonitrileD3Qquin = {
  name: 'Acetonitrile-d3 (quin)',
  value: 1.94,
  label: 'Acetonitrile-d3',
  nsdb: 'Acetonitrile-D3(CD3CN)'
};

var hBenzeneS = {
  name: 'Benzene (s)',
  value: 7.16,
  label: 'Benzene-d6',
  nsdb: 'Benzene-D6 (C6D6)'
};

var hChloroformDS = {
  name: 'Chloroform-d (s)',
  value: 7.27,
  label: 'CDCl$3',
  nsdb: 'Chloroform-D1 (CDCl3)'
};

var hCyclohexaneD12S = {
  name: 'Cyclohexane-d12 (s)',
  value: 1.38,
  label: 'C$6D$1$2'
};

var hDeuteriumOxideS = {
  name: 'Deuterium oxide (s)',
  value: 4.75,
  label: 'D$2O',
  nsdb: 'Deuteriumoxide (D2O)'
};

var hDichloroethaneD4S = {
  name: 'Dichloroethane-d4 (s)',
  value: 3.72,
  label: 'Dichloroethane-d4'
};

var hDichloromethaneD2T = {
  name: 'Dichloromethane-d2 (t)',
  value: 5.32,
  label: 'CD2Cl2',
  nsdb: 'Methylenchloride-D2 (CD2Cl2)'
};

var hDMFD7Quin1 = {
  name: 'DMF-d7 (quin)-1',
  value: 2.75,
  label: 'DMF-d7'
};

var hDMFD7Quin2 = {
  name: 'DMF-d7 (quin)-2',
  value: 2.92,
  label: 'DMF-d7'
};

var hDMFD7Broad3 = {
  name: 'DMF-d7 (broad)-3',
  value: 8.03,
  label: 'DMF-d7'
};

var hDioxaneD8Broad = {
  name: 'Dioxane-d8 (broad)',
  value: 3.53,
  label: 'Dioxane-d8'
};

var hDMSOD6Quin = {
  name: 'DMSO-d6 (quin)',
  value: 2.50,
  label: 'DMSO-d6',
  nsdb: 'Dimethylsulphoxide-D6 (DMSO-D6, C2D6SO))'
};

var hEthanolD6Broad1 = {
  name: 'Ethanol-d6 (broad)-1',
  value: 1.11,
  label: 'Ethanol-d6'
};

var hEthanolD6S2 = {
  name: 'Ethanol-d6 (s)-2',
  value: 3.56,
  label: 'Ethanol-d6'
};

var hEthanolD6S3 = {
  name: 'Ethanol-d6 (s)-3',
  value: 5.29,
  label: 'Ethanol-d6'
};

var hMethanolD4Quin = {
  name: 'Methanol-d4 (quin)',
  value: 3.31,
  label: 'Methanol-d4',
  nsdb: 'Methanol-D4 (CD3OD)'
};

var hMethanolD4S = {
  name: 'Methanol-d4 (s)',
  value: 4.87,
  label: 'Methanol-d4',
  nsdb: 'Methanol-D4 (CD3OD)'
};

var hNitromethaneD3S = {
  name: 'Nitromethane-d3 (s)',
  value: 4.33,
  label: 'Nitromethane-d3'
};

var hPyridineD5Broad1 = {
  name: 'Pyridine-d5 (broad)-1',
  value: 7.22,
  label: 'Pyridine-d5',
  nsdb: 'Pyridin-D5 (C5D5N)'
};

var hPyridineD5Broad2 = {
  name: 'Pyridine-d5 (broad)-2',
  value: 7.58,
  label: 'Pyridine-d5',
  nsdb: 'Pyridin-D5 (C5D5N)'
};

var hPyridineD5Broad3 = {
  name: 'Pyridine-d5 (broad)-3',
  value: 8.74,
  label: 'Pyridine-d5',
  nsdb: 'Pyridin-D5 (C5D5N)'
};

var hTHFD8S1 = {
  name: 'THF-d8 (s)-1',
  value: 1.73,
  label: 'THF-d8',
  nsdb: 'Tetrahydrofuran-D8 (THF-D8, C4D4O)'
};

var hTHFD8S2 = {
  name: 'THF-d8 (s)-2',
  value: 3.58,
  label: 'THF-d8',
  nsdb: 'Tetrahydrofuran-D8 (THF-D8, C4D4O)'
};

var hTMSS = {
  name: 'TMS (s)',
  value: 0.0,
  label: 'TMS'
};

var hTolueneD8Quin = {
  name: 'Toluene-d8 (quin)-1',
  value: 2.09,
  label: 'Toluene-d8'
};

var hTolueneD8Boad2 = {
  name: 'Toluene-d8 (boad)-2',
  value: 6.98,
  label: 'Toluene-d8'
};

var hTolueneD8S3 = {
  name: 'Toluene-d8 (s)-3',
  value: 7.00,
  label: 'Toluene-d8'
};

var hTolueneD8Broad4 = {
  name: 'Toluene-d8 (broad)-4',
  value: 7.09,
  label: 'Toluene-d8'
};

var hTFADS = {
  name: 'TFA-d (s)',
  value: 11.5,
  label: 'TFA-d'
};

var hTrifluoroethanolD31 = {
  name: 'Trifluoroethanol-d3-1',
  value: 3.88,
  label: 'Trifluoroethanol-d3'
};

var hTrifluoroethanolD32 = {
  name: 'Trifluoroethanol-d3-2',
  value: 5.02,
  label: 'Trifluoroethanol-d3'
};

var LIST_SHIFT_1H = [noReference, hActicAcidD4Quin, hActicAcidD4S, hAcetoneD6Quin, hAcetonitrileD3Qquin, hBenzeneS, hChloroformDS, hCyclohexaneD12S, hDeuteriumOxideS, hDichloroethaneD4S, hDichloromethaneD2T, hDMFD7Quin1, hDMFD7Quin2, hDMFD7Broad3, hDioxaneD8Broad, hDMSOD6Quin, hEthanolD6Broad1, hEthanolD6S2, hEthanolD6S3, hMethanolD4Quin, hMethanolD4S, hNitromethaneD3S, hPyridineD5Broad1, hPyridineD5Broad2, hPyridineD5Broad3, hTHFD8S1, hTHFD8S2, hTMSS, hTolueneD8Quin, hTolueneD8Boad2, hTolueneD8S3, hTolueneD8Broad4, hTFADS, hTrifluoroethanolD31, hTrifluoroethanolD32];

var LIST_SHIFT_19F = [];

var LIST_SHIFT_31P = [];
var LIST_SHIFT_15N = [];
var LIST_SHIFT_29Si = [];

var getListShift = function getListShift(layoutSt) {
  switch (layoutSt) {
    case _list_layout.LIST_LAYOUT.H1:
      return LIST_SHIFT_1H;
    case _list_layout.LIST_LAYOUT.C13:
      return LIST_SHIFT_13C;
    case _list_layout.LIST_LAYOUT.F19:
      return LIST_SHIFT_19F;
    case _list_layout.LIST_LAYOUT.P31:
      return LIST_SHIFT_31P;
    case _list_layout.LIST_LAYOUT.N15:
      return LIST_SHIFT_15N;
    case _list_layout.LIST_LAYOUT.Si29:
      return LIST_SHIFT_29Si;
    default:
      return [];
  }
};

exports.LIST_SHIFT_13C = LIST_SHIFT_13C;
exports.LIST_SHIFT_1H = LIST_SHIFT_1H;
exports.LIST_SHIFT_19F = LIST_SHIFT_19F;
exports.LIST_SHIFT_31P = LIST_SHIFT_31P;
exports.LIST_SHIFT_15N = LIST_SHIFT_15N;
exports.LIST_SHIFT_29Si = LIST_SHIFT_29Si;
exports.getListShift = getListShift;