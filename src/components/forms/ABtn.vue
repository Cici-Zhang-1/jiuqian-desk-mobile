<template>
  <a class="btn btn-light mb-2 mb-md-3" role="button" :href="disposeUri()" :data-toggle="func.toggle_name" :data-target="func.target" :data-multiple="func.multiple_name ? true : false" :data-source="func.source"><i :class="func.img"></i>{{ func.label }}</a>
</template>

<script>
export default {
  name: 'a-btn',
  props: {
    func: {
      type: [Array, Object],
      required: true
    }
  },
  methods: {
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
