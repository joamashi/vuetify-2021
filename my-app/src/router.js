import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'

Vue.use(Router)

const About = () => import(/* webpackChunkName: "about" */ './views/About.vue');
const UsersDefail = () => import(/* webpackChunkName: "UsersDefail" */ './views/UsersDefail.vue');
const UsersEdit = () => import(/* webpackChunkName: "UsersEdit" */ './views/UsersEdit.vue');

const isUserLogin = true;

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      // path: '/about/:userId',
      path: '/about',
      name: 'about',
      children: [
        {
          path: ':ids',
          name: 'users-defail',
          component: UsersDefail,
        },
        {
          path: ':ids/edit',
          name: 'users-edit',
          component: UsersEdit,
        }
      ],
      beforeEnter: (to, from, next) => { // Guard
        console.log('to: ', to, 'form: ', from, 'next: ', next)
        /*
          to ::::::::
          fullPath: "/about?group=member&category=trial%20"
          hash: ""
          matched: [{…}]
          meta: {}
          name: "about"
          params: {userId: 4000, size: "hodx"}
          path: "/about"
          query: {group: "member", category: "trial "}
        */

        /*
          form :::::::
          fullPath: "/"
          hash: ""
          matched: [{…}]
          meta: {}
          name: "home"
          params: {}
          path: "/"
          query: {}
        */
        if (isUserLogin === true) {
          console.log('before Enter')
          next()
        } else {
          next('/')
        }
      },
      
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      // component: () => import(/* webpackChunkName: "about" */ './views/About.vue')

      component: About
    },



    { path: '/alerts', name: 'alerts', component: () => import(/* webpackChunkName: "alerts" */ './views/Alerts.vue') },
    { path: '/cards', name: 'cards', component: () => import(/* webpackChunkName: "cards" */ './views/Cards.vue') },

    { path: '/redirect', redirect: { name: 'about' } },
    { path: '/*', redirect: { name: 'home' } },
  ]
})
