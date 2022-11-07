<template>
    <div class="bg-gray-50 px-8">
      <p>{{ error }}</p>
      <p>{{ decodedString }}</p>
      <button @click="torch=!torch">TURN ON/OFF FLASHLIGHT</button>
      <qrcode-stream @init="onInit" @decode="onDecode" :torch="torch"></qrcode-stream>
    </div>
  </template>
  
  <script>
  import { QrcodeStream } from 'vue-qrcode-reader'
  export default {
    name: "scanner",
    data() {
      return {
        error: '',
        decodedString: '',
        torch: false,
      }
    },
    components: {
      QrcodeStream
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
      verifyQR (decodedString) {
        
      }
    }
  }
  </script>