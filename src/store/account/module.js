import { API_URL } from "@/constants"
import axios from "axios"

export const account = {
    namespaced: true,
    state: {
      departments: []
    },
    getters: {
      getDepartments(state) {
        return state.departments
      },
      
    },
    mutations: {
      SET_DEPARTMENTS(state, departments) {
        state.departments = departments
      }
    },
    actions: {
      async getAllDepartments ({commit}, req) {
        await axios.get(API_URL + '/departments').then((res) => {
            console.log(res)
            commit('SET_DEPARTMENTS', res.data.departments)
                      }).catch((res) => {
                          console.log(res)
                      })
      },
      async deleteDepartment ({commit, dispatch}, payload) {
        let headers = {
              'Authorization': "Bearer " + payload.token,
              'Content-Type': 'application/json'
            }
        await axios.delete(payload.url,{headers}).then( async (res)=>{
              console.log(res)
              await dispatch('getAllDepartments')
          }).catch((e) => console.log(e))
      }
    }
  }