import { verifyTypeH } from '../../../helpers/multiplicity_verify_basic';

const deltaX = 0.0003;
const observeFrequency = 400;

describe('Multiplicity', () => {
  describe('Type H', () => {
    const type = 'h';
    const js = [10 * deltaX * observeFrequency];
    const metaSt = {
      peaks: {
        deltaX,
        observeFrequency,
      },
    };

    describe('has < 5 intervals', () => {
      const rfv = 5 * deltaX;

      test('return m', () => {
        const oivs = [rfv, rfv, rfv, rfv];
        const output = verifyTypeH(type, js, oivs, metaSt);
        expect(output.type).toEqual('m');
        expect(output.js.length).toEqual(0);
      });
    });
    describe('has > 5 intervals', () => {
      const rfv = 5 * deltaX;

      test('return m', () => {
        const oivs = [rfv, rfv, rfv, rfv, rfv, rfv];
        const output = verifyTypeH(type, js, oivs, metaSt);
        expect(output.type).toEqual('m');
        expect(output.js.length).toEqual(0);
      });
    });
    describe('has = 5 intervals', () => {
      describe('~ 5 * deltaX', () => {
        const rfv = 5 * deltaX;

        describe('< tolerance', () => {
          test('return h', () => {
            const iv = rfv - 2.1 * deltaX;
            const oivs = [rfv, iv, iv, iv, iv];
            const output = verifyTypeH(type, js, oivs, metaSt);
            expect(output.type).toEqual('h');
            expect(output.js.length).toEqual(1);
          });
        });
        describe('>= tolerance', () => {
          test('return dt', () => {
            const iv1 = rfv - 2.1 * deltaX;
            const iv2 = iv1 - 2.2 * deltaX;
            const oivs = [rfv, iv1, iv2, iv1, rfv];
            const output = verifyTypeH(type, js, oivs, metaSt);
            expect(output.type).toEqual('dt');
            expect(output.js.length).toEqual(2);
          });
          test('return td', () => {
            const iv = rfv - 2.2 * deltaX;
            const oivs = [rfv, iv, rfv, iv, rfv];
            const output = verifyTypeH(type, js, oivs, metaSt);
            expect(output.type).toEqual('td');
            expect(output.js.length).toEqual(2);
          });
          test('return m', () => {
            const iv = rfv - 2.2 * deltaX;
            const oivs = [rfv, iv, iv, iv, iv];
            const output = verifyTypeH(type, js, oivs, metaSt);
            expect(output.type).toEqual('m');
            expect(output.js.length).toEqual(0);
          });
        });
      });

      describe('~ 50 * deltaX', () => {
        const rfv = 50 * deltaX;

        describe('< tolerance', () => {
          test('return h', () => {
            const iv = rfv * 0.84;
            const oivs = [rfv, iv, iv, iv, iv];
            const output = verifyTypeH(type, js, oivs, metaSt);
            expect(output.type).toEqual('h');
            expect(output.js.length).toEqual(1);
          });
        });
        describe('>= tolerance', () => {
          test('return dt', () => {
            const iv1 = rfv * 0.84;
            const iv2 = iv1 * 0.83;
            const oivs = [rfv, iv1, iv2, iv1, rfv];
            const output = verifyTypeH(type, js, oivs, metaSt);
            expect(output.type).toEqual('dt');
            expect(output.js.length).toEqual(2);
          });
          test('return td', () => {
            const iv = rfv * 0.83;
            const oivs = [rfv, iv, rfv, iv, rfv];
            const output = verifyTypeH(type, js, oivs, metaSt);
            expect(output.type).toEqual('td');
            expect(output.js.length).toEqual(2);
          });
          test('return m', () => {
            const iv = rfv * 0.83;
            const oivs = [rfv, iv, iv, iv, iv];
            const output = verifyTypeH(type, js, oivs, metaSt);
            expect(output.type).toEqual('m');
            expect(output.js.length).toEqual(0);
          });
        });
      });
    });
  });
});
