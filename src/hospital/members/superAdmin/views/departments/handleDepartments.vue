<template>
  <v-container>
    <v-row>
<div class="page-container">
  <v-col>
    <h1 class="title text-overline page-heading">MANAGE DEPARTMENTS</h1>
    <v-card elevation="1" class="create-dept grey lighten-5" min-width="344" min-height="200">
      <v-card-title class="text-overline blue lighten-5 mb-2" >Create department :</v-card-title>
    <create-department @deptCreated="refreshTable"></create-department>
    </v-card>
  </v-col>
  <v-col>
    <v-card class="dept-table grey lighten-5">
    <v-card-title>
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Search"
        single-line
        hide-details
      ></v-text-field>
    </v-card-title>
    <v-data-table
      :headers="headers"
      :items="departments"
      :search="search"
    >
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
    </template>
    <script>
  import { mapActions, mapGetters } from 'vuex';
import createDepartment from './createDepartment.vue';
import { API_URL } from '@/constants';
        export default {
            name: 'handleDepartments',
            components:{
              createDepartment
            },
            data () {
            return {
              search: '',
              deleteItemId: '',
              dialogDelete: false,
              headers: [
          {
            text: 'Departments',
            align: 'start',
            filterable: true,
            value: 'name',
          },
          { text: '', align:'end', value: 'actions', sortable: false },
        ],
        departments: [],
        departmentsData: []
            }
        },
        async created () {
          await this.getAllDepartments()
          this.departments = this.getDepartments
        },
        computed: {
          ...mapGetters('account',['getDepartments']),
          ...mapGetters('site',['getUserId','getToken'])
        },
        methods: {
          ...mapActions('account',['getAllDepartments','deleteDepartment']),
          async refreshTable () {
            await this.getAllDepartments()
            this.departments = this.getDepartments
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
        let url = API_URL +'/superAdmin' + `/${this.getUserId}` + '/department' + `/${this.deleteItemId}`
        let payload = {
          url: url,
          token: this.getToken
        }
        await this.deleteDepartment(payload)
        this.refreshTable()
        this.closeDelete()
      }
        },
        watch: {
      dialogDelete (val) {
        val || this.closeDelete()
      }
    }
    }
    </script>
    <style scoped>
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