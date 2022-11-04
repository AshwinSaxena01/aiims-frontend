<template>
<div>
  <v-btn text
  tile x-large v-if="role==='superAdmin'" @click="handleAccounts"> Manage Accounts</v-btn>
  <v-btn text
  tile x-large v-if="role==='superAdmin'" @click="handleDepartments"> Manage Departments</v-btn>
</div>
</template>

<script>
import createAccount from './views/accounts/createAccount.vue'
import { mapGetters } from 'vuex';
export default {
  name: "superAdmin",
  components: {
  },
  computed: {
    ...mapGetters('site',['getUserRole','getToken']),
    role () {
      return this.getUserRole
    }
  },
  methods: {
    handleAccounts () {
      this.$router.push('/dashboard/handleAccounts')
    },
    handleDepartments () {
      this.$router.push('/dashboard/handleDepartments')
    }
  }
}
</script>