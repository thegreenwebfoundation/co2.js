const esbuildCommon = require("./.esbuild.common");

require('esbuild').buildSync({
  ...esbuildCommon,
  entryPoints: ['src/index.js'],
  outdir: 'dist/iife',
  globalName: 'co2',
  format: 'iife',
  platform: 'browser',
  bundle: true,
  sourcemap: true,
  minify: true,
  // target: ['es5'],
})
