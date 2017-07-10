<template>
    <div>
        <router-link v-for="event in events" :key="event.id" :to="`/organizer/events/${event.id}`">
            <v-card>
                <v-card-title>
                  <span class="white--text" v-text="event.name"></span>
                </v-card-title>
                <v-card-text>
                    <p>{{ event.start }} - {{ event.end }}</p>
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
  import gql from '~plugins/apollo'
  export default {
    fetch: gql`{
        events {
            id
            name
            description
            start
            end
        }
    }`,
    computed: mapState(['events'])
}
</script>
