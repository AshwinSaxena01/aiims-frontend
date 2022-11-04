<template>
  <div class="admin-container">
    <h1 class="text-overline page-heading">Dashboard</h1>
    <v-card elevation="1" class="create-slots grey lighten-5" min-width="344" min-height="200">
      <v-card-title class="text-overline blue lighten-5" >Create Slots :</v-card-title>
      <create-slot :departmentNames="departmentMenuItems" :departments="departments" ></create-slot>
    </v-card>
    <v-card elevation="1" class="grey lighten-5">
    <v-card-title class="text-overline blue lighten-5">View Slots :</v-card-title>
    <v-data-table
      :headers="headers"
      :items="slotsData"
      sort-by="capacity"
      class="elevation-0"
    >
      <template v-slot:top>
        <v-toolbar elevation="0" >
          <span class="text-overline" >Select Date and Department: </span>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-col cols="12" sm="6" md="3">
          <v-select
            v-model="getSlotsData.department"
            :items="departmentMenuItems"
            class="departments"
            label="Department"
            dense
            required
            multiple
            outlined
          ></v-select>
          </v-col>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-col cols="12" sm="6" md="2">
          <v-menu
            ref="getSlotsMenu"
            v-model="getSlotsMenu"
            :close-on-content-click="false"
            :return-value.sync="getSlotsData.date"
            transition="scale-transition"
            offset-y
            min-width="auto"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="getSlotsData.date"
                label="Date"
                readonly
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker v-model="getSlotsData.date" no-title scrollable>
              <v-spacer></v-spacer>
              <v-btn text color="primary" @click="getSlotsMenu = false">
                Cancel
              </v-btn>
              <v-btn
                text
                color="primary"
                @click="$refs.getSlotsMenu.save(getSlotsData.date)"
              >
                OK
              </v-btn>
            </v-date-picker>
          </v-menu>
          </v-col>
          <v-divider class="mx-4" inset vertical></v-divider>
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
        </v-toolbar>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-icon small class="mr-2" @click="editItem(item)"> mdi-pencil </v-icon>
        <v-icon small @click="deleteItem(item)" color="red lighten-1"> mdi-delete </v-icon>
      </template>
      <template v-slot:no-data> No Slots Found! </template>
    </v-data-table>
  </v-card>
  </div>
</template>

  <script>
import createSlot from './createSlot.vue';
import moment from 'moment';
import axios from 'axios'
import { mapGetters } from 'vuex';
import { API_URL } from '@/constants';

  export default {
    department: "adminPanel",
    components: {
      createSlot
    },
    data: () => ({
      dialog: false,
      dialogDelete: false,
      departments: [],
      departmentMenuItems: [],
      getSlotsData: {
        department: '',
        date: ''
      },
      headers: [
        { text: 'Slot No', value: 'index', sortable: false },
        { text: 'Capacity', value: 'capacity', sortable: false },
        { text: 'Department', value: 'department', sortable: false },
        { text: 'Scheduled Date', value: 'scheduleDate', sortable: true },
        { text: 'Start Time', value: 'startTime', sortable: true },
        { text: 'End Time', value: 'endTime', sortable: false },
        { text: '', value: 'actions', sortable: false },
      ],
      slotsData: [],
      slots: [],
      editedIndex: -1,
      editedItem: {
        department: '',
        capacity: 0,
        scheduleDate: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
        startTime: null,
        endTime: null
      },
      date: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
      menu: false,
      getSlotsMenu: false,
      modal: false,
      menu2: false,
      startTimeMenu: false,
      endTimeMenu: false,
      startTime: null,
      endTime: null,
      editing: false,
      modal2: false,
      deleteItemId: '',
      todayDate: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10)
    }),

    computed: {
      ...mapGetters('site',['getUserId', 'getToken']),
      formTitle () {
        return this.editedIndex === -1 ? 'New Slot' : 'Edit Slot'
      },
      newEndTime () {
        if(this.editedItem.endTime) return this.editedItem.endTime + this.$refs.endTimePicker.period
      },
      newStartTime () {
      if( this.editedItem.startTime ) return this.editedItem.startTime + this.$refs.startTimePicker.period
    }
  },

    watch: {
      dialog (val) {
        val || this.close()
      },
      dialogDelete (val) {
        val || this.closeDelete()
      },
      'getSlotsData.department' (newVal, oldVal) {
        if(oldVal) this.clearTable()
        if (newVal && this.getSlotsData.date) {
          this.getSlots(this.getSlotsData.date, newVal)
        }
      },
      'getSlotsData.date' (newVal, oldVal) {
        if(oldVal) this.clearTable()
        if (newVal && this.getSlotsData.department) {
          this.getSlots(newVal, this.getSlotsData.department)
        }
      }
    },

    created () {
      this.initialize()
    },

    methods: {
      async initialize () {
        await axios.get(API_URL + '/departments').then((res) => {
      this.departments = res.data.departments
      this.departments.forEach((department) => {
        this.departmentMenuItems.push(department.name)
      })
    })
      },
      async getSlots (date,department) {
      let Department = this.departments.find(o => o.name == department)
      let departmentId = Department._id
      const response = await axios.get(API_URL + `/slots?date=${date}&department=${departmentId}`).then((res)=>{
      return res.data
    }).catch((e) => {
      console.log(e)
    })
    this.slots = response.slots
    this.fillSlotsTable(response.slots)
  },
  fillSlotsTable (data) {
    console.log(data)

    data.forEach((slot) => {
      let Department = this.departments.find(o => o._id == slot.department)
      let slotItem = {
        id: slot._id,
        department: Department.name,
        scheduleDate: moment(slot.scheduleDate).format('YYYY-MM-DD'),
        capacity: slot.capacity,
        startTime: moment(slot.startTime).format("hh:mm a"),
        endTime: moment(slot.endTime).format("hh:mm a")
      }
      this.slotsData.push(slotItem)
    } )
  },
      editItem (item) {
        
        this.editing = true
        this.editedIndex = this.slotsData.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },

      deleteItem (item) {
        console.log(item)
        this.deleteItemId = item.id
        this.editedIndex = this.slotsData.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialogDelete = true
      },

      async deleteItemConfirm () {
        //this.slotsData.splice(this.editedIndex, 1)
        let url = API_URL +'/admin' + `/${this.getUserId}` + '/slot' + `/${this.deleteItemId}`
        let headers = {
              'Authorization': "Bearer " + this.getToken,
              'Content-Type': 'application/json'
            }
        await axios.delete(url,{ headers}).then((res)=>{
              console.log(res)
              this.clearTable()
              this.getSlots(this.getSlotsData.date,this.getSlotsData.department)
              this.closeDelete()
          })
        
      },

      close () {
        this.dialog = false
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },

      closeDelete () {
        this.dialogDelete = false
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },
      clearTable () {
        this.slotsData = []
      },

      async save () {
        if (this.editedIndex > -1) {
          Object.assign(this.slotsData[this.editedIndex], this.editedItem)
        } else {
          let url = API_URL + '/admin/' + this.getUserId + '/slot'
          let reqData = this.editedItem
          let Department = this.departments.find(o => o.name == reqData.department)
          reqData.department = Department._id
          reqData.startTime = new Date(reqData.date + ' ' + reqData.startTime)
          reqData.endTime = new Date(reqData.date + ' ' + reqData.endTime)
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
              console.log(res)
          })
          
          
        }
        this.close()
      },
      
    },
  };
  </script>
  <style scoped>
.v-time-picker-clock__container {
  flex-basis: 0px !important;
}

.v-card{
  padding:10px;
  margin: 20px;
}
.v-card__title {
  padding:10px;
  font-size: 14px!important;
}
.page-heading{
  padding:20px;
  text-align: left;
  font-size: 1.25rem !important;
}
.admin-container{
  width: 1000px;
  margin: auto;
}
.v-text-field--outlined.v-input--dense .v-label{
  font-size:12px !important;
}
.departments{
  top:10px
}


</style>