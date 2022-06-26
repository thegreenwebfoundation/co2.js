require('esbuild').buildSync({
  entryPoints: ['src/index.js'],
  outdir: 'public',
  globalName: 'co2',
  format: 'iife',
  platform: 'browser',
  bundle: true,
  sourcemap: true,
  // minify: true,
  // target: ['es5'],
})
