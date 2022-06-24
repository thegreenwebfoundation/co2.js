require('esbuild').buildSync({
    entryPoints: ['src/index.js'],
    bundle: true,
    minify: true,
    sourcemap: true,
    target: ['chrome58', 'firefox57', 'safari11', 'edge18', 'esnext'],
    outdir: 'lib',
    outExtension: { '.js': '.mjs' },
    format: 'esm'
  })