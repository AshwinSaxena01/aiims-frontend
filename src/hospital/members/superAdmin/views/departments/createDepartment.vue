<template>
    <div>
        <v-container>
          <v-row justify="start">
            <v-col
              cols="8"
              sm="6"
            >
            <v-snackbar
      v-model="snackbar"
      :timeout="timeout"
      color="success"
      top
    > Slot created successfully </v-snackbar>
                  <v-form ref="form">
                    <v-text-field
                    dense
                single-line
                outlined
                label="Department"
                type="text"
                :rules="[(v) => !!v || 'Department is required']"
                v-model="department"
                >
            </v-text-field>
                  </v-form>
                </v-col>
                  <v-col
              cols="8"
              sm="4"
            >
                  <v-btn color="blue lighten-2" :large="$vuetify.breakpoint.smAndUp" @click="handleCreateAccount">
                    Create Department
                  </v-btn>
                  </v-col>
          </v-row>
        </v-container>
    </div>
    </template>
    
    <script>
    import axios from 'axios'
    import { mapState, mapActions, mapGetters } from 'vuex';
        export default {
            name: 'createDepartment',
            created () {
                this.userId = this.getUserId
            },
            data () {
                return {
          darkTheme: true,
          department: null,
          userId: null,
          items: ['Admin','Guard' ],
          snackbar: false,
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
                    let reqBody = {
                        "data": {
                            "name": this.department
                        }}
                        let url = 'http://localhost:4000/superAdmin/' + this.userId + '/department'
                    
                        await axios.request({
          url: url,
          method: "POST",
          headers: {
            Authorization: "Bearer " + this.getToken
          },
          data: reqBody
        
        }).then((res)=>{
          this.$emit('deptCreated')
          this.snackbar = true
          this.$refs.form.reset()
        }).catch((e) => console.log(e)
        )
                        
        }
    }   
        }
        }
    </script>