<template>
  <v-app>
    <v-app-bar
    class="navBar"
    app
      color="primary"
      dark
    >
    <v-app-bar-nav-icon></v-app-bar-nav-icon>
    <logout-button v-if="isLoggedIn"></logout-button>
    <login-button v-else-if="!isLoginPage"></login-button>
  </v-app-bar>
    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>
import { RouterLink } from 'vue-router';
import { mapActions, mapMutations, mapState } from 'vuex';
import logoutButton from './hospital/login/components/logout.vue'
import loginButton from './hospital/login/components/loginButton.vue'

export default {
    name: "App",
    data: () => ({
    //
    }),
    async created () {
      if(localStorage.getItem('token') !== undefined) this.SET_TOKEN(localStorage.getItem('token'))
      await this.userState(localStorage.getItem('token'))
    },
    computed: {
      ...mapState('site',['isLoggedIn','token']),
      isLoginPage () {
        return this.$route.path.includes('login')
      }
    },
    methods: {
      ...mapMutations('site',['SET_TOKEN']),
      ...mapActions('site',['userState'])
    },
    components: { 
      RouterLink,
      logoutButton,
      loginButton
    }
};
</script>
<style>
.v-toolbar__content{
  justify-content: space-between;
}
</style>
