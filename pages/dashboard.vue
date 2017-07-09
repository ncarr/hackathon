<template>
    <div>
        <v-card v-for="event in viewer.events" :key="event.id">
            <v-card-title>
              <span class="white--text" v-text="event.name"></span>
            </v-card-title>
            <v-card-text>
                <p>{{ event.times.start }} - {{ event.times.end }}</p>
                <p v-if="event.discord.url"><a :href="event.discord.url">Discord</a></p>
                <p v-if="event.github.url"><a :href="event.github.url">GitHub</a></p>
                <p>{{ event.description }}</p>
                <ul v-if="event.links">
                    <p>Other links</p>
                    <li v-for="link in event.links"><a :href="link" target="_blank">{{ link }}</a></li>
                </ul>
            </v-card-text>
        </v-card>
        <a href="/connect/github" v-if="!viewer.github">
            <v-card class="blue darken-1 white--text">
                <v-card-text>
                    Connect your GitHub account to view project commits, issues and projects right from your dashboard.
                </v-card-text>
            </v-card>
        </a>
        <a href="/connect/discord" v-if="!viewer.discord">
            <v-card-text>
                <v-card class="blue darken-1 white--text">
                    <v-card-text>
                        Connect your Discord account to join our server.
                    </v-card-text>
                </v-card>
            </v-card-text>
        </a>
    </div>
</template>

<script>
  import { mapState } from 'vuex'
  import gql from '~plugins/apollo'
  export default {
    fetch: gql`{
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
    }`,
    computed: mapState(['viewer'])
}
</script>
