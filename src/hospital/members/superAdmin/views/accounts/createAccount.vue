<template>
<div>
    <v-container>
      <v-row justify="center">
        <v-col
          cols="8"
          sm="4"
        >
        <v-snackbar
      v-model="snackbar"
      :timeout="timeout"
      color="success"
      top
    > Account created successfully </v-snackbar>
    <v-snackbar
      v-model="errorSnackbar"
      :timeout="timeout"
      color="error"
      top
    > Account could not be created </v-snackbar>
              <v-form ref="form">
                <v-text-field
                dense
                single-line
                outlined
                label="Username"
                type="text"
                :rules="[(v) => !!v || 'Username is required']"
                v-model="username"
                >
            </v-text-field>
            <v-text-field
            dense
                single-line
                outlined
                label="Password"
                type="text"
                :rules="[(v) => !!v || 'Password is required']"
                v-model="password"
                >
            </v-text-field>
            
            <v-select
            dense
            v-model="role"
            outlined
          :items="items"
          label="Select Role"
          :rules="[(v) => !!v || 'Role is required']"
        ></v-select>
              </v-form>
              <v-btn color="info" :large="$vuetify.breakpoint.smAndUp" @click="handleCreateAccount">
                Create Account
              </v-btn>
    </v-col>
      </v-row>
    </v-container>
</div>
</template>

<script>
import axios from 'axios'
import { mapState, mapActions, mapGetters } from 'vuex';
import { API_URL } from '@/constants';
    export default {
        name: 'createAccount',
        created () {
            this.userId = this.getUserId
        },
        data () {
            return {
      darkTheme: true,
      password: null,
      username: null,
      role: null,
      userId: null,
      items: ['Admin','Guard' ],
      snackbar: false,
      errorSnackbar: false,
      timeout: 2000
    }
},
computed:{
    ...mapGetters('site',['getUserId','getToken'])
    
},
    methods: {
        ...mapActions('site',['login']),
        validate() {
            return this.$refs.form.validate();
        },
        async handleCreateAccount () {
            if (this.validate()) {
                let reqBody = JSON.stringify({
                    "data": {
                        "username": this.username,
                        "password": this.password,
                        "role": this.role.toLowerCase()
                    }})
                    let url = API_URL + '/superAdmin/' + this.userId + '/account'
                
                    await axios.request({
      url: url,
      method: "POST",
      headers: {
        'Authorization': "Bearer " + this.getToken,
        'Content-Type': 'application/json'
      },
      data: reqBody

    }).then((res)=>{
      this.snackbar = true
      this.$refs.form.reset()
        console.log(res)
    }).catch((e) => {
      this.errorSnackbar = true;
      console.log(e)
    })
                    
    }
}   
    }
    }
</script>