<template>
    <nav>
      <v-toolbar>
        <v-app-bar-nav-icon v-if="getUserLoginFlag" @click="drawer = !drawer" class="grey--text"></v-app-bar-nav-icon>
        <v-toolbar-title class="text-uppercase grey--text">
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <logout-button v-if="isLoggedIn"></logout-button>
        <login-button v-else-if="!isLoginPage"></login-button>
      </v-toolbar>
  
      <v-navigation-drawer app dark v-model="drawer" v-if="getUserLoginFlag" class="blue lighten-1" width="240">
        <v-list-item  class = "app-logo">
          <v-list-item-content>
            <v-list-item-title>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        
 
        <v-divider></v-divider>
  
        <v-list
          dense
          nav
        >
        <v-list-item link v-if="role==='superAdmin' || role==='admin'" @click="handleDashboard">
          <v-list-item-icon>
            <v-icon>mdi-view-dashboard</v-icon>
          </v-list-item-icon>
            <v-list-item-content class="text-overline">
              Dashboard
            </v-list-item-content>
          </v-list-item>
          <v-list-item link v-if="role==='superAdmin'" @click="handleAccounts">
            <v-list-item-icon>
            <v-icon>mdi-account-group</v-icon>
          </v-list-item-icon>
            <v-list-item-content class="text-overline">
              Accounts
            </v-list-item-content>
          </v-list-item>
          <v-list-item link  v-if="role==='superAdmin'" @click="handleDepartments">
            <v-list-item-icon>
            <v-icon>mdi-briefcase</v-icon>
          </v-list-item-icon>
            <v-list-item-content class="text-overline">
               Departments
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>
  
    </nav>
  </template>
  
  <script>
import logoutButton from '../hospital/login/components/logout.vue'
import loginButton from '../hospital/login/components/loginButton.vue'
import { mapActions, mapMutations, mapState, mapGetters } from 'vuex';  
export default {
    components: {
      logoutButton,
      loginButton
    },
    data() {
      return {
        drawer: true,
        items: [
        { title: 'Dashboard', icon: 'mdi-view-dashboard' },
        { title: 'Photos', icon: 'mdi-image' },
        { title: 'About', icon: 'mdi-help-box' },
      ],
      right: null,
      }
    },
    async created () {
      if(localStorage.getItem('token') !== undefined) this.SET_TOKEN(localStorage.getItem('token'))
      await this.userState(localStorage.getItem('token'))
    },
    computed: {
      ...mapState('site',['isLoggedIn','token']),
      ...mapGetters('site',['getUserRole','getToken', 'getUserLoginFlag']),
    role () {
      return this.getUserRole
    },
      isLoginPage () {
        return this.$route.path.includes('login')
      }
    },
    methods: {
      ...mapMutations('site',['SET_TOKEN']),
      ...mapActions('site',['userState']),
    handleAccounts () {
      this.$router.push('/dashboard/handleAccounts').catch(err => {})
    },
    handleDepartments () {
      this.$router.push('/dashboard/handleDepartments').catch(err => {})
    },
    handleDashboard () {
      this.$router.push('/dashboard').catch(err => {})
    }
  
    }
  }
  </script>
  
  <style scoped>
  .v-toolbar{
    font-weight: 500!important;
  }
  .app-logo {
    height: 64px
  }
  .v-list-item__content {
    font-weight: 300 !important;
  }
  </style>