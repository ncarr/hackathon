module.exports = {
  /*
  ** Headers of the page
  */
  head: {
    title: 'GenericHacks',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'A basic hackathon tech stack' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons' }
    ]
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#3B8070' },
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
  css: [
    { src: '~assets/style/app.styl', lang: 'styl' }
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
