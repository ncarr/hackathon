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
        </v-list-item> <!-- add a v-if to restrict this to organizers once we get vuex up and running -->
        <v-list-item>
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
            <nuxt></nuxt>
          </v-layout>
        </v-slide-y-transition>
      </v-container>
    </main>
  </v-app>
</template>

<script>
  export default {
      data () {
        return {
          clipped: false,
          drawer: true,
          miniVariant: false,
          title: 'Dashboard'
        }
      }
  }
</script>

<style lang="stylus">
  @import '~assets/stylus/main'
</style>
