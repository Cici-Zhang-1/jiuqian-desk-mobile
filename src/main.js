// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import 'bootstrap/dist/css/bootstrap.min.css'
import '@/assets/css/custom.css'
import App from './App'
import router from './router'
import store from './store'
import { sync } from 'vuex-router-sync'
import 'popper.js/dist/umd/popper'
import 'bootstrap/dist/js/bootstrap.min'
import Progressbar from './components/bars/Progressbar.vue'
import VueCookies from 'vue-cookies'

// global progress bar
const bar = Vue.prototype.$bar = new Vue(Progressbar).$mount()
document.body.appendChild(bar.$el)

Vue.config.productionTip = false

// const store = createStore()
sync(store, router) // 同步store和router

const app = new Vue({
  store,
  router,
  VueCookies,
  beforeMount () {
    if (!store.state.signin) { // 不是登录页
      if (!(VueCookies.get('uid') && VueCookies.get('truename'))) {
        store.commit('SET_SIGNIN', { signin: true })
        router.push('/sign/index/in')
      } else {
        this.$store.commit('SET_USER', { contents: { truename: VueCookies.get('truename') } })
        if (JSON.stringify(store.state.apps) === '{}') { // 加载APP
          store.dispatch('FETCH_APPS')
        }
      }
    }
  },
  components: { App },
  template: '<App/>'
})

router.onReady(() => {
  router.beforeEach(function (to, from, next) {
    store.commit('SET_APP_LABEL', {path: to.path})
    if (!store.state.signin) {
      if (!(VueCookies.get('uid') && VueCookies.get('truename'))) {
        store.commit('SET_SIGNIN', { signin: true })
        next('/sign/index/in')
      } else {
        if (JSON.stringify(store.state.apps) === '{}') {
          store.dispatch('FETCH_APPS')
        }
        next()
      }
    } else {
      next()
    }
  })
  app.$mount('#app')
  /* console.log(router.currentRoute.path.search('sign'))
  if (router.currentRoute.path.search('sign') >= 0) {
    console.log(router.currentRoute.path)
    console.log(111)
    app.$mount('#app')
  } else if (!(VueCookies.get('uid') && VueCookies.get('truename'))) {
    console.log(222)
    store.commit('SET_SIGNIN', { signin: true })
    router.replace('/sign/index/in')
    app.$mount('#app')
  } else {
    if (JSON.stringify(store.state.apps) === '{}') {
      console.log(333)
      // TODO 放在这个地方加载App，耗时过长，应该有加载界面
      store.dispatch('FETCH_APPS').then(function () {
        /!* for (let i in store.state.apps) {
          for (let j in store.state.apps[i]['children']) {
            if (store.state.apps[i]['children'][j].url === router.currentRoute.path) {
              store.commit('OPEN_APP', { app: store.state.apps[i]['children'][j] })
              if (router.currentRoute.fullPath !== store.state.apps[i]['children'][j].url) {
                store.commit('SET_APP_URI', router.currentRoute)
              }
              break
            }
          }
        } *!/
        router.beforeEach(function (to, from, next) {
          console.log(666)
          if (JSON.stringify(store.state.apps) === '{}') {
            store.dispatch('FETCH_APPS')
          }
          /!* for (let i in to.matched) {
            if (to.matched[i].name === 'App') {
              store.commit('SET_APP_URI', to)
              break
            }
          } *!/
          next()
        })
        console.log(444)
        app.$mount('#app')
      })
    } else {
      console.log(555)
      app.$mount('#app')
    }
  } */
})
