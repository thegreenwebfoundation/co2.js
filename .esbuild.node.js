const { globPlugin } = require('esbuild-plugin-glob');
const esbuildCommon = require('./.esbuild.common');

function main() {
  require('esbuild').build({
    ...esbuildCommon,
    entryPoints: ['src/**/!(*.test.js|test-constants.js|!(*.js))'],
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
