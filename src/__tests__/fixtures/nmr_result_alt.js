/* eslint-disable */
import nmrSvg from './nmr_svg';

const nmrResultAlt = {
  outline: {
    code: 200,
    text: 'Alt load from files.',
  },
  output: {
    result: [
      {
        id: 2,
        type: 'nmr;13C;1d',
        svgs: [nmrSvg],
        statistics: {
          accept: 2,
          warning: 1,
          reject: 2,
          missing: 1,
          total: 6,
        },
        shifts: [
          {
            atom: 1,
            prediction: 128.4000015258789,
            real: 116.0,
            diff: 12.400001525878906,
            status: 'warning',
          },
          {
            atom: 2,
            prediction: 118.80000305175781,
            real: 104.5,
            diff: 14.300003051757812,
            status: 'reject',
          },
          {
            atom: 3,
            prediction: 140.7500000000000,
            real: 124.2,
            diff: 16.55,
            status: 'accept',
          },
          {
            atom: 4,
            prediction: 151.2500000000000,
            real: 139.0,
            diff: 12.25,
            status: 'accept',
          },
          {
            atom: 5,
            prediction: 134.1999969482422,
            real: 120.0,
            diff: 14.199996948242188,
            status: 'reject',
          },
          {
            atom: 6,
            prediction: 147.13500213623047,
            real: 0.0,
            diff: 0.0,
            status: 'missing',
          },
        ],
      },
    ],
  },
};

export default nmrResultAlt;
