<template>
<div class="text-center">
    <super-admin v-if="role==='superAdmin'"></super-admin>
    <v-container>
    <admin v-if="role ==='superAdmin' || role === 'admin'"></admin>
  </v-container>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import superAdmin from './superAdmin/superAdmin.vue';
import admin from './admin/admin.vue'

export default {
    name: 'dashboard',
    components: {
      superAdmin,
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