<template>
  <table class="table table-striped table-responsive j-text-nowrap j-table" id="saveBoardTable">
    <thead>
      <tr>
        <th class="d-print-none"><input type="checkbox" name="select_all" @click="selectAll($event.currentTarget)"  v-model="selectAllChecked" /></th>
        <th v-for="(value, key, index) in tableThead" :class="[ value.classes ]" :key="index" v-if="value.checked_name">{{ value.label }}</th>
      </tr>
    </thead>
    <tbody >
      <tr @click="inactiveTr" is="scan-pack-board-tr" v-for="(value, key, index) in table" :trData="value" :tableThead="tableThead" :key="index" :qrcode="qrcode" :showAll="showAll" :thick="thick"></tr>
    </tbody>
  </table>
</template>

<script>
import ScanPackBoardTr from './ScanPackBoardTr'

export default {
  name: 'ScanPackBoardTable',
  props: {
    table: {
      type: Object | Array,
      required: true
    },
    tableThead: {
      type: Object | Array,
      required: true
    },
    qrcode: {
      type: String,
      required: true
    },
    showAll: {
      type: Number,
      default: 2
    },
    thick: {
      type: Number | String
    }
  },
  data () {
    return {
      selectAllChecked: false
    }
  },
  methods: {
    inactiveTr (e) {
      this.$store.commit('SET_INACTIVE_LINES', { table: this.table })
    },
    selectAll (e) {
      this.$store.commit('SET_ALL_LINE_ACTIVITY', { table: this.table, activity: !this.selectAllChecked, qrcode: this.qrcode })
    }
  },
  components: {
    ScanPackBoardTr
  }
}
</script>
