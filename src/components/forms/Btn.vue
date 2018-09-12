<template>
  <button class="btn btn-primary mb-2 mr-1 mb-md-3" type="button" :key="id" :value="func.label" @click="btnClick" :data-toggle="func.toggle_name" :data-target="func.target" :data-multiple=!!parseInt(func.multiple_v) :data-single=!!parseInt(func.single_v) :data-source="func.source" :data-query="func.query"><i :class="func.img"></i>{{ func.label }}</button>
</template>

<script>
import { nameToId, uuid } from '@/assets/js/custom'

export default {
  name: 'btn',
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
    btnClick (event) {
      switch (this.func.toggle_v) {
        case 'refresh':
          this.func_refresh()
          break
      }
    },
    func_refresh () {
      this.$store.commit('SET_APP_RELOAD', { reload: true })
    }
  }
}
</script>
