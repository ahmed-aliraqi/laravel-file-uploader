// rollup.config.js

import vue from "rollup-plugin-vue";
import buble from "rollup-plugin-buble";
import commonjs from "rollup-plugin-commonjs";
import includePaths from 'rollup-plugin-includepaths';

let includePathOptions = {
  include: {
    'axios': 'node_modules/axios/index.js'
  },
  paths: ['src/plugins', 'src/plugins/custom'],
  external: [],
  extensions: ['.js', '.json', '.html']
}
const config = {
  input: "src/entry.js",
  output: {
    name: "file-uploader",
    exports: "named",
    extend: true
  },

  plugins: [
    includePaths(includePathOptions),
    commonjs(),
    vue({
      css: true,
      compileTemplate: true,
      template: {
        isProduction: true
      }
    }),
    buble({
      transforms: { asyncAwait: false }
    })
  ]
};

export default config;
