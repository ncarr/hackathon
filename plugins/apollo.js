import Vue from 'vue'
import { ApolloClient, createNetworkInterface } from 'apollo-client'
import 'isomorphic-fetch'

const apolloClient = new ApolloClient({
  networkInterface: createNetworkInterface({
    uri: 'http://localhost:8000/api/graphql',
    transportBatching: true,
    opts: { credentials: 'include' }
  })
})

export default apolloClient
