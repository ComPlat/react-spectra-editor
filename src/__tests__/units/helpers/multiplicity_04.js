import { verifyTypeQ } from '../../../helpers/multiplicity';

const deltaX = 0.0003;
const observeFrequency = 400;

describe('Multiplicity', () => {
  describe('Type Q', () => {
    const type = 'q';
    const js = [10 * deltaX * observeFrequency];
    const metaSt = {
      peaks: {
        deltaX,
        observeFrequency,
      },
    };

    describe('has < 3 intervals', () => {
      const rfv = 5 * deltaX;

      test('return m', () => {
        const oivs = [rfv, rfv];
        const output = verifyTypeQ(type, js, oivs, metaSt);
        expect(output.type).toEqual('m');
        expect(output.js.length).toEqual(0);
      });
    });
    describe('has > 3 intervals', () => {
      const rfv = 5 * deltaX;

      test('return m', () => {
        const oivs = [rfv, rfv, rfv, rfv];
        const output = verifyTypeQ(type, js, oivs, metaSt);
        expect(output.type).toEqual('m');
        expect(output.js.length).toEqual(0);
      });
    });
    describe('has = 3 intervals', () => {
      describe('~ 5 * deltaX', () => {
        const rfv = 5 * deltaX;

        describe('< tolerance', () => {
          test('return q', () => {
            const iv = rfv - 2.1 * deltaX;
            const oivs = [rfv, iv, iv];
            const output = verifyTypeQ(type, js, oivs, metaSt);
            expect(output.type).toEqual('q');
            expect(output.js.length).toEqual(1);
          });
        });
        describe('>= tolerance', () => {
          describe('with 2 similar intervals', () => {
            test('return dd', () => {
              const iv1 = rfv - 2.2 * deltaX;
              const oivs = [iv1, rfv, iv1];
              const output = verifyTypeQ(type, js, oivs, metaSt);
              expect(output.type).toEqual('dd');
              expect(output.js.length).toEqual(2);
            });
          });
          describe('without similar intervals', () => {
            test('return m', () => {
              const iv1 = rfv - 2.2 * deltaX;
              const iv2 = iv1 - 2.2 * deltaX;
              const oivs = [rfv, iv1, iv2];
              const output = verifyTypeQ(type, js, oivs, metaSt);
              expect(output.type).toEqual('m');
              expect(output.js.length).toEqual(0);
            });
          });
        });
      });

      describe('~ 50 * deltaX', () => {
        const rfv = 50 * deltaX;

        describe('< tolerance', () => {
          test('return q', () => {
            const iv = rfv * 0.84;
            const oivs = [rfv, iv, iv];
            const output = verifyTypeQ(type, js, oivs, metaSt);
            expect(output.type).toEqual('q');
            expect(output.js.length).toEqual(1);
          });
        });
        describe('>= tolerance', () => {
          describe('with 2 similar intervals', () => {
            test('return dd', () => {
              const iv1 = rfv * 0.83;
              const oivs = [iv1, rfv, iv1];
              const output = verifyTypeQ(type, js, oivs, metaSt);
              expect(output.type).toEqual('dd');
              expect(output.js.length).toEqual(2);
            });
          });
          describe('without similar intervals', () => {
            test('return m', () => {
              const iv1 = rfv * 0.83;
              const iv2 = iv1 * 0.80;
              const oivs = [rfv, iv1, iv2];
              const output = verifyTypeQ(type, js, oivs, metaSt);
              expect(output.type).toEqual('m');
              expect(output.js.length).toEqual(0);
            });
          });
        });
      });
    });
  });
});
