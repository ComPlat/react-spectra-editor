// `yarn start` / `yarn start:dev`: see start_env.js.
const { spawnSync } = require('child_process');
const { startEnv } = require('./start_env');

const dev = process.argv.includes('--dev');
const { env, error } = startEnv(process.env, { dev });
/* eslint-disable no-console */
if (error) {
  console.error(`[start] ${error}`);
  process.exit(1);
}
console.log(dev
  ? '[start] editor dev page'
  : `[start] ChemSpectra client against ${env.CHEM_SPECTRA_APP_URL}`);
/* eslint-enable no-console */

const { status } = spawnSync(
  'react-scripts',
  ['--max_old_space_size=12288', 'start'],
  { stdio: 'inherit', env, shell: process.platform === 'win32' },
);
process.exit(status === null ? 1 : status);
