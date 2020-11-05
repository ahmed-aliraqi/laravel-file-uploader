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
    inset: {
      '0': '0',
      '10': '10px',
    },
    zIndex: {
      '999999999': 999999999,
    },
    extend: {
      height: {
        '300-px': '300px',
      }
    },
  },
  variants: {},
  plugins: [],
}
