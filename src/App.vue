<template>
  <v-app>
    <Navbar v-if="!isUserPage"/>
    
    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>
import { RouterLink } from 'vue-router';
import { mapGetters } from 'vuex';
import Navbar from './components/Navbar.vue'

export default {
    name: "App",
    components: { 
      Navbar,
      RouterLink,
    },
    computed: {
      isUserPage () {
        return this.$route.path.includes('/user')
      }
    }  
};
</script>
<style>

</style>