<template>
    <v-card>
        <v-card-title>
          {{ viewer.name }}
        </v-card-title>
        <v-card-text>
            <p v-if="viewer.roles" class="roles">{{ viewer.roles.join(', ') }}</p>
            <p v-if="viewer.email">Email address: {{ viewer.email }}</p>
            <p v-if="viewer.shirtSize">Shirt size: {{ viewer.shirtSize }}</p>
            <p v-if="viewer.dietaryRestrictions">Dietary restrictions: {{ viewer.dietaryRestrictions }}</p>
            <p v-if="viewer.specialNeeds">Special needs: {{ viewer.specialNeeds }}</p>
            <p v-if="viewer.gender">Gender: {{ viewer.gender }}</p>
            <p v-if="viewer.school">School: {{ viewer.school.name }}</p>
        </v-card-text>
    </v-card>
</template>

<script>
  import { mapState } from 'vuex'
  import gql from '~plugins/apollo'
  export default {
    fetch: gql`{
        viewer {
            name
            roles
            email
            shirtSize
            dietaryRestrictions
            specialNeeds
            gender
            school {
              name
            }
        }
    }`,
    computed: mapState(['viewer'])
  }
</script>

<style>
.roles {
  text-transform: capitalize;
}
</style>
