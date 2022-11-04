<template>
    <v-btn text
  tile @click="handleClick"> Log in </v-btn>
  </template>
  
  <script>

  export default {
      name: "loginButton",
      data: () => ({
      //
      }),
      methods: {
        handleClick () {
            this.$router.push('/login')
        }
      }
  };
  </script>
  
