<template>
    <div class="bg-gray-50 px-8">
      <p>{{ error }}</p>
      <button @click="torch=!torch">TURN ON/OFF FLASHLIGHT</button>
      <qrcode-stream v-if="!verified && !showError" @init="onInit" @decode="onDecode" :torch="torch"></qrcode-stream>
      <v-card v-if="verified" color="green">
        <v-card-text>
          <p class="text-h4 text--primary">
            Verified!
          </p>
          <span>Name: {{userDetails.name}}</span>
          <span>UHID: {{userDetails.name}}</span>
          <span>Date: {{slotDetails.scheduleDate}}</span>
          <span>Slot Time: {{slotDetails.startTime}}</span>
        </v-card-text>
        
      </v-card>
      
      <h1 v-if="showError"> Sorry, your slot time is invalid </h1>
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
            this.slotDetails = res.data.slot
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
}

</style>