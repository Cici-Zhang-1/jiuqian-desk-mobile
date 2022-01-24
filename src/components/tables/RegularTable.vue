<template>
  <table class="table table-striped table-responsive j-text-nowrap j-table" :id="id">
    <thead>
      <tr>
        <th class="d-print-none d-sm-none d-md-block"><input type="checkbox" name="select_all" @click="selectAll($event.currentTarget)"  v-model="selectAllChecked" /></th>
        <th v-for="(value, key, index) in tableThead" :class="[ value.classes ]" :key="index" v-if="value.checked_name">{{ value.label }}</th>
      </tr>
    </thead>
    <tbody>
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
  data () {
    return {
      selectAllChecked: false
    }
  },
  computed: {
    id: {
      get () {
        return nameToId(this.$store.getters.getAppParam('c')) + 'Table'
      }
    }
  },
  methods: {
    inactiveTr (e) {
      this.$store.commit('SET_INACTIVE_LINES', { table: this.table })
    },
    selectAll (e) {
      this.$store.commit('SET_ALL_LINE_ACTIVITY', { table: this.table, activity: !this.selectAllChecked, search: this.search })
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
