import Vue from 'vue'
import Vuex from 'vuex'
import actions from './actions'
import mutations from './mutations'
import getters from './getters'

Vue.use(Vuex)

export function createStore () {
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
        title: '九千'
      }
    },
    actions,
    mutations,
    getters
  })
}
