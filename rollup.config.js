import devcert from 'devcert';
import typescript from 'rollup-plugin-typescript2';
import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import { terser } from 'rollup-plugin-terser';
import serve from 'rollup-plugin-serve';
import json from '@rollup/plugin-json';
import ignore from './rollup-plugins/ignore';
import { ignoreTextfieldFiles } from './elements/ignore/textfield';
import { ignoreSelectFiles } from './elements/ignore/select';
import { ignoreSwitchFiles } from './elements/ignore/switch';

export default async () => {
  const dev = process.env.ROLLUP_WATCH;
  const port = process.env.PORT || 5000;

  const serveopts = {
    contentBase: ['./dist'],
    port,
    allowCrossOrigin: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    /**
     * If your HA is running on https, resources also need to be fetched from https URLs.
     * To handle this we create and register a dev certificate when you run `npm run start -- --https`
     */
    https: process.argv.includes("--https") ?
      await devcert.certificateFor('localhost', { getCaPath: true }) :
      undefined,
  };

  const plugins = [
    nodeResolve({}),
    commonjs(),
    typescript(),
    json(),
    babel({
      exclude: 'node_modules/**',
    }),
    dev && serve(serveopts),
    !dev && terser(),
    ignore({
      files: [...ignoreTextfieldFiles, ...ignoreSelectFiles, ...ignoreSwitchFiles].map((file) => require.resolve(file)),
    }),
  ];
  
  return [
    {
      input: 'src/xiaomi-fan-card.ts',
      output: {
        dir: 'dist',
        format: 'es',
      },
      plugins: [...plugins],
    },
  ];
}

