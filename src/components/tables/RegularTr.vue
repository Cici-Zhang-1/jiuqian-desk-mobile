<template>
  <tr :class="{'table-success': trData.checked}" :id="id" @click="activeTr($event.currentTarget)" @dblclick="multipleActiveTr" v-if="quickSearch()">
    <td class="d-print-none"><input type="checkbox" v-model="trData.checked" /> </td>
    <td v-for="(value, key, index) in tableThead" :name="key" :class="[ value.classes ]" :key="index" v-if="value.checked_name" v-html="trData[key]"></td>
  </tr>
</template>

<script>
import { uuid } from '@/assets/js/custom'
import $ from 'jquery'

export default {
  name: 'RegularTr',
  props: {
    trData: {
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
      id: 'tr' + uuid(),
      timeoutId: null
    }
  },
  methods: {
    activeTr (e) { // 单行激活
      if (!$(e).hasClass('table-success')) {
        $(e).addClass('table-active').siblings().removeClass('table-active')
      }
    },
    multipleActiveTr (e) { // 单行选中
      this.$store.commit('SET_LINE_ACTIVITY', { tr: this.trData })
    },
    quickSearch () { // 当输入关键字时快速搜索
      if (this.search && this.search.length > 0) {
        for (let i in this.trData) {
          if (this.trData[i] && this.trData[i].toString().search(this.search) >= 0) {
            return true
          }
        }
        return false
      } else {
        return true
      }
    }
  }
}
</script>
