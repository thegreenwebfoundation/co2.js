// rollup.config.js
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import swc from 'rollup-plugin-swc'

const browserBuild = {
  input: "src/co2.js",
  output: {
    file: "dist/co2.browser.js",
    format: "iife",
    name: "CO2",
    // exports: "default",
  },
  plugins: [resolve()],
};

const browserDemoBuild = {
  input: "src/public-web-swd-demo.js",
  output: {
    file: "public/demo.js",
    format: "iife",
    name: "CO2",
    // exports: "default",
  },
  plugins: [resolve()],
};

const commonjsBuild = {
  input: "src/index-node.js",
  output: {
    dir: "lib",
    // format: "cjs",
    // exports: "default",
  },
  plugins: [
    // resolve({
    //   preferBuiltins: true,
    // }),
    swc({
      "module": {
        "type": "commonjs"
      },
      "jsc": {
        "parser": {
          "syntax": "ecmascript"
        },
        "target": "es2020"
      }
    })
  ],
};

export default [browserBuild, browserDemoBuild, commonjsBuild];
