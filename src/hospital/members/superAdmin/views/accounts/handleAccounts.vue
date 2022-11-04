<template><div>
  <h1 class="title">MANAGE ACCOUNTS</h1>
  <v-container>
    <v-expansion-panels>
      <v-expansion-panel>
        <v-expansion-panel-header>
          <div class="heading"> Create Account</div>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <create-account></create-account>
        </v-expansion-panel-content>
      </v-expansion-panel>
      <v-expansion-panel>
        <v-expansion-panel-header>
          <div class="heading"> Edit Account</div>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          Edit Account
        </v-expansion-panel-content>
      </v-expansion-panel>
      <v-expansion-panel>
        <v-expansion-panel-header>
          <div class="heading"> Delete Account</div>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          Delete Account
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-container>
  </div>
  </template>
  <script>
import createAccount from './createAccount.vue';
      export default {
          name: 'handleAccounts',
          components:{
            createAccount
          }
  
  }
  </script>
  <style>
  .heading {
    font-size: 16px;
    text-align: center;
  }
  .title{
    text-align: center;
    padding: 20px;
  }
</style>