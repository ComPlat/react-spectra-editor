import { verifyTypeT } from '../../../helpers/multiplicity';

const deltaX = 0.0003;
const observeFrequency = 400;

describe('Multiplicity', () => {
  describe('Type T', () => {
    const type = 't';
    const js = [10 * deltaX * observeFrequency];
    const metaSt = {
      peaks: {
        deltaX,
        observeFrequency,
      },
    };

    describe('has < 2 intervals', () => {
      const rfv = 5 * deltaX;

      test('return m', () => {
        const oivs = [rfv];
        const output = verifyTypeT(type, js, oivs, metaSt);
        expect(output.type).toEqual('m');
        expect(output.js.length).toEqual(0);
      });
    });
    describe('has > 2 intervals', () => {
      const rfv = 5 * deltaX;

      test('return m', () => {
        const oivs = [rfv, rfv, rfv];
        const output = verifyTypeT(type, js, oivs, metaSt);
        expect(output.type).toEqual('m');
        expect(output.js.length).toEqual(0);
      });
    });
    describe('has = 2 intervals', () => {
      describe('~ 5 * deltaX', () => {
        const rfv = 5 * deltaX;

        describe('< tolerance', () => {
          test('return t', () => {
            const iv = rfv - 2.1 * deltaX;
            const oivs = [rfv, iv];
            const output = verifyTypeT(type, js, oivs, metaSt);
            expect(output.type).toEqual('t');
            expect(output.js.length).toEqual(1);
          });
        });
        describe('>= tolerance', () => {
          test('return m', () => {
            const iv = rfv - 2.2 * deltaX;
            const oivs = [rfv, iv];
            const output = verifyTypeT(type, js, oivs, metaSt);
            expect(output.type).toEqual('m');
            expect(output.js.length).toEqual(0);
          });
        });
      });

      describe('~ 50 * deltaX', () => {
        const rfv = 50 * deltaX;

        describe('< tolerance', () => {
          test('return t', () => {
            const iv = rfv * 0.84;
            const oivs = [rfv, iv];
            const output = verifyTypeT(type, js, oivs, metaSt);
            expect(output.type).toEqual('t');
            expect(output.js.length).toEqual(1);
          });
        });
        describe('>= tolerance', () => {
          test('return m', () => {
            const iv = rfv * 0.83;
            const oivs = [rfv, iv];
            const output = verifyTypeT(type, js, oivs, metaSt);
            expect(output.type).toEqual('m');
            expect(output.js.length).toEqual(0);
          });
        });
      });
    });
  });
});
