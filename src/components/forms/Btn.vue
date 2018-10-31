<template>
  <button class="btn btn-primary mb-2 mr-1 mb-md-3" type="button" :key="id" :value="func.label" @click="btnClick" :data-toggle="func.toggle_name" :data-target="func.target" :data-multiple=!!parseInt(func.multiple_v) :data-single=!!parseInt(func.single_v) :data-source="func.source" :data-query="func.query"><i :class="func.img"></i>{{ func.label }}</button>
</template>

<script>
import { nameToId, uuid } from '@/assets/js/custom'
import $ from 'jquery'

export default {
  name: 'btn',
  props: {
    func: {
      type: [Array, Object],
      required: true
    }
  },
  data () {
    return {
      target: '',
      multiple: false,
      single: false,
      query: [],
      keys: [],
      search: [],
      showColumn: [],
      hideColumn: [],
      data: {}
    }
  },
  computed: {
    id () {
      return nameToId(this.func.name) + uuid()
    }
  },
  methods: {
    btnClick (event) {
      switch (this.func.toggle_v) {
        case 'refresh':
          this.func_refresh()
          break
        case 'simplify':
          this.func_simplify(event.currentTarget)
          break
      }
    },
    func_refresh () {
      this.$store.commit('SET_APP_RELOAD', { reload: true })
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
    parse_params (E) {
      this.data = {}
      let [ Query = '', Keys = '', Search = '', Column = '' ] = $(E).data('query').split('-')
      this.query = Query.split(',')
      this.keys = Keys.split(',')
      this.search = Search.split(',')
      let [HideColumn = '', ShowColumn = ''] = Column.split('/')
      this.hideColumn = HideColumn.split(',')
      this.showColumn = ShowColumn.split(',')
      this.target = $(E).data('target') || ''
      this.multiple = $(E).data('multiple') || false
      this.single = $(E).data('single') || false
    }
  }
}
</script>
