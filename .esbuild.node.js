const { globPlugin } = require('esbuild-plugin-glob');

function main() {
  require('esbuild').build({
    entryPoints: ['src/**/!(*.test.js|!(*.js))',],
    bundle: false,
    minify: false,
    sourcemap: true,
    target: ['node14'],
    outdir: 'dist/cjs/',
    outExtension: { '.js': '.js' },
    format: 'cjs',
    plugins: [globPlugin()]
  })
}
main()
