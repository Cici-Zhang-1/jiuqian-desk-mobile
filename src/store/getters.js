/**
 * Created by chuangchuangzhang on 2018/2/2.
 */
import { nameToId } from '@/assets/js/custom'

let generatePageActiveLines = (state, source) => {
  let lines = []
  if (!(source === false || source === undefined || source === null)) {
    let __ = state.apps.filter(app => {
      return app.url === state.route.path
    })[0].cards.filter(card => {
      return '#' + nameToId(card.name) === source
    })[0]
    if ((__ !== undefined) && ((__.data.length !== undefined && __.data.length > 0) ||
        (__.data.content !== undefined && ((__.data.content instanceof Array && __.data.content.length > 0) ||
          (__.data.content instanceof Object && JSON.stringify(__.data.content) !== '{}')
        )))) {
      for (let j in __.data.content) {
        if (__.data.content[j].checked) {
          lines.push(__.data.content[j])
        }
      }
    }
  }
  return lines
}
export default {

  activeNavbars (state) {
    return state.navbars.filter(_ => {
      return _.show
    })
  },
  /**
   * Get All App Information
   * @param state
   * @returns {{}}
   */
  getApps (state) {
    let First = {}
    let Second = {}
    for (let i in state.apps) {
      if (state.apps[i].invisible_name !== '1') {
        if (state.apps[i]['class'] === '0') {
          First[state.apps[i]['displayorder']] = state.apps[i]
        } else {
          if (Second[state.apps[i]['parent']] === undefined) {
            Second[state.apps[i]['parent']] = {}
          }
          Second[state.apps[i]['parent']][state.apps[i]['displayorder']] = state.apps[i]
        }
      }
    }
    for (let i in Second) {
      for (let j in First) {
        if (First[j]['v'] === i) {
          First[j]['children'] = Second[i]
        }
      }
    }
    return First
  },

  getHomes (state) {
    let Homes = {}
    for (let i in state.apps) {
      if (state.apps[i].home === '1') {
        Homes[i] = state.apps[i]
      }
    }
    return Homes
  },

  /**
   * 获得APP param 值
   * @param state
   * @returns {function(*)}
   */
  getAppParam: (state) => (key) => {
    return state.app[key]
  },

  getStateByKey: (state) => (key) => {
    return state[key]
  },

  getConfigs: (state) => {
    return state.configs
  },
  getReload: (state) => {
    return state.reload
  },

  getSignin: (state) => {
    return state.signin
  },

  /**
   * Get Source Data
   * @param state
   * @returns {function({uri: *})}
   */
  getSourceData: (state) => ({ uri }) => {
    return state.sourceData[uri] || {}
  },

  /**
   * 获取拆单信息
   * @param state
   * @returns {function({uri: *, child: *}): (*|undefined)}
   */
  getDismantleData: (state) => ({ uri, child }) => {
    return (state.sourceData[uri] && state.sourceData[uri][child]) || undefined
  },

  getActiveDismantleData: (state) => ({ uri, child }) => {
    let Data
    if (state.sourceData[uri] !== undefined) {
      let OrderProductId = state.sourceData[uri]['order_info']['order_product_id']
      if (OrderProductId > 0) {
        for (let i in state.sourceData[uri][child]['order_product']) {
          if (state.sourceData[uri][child]['order_product'][i]['v'] === OrderProductId) {
            Data = state.sourceData[uri][child]['order_product'][i]
            break
          }
        }
      }
    }
    return Data
    /* let Data = (state.sourceData[uri] && state.sourceData[uri][child]) || undefined
    if (Data === undefined) {
      return Data
    } else {

    } */
  },

  currentLabel (state) {
    return state.app.label
  },
  /**
   * 当前页面Cards
   * @param state
   */
  currentPageCards (state) {
    return state.apps.length > 0 && state.apps.filter(app => {
      return app.url === state.route.path
    })[0].cards
  },

  /**
   * 获取当前页面搜索设置
   * @param state
   * @returns {*}
   */
  currentPageSearches (state) {
    return state.apps.length > 0 && state.apps.filter(app => {
      return app.url === state.route.path
    })[0].page_search
  },

  /**
   * 生成当前搜索界面的键值对
   * @param state
   * @returns {{}}
   */
  currentPageSearchValues (state) {
    let t = state.apps.filter(app => {
      return app.url === state.route.path
    })[0].page_search

    let r = {}
    for (let i in t) {
      r[i] = t[i].dv
    }
    return r
  },
  currentPageSearchSearchValues: (state) => ({search}) => {
    let t = state.apps.filter(app => {
      return app.url === state.route.path
    })[0].page_search

    let r = {}
    for (let i in t) {
      if (search.indexOf(i) >= 0) {
        r[i] = t[i].dv
      }
    }
    return r
  },

  /**
   * 当前页面的Func
   * @param state
   * @returns {function({url: *})}
   */
  currentPageFuncs (state) {
    return state.apps.length > 0 && state.apps.filter(app => {
      return app.url === state.route.path
    })[0].funcs
  },

  /**
   * 当前表单页面
   * @param state
   * @returns {boolean|*}
   */
  currentFormPages (state) {
    return state.apps.length > 0 && state.apps.filter(app => {
      return app.url === state.route.path
    })[0].form_pages
  },

  /**
   * Get Current Page Active Lines By source
   * @param state
   * @returns {function({source: *, all?: *})}
   */
  currentPageActiveLines: (state) => ({ source, all = false }) => {
    if (source === false || source === undefined || source === null || source === '') {
      return []
    } else {
      let lines = []
      let __ = state.apps.filter(app => {
        return app.url === state.route.path
      })[0].cards.filter(card => {
        return '#' + nameToId(card.name) === source
      })[0]
      if ((__ !== undefined) && ((__.data.length !== undefined && __.data.length > 0) ||
          (__.data.content !== undefined && ((__.data.content instanceof Array && __.data.content.length > 0) ||
            (__.data.content instanceof Object && JSON.stringify(__.data.content) !== '{}')
          )))) {
        for (let j in __.data.content) {
          if (__.data.content[j].checked) {
            lines.push(__.data.content[j])
          }
        }
      }
      if (all) {
        return lines
      } else {
        return lines[0]
      }
    }
  },

  /**
   * Get The Active Line Key values
   * @param state
   * @returns {function({source?: *, all?: *})}
   */
  currentPageActiveLineVs: (state) => ({source, all = false, keys = ['v']}) => {
    if (keys instanceof String) {
      keys = [keys]
    }
    if (all) {
      return generatePageActiveLines(state, source).map(__ => {
        let Item = {}
        for (let i of keys) {
          Item[i] = __[i]
        }
        return Item
      }) || []
    } else {
      return generatePageActiveLines(state, source).slice(0, 1).map(__ => {
        let Item = {}
        for (let i of keys) {
          Item[i] = __[i]
        }
        return Item
      }) || []
    }
  },

  currentPageActiveLineLength: (state) => ({ source }) => {
    if (source === false || source === undefined || source === null) {
      return 0
    } else {
      let line = []
      let __ = state.apps.filter(app => {
        return app.url === state.route.path
      })[0].cards.filter(card => {
        return '#' + nameToId(card.name) === source
      })[0]
      if ((__ !== undefined) && ((__.data.length !== undefined && __.data.length > 0) ||
          (__.data.content !== undefined && ((__.data.content instanceof Array && __.data.content.length > 0) ||
            (__.data.content instanceof Object && JSON.stringify(__.data.content) !== '{}')
          )))) {
        for (let j in __.data.content) {
          if (__.data.content[j].checked) {
            line.push(__.data.content[j])
          }
        }
      }
      return line.length
    }
  },

  /**
   * 当前页面Query
   * @param state
   * @returns {Function}
   */
  currentPageQuery: (state) => ({ source, query }) => {
    if (source === false || source === undefined || source === null || source === '') {
      return {}
    } else {
      let Return = {}
      let __ = state.apps.filter(app => {
        return app.url === state.route.path
      })[0].cards.filter(card => {
        return '#' + nameToId(card.name) === source
      })[0]
      if ((__ !== undefined) && ((__.data.query !== undefined && ((__.data.query instanceof Array && __.data.query.length > 0) ||
          (__.data.query instanceof Object && JSON.stringify(__.data.query) !== '{}'))))) {
        if (query instanceof Array) { // 多值
          for (let j in query) {
            if (__.data.query[query[j]]) {
              Return[query[j]] = __.data.query[query[j]]
            }
          }
        } else {
          if (__.data.query[query]) { // 单值
            Return[query] = __.data.query[query]
          }
        }
      }
      return Return
    }
  },

  /**
   * 生成需要提交的表单的键值对
   * @param state
   * @returns {function({forms: *})}
   */
  generatePostData: (state) => ({ forms = {}, trs = [] }) => {
    let data = {}
    if (JSON.stringify(forms) !== '{}' && trs.length === 0) {
      for (let i in forms) {
        data[i] = forms[i].dv === undefined ? '' : forms[i].dv
      }
    } else if (trs.length !== 0) {
      for (let i in trs) {
        data[i] = trs[i].v === undefined ? '' : trs[i].v
      }
    }

    return data
  }
}
