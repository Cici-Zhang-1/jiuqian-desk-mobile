/**
 * Created by chuangchuangzhang on 2018/2/2.
 */
import service from '@/axios'

let Loading = {}
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
   * @param url
   * @param configs
   * @param target
   * {
   *    uri: this.card.url,
   *    data: {
   *      keyword: this.keyword,
   *      page: to,
   *      pagesize: this.card ? this.card.pagesize : this.pagesize
   *    }
   *  }
   * @returns {*|PromiseLike<T | never>|Promise<T | never>}
   * @constructor
   */
  FETCH_DATA: ({commit, dispatch, state}, { url, configs = {}, target }) => {
    return service.get(url, configs).then(data => {
      commit('SET_DATA', { ...data, target })
      return data
    })
  },

  /**
   * Fetch Source Data
   * @param commit
   * @param dispatch
   * @param state
   * @param url
   * @param configs
   * @param target
   * @returns {*}
   * @constructor
   */
  FETCH_SOURCE_DATA: ({ commit, dispatch, state }, { url, configs, target }) => {
    let Key = JSON.stringify({ url, configs, target })
    if (Loading[Key] !== undefined) {
      return true
    } else {
      Loading[Key] = true
    }
    return service.get(url, configs).then(data => {
      // let data = response.data
      // if (data.code === 0) {
      commit('SET_SOURCE_DATA', { ...data, target })
      delete Loading[Key]
      return data
      // }
    })
  },

  FETCH_FORM_SOURCE_DATA: ({ commit, dispatch, state }, { url, configs, target }) => {
    return service.get(url, configs).then(data => {
      // let data = response.data
      if (data.code === 0) {
        commit('SET_FORM_SOURCE_DATA', { ...data, target })
      }
      return data
    })
  },

  /**
   * 获取拆单数据结构
   * @param commit
   * @param dispatch
   * @param state
   * @param configs
   * @param target
   * @returns {*}
   * @constructor
   */
  FETCH_CABINET_STRUCT: ({ commit, dispatch, state }, { configs, target }) => {
    return service.get('/order/order_product_cabinet_struct/read', configs).then(data => {
      if (data.code === 0) {
        commit('SET_DISMANTLE_STRUCT', { ...data, target })
      } else {
        commit('SET_DISMANTLE_STRUCT', {
          contents: {
            board: '18多层板古典红木R',
            facefb: '0.8同色封边',
            v: 0
          },
          target
        })
      }
      return data
    })
  },

  FETCH_DISMANTLE_ORDER_PRODUCT_BOARD_PLATE: ({ commit, dispatch, state }, { url, configs, target }) => {
    return service.get(url, configs).then(data => {
      if (data.code === 0) {
        commit('SET_DISMANTLE_ORDER_PRODUCT_BOARD_PLATE', { ...data, target })
      } else {
        commit('SET_DISMANTLE_ORDER_PRODUCT_BOARD_PLATE', {
          contents: {
            content: []
          },
          target
        })
      }
      return data
    })
  },

  FETCH_WARDROBE_STRUCT: ({ commit, dispatch, state }, { configs, target }) => {
    return service.get('/order/order_product_wardrobe_struct/read', configs).then(data => {
      if (data.code === 0) {
        commit('SET_DISMANTLE_STRUCT', { ...data, target })
      } else {
        commit('SET_DISMANTLE_STRUCT', {
          contents: {
            board: '18多层板古典红木R',
            v: 0
          },
          target
        })
      }
      return data
    })
  },

  FETCH_DOOR_STRUCT: ({ commit, dispatch, state }, { configs, target }) => {
    return service.get('/order/order_product_door/read', configs).then(data => {
      if (data.code === 0) {
        commit('SET_DISMANTLE_STRUCT', { ...data, target })
      } else {
        commit('SET_DISMANTLE_STRUCT', {
          contents: {
            board: '18多层板古典红木R',
            edge: '',
            v: 0
          },
          target
        })
      }
      return data
    })
  },

  FETCH_VALUATE_DATA: ({ commit, dispatch, state }, { url, configs, target }) => {
    return service.get(url, configs).then(data => {
      commit('SET_VALUATE_DATA', { ...data, target })
      return data
    })
  }
}
