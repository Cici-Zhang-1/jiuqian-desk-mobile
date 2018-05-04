<template>
  <form id="checkList">
    <check-list v-for="(value, key, index) in checkLists" :checkList="value" :checkListName="key" :checkListId="index" :key="index"/>
  </form>
</template>

<script>
import CheckList from './CheckList'

export default {
  name: 'CheckLists',
  props: ['checkLists'],
  components: {
    CheckList
  }
}
</script>
