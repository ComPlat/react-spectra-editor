import { verifyTypeSept } from '../../../helpers/multiplicity_verify_basic';

const deltaX = 0.0003;
const observeFrequency = 400;

describe('Multiplicity', () => {
  describe('Type Sept', () => {
    const type = 'sept';
    const js = [10 * deltaX * observeFrequency];
    const metaSt = {
      peaks: {
        deltaX,
        observeFrequency,
      },
    };

    describe('has < 6 intervals', () => {
      const rfv = 5 * deltaX;

      test('return m', () => {
        const oivs = [rfv, rfv, rfv, rfv, rfv];
        const output = verifyTypeSept(type, js, oivs, metaSt);
        expect(output.type).toEqual('m');
        expect(output.js.length).toEqual(0);
      });
    });
    describe('has > 6 intervals', () => {
      const rfv = 5 * deltaX;

      test('return m', () => {
        const oivs = [rfv, rfv, rfv, rfv, rfv, rfv, rfv];
        const output = verifyTypeSept(type, js, oivs, metaSt);
        expect(output.type).toEqual('m');
        expect(output.js.length).toEqual(0);
      });
    });
    describe('has = 6 intervals', () => {
      describe('~ 5 * deltaX', () => {
        const rfv = 5 * deltaX;

        describe('< tolerance', () => {
          test('return sept', () => {
            const iv = rfv - 2.1 * deltaX;
            const oivs = [rfv, iv, iv, iv, iv, iv];
            const output = verifyTypeSept(type, js, oivs, metaSt);
            expect(output.type).toEqual('sept');
            expect(output.js.length).toEqual(1);
          });
        });
        describe('>= tolerance', () => {
          test('return ddd', () => {
            const iv = rfv - 2.2 * deltaX;
            const oivs = [rfv, iv, rfv, rfv, iv, rfv];
            const output = verifyTypeSept(type, js, oivs, metaSt);
            expect(output.type).toEqual('ddd');
            expect(output.js.length).toEqual(3);
          });
          test('return m', () => {
            const iv = rfv - 2.2 * deltaX;
            const oivs = [rfv, iv, iv, iv, iv, iv];
            const output = verifyTypeSept(type, js, oivs, metaSt);
            expect(output.type).toEqual('m');
            expect(output.js.length).toEqual(0);
          });
        });
      });

      describe('~ 50 * deltaX', () => {
        const rfv = 50 * deltaX;

        describe('< tolerance', () => {
          test('return sept', () => {
            const iv = rfv * 0.84;
            const oivs = [rfv, iv, iv, iv, iv, iv];
            const output = verifyTypeSept(type, js, oivs, metaSt);
            expect(output.type).toEqual('sept');
            expect(output.js.length).toEqual(1);
          });
        });
        describe('>= tolerance', () => {
          test('return ddd', () => {
            const iv = rfv * 0.83;
            const oivs = [rfv, iv, rfv, rfv, iv, rfv];
            const output = verifyTypeSept(type, js, oivs, metaSt);
            expect(output.type).toEqual('ddd');
            expect(output.js.length).toEqual(3);
          });
          test('return m', () => {
            const iv = rfv * 0.83;
            const oivs = [rfv, iv, iv, iv, iv, iv];
            const output = verifyTypeSept(type, js, oivs, metaSt);
            expect(output.type).toEqual('m');
            expect(output.js.length).toEqual(0);
          });
        });
      });
    });
  });
});
