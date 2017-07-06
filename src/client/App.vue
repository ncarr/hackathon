<template>
  <v-app>
    <v-navigation-drawer
      persistent
      :mini-variant="miniVariant"
      :clipped="clipped"
      v-model="drawer"
    >
      <v-list>
        <v-list-item>
            <v-spacer></v-spacer>
            <v-btn
              icon
              @click.native.stop="miniVariant = !miniVariant"
            >
              <v-icon light v-html="miniVariant ? 'chevron_right' : 'chevron_left'"></v-icon>
            </v-btn>
        </v-list-item>
        <v-list-item>
          <v-list-tile value="true">
            <v-list-tile-action>
              <v-icon light>bubble_chart</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>GenericHacks</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list-item>
        <v-list-item>
          <v-list-tile value="true">
            <v-list-tile-action>
              <v-icon light>bubble_chart</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>Profile</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list-item>
        <v-list-item v-if="user.roles.contains('organizer')">
          <v-list-tile value="true">
            <v-list-tile-action>
              <v-icon light>bubble_chart</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>Organizer Dashboard</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar>
      <v-toolbar-side-icon @click.native.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-btn
        icon
        @click.native.stop="clipped = !clipped"
      >
        <v-icon>web</v-icon>
      </v-btn>
      <v-toolbar-title v-text="title"></v-toolbar-title>
      <v-spacer></v-spacer>
    </v-toolbar>
    <main>
      <v-container fluid>
        <v-slide-y-transition mode="out-in">
          <v-layout column align-center>
            <v-card v-for="event in viewer.events" :key="event.id">
                <v-card-row class="green darken-1">
                  <v-card-title>
                    <span class="white--text" v-text="event.name"></span>
                  </v-card-title>
                </v-card-row>
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
                    Connect your GitHub account to view project commits, issues and projects right from your dashboard.
                </v-card>
            </a>
            <a href="/connect/discord" v-if="!viewer.discord">
                <v-card class="blue darken-1 white--text">
                    Connect your Discord account to join our server.
                </v-card>
            </a>
          </v-layout>
        </v-slide-y-transition>
      </v-container>
    </main>
  </v-app>
</template>

<script>
  import gql from 'graphql-tag'
  export default {
    apollo: {
        viewer: gql`{
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
    },
    data () {
      return {
        viewer: { events: [], roles: ["hacker"], discord: null, github: null },
        clipped: false,
        drawer: true,
        items: [
          { icon: 'bubble_chart', title: 'GenericHacks' }
        ],
        miniVariant: false,
        title: 'Dashboard'
      }
    }
  }
</script>

<style lang="stylus">
  @import './stylus/main'
</style>
