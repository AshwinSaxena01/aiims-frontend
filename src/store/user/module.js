import { API_URL } from "@/constants"
import axios from "axios"

export const user = {
    namespaced: true,
    state: {
      registrationDetails: {}
    },
    getters: {
      getDetails(state) {
        return state.registrationDetails
      },
      
    },
    mutations: {
      SET_DETAILS(state, details) {
        state.registrationDetails = details
      }
    },
    actions: {
      async register ({commit}, req) {
        await axios.post(API_URL + '/register', req).then((res) => {
            commit('SET_DETAILS', res.data.registration)
                      }).catch((res) => {
                          console.log(res)
                      })
      }
    }
  }