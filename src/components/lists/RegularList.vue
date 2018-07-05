<template>
  <dl class="dl-horizontal">
    <dt>$value[create_datetime]</dt>
    <dd>$value[creator]-$value[target]-$value[msg]</dd>
  </dl>
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
