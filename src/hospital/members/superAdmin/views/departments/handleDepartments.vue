<template><div>
    <h1 class="title">MANAGE DEPARTMENTS</h1>
    <v-container>
      <v-expansion-panels>
        <v-expansion-panel>
          <v-expansion-panel-header>
            <div class="heading"> Create department</div>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <create-department></create-department>
          </v-expansion-panel-content>
        </v-expansion-panel>
        <v-expansion-panel>
          <v-expansion-panel-header>
            <div class="heading"> Delete department</div>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            Delete department
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-container>
    </div>
    </template>
    <script>
  import createDepartment from './createDepartment.vue';
        export default {
            name: 'handleDepartments',
            components:{
              createDepartment
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