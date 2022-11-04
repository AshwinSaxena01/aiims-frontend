
<template>
  <v-app>
    <h1>Patient Registration</h1> 
  <v-container>
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
    <v-chip-group
    v-model="selectedTimeSlot"
          mandatory
          active-class="primary--text"
        >
          <v-chip
            v-for="tag in timeSlots"
            :key="tag"
          >
            {{ tag }}
          </v-chip>
        </v-chip-group>
          <v-text-field
            v-model="name"
            :rules="nameRules"
            label="Name"
            required
            filled
          ></v-text-field>
          <v-text-field
            v-model="uhid"
            label="UHID"
            :rules="[(v) => !!v || 'UHID is required']"
            required
            filled
          ></v-text-field>
          <v-text-field
            v-model="mobileNo"
            :rules="phoneRules"
            label="Mobile No."
            required
            filled
          ></v-text-field>
          <v-text-field
            v-model="email"
            :rules="emailRules"
            label="E-mail"
            required
            filled
          ></v-text-field>
        <v-btn class="submitBtn" @click = "handleSubmit"> Book Now</v-btn>
        </v-form>
      </v-col>
    </v-row>
  </v-container>
</v-app>
</template>
<script>
import axios from 'axios'
import moment from 'moment';
const API_URL = `http://localhost:4000`

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
      (v) => !!v || "E-mail is required",
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
      endTime: []
  }),

  methods: {
    validate() {
      return this.$refs.form.validate();
    },
    async getSlots (date,departmentId) {
      const response = await axios.get(API_URL + `/slots?date=${date}&department=${departmentId}`).then((res)=>{
      return res.data
    })
    console.log(response)
    this.printSlots(response.slots)
    
    },
    printSlots(slots) {
      slots.forEach((slot)=>{
        debugger
        this.startTime.push(moment(slot.startTime).format("hh:mm a"))
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
      // let allowedDay = parseInt(val.split('-')[2])
      // let today = parseInt(this.todayDate.split('-')[2])
      return val >= this.todayDate
    }
  },
  watch:{
    select (val) {
      let department = this.departments.find(department => department.name == val)
      let departmentId = department._id
      this.getSlots(this.date, departmentId)
    }
  }
};
</script>
<style>
.submitBtn {
  margin-top: 16px;
}
.v-chip-group .v-slide-group__content {
    padding: 12px
}
</style>
