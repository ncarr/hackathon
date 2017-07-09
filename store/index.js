import { ApolloClient, createNetworkInterface } from 'apollo-client'
import 'isomorphic-fetch'
import gql from 'graphql-tag'

var client;

export const state = () => ({viewer: {events:[], github: null, discord:null}}) // TODO: add default state

export const mutations = {
  SET_STATE(state, data) {
    for (var property in data) {
      if (data.hasOwnProperty(property)) {
        state[property] = data[property]
      }
    }
  },
  newEvent: (state, data) => state.events.push(data)
}

export const actions = {
  nuxtServerInit ({ commit }, { req }) {
        client = new ApolloClient({
            ssrMode: true,
            networkInterface: createNetworkInterface({
              uri: 'http://localhost:8000/api/graphql',
              opts: {
                credentials: 'same-origin',
                headers: {
                  cookie: req.header('Cookie'),
                }
              }
            })
        });
        return client.query({
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
      .then(result => commit('SET_STATE', result.data));
  }
}
