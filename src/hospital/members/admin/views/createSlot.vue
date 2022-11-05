<template>
    <div>
      
    <v-snackbar
      v-model="snackbar"
      :timeout="timeout"
      color="success"
      top
    > Slot created successfully </v-snackbar>
            <v-form class="form mt-4" ref="form" :key="formKey">
          <v-col cols="12" sm="6" md="3">
            <v-select
              v-model="editedItem.department"
              :items="departmentNames"
              :rules="[(v) => !!v || 'Item is required']"
              label="Department"
              dense
            required
            outlined
            ></v-select>
          </v-col>
          <v-col cols="12" sm="6" md="2">
            <v-text-field
              v-model="editedItem.capacity"
              :rules="[(v) => !!v || 'capacity is required']"
              label="Capacity"
              dense
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="2">
            <v-menu
              ref="menu"
              v-model="menu"
              :close-on-content-click="false"
              :return-value.sync="date"
              transition="scale-transition"
              offset-y
              min-width="auto"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                dense
                  v-model="editedItem.scheduleDate"
                  label="Date"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="editedItem.scheduleDate"
                no-title
                scrollable
                :allowed-dates="(val) => val >= todayDate"
              >
                <v-spacer></v-spacer>
                <v-btn text color="primary" @click="menu = false"> Cancel </v-btn>
                <v-btn text color="primary" @click="$refs.menu.save(date)">
                  OK
                </v-btn>
              </v-date-picker>
            </v-menu>
          </v-col>
          <v-col cols="12" sm="6" md="2">
          <v-menu
            ref="startMenu"
            v-model="startTimeMenu"
            :close-on-content-click="false"
            :nudge-right="40"
            :return-value.sync="editedItem.startTime"
            transition="scale-transition"
            offset-y
            max-width="290px"
            min-width="290px"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
              dense
                v-model="newStartTime"
                label="Start Time"
                prepend-icon="mdi-clock-time-four-outline"
                :rules="[(v) => !!v || 'Start time is required']"
                readonly
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-time-picker
              ref="startTimePicker"
              ampm-in-title
              flat
              v-model="editedItem.startTime"
              @click:minute="$refs.startMenu.save(editedItem.startTime)"
            ></v-time-picker>
          </v-menu>
        </v-col>
        <v-col cols="12" sm="6" md="2">
          <v-menu
            ref="endMenu"
            v-model="endTimeMenu"
            :close-on-content-click="false"
            :nudge-right="40"
            :return-value.sync="editedItem.endTime"
            transition="scale-transition"
            offset-y
            max-width="290px"
            min-width="290px"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
              dense
                v-model="newEndTime"
                label="End Time"
                prepend-icon="mdi-clock-time-four-outline"
                :rules="[(v) => !!v || 'End time is required']"
                readonly
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-time-picker
              ref="endTimePicker"
              v-model="editedItem.endTime"
              :min="editedItem.startTime"
              @click:minute="$refs.endMenu.save(editedItem.endTime)"
            ></v-time-picker>
          </v-menu>
        </v-col>
        <v-col cols="12" sm="6" md="10"></v-col>
          <v-col cols="12" sm="6" md="2">
            <v-btn color="blue lighten-2" @click="saveSlot"> Create </v-btn>
          </v-col>
        </v-form>
    </div>
  </template>
  
  <script>
  import { mapActions, mapMutations, mapState, mapGetters } from 'vuex';
  import axios from 'axios'
  import { API_URL } from '@/constants';
  export default {
      name: "createSlots",
      props: {
        departmentNames: [],
        departments: []
      },
      components: { 
        
      },
      data: () => ({
        snackbar: false,
        timeout: 2000,
        editedItem: {
        department: '',
        capacity: '',
        scheduleDate: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
        startTime: null,
        endTime: null
      },
      defaultItem: {
        department: '',
        capacity: '',
        scheduleDate: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
        startTime: null,
        endTime: null
      },
      formKey: 0,
      menu: false,
      date: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
      startTimeMenu: false,
      endTimeMenu: false,
      todayDate: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
      newEndTime: '',
      newStartTime: ''

      //
      }),
      computed: {
        ...mapGetters('site',['getUserId','getToken']),
    //     newEndTime () {
    //     if(this.editedItem.endTime) return this.editedItem.endTime + this.$refs.endTimePicker.period
    //   },
    //   newStartTime () {
    //   if( this.editedItem.startTime ) return this.editedItem.startTime + this.$refs.startTimePicker.period
    // }
      },
      methods: {
        allowedDates (val) {
            return val >= this.todayDate
        },
        formattedStartTime () {
          if(this.editedItem.startTime) this.newStartTime = this.editedItem.startTime + this.$refs.startTimePicker.period
        },
        formattedEndTime () {
          if(this.editedItem.endTime) this.newEndTime = this.editedItem.endTime + this.$refs.endTimePicker.period

        },
        async saveSlot () {
          let url = API_URL + '/admin/' + this.getUserId + '/slot'
          let reqData = this.editedItem
          let Department = this.departments.find(o => o.name == reqData.department)
          reqData.department = Department._id
          reqData.startTime = new Date(reqData.scheduleDate + ' ' + reqData.startTime)
          reqData.endTime = new Date(reqData.scheduleDate + ' ' + reqData.endTime)
          let reqBody = JSON.stringify({
            'data': reqData
          })

          await axios.request({
            url: url,
            method: "POST",
            headers: {
              'Authorization': "Bearer " + this.getToken,
              'Content-Type': 'application/json'
            },
            data: reqBody
          }).then((res)=>{
            //
              this.formKey++
              this.snackbar = true
              this.$refs.form.reset()
              console.log(res)
          })
          
      },

      },
      watch: {
        'editedItem.endTime' () {
          this.formattedEndTime()
        },
        'editedItem.startTime' () {
          this.formattedStartTime()
        }
      }
      
  };
  </script>
  <style scoped>
  .form {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
  }
  .col-sm-6{
    padding: 4px !important;
  }

  </style>