require('esbuild').buildSync({
  entryPoints: ['src/co2.js'],
  outdir: 'public',
  globalName: 'co2',
  format: 'iife',
  // platform: 'browser',
  bundle: true,
  sourcemap: true,
  // minify: true,
  // target: ['es5'],
})