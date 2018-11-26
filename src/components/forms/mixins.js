import $ from 'jquery'
import service from '@/axios'
import { nameToId, uuid, dataToStr } from '@/assets/js/custom'
import { baseUrl } from '@/axios/env'
let formsMixins = {
  computed: {
    id () {
      return nameToId(this.configs.name) + uuid()
    },
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
    }
  },
  methods: {
    generateId (key) {
      return this.id + key
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
          alert(postReturn.message)
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
    disposeUri () {
      if (this.func.toggle_name === 'child') {
        return '#' + this.func.url
      } else {
        return baseUrl + this.func.url
      }
    }
  }
}

export { formsMixins, btnMixins }
