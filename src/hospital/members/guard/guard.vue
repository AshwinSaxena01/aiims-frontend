<template>
    <v-container>
    <v-btn @click="showQRScanner"> Scan QR</v-btn>
<scanner v-if="showScanner"></scanner>
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
            showScanner: false
        }
    },
    computed: {
  },
  methods: {
    showQRScanner () {
        this.showScanner = true
    }
  }
}
</script>