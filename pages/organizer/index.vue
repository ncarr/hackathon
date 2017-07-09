<template>
    <div>
        <router-link v-for="event in events" :key="event.id" :to="`/organizer/events/${event.id}`">
            <v-card>
                <v-card-title>
                  <span class="white--text" v-text="event.name"></span>
                </v-card-title>
                <v-card-text>
                    <p>{{ event.times.start }} - {{ event.times.end }}</p>
                    <p>{{ event.description }}</p>
                </v-card-text>
            </v-card>
        </router-link>
        <v-btn
            class="purple"
            dark
            fab
            fixed
            bottom
            right
            router
            to="/organizer/events/new"
          >
            <v-icon>add</v-icon>
            <v-icon>close</v-icon>
          </v-btn>
    </div>
</template>

<script>
  import { mapState } from 'vuex'
  import { ApolloClient, createNetworkInterface } from 'apollo-client'
  import 'isomorphic-fetch'
  import gql from 'graphql-tag'
  export default {
    fetch ({ store, req, isServer }) {
      return new ApolloClient({
          ssrMode: true,
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
      .query({
        query: gql`{
            events {
                id
                name
                description
                times {
                    start
                    end
                }
            }
        }`
      })
      .then(result => store.commit('SET_STATE', result.data));
    },
    data () {
        return {
            title: 'Events'
        }
    },
    computed: mapState(['events'])
}
</script>
