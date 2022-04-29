// rollup.config.js
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import { getBabelOutputPlugin } from '@rollup/plugin-babel';


const browserBuild = {
  input: 'src/co2.js',
  output: {
    file: 'dist/co2.browser.js',
    format: 'iife',
    name: "CO2"
  },
  plugins: [
    resolve(),
  ]
}


const browserDemoBuild = {
  input: 'src/public-web-swd-demo.js',
  output: {
    file: 'public/co2.browser.js',
    format: 'iife',
    name: "CO2"
  },
  plugins: [
    resolve(),
  ]
}

// const browserBuildMin = {
//   input: 'src/browser.bundle.js',
//   output: {
//     file: 'lib/gridintensity.browser.min.js'
//   },
//   plugins: [
//     resolve(),
//     babel({ babelHelpers: 'bundled' }),
//     terser()
//   ]
// }



const nodeBuild = {
  input: 'src/co2.js',
  output: {
    file: 'lib/index.js',
    format: 'cjs',
    exports: "default"
  },
  plugins: [
    resolve({
      preferBuiltins: true
    }),
    commonjs(),
    babel({ babelHelpers: 'bundled' }),
    getBabelOutputPlugin({
      presets: [['@babel/preset-env',
        {
          targets: {
            node: "current"
          }
        }]]
    })
  ]
}

export default [
  browserBuild,
  browserDemoBuild,
  nodeBuild
];
