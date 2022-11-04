<template>
   <v-btn text
  tile @click="logoutUser">
        <span>Sign Out</span>
        <v-icon right>mdi-logout</v-icon>
      </v-btn>
  </template>
  
  <script>
import { mapMutations } from 'vuex';
  
  
  export default {
      name: "logoutButton",
      data: () => ({
      //
      }),
      methods: {
        ...mapMutations('site',['logout']),
        logoutUser() {
            this.logout()
            localStorage.removeItem('token')
            this.$router.push('/')
        }
      }
  };
  </script>
  
