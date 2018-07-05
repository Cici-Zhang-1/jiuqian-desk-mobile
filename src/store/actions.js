/**
 * Created by chuangchuangzhang on 2018/2/2.
 */
import service from '@/axios'

export default {
  FETCH_APPS: ({commit}) => {
    return service.get('permission/menu/read').then(data => {
      // let data = response.data
      if (data.code === 0) {
        commit('SET_APPS', { ...data })
      }
    })
  },

  /* FETCH_USER: ({commit}) => {
    return service.get('manage/myself/read').then(data => {
      // let data = response.data
      if (data.code === 0) {
        commit('SET_USER', { ...data })
      }
    })
  }, */

  FETCH_CONFIGS: ({commit}) => {
    return service.get('manage/configs/read').then(data => {
      // let data = response.data
      if (data.code === 0) {
        commit('SET_CONFIGS', { ...data })
      }
    })
  },

  /**
   *
   * @param commit
   * @param dispatch
   * @param state
   * @param params
   * {
   *    uri: this.card.url,
   *    data: {
   *      keyword: this.keyword,
   *      page: to,
   *      pagesize: this.card ? this.card.pagesize : this.pagesize
   *    }
   *  }
   * @param target
   * @constructor
   */
  FETCH_DATA: ({commit, dispatch, state}, { url, configs = {}, target }) => {
    return service.get(url, configs).then(data => {
      // if (data.code === 0) {
      commit('SET_DATA', { ...data, target })
      // }
    })
  },

  /**
   * Fetch Source Data
   * @param commit
   * @param dispatch
   * @param state
   * @param params
   * @param target
   * @returns {*|PromiseLike<T>|Promise<T>}
   * @constructor
   */
  FETCH_SOURCE_DATA: ({ commit, dispatch, state }, { url, configs, target }) => {
    return service.get(url, configs).then(data => {
      // let data = response.data
      // if (data.code === 0) {
      commit('SET_SOURCE_DATA', { ...data, target })
      // }
    })
  },

  FETCH_FORM_SOURCE_DATA: ({ commit, dispatch, state }, { url, configs, target }) => {
    return service.get(url, configs).then(data => {
      // let data = response.data
      if (data.code === 0) {
        commit('SET_FORM_SOURCE_DATA', { ...data, target })
      }
    })
  }
}
