import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import sourceMaps from 'rollup-plugin-sourcemaps';
import camelCase from 'lodash.camelcase';
import typescript from 'rollup-plugin-typescript2';
import json from 'rollup-plugin-json';
import postcss from 'rollup-plugin-postcss';

const pkg = require('./package.json');

const libraryName = 'index';

export default {
  input: `src/Upset/${libraryName}.tsx`,
  output: [
    {
      file: pkg.main,
      name: camelCase(libraryName),
      format: 'umd',
      sourcemap: true
    },
    { file: pkg.module, format: 'es', sourcemap: true }
  ],
  // Indicate here external modules you don't wanna include in your bundle (i.e.: 'lodash')
  external: [],
  watch: {
    include: 'src/Upset/**'
  },
  plugins: [
    // Allow json resolution
    json(),
    // Compile TypeScript files
    typescript({ useTsconfigDeclarationDir: true }),
    postcss({
      extract: false,
      modules: true
    }),
    // Allow bundling cjs modules (unlike webpack, rollup doesn't understand cjs)
    commonjs({
      namedExports: {
        'node_modules/react/index.js': [
          'Children',
          'Component',
          'PureComponent',
          'PropTypes',
          'createElement',
          'Fragment',
          'cloneElement',
          'StrictMode',
          'createFactory',
          'createRef',
          'useState',
          'useRef',
          'useMemo',
          'useEffect',
          'useCallback',
          'useDebugValue',
          'memo',
          'forwardRef',
          'createContext',
          'isValidElement',
          'isValidElementType'
        ],
        'node_modules/react-dom/index.js': [
          'render',
          'hydrate',
          'createPortal',
          'unstable_batchedUpdates'
        ]
      }
    }),
    // Allow node_modules resolution, so you can use 'external' to control
    // which external modules to include in the bundle
    // https://github.com/rollup/rollup-plugin-node-resolve#usage
    resolve(),

    // Resolve source maps to the original source
    sourceMaps()
  ]
};
