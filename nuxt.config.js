module.exports = {
  build: {
      vendor: ['apollo-client', 'vuetify', 'isomorphic-fetch']
  },
  manifest: {
    name: 'GenericHacks',
    description: 'A basic hackathon tech stack',
    theme_color: '#188269'
  },
  plugins: [
      '~plugins/vuetify.js'
  ],
  modules: [
    '@nuxtjs/pwa'
  ],
  render: {
    static: {
      maxAge: '1y',
      setHeaders (res, path) {
        if (path.includes('sw.js')) {
          res.setHeader('Cache-Control', 'public, max-age=0')
        }
      }
    }
  }
}
