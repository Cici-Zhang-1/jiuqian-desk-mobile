<template>
  <a class="btn btn-outline-dark mb-2 mr-1 mb-md-3" role="button" :key="id" :href="disposeUri()" @click="aBtnClick" :target="func.toggle_v === 'blank' ? '_blank' : '_self'" :data-toggle="func.toggle_v" :data-target="func.target" :data-multiple=!!parseInt(func.multiple_v) :data-single=!!parseInt(func.single_v) :data-source="func.source" :data-query="func.query" :data-hide=!!parseInt(func.hide)><i :class="func.img"></i>{{ func.label }}</a>
</template>

<script>
import $ from 'jquery'
import service from '@/axios'
import { nameToId, uuid, dataToStr } from '@/assets/js/custom'
import { baseUrl } from '@/axios/env'

export default {
  name: 'a-btn',
  props: {
    func: {
      type: [Array, Object],
      required: true,
      target: '',
      multiple: false,
      single: false,
      hide: false,
      query: [],
      keys: [],
      search: [],
      data: {}
    }
  },
  computed: {
    id () {
      return nameToId(this.func.name) + uuid()
    }
  },
  methods: {
    aBtnClick (event) {
      switch (this.func.toggle_v) {
        case 'child':
          this.func_child(event.currentTarget) || event.preventDefault()
          break
        case 'backstage':
          event.preventDefault()
          this.func_backstage(event.currentTarget)
          break
        case 'save':
          event.preventDefault()
          this.func_save(event.currentTarget)
          break
        case 'refresh':
          event.preventDefault()
          this.func_refresh()
          break
        case 'blank':
          this.func_blank(event.currentTarget) || event.preventDefault()
          break
      }
    },
    func_child (E) {
      this.data = {}
      let [ Query = '', Keys = '', Search = '' ] = $(E).data('query').split('-')
      this.query = Query === '' ? [] : Query.split(',')
      this.keys = Keys === '' ? [] : Keys.split(',')
      this.search = Search === '' ? [] : Search.split(',')
      this.target = $(E).data('target') || ''
      this.multiple = $(E).data('multiple') || false
      this.single = $(E).data('single') || false
      this.hide = $(E).data('hide') || false
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
    parse_params (E) {
      this.data = {}
      let [ Query = '', Keys = '', Search = '' ] = $(E).data('query').split('-')
      this.query = Query === '' ? [] : Query.split(',')
      this.keys = Keys === '' ? [] : Keys.split(',')
      this.search = Search === '' ? [] : Search.split(',')
      this.target = $(E).data('target') || ''
      this.multiple = $(E).data('multiple') || false
      this.single = $(E).data('single') || false
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
      // let Data = {}
      // if ($(E).data('multiple') || $(E).data('single')) {
      //   if ($(E).data('target')) {
      //     let Target = $(E).data('target')
      //     let [ Query, Keys ] = $(E).data('query') ? $(E).data('query').split('-') : [ null, null ]
      //     Query = Query ? Query.split(',') : null
      //     Keys = Keys ? Keys.split(',') : null
      //     let V = this.$store.getters.currentPageActiveLineVs({source: Target, all: $(E).data('multiple')}).map(__ => __.v)
      //     if (V && V.length !== 0) {
      //       if ($(E).data('single')) {
      //         V = V.pop()
      //       }
      //       if (confirm('确定执行' + $(E).text() + '操作?')) {
      //         Data['v'] = V
      //         if (Keys) {
      //           // Relate = this.$store.getters.currentPageActiveLineVs({source: Target, all: false, keys: Keys})
      //           let Relate = this.$store.getters.currentPageActiveLineVs({source: Target, all: $(E).data('multiple'), keys: Keys})
      //           if ($(E).data('single')) {
      //             Relate = Relate.shift()
      //             Data = { ...Data, ...Relate }
      //           } else {
      //             Data['relate'] = Relate
      //           }
      //         }
      //         if (Query) {
      //           let QueryValue = this.$store.getters.currentPageQuery({source: Target, query: Query})
      //           Data = { ...Data, ...QueryValue }
      //         }
      //       } else {
      //         return false
      //       }
      //     } else {
      //       alert('请先选中')
      //       return false
      //     }
      //   } else {
      //     console.log('没有定义Target')
      //   }
      // }
      // let postReturn = await service.post($(E).attr('href'), Data)
      // if (!postReturn.code) {
      //   alert(postReturn.message)
      //   this.$store.commit('SET_APP_RELOAD', { reload: true })
      //   return true
      // } else {
      //   alert(postReturn.message)
      //   return false
      // }
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
      let dataStr = dataToStr(this.data)

      $(E).attr('href', function (index, attr) {
        return attr.indexOf('?') >= 0 ? attr.substr(0, attr.lastIndexOf('?')) + '?' + dataStr : attr + '?' + dataStr
      })
      return true
      // let Data = {}
      // let [ Query = null, Keys = null, Search = null ] = $(E).data('query').split('-')
      // Query = Query ? Query.split(',') : null
      // Keys = Keys ? Keys.split(',') : null
      // Search = Search ? Search.split(',') : null
      // if (Query) {
      //   let QueryValue = this.$store.getters.currentPageQuery({source: $(E).data('target') || '', query: Query})
      //   Data = { ...Data, ...QueryValue }
      // }
      // if (Search) {
      //   let SearchValues = this.$store.getters.currentPageSearchSearchValues({search: Search})
      //   Data = { ...Data, ...SearchValues }
      // }
      // if ($(E).data('multiple') || $(E).data('single')) {
      //   let V = this.$store.getters.currentPageActiveLineVs({source: $(E).data('target') || '', all: $(E).data('multiple') || false}).map(__ => __.v)
      //   if (V && V.length !== 0) {
      //     Data['v'] = V
      //     if (Keys) {
      //       let Relate = this.$store.getters.currentPageActiveLineVs({source: $(E).data('target') || '', all: false, keys: Keys})
      //       if ($(E).data('single')) {
      //         Relate = Relate.shift()
      //         Data = { ...Data, ...Relate }
      //       } else {
      //         Data['relate'] = dataToStr(Relate)
      //       }
      //     }
      //   } else {
      //     alert('请先选中!!')
      //     return false
      //   }
      // }
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
</script>
