
<template>
  
    
  <v-container>
    <h1 class="heading">Patient Registration</h1> 
    <v-row justify="center">
      <v-col
      cols="12"
      sm="6"
      md="4"
      >
        <v-form ref="form" v-model="valid" lazy-validation>
          
    <v-select
            v-model="select"
            :items="items"
            :rules="[(v) => !!v || 'Item is required']"
            label="Department"
            required
            filled
            dense
            offset-y
          ></v-select>
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
            v-model="date"
            label="Date"
            prepend-icon="mdi-calendar"
            readonly
            v-bind="attrs"
            v-on="on"
            filled
          ></v-text-field>
        </template>
        <v-date-picker
          v-model="date"
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
    <div style="text-align: left;"> Select Time Slots: </div>
    <div v-if="noSlots" style="padding: 10px"> {{noSlotsMessage}} </div>
    <v-chip-group
    v-else
    v-model="selectedTimeSlot"
          mandatory
          column
          active-class="primary--text"
        >
          <v-chip
          dense
            v-for="tag in timeSlots"
            :key="tag"
          >
            {{ tag }}
          </v-chip>
        </v-chip-group>
          <v-text-field
          dense
            v-model="name"
            :rules="nameRules"
            label="Name"
            required
            filled
          ></v-text-field>
          <v-text-field
          dense
            v-model="uhid"
            label="UHID"
            :rules="[(v) => !!v || 'UHID is required']"
            required
            filled
          ></v-text-field>
          <v-text-field
          dense
            v-model="mobileNo"
            :rules="phoneRules"
            label="Mobile No."
            required
            filled
          ></v-text-field>
          <v-text-field
          dense
            v-model="email"
            :rules="emailRules"
            label="E-mail (Optional)"
            required
            filled
          ></v-text-field>
        <v-btn class="submitBtn primary" @click = "handleSubmit"> Book Now</v-btn>
        </v-form>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import axios from 'axios'
import moment from 'moment';
import { API_URL } from '@/constants';

export default {
  name: "UserForm",
  async created () {
    let date = this.todayDate
    await axios.get(API_URL + '/departments').then((res) => {
      console.log(res)
      this.departments = res.data.departments
      this.departments.forEach((department) => {
        this.items.push(department.name)
      })
    })

  },
  data: () => ({
    valid: true,
    name: "",
    uhid: "",
    picker: "",
    nameRules: [
      (v) => !!v || "Name is required",
    ],
    email: "",
    mobileNo: "",
    emailRules: [
      (v) => /.+@.+\..+/.test(v) || "E-mail must be valid"
    ],
    phoneRules: [
      (v) => !!v || "Mobile Number is required",
      (v) => /^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[789]\d{9}$/.test(v) || "Mobile Number must be valid"
    ],
    select: null,
    items: [],
    checkbox: false,
    todayDate: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
    date: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
      menu: false,
      modal: false,
      menu2: false,
      timeSlots: [],
      selectedTimeSlot: "",
      departments: [],
      startTime: [],
      endTime: [],
      noSlots: false,
      noSlotsMessage: ''
  }),

  methods: {
    validate() {
      return this.$refs.form.validate();
    },
    async getSlots (date,departmentId) {
      const response = await axios.get(API_URL + `/slots?date=${date}&department=${departmentId}`).then((res)=>{
        let sortedSlots = res.data.slots.sort((a,b) => (a.startTime > b.startTime) ? 1 : ((b.startTime > a.startTime) ? -1 : 0))
      return sortedSlots
    }).catch((e) => {
      console.log(e)
    })
    console.log(response)
    this.printSlots(response)
    
    },
    printSlots(slots) {
      if(slots.length === 0) {
        this.noSlotsMessage = 'No slots found for this date'
        this.noSlots = true
      }
      slots.forEach((slot)=>{
        let startTime = moment(slot.startTime).format("hh:mm a")
        let endTime = moment(slot.endTime).format("hh:mm a")
        let slotTime = startTime + ' - ' + endTime
        this.timeSlots.push(slotTime)
      })
    },
    handleSubmit () {
      if (this.validate()) {
        let reqBody = {
          name: this.name,
          uhid: this.uhid,
          email: this.email,
          department: this.select,
          date: this.date,
          timeSlot: this.timeSlots[this.selectedTimeSlot]
        }
        console.log(reqBody)
      }
    },
    allowedDates (val) {
      return val >= this.todayDate
    }
  },
  watch:{
    select (val) {
      let department = this.departments.find(department => department.name == val)
      let departmentId = department._id
      this.getSlots(this.date, departmentId)
    },
    date (val) {
      if(this.select) {
        let department = this.departments.find(department => department.name == this.select)
      let departmentId = department._id
        this.getSlots(this.date, departmentId)
      }
    }
  }
};
</script>
<style scoped>
.submitBtn {
  margin-top: 16px;
}
.v-chip-group .v-slide-group__content {
    padding: 12px
}
.heading{
  margin: 15px;
  text-align: center;
}
</style>
