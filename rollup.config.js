import babel from '@rollup/plugin-babel';
import { nodeResolve } from '@rollup/plugin-node-resolve';

const extensions = ['.js', '.jsx', '.ts', '.tsx'];

const config = {
  input: 'src/index.ts',
  output: [
    {
      format: 'umd',
      name: 'Treact',
      file: 'dist/index.umd.js',
    },
    {
      format: 'cjs',
      file: 'dist/index.js',
    },
  ],
  plugins: [
    nodeResolve({
      extensions,
    }),
    babel({
      babelHelpers: 'bundled',
      extensions,
    }),
  ],
};

export default config;
