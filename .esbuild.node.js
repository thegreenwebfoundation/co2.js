require('esbuild').buildSync({
    entryPoints: ['src/index.js'],
    bundle: false,
    minify: false,
    sourcemap: true,
    target: ['node10'],
    outdir: 'lib',
    outExtension: { '.js': '.js' },
    format: 'cjs' // Node, no bundling but in the 
  })