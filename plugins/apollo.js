import { ApolloClient, createNetworkInterface } from 'apollo-client'
import gql from 'graphql-tag'

export default (...args) => {
  return ({ store, req, isServer }) => {
    return new ApolloClient({
        ssrMode: isServer,
        networkInterface: createNetworkInterface({
          uri: 'http://localhost:8000/api/graphql',
          opts: {
            credentials: 'same-origin',
            headers: isServer ? {
              cookie: req.header('Cookie'),
            } : {}
          }
        })
    })
    .query({ query: gql(...args) })
    .then(result => store.commit('SET_STATE', result.data));
  }
}

export const mutate = (variables) => {
  return (...args) => {
    return new ApolloClient({
        networkInterface: createNetworkInterface({
          uri: 'http://localhost:8000/api/graphql',
          opts: {
            credentials: 'same-origin'
          }
        })
    })
    .mutate({ mutation: gql(...args), variables })
  }
}
