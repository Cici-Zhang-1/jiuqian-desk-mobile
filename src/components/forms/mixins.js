import $ from 'jquery'
import service from '@/axios'
import { dataToStr } from '@/assets/js/custom'
import { baseUrl } from '@/axios/env'
let formsMixins = {
  props: {
    configs: {
      type: [Array, Object],
      required: true
    },
    forms: {
      type: [Array, Object]
    },
    forceReadonly: {
      type: [Boolean]
    },
    query: {
      type: [Array, Object]
    }
  },
  data () {
    return {
      queryStr: '',
      params: [],
      paramsValue: {},
      related: [],
      relatedValue: {}
    }
  },
  computed: {
    readonly () {
      return this.forceReadonly && this.configs.readonly_v === '1'
    },
    required () {
      return this.configs.required_v === '1'
    },
    multiple () {
      return this.configs.multiple_v === '1'
    },
    max () {
      return this.configs.max === '' ? false : this.configs.max
    },
    min () {
      return this.configs.min === '' ? false : this.configs.min
    },
    maxlength () {
      return this.configs.maxlength !== '0' ? this.configs.maxlength : ''
    },
    pattern () {
      return this.configs.pattern === '' ? false : this.configs.pattern
    },
    placeholder () {
      return this.configs.placeholder
    },
    local () {
      return this.configs['local_v'] && this.configs['local_v'] === '1'
    }
  },
  methods: {
    generateId (key) {
      return this.id + key
    },
    parseQuery () {
      if (this.configs.query) {
        [ this.queryStr = '', this.params = '', this.related = '' ] = this.configs.query.split('-')
        // Query
        // Params 获取Data时的相关参数
        // Related 相关表单，变动则改动
        this.params = this.params.split(',')
        this.related = this.related.split(',')
        this.initQuery()
      }
    },
    initQuery () {
      if (this.queryStr) {
        if (this.$router.currentRoute.query[this.queryStr] !== undefined) {
          this.formValue = this.$router.currentRoute.query[this.queryStr]
          this.multipleDv()
        }
        this.watchQuery()
      }
      if (this.params.length > 0) {
        this.params.map(__ => {
          if (this.$router.currentRoute.query[__] !== undefined) {
            this.paramsValue[__] = this.$router.currentRoute.query[__]
          } else {
            this.paramsValue[__] = ''
          }
          return __
        })
        this.watchParams()
      }
      if (this.related.length > 0) {
        this.related.map(__ => {
          if (this.forms[__] !== undefined) {
            this.relatedValue[__] = this.forms[__].dv
          }
          return __
        })
        this.watchForms()
      }
    },
    watchQuery () {
      this.$watch('query', function (to, from) {
        if (this.query[this.queryStr] !== undefined && this.query[this.queryStr] !== this.formValue) {
          this.formValue = this.query[this.queryStr]
          this.multipleDv()
        }
      }, {
        deep: true
      })
    },
    watchParams () {
      this.$watch('query', function (to, from) {
        let Flag = false
        this.params.map(__ => {
          if (this.query[__] !== undefined && this.query[__] !== this.paramsValue[__]) {
            this.paramsValue[__] = this.query[__]
            Flag = true
          }
          return __
        })
        if (Flag) {
          this.loadSourceData(true)
        }
      }, {
        deep: true
      })
    },
    watchForms () {
      this.related.map(__ => {
        if (this.forms[__] !== undefined) {
          this.$watch(function () {
            return this.forms[__].dv
          }, function (to, from) {
            if (this.forms[__].dv !== this.relatedValue[__]) {
              this.relatedValue[__] = this.forms[__].dv
              this.loadSourceData(true)
            }
          })
        }
        return __
      }, {
        deep: true
      })
    },
    multipleDv (value = false) {
      if (value !== false) {
        if (this.multiple && !(value instanceof Array)) {
          value = value ? [ value ] : []
        }
        return value
      } else {
        if (this.multiple && !(this.formValue instanceof Array)) {
          this.formValue = this.formValue ? [ this.formValue ] : []
        }
        return this.formValue
      }
    }
  }
}

let btnMixins = {
  methods: {
    func_child (E) {
      this.data = {}
      this.parse_params(E)
      this.parse_query()
      this.parse_search()
      if (this.parse_v()) {
        this.parse_keys()
      } else {
        return false
      }

      let dataStr = dataToStr(this.data)
      $(E).attr('href', function (index, attr) {
        return attr.indexOf('?') >= 0 ? attr.substr(0, attr.lastIndexOf('?')) + '?' + dataStr : attr + '?' + dataStr
      })
      return true
    },
    parse_query () {
      if (this.query.length > 0) {
        let QueryValue = this.$store.getters.currentPageQuery({source: this.target, query: this.query})
        if (QueryValue) {
          this.data = { ...this.data, ...QueryValue }
        }
      }
      return true
    },
    parse_search () {
      if (this.search.length > 0) {
        let SearchValues = this.$store.getters.currentPageSearchSearchValues({search: this.search})
        if (SearchValues) {
          this.data = { ...this.data, ...SearchValues }
        }
      }
      return true
    },
    parse_v () {
      if (this.multiple || this.single) {
        if (this.target === '') {
          alert('系统错误, 请联系管理员')
          return false
        } else {
          let V = this.$store.getters.currentPageActiveLineVs({source: this.target, all: this.multiple}).map(__ => __.v)
          if (V && V.length > 0) {
            if (this.single) {
              V = V.pop()
            }
            this.data['v'] = V
          } else {
            alert('请先选中!!')
            return false
          }
        }
      }
      return true
    },
    parse_keys () {
      if (this.multiple || this.single) {
        if (this.keys.length > 0) {
          let Relate = this.$store.getters.currentPageActiveLineVs({source: this.target, all: this.multiple, keys: this.keys})
          if (this.single) {
            Relate = Relate.shift()
            this.data = { ...this.data, ...Relate }
          } else {
            this.data['relate'] = Relate
          }
        }
      }
      return true
    },
    hideItem () { // 隐藏处理过的
      if (this.hide) {
        this.$store.commit('SET_HIDE_ITEM', { source: this.target, v: this.data.v })
      }
    },
    parse_params (E) {
      this.data = {}
      let [ Query = '', Keys = '', Search = '' ] = $(E).data('query').split('-')
      this.query = Query === '' ? [] : Query.split(',')
      this.keys = Keys === '' ? [] : Keys.split(',')
      this.search = Search === '' ? [] : Search.split(',')
      this.target = $(E).data('target') || ''
      this.multiple = $(E).data('multiple') || false
      this.single = $(E).data('single') || false
      this.hide = $(E).data('hide') || false
    },
    async func_backstage (E) {
      this.parse_params(E)
      this.parse_query()
      this.parse_search()
      if (this.parse_v()) {
        this.parse_keys()
      } else {
        return false
      }
      if (confirm('确定执行' + $(E).text() + '操作?')) {
        let postReturn = await service.post($(E).attr('href'), this.data)
        if (!postReturn.code) {
          if (postReturn.message !== '') {
            alert(postReturn.message)
          }
          this.$store.commit('SET_APP_RELOAD', { reload: true })
          return true
        } else {
          alert(postReturn.message)
          return false
        }
      } else {
        return false
      }
    },
    func_save (ThisAlien) {

    },
    func_refresh () {
      this.$store.commit('SET_APP_RELOAD', { reload: true })
    },
    func_blank (E) {
      this.parse_params(E)
      this.parse_query()
      this.parse_search()
      if (this.parse_v()) {
        this.parse_keys()
      } else {
        return false
      }
      this.hideItem()
      let dataStr = dataToStr(this.data)
      $(E).attr('href', function (index, attr) {
        return attr.indexOf('?') >= 0 ? attr.substr(0, attr.lastIndexOf('?')) + '?' + dataStr : attr + '?' + dataStr
      })
      return true
    },
    func_simplify (E) {
      this.parse_params(E)
      if ((this.showColumn.length > 0 || this.hideColumn.length > 0) && this.target !== '') {
        let Elements = this.$store.getters.currentPageCardElements({source: this.target})
        if (!$(E).data('simplified')) {
          if (this.showColumn.length > 0) {
            this.showColumn.map(__ => {
              Elements[__]['classes'] = ''
              return __
            })
          }
          if (this.hideColumn.length > 0) {
            this.hideColumn.map(__ => {
              Elements[__]['classes'] = 'd-none'
              return __
            })
          }
          $(E).data('simplified', true)
        } else {
          if (this.showColumn.length > 0) {
            this.showColumn.map(__ => {
              Elements[__]['classes'] = 'd-none'
              return __
            })
          }
          if (this.hideColumn.length > 0) {
            this.hideColumn.map(__ => {
              Elements[__]['classes'] = ''
              return __
            })
          }
          $(E).data('simplified', false)
        }
      }
      return true
    },
    disposeUri (func = '') {
      if (func.toggle_name === 'child') {
        return '#' + func.url
      } else {
        return baseUrl + func.url
      }
    }
  }
}

export { formsMixins, btnMixins }
