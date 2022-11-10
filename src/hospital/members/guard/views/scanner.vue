<template>
    <div class="bg-gray-50 px-8">
      <p>{{ error }}</p>
      <qrcode-stream v-if="!verified && !showError" @init="onInit" @decode="onDecode" :torch="torch"></qrcode-stream>
      <v-card v-if="verified" elevation="2" class="mx-auto" tile color="green lighten-1">
        <v-card-text class="grey--text">
          <v-icon size="200">mdi-checkbox-marked-circle</v-icon>
          <span class="text-h6 text--primary">Name: {{userDetails.name}}</span>
          <span class="text-h6 text--primary">UHID: {{userDetails.name}}</span>
          <span class="text-h6 text--primary">Date: {{slotDetails.scheduleDate}}</span>
          <span class="text-h6 text--primary">Slot Time: {{slotDetails.startTime}}</span>
        </v-card-text>
        
      </v-card>
      <v-card v-if="showError" elevation="2" class="mx-auto" tile color="red lighten-1">
        <v-card-text class="grey--text">
          <v-icon size="100">mdi-emoticon-sad-outline</v-icon>
          <span class="text-h7 text--primary">Sorry, your slot time is invalid</span>
        </v-card-text>
      </v-card>
    </div>
  </template>
  
  <script>
  import { QrcodeStream } from 'vue-qrcode-reader'
  import axios from 'axios'
import { mapGetters } from 'vuex'
import { API_URL } from '@/constants'
import moment from 'moment'
  export default {
    name: "scanner",
    data() {
      return {
        error: '',
        decodedString: '',
        torch: false,
        verified: false,
        showError: false,
        slotDetails: [],
        userDetails: []
      }
    },
    components: {
      QrcodeStream
    },
    computed: {
      ...mapGetters('site', ['getToken','getUserId']
      )
    },
    methods: {
      async onInit( promise ) {
        try {
        const { capabilities } = await promise
        // successfully initialized
      } catch (error) {
        if (error.name === 'NotAllowedError') {
          this.error = "User denied camera access permisson"
        } else if (error.name === 'NotFoundError') {
          this.error = "No suitable camera device installed"
        } else if (error.name === 'NotSupportedError') {
          this.error = "Page is not served over HTTPS (or localhost)"
        } else if (error.name === 'NotReadableError') {
          this.error = "Maybe camera is already in use"
        } else if (error.name === 'OverconstrainedError') {
          this.error = "Did you requested the front camera although there is none?"
        } else if (error.name === 'StreamApiNotSupportedError') {
          this.error = "Browser seems to be lacking features"
        }
        } finally {
          // hide loading indicator
        }
      },
      onDecode(decodedString) {
        this.decodedString = decodedString;
        //window.location.replace(decodedString)
      },
      async verifyQR (decodedString) {
        console.log(decodedString.replaceAll('\"',''))
            let reqBody = JSON.stringify({ 
              data: {
                registrationId: decodedString.replaceAll('\"','')
            }
          })

          let url = API_URL + `/guard/${this.getUserId}` + '/verifyRegistration'
          await axios.request({
            url: url,
            method: "POST",
            headers: {
              'Authorization': "Bearer " + this.getToken,
              'Content-Type': 'application/json'
            },
            data: reqBody
          }).then((res)=>{
            this.verified = true
            this.slotDetails = res.data.registration.slot
            this.slotDetails.startTime = moment(this.slotDetails.startTime).format('hh:mm A')
            this.slotDetails.scheduleDate = moment(this.slotDetails.scheduleDate).format('YYYY-MM-DD')
            this.userDetails = res.data.registration
            console.log(res)
          }).catch((e) => {
            console.log(e)
            this.showError = true
          })
      }
    },
    watch:{
      decodedString (val) {
        this.verifyQR(val)
      }
    }
  }
  </script>
  <style scoped>
.v-card__text{
  display: flex;
  flex-direction: column;
  margin-top:80px;
  height: 40vh;
    justify-content: space-around;
}
.text-h6 {
  font-weight: 400;
  letter-spacing: 0.2rem!important;
}
.v-card{
  min-height: 50vh;
}
</style>