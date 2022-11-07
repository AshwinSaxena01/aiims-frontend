import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import jwt_decode from 'jwt-decode'
import {account} from '../store/account/module'
import {user} from './user/module'

Vue.use(Vuex)

const BASE_URL = 'http://localhost:4000'

 const site = {
  namespaced: true,
  state: {
    isLoggedIn: false,
    userName: '',
    role: null,
    userId: '',
    token: ''
  },
  getters: {
    getUserRole(state) {
      return state.role
    },
    getUserName(state) {
      return state.userName
    },
    getUserLoginFlag(state) {
      return state.isLoggedIn
    },
    getUserId(state) {
      return state.userId
    },
    getToken(state) {
      return state.token
    }
  },
  mutations: {
    SET_TOKEN(state,token) {
      state.token = token
    },
    SET_USER_ROLE(state, role) {
      state.role = role
    },
    SET_USER_NAME(state, userName) {
      state.userName = userName
    },
    SET_USER_ID(state, userId) {
      state.userId = userId
    },
    SET_LOGIN_FLAG(state, isLoggedIn) {
      state.isLoggedIn = isLoggedIn
    },
    logout(state) {
      state.isLoggedIn = false
      state.userName = ''
      state.userId = ''
      state.role = null
      console.log(state.isLoggedIn)
    }
  },
  actions: {
    async login({commit},req) {
      await axios.post('http://localhost:4000/signin', req).then((res) => {
                        console.log(res.data)
                        commit('SET_USER_NAME', res.data.account.username)
                        commit('SET_USER_ROLE', res.data.account.role)
                        commit('SET_USER_ID', res.data.account._id)
                        commit('SET_LOGIN_FLAG', true)
                        localStorage.setItem('token', res.data.token)
                    }).catch((res) => {
                      commit('SET_LOGIN_FLAG', false)
                        console.log(this.errorMessage)
                    })
    },
    userState({commit}, token) {
      const data = jwt_decode(token)
      console.log(data)

      commit('SET_USER_NAME', data.username)
      commit('SET_USER_ROLE', data.role)
      commit('SET_USER_ID', data._id)
      if(data._id) commit('SET_LOGIN_FLAG', true)
    }
  }
}
export default new Vuex.Store({modules:{
  site,
  account,
  user
}})
