<template>
<div class="text-center">
    <v-container>
    <admin v-if="role ==='superAdmin' || role === 'admin'"></admin>
  </v-container>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

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
    computed: {
    ...mapGetters('site',['getUserRole','getToken']),
    role () {
      return this.getUserRole
    }
  }
}
</script>