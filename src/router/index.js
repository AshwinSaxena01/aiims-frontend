import Vue from "vue";
import VueRouter from "vue-router";
import HomeView from "../home/HomeView.vue";
import userView from "../user/user.vue";
import loginView from "../hospital/login/login.vue"
import dashboard from '../hospital/members/dashboard.vue'
import handleAccounts from '../hospital/members/superAdmin/views/accounts/handleAccounts.vue'
import handleDepartments from '../hospital/members/superAdmin/views/departments/handleDepartments.vue'

import store from '../store'



Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
    meta: {
      reqAuth: false
    }
  },
  {
    path: "/user",
    name: "user",
    component: userView
  },
  {
    path: "/login",
    name: "login",
    component: loginView,
    beforeEnter: (to,from,next) => {
      console.log(store.getters['site/getUserLoginFlag'], to)
      if(localStorage.getItem('token')){
        next({name: 'dashboard'})
      } else {
        next()
      }
    },
    meta: {
      reqAuth: false
    }
  },
  {
    path: "/dashboard",
    name: "dashboard",
    component: dashboard,
    meta: {
      reqAuth: true
    }
  },
  {
    path: "/dashboard/handleAccounts",
    name: "handleAccounts",
    component: handleAccounts,
    meta: {
      reqAuth: true
    }
  },
  {
    path: "/dashboard/handleDepartments",
    name: "handleDepartments",
    component: handleDepartments,
    meta: {
      reqAuth: true
    }
  }
];


const router = new VueRouter({
  routes,
  mode:'history'
});

const redirectToLogin = route => {
  const LOGIN = 'LOGIN';
  if (route.name != LOGIN) {
    return { name: LOGIN, replace: true, query: { redirectFrom: route.fullPath } };
  }
};

// router.beforeEach(async (to,from, next) => {
//   const userIsAuthenticated = store.getters['site/getUserLoginFlag']
//   console.log(to, userIsAuthenticated)
//   if(!userIsAuthenticated && to.meta.reqAuth && to.path !== "/login") {
//     return '/login'
//   } else if (userIsAuthenticated && to.path === '/login' ) {
//     return '/dashboard'
//   } else {
//     next()
//   }
// })

export default router;
