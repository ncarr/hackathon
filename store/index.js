import { ApolloClient, createNetworkInterface } from 'apollo-client'
import 'isomorphic-fetch'
import gql from '~plugins/apollo'
import realtime from '~plugins/realtime'

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
  nuxtServerInit: (store, ctx) => gql`
    {
        viewer {
            roles
        }
    }`(ctx)
}

export const plugins = [realtime]
