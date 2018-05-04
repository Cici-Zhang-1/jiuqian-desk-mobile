/**
 * Created by chuangchuangzhang on 2018/2/2.
 */
import {
  fetchJsonByParams
} from '../api'

export default {
  FETCH_APPS: ({commit}) => {
    return fetchJsonByParams({ uri: 'permission/menu/read?full=true' }).then(data => {
      if (data.code === 0) {
        commit('SET_APPS', { ...data })
      }
    })
  },

  FETCH_USER: ({commit}) => {
    return fetchJsonByParams({ uri: 'manage/user/read' }).then(data => {
      if (data.code === 0) {
        commit('SET_USER', { ...data })
      }
    })
  },

  FETCH_CONFIGS: ({commit}) => {
    return fetchJsonByParams({ uri: 'manage/configs/read' }).then(data => {
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
  FETCH_DATA: ({commit, dispatch, state}, { params, target }) => {
    return fetchJsonByParams(params).then(data => {
      if (data.code === 0) {
        commit('SET_DATA', { ...data, target })
      }
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
  FETCH_SOURCE_DATA: ({ commit, dispatch, state }, { params, target }) => {
    return fetchJsonByParams(params).then(data => {
      if (data.code === 0) {
        commit('SET_SOURCE_DATA', { ...data, target })
      }
    })
  }
}
