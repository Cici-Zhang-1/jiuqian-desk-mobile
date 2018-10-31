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
