import { calcMpyManual } from '../../../helpers/multiplicity_manual';

const freq = 400.0;

const metaSt = {
  peaks: {
    observeFrequency: freq,
  },
};

describe('Manual Multiplicity', () => {
  describe('inputting basic types', () => {
    describe('"t"', () => {
      test('return 1 js', () => {
        const manualType = 't';
        const [d1, d2] = [0.011, 0.013];
        const peaks = [
          { x: 8.001 },
          { x: 8.001 + d1 },
          { x: 8.001 + d1 + d2 },
        ];
        const k = { peaks };
        const output = calcMpyManual(k, manualType, metaSt);
        expect(output.mpyType).toEqual(manualType);
        expect(output.js.length).toEqual(1);
        expect(output.js[0].toFixed(3)).toEqual((freq * (d1 + d2) / 2).toFixed(3));
      });
    });

    describe('"quint"', () => {
      test('return 1 js', () => {
        const manualType = 'quint';
        const [d1, d2, d3, d4] = [0.011, 0.013, 0.015, 0.017];
        const peaks = [
          { x: 8.001 },
          { x: 8.001 + d1 },
          { x: 8.001 + d1 + d2 },
          { x: 8.001 + d1 + d2 + d3 },
          { x: 8.001 + d1 + d2 + d3 + d4 },
        ];
        const k = { peaks };
        const output = calcMpyManual(k, manualType, metaSt);
        expect(output.mpyType).toEqual(manualType);
        expect(output.js.length).toEqual(1);
        expect(output.js[0].toFixed(3)).toEqual((freq * (d1 + d2 + d3 + d4) / 4).toFixed(3));
      });
    });

    describe('"m"', () => {
      test('return 0 js', () => {
        const manualType = 'm';
        const [d1, d2] = [0.011, 0.013];
        const peaks = [
          { x: 8.001 },
          { x: 8.001 + d1 },
          { x: 8.001 + d1 + d2 },
        ];
        const k = { peaks };
        const output = calcMpyManual(k, manualType, metaSt);
        expect(output.mpyType).toEqual(manualType);
        expect(output.js.length).toEqual(0);
      });
    });
  });

  describe('inputting advance types', () => {
    describe('"dd"', () => {
      test('return 2 js', () => {
        const manualType = 'dd';
        const [d1a, d2, d1b] = [0.011, 0.22, 0.13];
        const peaks = [
          { x: 8.001 },
          { x: 8.001 + d1a },
          { x: 8.001 + d1a + d2 },
          { x: 8.001 + d1a + d2 + d1b },
        ];
        const k = { peaks };
        const output = calcMpyManual(k, manualType, metaSt);
        expect(output.mpyType).toEqual(manualType);
        expect(output.js.length).toEqual(2);
        expect(output.js[0].toFixed(3)).toEqual((freq * d1a).toFixed(3));
        expect(output.js[1].toFixed(3)).toEqual((freq * (d1a + d2)).toFixed(3));
      });
    });

    describe('"dt"', () => {
      test('return 2 js', () => {
        const manualType = 'dt';
        const [d1a, d2, d1b] = [0.011, 0.22, 0.13];
        const peaks = [
          { x: 8.001 },
          { x: 8.001 + d1a },
          { x: 8.001 + d1a + d1a },
          { x: 8.001 + d1a + d1a + d2 },
          { x: 8.001 + d1a + d1a + d2 + d1b },
          { x: 8.001 + d1a + d1a + d2 + d1b + d1b },
        ];
        const k = { peaks };
        const output = calcMpyManual(k, manualType, metaSt);
        expect(output.mpyType).toEqual(manualType);
        expect(output.js.length).toEqual(2);
        expect(output.js[0].toFixed(3)).toEqual((freq * d1a).toFixed(3));
        expect(output.js[1].toFixed(3)).toEqual((freq * (d1a + d2 + d1b)).toFixed(3));
      });
    });

    describe('"td"', () => {
      test('return 2 js', () => {
        const manualType = 'td';
        const [d1a, d2, d1b] = [0.011, 0.22, 0.13];
        const peaks = [
          { x: 8.001 },
          { x: 8.001 + d1a },
          { x: 8.001 + d1a + d2 },
          { x: 8.001 + d1a + d2 + d1b },
          { x: 8.001 + d1a + d2 + d1b + d2 },
          { x: 8.001 + d1a + d2 + d1b + d2 + d1b },
        ];
        const k = { peaks };
        const output = calcMpyManual(k, manualType, metaSt);
        expect(output.mpyType).toEqual(manualType);
        expect(output.js.length).toEqual(2);
        expect(output.js[0].toFixed(3)).toEqual((freq * d1a).toFixed(3));
        expect(output.js[1].toFixed(3)).toEqual((freq * (d1a + d2)).toFixed(3));
      });
    });

    describe('"dq"', () => {
      test('return 2 js', () => {
        const manualType = 'dq';
        const [d1, d1h] = [0.011, 0.011 / 2];
        const peaks = [
          { x: 8.001 },
          { x: 8.001 + d1 },
          { x: 8.001 + d1 + d1h },
          { x: 8.001 + d1 + d1h + d1h },
          { x: 8.001 + d1 + d1h + d1h + d1h },
          { x: 8.001 + d1 + d1h + d1h + d1h + d1h },
          { x: 8.001 + d1 + d1h + d1h + d1h + d1h + d1h },
          { x: 8.001 + d1 + d1h + d1h + d1h + d1h + d1h + d1 },
        ];
        const k = { peaks };
        const output = calcMpyManual(k, manualType, metaSt);
        expect(output.mpyType).toEqual(manualType);
        expect(output.js.length).toEqual(2);
        expect(output.js[0].toFixed(3)).toEqual((freq * d1).toFixed(3));
        expect(output.js[1].toFixed(3)).toEqual((freq * (d1 + d1h)).toFixed(3));
      });
    });

    describe('"qd"', () => {
      test('return 2 js', () => {
        const manualType = 'qd';
        const [d1, d2] = [0.011, 0.22];
        const peaks = [
          { x: 8.001 },
          { x: 8.001 + d1 },
          { x: 8.001 + d1 + d2 },
          { x: 8.001 + d1 + d2 + d1 },
          { x: 8.001 + d1 + d2 + d1 + d2 },
          { x: 8.001 + d1 + d2 + d1 + d2 + d1 },
          { x: 8.001 + d1 + d2 + d1 + d2 + d1 + d2 },
          { x: 8.001 + d1 + d2 + d1 + d2 + d1 + d2 + d1 },
        ];
        const k = { peaks };
        const output = calcMpyManual(k, manualType, metaSt);
        expect(output.mpyType).toEqual(manualType);
        expect(output.js.length).toEqual(2);
        expect(output.js[0].toFixed(3)).toEqual((freq * d1).toFixed(3));
        expect(output.js[1].toFixed(3)).toEqual((freq * (d1 + d2)).toFixed(3));
      });
    });

    describe('"ddd"', () => {
      test('return 3 js', () => {
        const manualType = 'ddd';
        const [d1, d2, d3] = [0.011, 0.22, 0.88];
        const peaks = [
          { x: 8.001 },
          { x: 8.001 + d1 },
          { x: 8.001 + d1 + d2 },
          { x: 8.001 + d1 + d2 + d1 },
          { x: 8.001 + d1 + d2 + d1 + d3 },
          { x: 8.001 + d1 + d2 + d1 + d3 + d1 },
          { x: 8.001 + d1 + d2 + d1 + d3 + d1 + d2 },
          { x: 8.001 + d1 + d2 + d1 + d3 + d1 + d2 + d1 },
        ];
        const k = { peaks };
        const output = calcMpyManual(k, manualType, metaSt);
        expect(output.mpyType).toEqual(manualType);
        expect(output.js.length).toEqual(3);
        expect(output.js[0].toFixed(3)).toEqual((freq * d1).toFixed(3));
        expect(output.js[1].toFixed(3)).toEqual((freq * (d1 + d2)).toFixed(3));
        expect(output.js[2].toFixed(3)).toEqual((freq * (d1 + d2 + d1 + d3)).toFixed(3));
      });
    });
  });
});
