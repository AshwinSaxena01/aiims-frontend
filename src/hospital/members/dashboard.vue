<template>
<div class="text-center">
    <v-container>
    <admin v-if="role ==='superAdmin' || role === 'admin'"></admin>
  </v-container>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

import admin from './admin/admin.vue'

export default {
    name: 'dashboard',
    components: {
      admin
    },
    data () {
        return {
        }
    },
    async created () {
      await this.getAllDepartments()
    },
    computed: {
    ...mapGetters('site',['getUserRole','getToken']),
    role () {
      return this.getUserRole
    }
  },
  methods: {
    ...mapActions('account', ['getAllDepartments'] )
  }
}
</script>