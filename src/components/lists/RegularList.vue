<template>
  <a :href="list.url" class="list-group-item list-group-item-action px-1 text-size-sm">{{ list.message }}</a>
</template>

<script>
export default {
  name: 'RegularList',
  props: ['list'],
  data () {
    return {}
  }
}
</script>

<style>
  .list-group-item.text-size-sm {
    font-size: small;
  }
</style>
