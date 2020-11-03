module.exports = {
  prefix: 'uploader-',
  future: {
    purgeLayersByDefault: true,
  },
  purge: {
    enabled: true,
    layers: ['utilities', 'components', 'base'],
    content: ['./src/file-uploader.vue'],
  },
  theme: {
    extend: {
      height: {
        '300-px': '300px',
      }
    },
  },
  variants: {},
  plugins: [],
}
