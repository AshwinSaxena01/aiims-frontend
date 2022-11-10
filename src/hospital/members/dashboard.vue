<template>
<div class="text-center">
    <v-container>
    <admin v-if="role ==='superAdmin' || role === 'admin'"></admin>
    <guard v-if="role === 'guard'"></guard>  
  </v-container>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import admin from './admin/admin.vue'
import guard from './guard/guard.vue';


export default {
    name: 'dashboard',
    components: {
      admin,
      guard
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