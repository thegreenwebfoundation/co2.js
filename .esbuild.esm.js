const fs = require('fs')
const path = require('path')

/*
Only return the files that target browser APIs, leaving out node
*/
const justBrowserFiles = fs.readdirSync("./src")
  // remove anything using the node APIs
  .filter(src => !src.endsWith('node.js'))
  // remove anything querying local JSON blobs - TODO: rename these to end with node.js too
  .filter(src => !src.endsWith('json.js'))
  // remove tests
  .filter(src => !src.endsWith('test.js'))
  // only transpile actual js files
  .filter(src => src.endsWith(".js"))
  // resolve the full filepath
  .map(file => path.resolve('./src', file))

require('esbuild').buildSync({
  entryPoints: justBrowserFiles,
  bundle: false,
  minify: false,
  sourcemap: false,
  target: ['chrome58', 'firefox57', 'safari11', 'edge18', 'esnext'],
  outdir: 'lib/esm',
  // do we definitely want mjs files? Some servers don't seem to recognise them as js files
  outExtension: { '.js': '.mjs' },
  format: 'esm',

})