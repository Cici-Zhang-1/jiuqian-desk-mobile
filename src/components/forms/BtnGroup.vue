<template>
  <div class="btn-group mb-2 mb-md-3" role="group" :data-table="target">
    <button :id="id" type="button" class="btn btn-danger dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
      共选中<span id="tableSelected" data-num="">{{ activeLineLength }}</span>项
      <span class="caret"></span>
    </button>
    <div class="dropdown-menu" :aria-labelledby="id">
      <a class="dropdown-item mt-1 mb-1" v-for="(func, key, index) in funcGroup.funcs" :key="uuid(index)" :href="disposeUri(func)" :target="func.toggle_v === 'blank' ? '_blank' : '_self'"  :data-toggle="func.toggle_name" :data-target="func.target" :data-multiple=!!parseInt(func.multiple_v) :data-single=!!parseInt(func.single_v) :data-source="func.source" :data-query="func.query" @click="btnGroupAClick"><i class="mr-1" :class="func.img"></i>{{ func.label }}</a>
    </div>
  </div>
</template>

<script>
import { uuid } from '@/assets/js/custom'
import $ from 'jquery'
import { btnMixins } from './mixins'

export default {
  mixins: [ btnMixins ],
  name: 'btn-group',
  props: {
    funcGroup: {
      type: [Array, Object],
      required: true
    },
    index: {
      required: true
    },
    target: {
      required: true
    }
  },
  computed: {
    activeLineLength: {
      get () {
        return this.$store.getters.currentPageActiveLineLength({ source: this.target })
      }
    },
    id: {
      get () {
        return 'btnGroupDrop' + this.index
      }
    }
  },
  methods: {
    uuid (index) {
      return index + uuid()
    },
    btnGroupAClick (event) {
      let Toggle = $(event.currentTarget).data('toggle')
      switch (Toggle) {
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
        case 'blank':
          this.func_blank(event.currentTarget) || event.preventDefault()
          break
      }
    }
  }
}
</script>
