<template>
    <v-main>
        <v-container>
      <v-row justify="center">
        <v-col
          cols="8"
          sm="4"
        >
              <p>Sign in with your username and password:</p>
              <v-form ref="form">
                <v-text-field
                single-line
                outlined
                label="Username"
                type="text"
                :rules="[(v) => !!v || 'Username is required']"
                v-model="username"
                :error="invalidCred"
                >
            </v-text-field>
            <v-text-field
                single-line
                outlined
                v-model="password"
                :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                :rules="[rules.required]"
                :type="show1 ? 'text' : 'password'"
                label="Password"
                :error="invalidCred"
                @click:append="show1 = !show1">
            </v-text-field>
              </v-form>
              <div v-if="invalidCred" class="error--text">{{errorMessage}}</div>
              <v-btn color="info" :large="$vuetify.breakpoint.smAndUp" @click="handleLogin">
                <v-icon left>mdi-lock</v-icon>
                Login
              </v-btn>
    </v-col>
      </v-row>
    </v-container>
      </v-main>
</template>
<script>
import axios from 'axios'
import { mapState, mapActions, mapGetters } from 'vuex';
    export default {
        name: 'loginPage',
        data () {
            return {
                rules: {
          required: value => !!value || 'Password is required'
        },
      darkTheme: true,
      password: null,
      username: null,
      show1: false,
      errorMessage: '',
      invalidCred: false
    }
},
computed:{
    ...mapGetters('site',['getUserLoginFlag'])
    
},
    methods: {
        ...mapActions('site',['login']),
        validate() {
            return this.$refs.form.validate();
        },
        async handleLogin () {
            if (this.validate()) {
                let reqBody = {
                    "data": {
                        "username": this.username,
                        "password": this.password
                    }}
                    await this.login(reqBody)
                    this.invalidCred = !this.getUserLoginFlag
                    if(this.invalidCred){ this.errorMessage = 'Invalid Username/Password.'
                    } else {
                        this.$router.push('/dashboard')
                    }
                }
    }
}   
    }
</script>