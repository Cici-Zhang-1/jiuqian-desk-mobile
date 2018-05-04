/**
 * Created by chuangchuangzhang on 2018/2/2.
 */
import Vue from 'vue'
export default {

  /**
   * Set state.apps
   * @param state
   * @param contents
   * @constructor
   */
  SET_APPS: (state, { contents }) => {
    state.apps = contents.content
  },

  /**
   * set state.app.c
   * @param state
   * @param controller
   * @constructor
   */
  SET_APP_CONTROLLER: (state, { controller }) => {
    state.app.c = controller
  },

  /**
   * set state.user
   * @param state
   * @param contents
   * @constructor
   */
  SET_USER: (state, { contents }) => {
    state.user = contents
  },

  /**
   * set state.configs
   * @param state
   * @param contents
   * @constructor
   */
  SET_CONFIGS: (state, { contents }) => {
    state.configs = contents
  },

  /**
   * 打开app时需要设置navbar
   * @param state
   * @param app
   * @constructor
   */
  OPEN_APP: (state, { app, url = '' }) => {
    if (state.navbars[state.NAVBAR_APP_INDEX].id === 'App') {
      for (let i in app) {
        state.navbars[state.NAVBAR_APP_INDEX][i] = app[i]
      }
      state.navbars[state.NAVBAR_APP_INDEX].show = true
    } else {
      state.navbars = state.navbars.map(navbar => {
        if (navbar.id === 'App') {
          for (let i in app) {
            navbar[i] = app[i]
          }
          navbar.show = true
        }
        return navbar
      })
    }
  },

  /**
   * 设置获取的数据
   * @param state
   * @param tableData
   * @constructor
   */
  SET_DATA: (state, { contents, target }) => {
    Vue.set(target, 'data', contents)
  },

  /**
   * Set Source Data
   * @param state
   * @param contents
   * @param target
   * @constructor
   */
  SET_SOURCE_DATA: (state, { contents, target }) => {
    Vue.set(state.sourceData, target, contents)
  },

  SET_LINE_ACTIVITY: (state, { tr }) => { // 设置表格、List活跃行
    Vue.set(tr, 'checked', !tr.checked)
  },

  SET_INACTIVE_LINES: (state, { table }) => {
    table.map(__ => {
      Vue.set(__, 'checked', false)
    })
  },

  /**
   *
   * @param state
   * @param reload
   * @constructor
   */
  SET_RELOAD: (state, { reload }) => { // 判断是否需要重新载入
    state.reload = reload
  },
  /**
   *
   * @param state
   * @constructor
   */
  SET_APP_RELOAD: (state, { reload }) => { // 判断是否需要重新载入
    state.app.reload = reload
  },

  /**
   * 重置Card-Data
   * @param state
   * @param card
   * @constructor
   */
  RESET_CARD: (state, { card }) => {
    card.data.num = 0 // 总数量
    card.data.p = 1 // 当前页数
    card.data.pn = 0 // 总页数
    card.data.content = {}
  }
}
