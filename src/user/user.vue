
<template>
  <div>
  <user-form @showQR="showQR" v-if="showForm"></user-form>

</div>
  </template>
<script>
import userForm from "./components/userForm.vue";


export default {
  name: "UserView",
  components: {
    userForm
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

