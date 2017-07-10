<template>
    <v-card>
        <v-card-title>
          <v-text-field
              v-model="event.name"
              label="Event name"
          ></v-text-field>
        </v-card-title>
        <v-card-text>
          <v-text-field
              v-model="event.description"
              multi-line
              label="Description"
          ></v-text-field>
          <p>Start time</p>
          <v-layout row wrap>
            <v-flex lg4 class="ma-3">
              <v-date-picker v-model="startDate"></v-date-picker>
            </v-flex>
            <v-flex lg4 class="ma-3">
              <v-time-picker format="24hr" v-model="startTime"></v-time-picker>
            </v-flex>
          </v-layout>
          <p>End time</p>
          <v-layout row wrap>
            <v-flex lg4 class="ma-3">
              <v-date-picker v-model="endDate"></v-date-picker>
            </v-flex>
            <v-flex lg4 class="ma-3">
              <v-time-picker format="24hr" v-model="endTime"></v-time-picker>
            </v-flex>
          </v-layout>
        </v-card-text>
        <v-btn primary @click.native.stop="submit">Submit</v-btn>
    </v-card>
</template>

<script>
  import uuid from 'uuid'
  import { mutate } from '~plugins/apollo'
  export default {
    data: () => ({
      event: {
        name: '',
        description: ''
      },
      startDate: new Date().toISOString().substr(0, 10),
      endDate: new Date().toISOString().substr(0, 10),
      startTime: new Date().toTimeString(),
      endTime: new Date().toTimeString()
    }),
    computed: {
      startISODate() {
        return new Date(this.startDate + " " + this.startTime)
      },
      endISODate() {
        return new Date(this.endDate + " " + this.endTime)
      }
    },
    methods: {
      submit() {
        let event = this.event
        event.id = uuid.v4()
        event.start = this.startISODate
        event.stop = this.endISODate
        mutate(event)`mutation($id: ID!, $name: String!, $description: String, $start: Date, $end: Date) {
            newEvent(id: $id, name: $name, description: $description, start: $start, end: $end) {
                id
            }
        }`
        .then(() => this.$router.push({ name: 'organizer-events-event', params: { event: event.id }}))
      }
    }
  }
</script>
