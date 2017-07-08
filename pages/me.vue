<template>
    <v-card>
        <v-card-title>
          <span class="white--text" v-if="viewer.name" v-text="viewer.name"></span>
        </v-card-title>
        <v-card-text>
            <p v-if="viewer.roles" class="roles">{{ viewer.roles.join(', ') }}</p>
            <p v-if="viewer.email">Email address: {{ viewer.email }}</p>
            <p v-if="viewer.shirtSize">Shirt size: {{ viewer.shirtSize }}</p>
            <p v-if="viewer.dietaryRestrictions">Dietary restrictions: {{ viewer.dietaryRestrictions }}</p>
            <p v-if="viewer.specialNeeds">Special needs: {{ viewer.specialNeeds }}</p>
            <p v-if="viewer.gender">Gender: {{ viewer.gender }}</p>
            <p v-if="viewer.school">School: {{ viewer.school }}</p>
        </v-card-text>
    </v-card>
</template>

<script>
  import { mapState } from 'vuex'
  export default {
    computed: mapState(['viewer'])
  }
</script>

<style>
.roles {
  text-transform: capitalize;
}
</style>
