<template>
<div>
  <v-container>
    <v-row>
<div class="page-container">
  <v-col>
    <h1 class="title text-overline page-heading">MANAGE ACCOUNTS</h1>
    <v-card elevation="1" class="create-dept grey lighten-5" min-width="344" min-height="200">
      <v-card-title class="text-overline blue lighten-5 mb-2" >Create Account :</v-card-title>
    <create-account></create-account>
    </v-card>
  </v-col>
  <v-col>
    <v-card class="dept-table grey lighten-5">
    <v-card-title>
      
    </v-card-title>
    <v-data-table
      :headers="headers"
      :items="accounts"
    >
    <template v-slot:top>
        <v-toolbar elevation="0" >
          <span class="text-overline" >Select Role: </span>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-col cols="12" sm="6" md="3">
          <v-select
            v-model="role"
            :items="roles"
            class="roles"
            label="Role"
            dense
            required
            outlined
          ></v-select>
          </v-col>
          </v-toolbar>
    </template>
    <template v-slot:item.actions="{ item }">
        <v-icon small @click="deleteItem(item)" color="red lighten-1"> mdi-delete </v-icon>
      </template> 
  </v-data-table>
  <v-dialog v-model="dialogDelete" max-width="500px">
            <v-card>
              <v-card-title class="text-h5"
                >Are you sure you want to delete this item?</v-card-title
              >
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="closeDelete"
                  >Cancel</v-btn
                >
                <v-btn color="blue darken-1" text @click="deleteItemConfirm"
                  >OK</v-btn
                >
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
  </v-card>
</v-col>
  </div>
</v-row>
  </v-container>
  </div>
  </template>
  <script>
import { mapActions, mapGetters } from 'vuex';
import createAccount from './createAccount.vue';
import { API_URL } from '@/constants';
import axios from 'axios'
      export default {
          name: 'handleAccounts',
          components:{
            createAccount
          },
          data () {
            return {
              role: '',
              roles: ['admin', 'guard'],
              accounts: [],
              headers: [ {
            text: 'Accounts',
            align: 'start',
            filterable: true,
            value: 'username',
          },
          { text: '', align:'end', value: 'actions', sortable: false }],
          deleteItemId: '',
          dialogDelete: false
            }
          },
          computed:{
            ...mapGetters('site', ['getUserId', 'getToken']),
            ...mapGetters('account', ['getAccounts'])
          },
          methods: {
            ...mapActions('account', ['getAccountsByRole','deleteAccount']),
            async getRoleAccounts() {
              let url = API_URL + '/superAdmin' + `/${this.getUserId}` + `/account?role=${this.role}`
            let req = {
            url: url,
            method: "GET",
            headers: {
              'Authorization': "Bearer " + this.getToken,
              'Content-Type': 'application/json'
            }
            }
            await this.getAccountsByRole(req)
            this.accounts = this.getAccounts
          },
        deleteItem (item) {
        console.log(item)
        this.deleteItemId = item._id
        this.dialogDelete = true
      },
      
      closeDelete () {
        this.dialogDelete = false
        
      },
      async deleteItemConfirm () {
        let url = API_URL +'/superAdmin' + `/${this.getUserId}` + '/account' + `/${this.deleteItemId}`
        let payload = {
          url: url,
          token: this.getToken
        }
        await this.deleteAccount(payload)
        this.getRoleAccounts()
        this.closeDelete()
      },
      
          },
          watch: {
            role (val) {
              if(val) {
                this.accounts = []
              }
              this.getRoleAccounts()
            }
          }
  
  }
  </script>
  <style scoped>

  .title{
    text-align: center;
    padding: 20px;
  }
  .page-heading{
  padding:20px;
  text-align: left;
  font-size: 1.25rem !important;
}
.page-container{
  width: 1000px;
  margin: auto;
}
.v-card__title {
  padding:10px;
  font-size: 14px!important;
}
.v-card{
  padding:10px;
  min-height: 100px !important;
}
.dept-table{
  max-width:600px;
  margin-top:20px;
  margin: auto;
}
</style>