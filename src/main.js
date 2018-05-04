// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import { createStore } from './store'
import { sync } from 'vuex-router-sync'
import 'bootstrap/dist/css/bootstrap.min.css'
import '@/assets/css/custom.css'
import 'popper.js/dist/umd/popper'
import 'bootstrap/dist/js/bootstrap.min'
import Progressbar from './components/bars/Progressbar.vue'
import $ from 'jquery'
import { postData } from '@/service/service'

// global progress bar
const bar = Vue.prototype.$bar = new Vue(Progressbar).$mount()
document.body.appendChild(bar.$el)

Vue.config.productionTip = false

const store = createStore()
sync(store, router) // 同步store和router

const app = new Vue({
  mounted () {
    let ThisAlien = this
    $('a').each(function (i, v) {
      $(this).on('click', function (e) {
        let Toggle = $(this).data('toggle') || ''
        if (Toggle === 'child') {
          return ThisAlien.func_child(this)
        } else if (Toggle === 'backstage') {
          e.preventDefault()
          return ThisAlien.func_backstage(this)
        } else if (Toggle === 'save') {
          return ThisAlien.func_save(this)
        }
      })
    })
  },
  methods: {
    func_child (ThisAlien) {
      console.log($(ThisAlien).data('target'))
      let V = this.$store.getters.currentPageActiveLineVs({source: $(ThisAlien).data('target') || '', all: $(ThisAlien).data('multiple') || false}).map(__ => __.v).join(',')
      if (V !== '') {
        $(ThisAlien).attr('href', function (index, attr) {
          return attr + '?v=' + V
        })
      } else {
        alert('请先选中!')
        return false
      }
      return true
    },
    async func_backstage (ThisAlien) {
      let Target = $(ThisAlien).data('target') || ''
      let Multiple = $(ThisAlien).data('multiple') || false
      let Keys = $(ThisAlien).data('key').split(',') || null
      let V = this.$store.getters.currentPageActiveLineVs({source: Target, all: Multiple}).map(__ => __.v)
      let Data = {}
      if (V.length !== 0) {
        if (confirm('确定执行' + $(ThisAlien).text() + '操作?')) {
          Data['v'] = V
          if (Keys !== null) {
            Data['relate'] = this.$store.getters.currentPageActiveLineVs({source: Target, all: false, keys: Keys})
          }
        } else {
          return false
        }
      } else {
        alert('请先选中')
        return false
      }
      let postReturn = await postData($(ThisAlien).attr('href'), Data)
      if (!postReturn.code) {
        this.$store.commit('SET_APP_RELOAD', { reload: true })
        return true
      } else {
        alert(postReturn.message)
        return false
      }
    },
    func_save (ThisAlien) {

    }
  },
  store,
  router,
  components: { App },
  template: '<App/>'
})

router.onReady(() => {
  if (JSON.stringify(store.state.apps) === '{}') {
    // TODO 放在这个地方加载App，耗时过长，应该有加载界面
    store.dispatch('FETCH_APPS').then(function () {
      for (let i in store.state.apps) {
        for (let j in store.state.apps[i]['children']) {
          if (store.state.apps[i]['children'][j].url === router.currentRoute.path) {
            store.commit('OPEN_APP', { app: store.state.apps[i]['children'][j] })
            if (router.currentRoute.fullPath !== store.state.apps[i]['children'][j].url) {
              store.commit('SET_APP_URI', router.currentRoute)
            }
            break
          }
        }
      }
      router.beforeEach(function (to, from, next) {
        for (let i in to.matched) {
          if (to.matched[i].name === 'App') {
            store.commit('SET_APP_URI', to)
            break
          }
        }
        next()
      })
      app.$mount('#app')
    })
  }
})
