const esbuild = require('esbuild')
// tiny glob is a dependency of `esbuild-plugin-glob`.
// For this build however we need to filter out some extra files
// that are used for nodejs, but not in browsers, so we use the
// library directly instead of using `esbuild-plugin-glob` as a plugin
const glob = require('tiny-glob');

async function main() {
  const results = await glob('src/**/**.js')
  // we remove node specific files here, with the assumption that
  // the common use case is bundling into browser based web apps
  const justBrowserCompatibleFiles = results.filter(filepath => !filepath.endsWith('node.js'))

  esbuild.build({
    entryPoints: justBrowserCompatibleFiles,
    bundle: false,
    minify: false,
    sourcemap: false,
    target: ['chrome58', 'firefox57', 'safari11', 'edge18', 'esnext'],
    outdir: 'dist/esm',
    outExtension: { '.js': '.js' },
    format: 'esm'
  })
}
main()
