<template>
    <v-container>
    <v-btn @click="showQRScanner"> Scan QR</v-btn>
<scanner v-if="showScanner" :key="scannerKey"></scanner>
</v-container>
</template>

<script>
import scanner from './views/scanner.vue';

export default {
    name: 'guard',
    components: {
      scanner
    },
    data () {
        return {
            showScanner: false,
            scannerKey: 0
        }
    },
    computed: {
  },
  methods: {
    showQRScanner () {
        this.showScanner = true
        this.scannerKey++
    }
  }
}
</script>