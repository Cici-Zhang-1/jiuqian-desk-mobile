<template>
  <button class="btn btn-primary mb-2 mr-1 mb-md-3" type="button" :value="func.label" :data-toggle="func.toggle_name" :data-target="func.target" :data-multiple="func.multiple_name ? true : false" :data-source="func.source"><i :class="func.img"></i>{{ func.label }}</button>
</template>

<script>
export default {
  name: 'btn',
  props: {
    func: {
      type: [Array, Object],
      required: true
    }
  }
}
</script>
