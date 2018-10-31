<template>
  <tr :class="{'table-success': trData.checked, 'd-none': trData.hide === true}" :id="id" @click="activeTr($event.currentTarget)" @dblclick="multipleActiveTr" v-if="quickSearch()">
    <td class="d-print-none d-sm-none d-md-block"><input type="checkbox" v-model="trData.checked" /> </td>
    <td v-for="(value, key, index) in tableThead" :name="key" :class="[ value.classes ]" :key="index" v-if="value.checked_name" v-html="generateTd(trData[key], value)"></td>
  </tr>
</template>

<script>
import { uuid } from '@/assets/js/custom'
import $ from 'jquery'
import { trimRight } from 'voca'

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
    },
    generateTd (Data, Thead) {
      let Url = Thead.url
      let Query = Thead.query
      if (Url && Url !== '') {
        Query = (Query && Query.split(',')) || []
        if (Query.length > 0) {
          let I = Query.length
          let Params = ''
          for (let J = 0; J < I; J++) {
            if (this.trData[Query[J]] !== undefined) {
              Params += Query[J] + '=' + this.trData[Query[J]] + '&'
            }
          }
          Params = trimRight(Params, '&')
          Url = Url.indexOf('?') >= 0 ? Url + '&' + Params : Url + '?' + Params
        }
        Data = '<a href="#' + Url + '">' + Data + '</a>'
      }
      return Data
    }
  }
}
</script>
