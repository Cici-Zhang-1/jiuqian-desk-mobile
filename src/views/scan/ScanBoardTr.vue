<template>
  <tr :class="{'table-danger': trData.checked, 'd-none': !showAll && trData.checked}" @click="activeTr($event.currentTarget)" @dblclick="multipleActiveTr" v-if="thickFilter()">
    <td class="d-print-none"><input type="checkbox" v-model="trData.checked" /> </td>
    <td v-for="(value, key, index) in tableThead" :name="key" :class="[ value.classes ]" :key="index" v-if="value.checked_name" v-html="generateTd(trData[key], value)"></td>
  </tr>
</template>

<script>
import $ from 'jquery'
import { trimRight } from 'voca'
import { THICK } from '@/assets/js/constants'

export default {
  name: 'ScanBoardTr',
  props: {
    trData: {
      type: Object | Array,
      required: true
    },
    tableThead: {
      type: Object | Array,
      required: true
    },
    qrcode: {
      type: String
    },
    showAll: {
      type: Boolean,
      default: false
    },
    thick: {
      type: Number | String
    }
  },
  created () {
    this.qrcodeSearch()
  },
  watch: {
    qrcode: {
      handler: function (to, from) {
        this.qrcodeSearch()
      }
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
    qrcodeSearch () {
      if (this.qrcode && this.qrcode.length > 0) {
        if (this.trData['qrcode'] === this.qrcode) {
          if (!this.trData.checked) {
            this.$store.commit('SET_LINE_ACTIVITY', { tr: this.trData })
          }
        }
      }
    },
    thickFilter () {
      if (this.thick === '') {
        return true
      } else {
        if (this.thick === 0 || this.thick === '0') {
          return this.trData['thick'] < THICK
        } else {
          return this.trData['thick'] > THICK
        }
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
