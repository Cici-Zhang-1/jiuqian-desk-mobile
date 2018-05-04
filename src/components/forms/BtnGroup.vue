<template>
  <div class="btn-group mb-2 mb-md-3" role="group" :data-table="target">
    <button :id="id" type="button" class="btn btn-danger dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
      共选中<span id="tableSelected" data-num="">{{ activeLineLength }}</span>项
      <span class="caret"></span>
    </button>
    <div class="dropdown-menu" :aria-labelledby="id">
      <a class="dropdown-item" v-for="(func, key, index) in funcGroup.funcs" :key="index" :href="disposeUri(func)"  :data-toggle="func.toggle_name" :data-target="func.target" :data-multiple="func.multiple_name ? true : false" :data-source="func.source"><i :class="func.img"></i>{{ func.label }}</a>
    </div>
  </div>
</template>

<script>
// import $ from 'jquery'
export default {
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
  created () {
  },
  methods: {
    disposeUri (func) {
      if (func.toggle_name === 'child') {
        return '#' + func.url
      } else {
        return func.url
      }
    }
  }
}
</script>
