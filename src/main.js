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
import VueLocalStorage from 'vue-localstorage'
import service from '@/axios'

// global progress bar
const bar = Vue.prototype.$bar = new Vue(Progressbar).$mount()
document.body.appendChild(bar.$el)

Vue.config.productionTip = false

// const store = createStore()
sync(store, router) // 同步store和router

Vue.use(VueLocalStorage)
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
          store.dispatch('FETCH_APPS', {
            label: true,
            path: this.$route.path
          })
        }
      }
    }
    this.versionUpdate()
  },
  components: { App },
  methods: {
    async versionUpdate () {
      let getReturn = await service.get('/data/configs/read', { params: { type: 'system' } })
      if (!getReturn.code) {
        let version = ''
        let oldVersion = this.$localStorage.get('version', '')
        getReturn.contents.content.map(__ => {
          if (__.name === 'version') {
            version = __.config
          }
          return __
        })
        if (version !== oldVersion) {
          localStorage.clear()
          this.$localStorage.set('version', version)
        }
      }
    }
  },
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
          store.dispatch('FETCH_APPS', {
            label: false,
            path: ''
          })
        }
        next()
      }
    } else {
      next()
    }
  })
  app.$mount('#app')
})
