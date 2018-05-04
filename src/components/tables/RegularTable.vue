<template>
  <table class="table table-striped table-responsive" :id="id">
    <thead>
      <tr>
        <th class="d-none">选中</th>
        <th v-for="(value, key, index) in tableThead" :class="[ value.classes ]" :key="index" v-if="value.checked_name">{{ value.label }}</th>
      </tr>
    </thead>
    <tbody >
      <tr @click="inactiveTr" is="regular-tr" v-for="(value, key, index) in table" :trData="value" :tableThead="tableThead" :key="index" :search="search"></tr>
    </tbody>
  </table>
</template>

<script>
import RegularTr from './RegularTr'
import { nameToId } from '@/assets/js/custom'

export default {
  name: 'RegularTable',
  props: {
    table: {
      type: Object | Array,
      required: true
    },
    tableThead: {
      type: Object | Array,
      required: true
    },
    search: {
      type: String
    }
  },
  computed: {
    id: {
      get () {
        return nameToId(this.$store.getters.getAppParam('c')) + 'Table'
      }
    }
  },
  created () {
  },
  methods: {
    inactiveTr (e) {
      this.$store.commit('SET_INACTIVE_LINES', { table: this.table })
    }
  },
  components: {
    RegularTr
  }
}
</script>

<style scoped>
  table thead, table tbody{
    min-width: 100%;
  }
</style>
