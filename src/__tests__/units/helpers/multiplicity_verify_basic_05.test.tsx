import { verifyTypeQuint } from '../../../helpers/multiplicity_verify_basic';

const deltaX = 0.0003;
const observeFrequency = 400;

describe('Multiplicity', () => {
  describe('Type Quint', () => {
    const type = 'quint';
    const js = [10 * deltaX * observeFrequency];
    const metaSt = {
      peaks: {
        deltaX,
        observeFrequency,
      },
    };

    describe('has < 4 intervals', () => {
      const rfv = 5 * deltaX;

      test('return m', () => {
        const oivs = [rfv, rfv, rfv];
        const output = verifyTypeQuint(type, js, oivs, metaSt);
        expect(output.type).toEqual('m');
        expect(output.js.length).toEqual(0);
      });
    });
    describe('has > 4 intervals', () => {
      const rfv = 5 * deltaX;

      test('return m', () => {
        const oivs = [rfv, rfv, rfv, rfv, rfv];
        const output = verifyTypeQuint(type, js, oivs, metaSt);
        expect(output.type).toEqual('m');
        expect(output.js.length).toEqual(0);
      });
    });
    describe('has = 4 intervals', () => {
      describe('~ 5 * deltaX', () => {
        const rfv = 5 * deltaX;

        describe('< tolerance', () => {
          test('return quint', () => {
            const iv = rfv - 2.1 * deltaX;
            const oivs = [rfv, iv, iv, iv];
            const output = verifyTypeQuint(type, js, oivs, metaSt);
            expect(output.type).toEqual('quint');
            expect(output.js.length).toEqual(1);
          });
        });
        describe('>= tolerance', () => {
          test('return m', () => {
            const iv = rfv - 2.2 * deltaX;
            const oivs = [rfv, iv, iv, iv];
            const output = verifyTypeQuint(type, js, oivs, metaSt);
            expect(output.type).toEqual('m');
            expect(output.js.length).toEqual(0);
          });
        });
      });

      describe('~ 50 * deltaX', () => {
        const rfv = 50 * deltaX;

        describe('< tolerance', () => {
          test('return quint', () => {
            const iv = rfv * 0.84;
            const oivs = [rfv, iv, iv, iv];
            const output = verifyTypeQuint(type, js, oivs, metaSt);
            expect(output.type).toEqual('quint');
            expect(output.js.length).toEqual(1);
          });
        });
        describe('>= tolerance', () => {
          test('return m', () => {
            const iv = rfv * 0.83;
            const oivs = [rfv, iv, iv, iv];
            const output = verifyTypeQuint(type, js, oivs, metaSt);
            expect(output.type).toEqual('m');
            expect(output.js.length).toEqual(0);
          });
        });
      });
    });
  });
});
