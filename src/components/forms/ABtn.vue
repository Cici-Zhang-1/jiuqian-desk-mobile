<template>
  <a class="btn btn-outline-dark mb-2 mr-1 mb-md-3" role="button" :key="id" :href="disposeUri()" @click="aBtnClick" :data-toggle="func.toggle_v" :data-target="func.target" :data-multiple=!!parseInt(func.multiple_v) :data-single=!!parseInt(func.single_v) :data-source="func.source" :data-query="func.query"><i :class="func.img"></i>{{ func.label }}</a>
</template>

<script>
import $ from 'jquery'
import service from '@/axios'
import { nameToId, uuid } from '@/assets/js/custom'

export default {
  name: 'a-btn',
  props: {
    func: {
      type: [Array, Object],
      required: true
    }
  },
  computed: {
    id () {
      return nameToId(this.func.name) + uuid()
    }
  },
  methods: {
    dataStr (data) {
      let DataStr = ''
      Object.keys(data).forEach(key => {
        DataStr += key + '=' + data[key] + '&'
      })
      return DataStr
    },
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
      }
    },
    func_child (E) {
      let Data = {}
      let [ Query = null, Keys = null, Search = null ] = $(E).data('query').split('-')
      Query = Query ? Query.split(',') : null
      Keys = Keys ? Keys.split(',') : null
      Search = Search ? Search.split(',') : null
      if (Query) {
        let QueryValue = this.$store.getters.currentPageQuery({source: $(E).data('target') || '', query: Query})
        Data = { ...Data, ...QueryValue }
      }
      if (Search) {
        let SearchValues = this.$store.getters.currentPageSearchSearchValues({search: Search})

        Data = { ...Data, ...SearchValues }
      }
      if ($(E).data('multiple') || $(E).data('single')) {
        let V = this.$store.getters.currentPageActiveLineVs({source: $(E).data('target') || '', all: $(E).data('multiple') || false}).map(__ => __.v)
        if (V && V.length !== 0) {
          Data['v'] = V
          if (Keys) {
            Data['relate'] = this.$store.getters.currentPageActiveLineVs({source: $(E).data('target') || '', all: false, keys: Keys})
          }
        } else {
          alert('请先选中!!')
          return false
        }
      }
      let DataStr = this.dataStr(Data)

      $(E).attr('href', function (index, attr) {
        return attr.indexOf('?') >= 0 ? attr.substr(0, attr.lastIndexOf('?')) + '?' + DataStr : attr + '?' + DataStr
      })
      return true
    },
    async func_backstage (E) {
      let Data = {}
      if ($(E).data('multiple') || $(E).data('single')) {
        if ($(E).data('target')) {
          let Target = $(E).data('target')
          let [ Query, Keys ] = $(E).data('query') ? $(E).data('query').split('-') : [ null, null ]
          Query = Query ? Query.split(',') : null
          Keys = Keys ? Keys.split(',') : null
          let V = this.$store.getters.currentPageActiveLineVs({source: Target, all: $(E).data('multiple')}).map(__ => __.v)
          if (V && V.length !== 0) {
            if (confirm('确定执行' + $(E).text() + '操作?')) {
              Data['v'] = V
              if (Keys) {
                Data['relate'] = this.$store.getters.currentPageActiveLineVs({source: Target, all: false, keys: Keys})
              }
              if (Query) {
                let QueryValue = this.$store.getters.currentPageQuery({source: Target, query: Query})
                Data = { ...Data, ...QueryValue }
              }
            } else {
              return false
            }
          } else {
            alert('请先选中')
            return false
          }
        } else {
          console.log('没有定义Target')
        }
      }
      let postReturn = await service.post($(E).attr('href'), Data)
      if (!postReturn.code) {
        this.$store.commit('SET_APP_RELOAD', { reload: true })
        return true
      } else {
        alert(postReturn.message)
        return false
      }
    },
    func_save (ThisAlien) {

    },
    disposeUri () {
      if (this.func.toggle_name === 'child') {
        return '#' + this.func.url
      } else {
        return this.func.url
      }
    }
  }
}
</script>
