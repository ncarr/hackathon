import { ApolloClient, createNetworkInterface } from 'apollo-client'
import 'isomorphic-fetch'
import gql from 'graphql-tag'

var client;

export const state = () => ({viewer: {events:[], github: null, discord:null}}) // TODO: add default state

export const mutations = {
  SET_DATA: function (state, data) {
    state.data = data
  }
}

export const actions = {
  nuxtServerInit ({ commit }, { req }) {
        commit('SET_DATA', {viewer: {events:[], github: null, discord:null}})
        /*client = new ApolloClient({
            networkInterface: createNetworkInterface({
              uri: 'http://localhost:8000/api/graphql',
              transportBatching: true,
              opts: { credentials: 'include', headers: { cookie: req.headers.cookie } }
            })
        });
        const allData = client.watchQuery({
          query: gql`{
              viewer {
                  events {
                      id
                      name
                      description
                      links
                      times {
                          start
                          end
                      }
                      discord {
                          url
                      }
                      github {
                          url
                      }
                  }
                  roles
                  discord
                  github {
                      id
                  }
              }
          }`
      })
      return allData.result().then(result => commit('SET_DATA', result));*/
  }
}
