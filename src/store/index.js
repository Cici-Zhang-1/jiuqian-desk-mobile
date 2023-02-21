import Vue from 'vue'
import Vuex from 'vuex'
import actions from './actions'
import mutations from './mutations'
import getters from './getters'
import { host } from '@/api/env'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    apps: {},
    app: {
      c: '',
      label: '',
      reload: false
    },
    sourceData: {},
    user: {
      truename: '张'
    },
    configs: {
      title: '九千定制管理系统2.1',
      company: '九千定制家具厂',
      host: host
    },
    collapse: false,
    signin: false
  },
  actions,
  mutations,
  getters
})
/* export function createStore () {
  return new Vuex.Store({
    state: {
      apps: {},
      app: {
        c: '',
        reload: false
      },
      sourceData: {},
      user: {
        truename: '张'
      },
      configs: {
        title: '九千',
        host: host
      },
      signin: false
    },
    actions,
    mutations,
    getters
  })
} */
