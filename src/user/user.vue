
<template>
  <div>
  <user-form @showQR="showQR" v-if="showForm"></user-form>
  <v-container v-if="!showForm" class="patient-ticket mt-4">
    <div class="ticket">
    <h1>Patient Ticket</h1>
    <span> User name: {{userDetails.name}}</span>
    <span> UHID: {{userDetails.uhid}}</span>
    <h3 class="mb-4"> QR Code </h3>
  <qrcode-vue v-if="QRValue" :value="QRValue" size="300" level="H" />
</div>
</v-container>
</div>
  </template>
<script>
import userForm from "./components/userForm.vue";
import QrcodeVue from 'qrcode.vue'
export default {
  name: "UserView",
  components: {
    userForm,
    QrcodeVue
  },
  data () {
    return {
      QRValue: '',
      showForm: true,
      userDetails: {}
    }
  },
  methods: {
    showQR (data) {
      this.userDetails = data
      this.QRValue = JSON.stringify(data._id)
      this.showForm = false
    }
  }
};
</script>
<style scoped>
.patient-ticket{
  width: 400px !important;
  margin:auto;
  border: 1px solid black;
}
.ticket{
  display: flex;
  flex-direction: column;
  padding:20px;
}
</style>
