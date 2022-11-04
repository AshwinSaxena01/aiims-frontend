<template>
    <div>
        <v-container>
          <v-row>
            <v-col
              cols="8"
              sm="4"
            >
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
                  <v-btn color="info" :large="$vuetify.breakpoint.smAndUp" @click="handleCreateAccount">
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
          items: ['Admin','Guard' ]
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
        }).catch((e) => console.log(e)
        )
                        
        }
    }   
        }
        }
    </script>