<template>
  <v-data-table
    :headers="headers"
    :items="slotsData"
    sort-by="capacity"
    class="elevation-1"
  >
    <template v-slot:top>
      <v-toolbar
        elevation="0"
      >
        
        <v-divider
          class="mx-4"
          inset
          vertical
        ></v-divider>
        <v-dialog
          v-model="dialog"
          max-width="800px"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              color="primary"
              dark
              class="mb-2"
              v-bind="attrs"
              v-on="on"
            >
              create Slot
            </v-btn>
            <v-spacer></v-spacer>
            <v-divider
          class="mx-4"
          inset
          vertical
        ></v-divider>
            <v-select
            v-model="getSlotsData.department"
            :items="departmentMenuItems"
            label="Department"
            required
            chips
          ></v-select>
          <v-divider
          class="mx-4"
          inset
          vertical
        ></v-divider>
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
            prepend-icon="mdi-calendar"
            readonly
            v-bind="attrs"
            v-on="on"
          ></v-text-field>
        </template>
        <v-date-picker
          v-model="getSlotsData.date"
          no-title
          scrollable
        >
          <v-spacer></v-spacer>
          <v-btn
            text
            color="primary"
            @click="getSlotsMenu = false"
          >
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
      <v-divider
          class="mx-4"
          inset
          vertical
        ></v-divider>
        <span>Select Date and Department: </span>
          </template>
          <v-card>
            <v-card-title>
              <span class="text-h5">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <v-select v-if="!editing"
            v-model="editedItem.department"
            :items="departmentMenuItems"
            :rules="[(v) => !!v || 'Item is required']"
            label="Department"
            required
            chips
          ></v-select>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <v-text-field
                      v-model="editedItem.capacity"
                      :rules="[(v) => !!v || 'capacity is required']"
                      label="Capacity"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                  <v-menu
                  v-if="!editing"
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
            v-model="editedItem.date"
            label="Date"

            readonly
            v-bind="attrs"
            v-on="on"
            filled
          ></v-text-field>
        </template>
        <v-date-picker
          v-model="editedItem.date"
          no-title
          scrollable
          :allowed-dates="allowedDates"
        >
          <v-spacer></v-spacer>
          <v-btn
            text
            color="primary"
            @click="menu = false"
          >
            Cancel
          </v-btn>
          <v-btn
            text
            color="primary"
            @click="$refs.menu.save(date)"
          >
            OK
          </v-btn>
        </v-date-picker>
      </v-menu>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  ></v-col>
                  <v-menu
                  v-if="!editing"
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
        width="200"
          v-model="editedItem.startTime"
          @click:minute="saveTime()"
        ></v-time-picker>
      </v-menu>
      <v-menu
      v-if="!editing"
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
        width="200"
          v-model="editedItem.endTime"
          :min="editedItem.startTime"
          @click:minute="$refs.endMenu.save(editedItem.endTime)"
        ></v-time-picker>
        </v-menu>

                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="blue darken-1"
                text
                @click="close"
              >
                Cancel
              </v-btn>
              <v-btn
                color="blue darken-1"
                text
                @click="save"
              >
                Save
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="text-h5">Are you sure you want to delete this item?</v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeDelete">Cancel</v-btn>
              <v-btn color="blue darken-1" text @click="deleteItemConfirm">OK</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template v-slot:item.actions="{ item }">
      <v-icon
        small
        class="mr-2"
        @click="editItem(item)"
      >
        mdi-pencil
      </v-icon>
      <v-icon
        small
        @click="deleteItem(item)"
      >
        mdi-delete
      </v-icon>
    </template>
    <template v-slot:no-data>
        No Slots Created!
    </template>
  </v-data-table>
</template>
  <script>

  import DatePicker from 'vue2-datepicker';
  import moment from 'moment';
  import axios from 'axios'
import { mapGetters } from 'vuex';
    const API_URL = `http://localhost:4000`

  export default {
    department: "adminPanel",
    components: {
      DatePicker
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
      { text: '', value: 'id' },
        { text: 'Capacity', value: 'capacity' },
        { text: 'Start Time', value: 'startTime', sortable: false },
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
      ...mapGetters('site',['getUserId','getToken']),
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
          console.log(this.getSlotsData)
          this.getSlots(this.getSlotsData.date, newVal)
        }
      },
      'getSlotsData.date' (newVal, oldVal) {
        console.log(newVal, oldVal)
        if(oldVal) this.clearTable()
        if (newVal && this.getSlotsData.department) {
          console.log(this.getSlotsData)
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
      console.log(res)
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
      let slotItem = {
        id: slot._id,
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

          moment.defaultFormat
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
      saveTime () {
        this.$refs.startMenu.save(this.editedItem.startTime)
      },
      allowedDates (val) {
      // let allowedDay = parseInt(val.split('-')[2])
      // let today = parseInt(this.todayDate.split('-')[2])
      return val >= this.todayDate
    }
    },
  };
  </script>
  <style>
.v-time-picker-clock__container {
  flex-basis: 0px !important;
}

.v-select.v-select--chips .v-select__selections {
  min-height: 32px;
  width: 40px;
}
.theme--light.v-toolbar.v-sheet {
  height: 100px;
}
</style>