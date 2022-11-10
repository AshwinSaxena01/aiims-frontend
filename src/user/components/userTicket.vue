<template>
    <v-container class="patient-ticket mt-4">
    <div id="print">
    <div class="ticket" id="qrticket">
    <h1>Patient Ticket</h1>
    <span> User name: {{userDetails.name}}</span>
    <span> UHID: {{userDetails.uhid}}</span>
    <h3 class="mb-4"> QR Code </h3>
  <qrcode-vue v-if="QRValue" :value="QRValue" size="500" level="H" />
</div>
</div>
</v-container>
</template>

<script>
import QrcodeVue from 'qrcode.vue'
import { mapGetters } from 'vuex';
import html2pdf from 'html2pdf.js'
import axios from 'axios'
import { API_URL } from '@/constants';
export default {
  name: "userTicket",
  components: {
    QrcodeVue
  },
  async created () {
    this.registrationId = this.$route.params.id
    let url = API_URL + `/register?registrationId=${this.registrationId}`
    await axios.get(url).then((res)=>{
        this.userDetails = res.data.registration
    })
    this.QRValue = this.userDetails._id
    setTimeout(this.printTicket(),1000)
  },
  data () {
    return {
        userDetails: [],
        QRValue: '',
        registrationId: ''
  }
},
computed:{
    ...mapGetters('user', ['getDetails'])
},
  methods: {

    printTicket () {
      var element = document.querySelector("body");
      var opt = {
              margin:       1,
              filename:     'ticket.pdf',
              image:        { type: 'jpeg', quality: 0.98 },
              html2canvas:  { scale: 2 },
              jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
            };
 debugger
// New Promise-based usage:
html2pdf().from(element).set(opt).save();
    }
  }
}
</script>
<style scoped>
.patient-ticket{
  margin:auto;
  border: 1px solid black;
}
.ticket{
  display: flex;
  flex-direction: column;
  padding:20px;
  align-items: center;
}
</style>
