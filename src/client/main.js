import Vue from 'vue'
import App from './App.vue'
import Vuetify from 'vuetify'
import { ApolloClient, createNetworkInterface } from 'apollo-client'
import VueApollo from 'vue-apollo'

const apolloClient = new ApolloClient({
  networkInterface: createNetworkInterface({
    uri: 'http://localhost:8000/api/graphql',
    transportBatching: true,
    opts: { credentials: 'include' }
  }),
  connectToDevTools: true
})

const apolloProvider = new VueApollo({
  defaultClient: apolloClient
})

Vue.use(VueApollo)
Vue.use(Vuetify)

new Vue({
  el: '#app',
  apolloProvider,
  render: h => h(App)
})
