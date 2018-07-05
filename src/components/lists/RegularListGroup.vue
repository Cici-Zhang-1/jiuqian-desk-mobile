<template>
  <div class="list-group">
    <regular-list v-for="(value, key, index) in lists" :list="value" :key="index"/>
  </div>
</template>

<script>
import RegularList from './RegularList'
export default {
  name: 'RegularListGroup',
  props: ['lists'],
  data () {
    return {}
  },
  components: {
    RegularList
  }
}
</script>
