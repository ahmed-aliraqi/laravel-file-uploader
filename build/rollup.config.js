// rollup.config.js

import vue from "rollup-plugin-vue";
import buble from "rollup-plugin-buble";
import commonjs from "rollup-plugin-commonjs";

const config = {
  input: "src/entry.js",
  output: {
    name: "file-uploader",
    exports: "named",
    extend: true
  },

  plugins: [
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
