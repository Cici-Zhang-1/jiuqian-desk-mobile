<template>
  <a class="btn btn-outline-dark mb-2 mr-1 mb-md-3" role="button" :key="id" :href="disposeUri(func)" @click="aBtnClick" :target="func.toggle_v === 'blank' ? '_blank' : '_self'" :data-toggle="func.toggle_v" :data-target="func.target" :data-multiple=!!parseInt(func.multiple_v) :data-single=!!parseInt(func.single_v) :data-source="func.source" :data-query="func.query" :data-hide=!!parseInt(func.hide)><i :class="func.img"></i>{{ func.label }}</a>
</template>

<script>
import { nameToId, uuid } from '@/assets/js/custom'
import { btnMixins } from './mixins'

export default {
  mixins: [ btnMixins ],
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
    }
  }
}
</script>
