<template>
  <button class="btn btn-primary mb-2 mr-1 mb-md-3" type="button" :key="id" :value="func.label" @click="btnClick" :data-toggle="func.toggle_name" :data-target="func.target" :data-multiple=!!parseInt(func.multiple_v) :data-single=!!parseInt(func.single_v) :data-source="func.source" :data-query="func.query"><i :class="func.img"></i>{{ func.label }}</button>
</template>

<script>
import { nameToId, uuid } from '@/assets/js/custom'
import $ from 'jquery'
import 'jquery.qrcode'
import { pubUrl } from '@/axios/env'

Date.prototype.Format = function (fmt) {
  var o = {
    'M+': this.getMonth() + 1,
    'd+': this.getDate(),
    'H+': this.getHours(),
    'm+': this.getMinutes(),
    's+': this.getSeconds(),
    'S+': this.getMilliseconds()
  }

  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  for (var k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(String(o[k]).length)))
    }
  }
  return fmt
}

export default {
  name: 'btn',
  props: {
    func: {
      type: [Array, Object],
      required: true
    }
  },
  data () {
    return {
      target: '',
      multiple: false,
      single: false,
      query: [],
      keys: [],
      search: [],
      showColumn: [],
      hideColumn: [],
      data: {}
    }
  },
  computed: {
    id () {
      return nameToId(this.func.name) + uuid()
    }
  },
  methods: {
    btnClick (event) {
      switch (this.func.toggle_v) {
        case 'refresh':
          this.func_refresh()
          break
        case 'simplify':
          this.func_simplify(event.currentTarget)
          break
        case 'label':
          this.func_label(event.currentTarget)
          break
      }
    },
    func_refresh () {
      this.$store.commit('SET_APP_RELOAD', { reload: true })
    },
    func_simplify (E) {
      this.parse_params(E)
      if ((this.showColumn.length > 0 || this.hideColumn.length > 0) && this.target !== '') {
        let Elements = this.$store.getters.currentPageCardElements({source: this.target})
        if (!$(E).data('simplified')) {
          if (this.showColumn.length > 0) {
            this.showColumn.map(__ => {
              Elements[__]['classes'] = ''
              return __
            })
          }
          if (this.hideColumn.length > 0) {
            this.hideColumn.map(__ => {
              Elements[__]['classes'] = 'd-none'
              return __
            })
          }
          $(E).data('simplified', true)
        } else {
          if (this.showColumn.length > 0) {
            this.showColumn.map(__ => {
              Elements[__]['classes'] = 'd-none'
              return __
            })
          }
          if (this.hideColumn.length > 0) {
            this.hideColumn.map(__ => {
              Elements[__]['classes'] = ''
              return __
            })
          }
          $(E).data('simplified', false)
        }
      }
      return true
    },
    func_label (E) {
      this.printLabel(E)
    },
    printLabel (E) { // 打印标签
      let activeLines = this.$store.getters.currentPageData({source: $(E).data('target'), key: 'content'})
      let orderProduct = this.$store.getters.currentPageData({source: $(E).data('target'), key: 'order_product'})
      let plates = ''
      let platesNum = 0 // 板块数目
      if (activeLines && activeLines.length !== 0) {
        platesNum = activeLines.length
        let activeLinesMerge = {}
        activeLines.forEach(v => {
          let [, productNum, plateNum] = v['qrcode'].split('-')
          if (activeLinesMerge[productNum] === undefined) {
            activeLinesMerge[productNum] = []
          }
          activeLinesMerge[productNum].push(plateNum)
        })
        if (JSON.stringify(activeLinesMerge) !== '{}') {
          plates = Object.keys(activeLinesMerge).map((v) => {
            return '<tr><td>' + v + ':' + activeLinesMerge[v].sort().join(', ') + '</td></tr>'
          }).join('')
        } else {
          return false
        }
      } else {
        return false
      }
      let printDate = new Date().Format('yyyy-MM-dd')
      let pack = orderProduct['pack']
      if (orderProduct['delivery_area'] === '') {
        orderProduct['delivery_area'] = '--'
      }
      if (orderProduct['delivery_linker'] === '') {
        orderProduct['delivery_linker'] = '--'
      }
      if (orderProduct['owner'] === '') {
        orderProduct['owner'] = '--'
      }
      let dealerName = orderProduct['dealer']
      let dealer = dealerName.split('-')
      if (dealer.length > 4) {
        let dealerNum = dealer.shift() // 客户编号
        dealerName = dealer.shift() // 客户名称
        let shopName = dealer.shift() // 店面编号
        dealerName = dealerName === shopName ? dealerNum + dealerName : dealerNum + dealerName + shopName
      }
      let packLabel = ''
      let url = ''

      url = pubUrl + '/' + orderProduct['order_product_num'] + '-' + pack
      packLabel = '<div class="print-area d-none d-print-block" id="scanPackBoardLabelArea">' +
        '<div class="print-label">' +
        '<div class="delivery-address">' +
        '<div class="middle">' + orderProduct['delivery_area'] + '</div>' +
        '</div>' +
        '<table class="basic-info">' +
        '<tr>' +
        '<td>' + orderProduct['order_product_num'] + '</td>' +
        '<td>' + dealerName + '</td>' +
        '</tr>'

      if (orderProduct['delivery_area'] !== 'OEA') {
        packLabel = packLabel + '<tr>' +
          '<td>' + orderProduct['delivery_linker'] + '</td>' +
          '<td>' + orderProduct['owner'] + '</td>' +
          '</tr>'
      }
      packLabel = packLabel + '<tr>' +
        '<td>' + printDate + '</td>' +
        '<td>共' + platesNum + '块</td>' +
        '</tr>' +
        '</table>' +
        '<table class="plates">'
      packLabel = packLabel + plates + '</table>' +
        '<div class="package-total">' +
        '<div class="middle"><span>第</span>' + pack + '<span>包</span></div>' +
        '</div>' +
        '<div class="qrcode" data-url=' + url + '></div>' +
        '</div>' +
        '</div>'
      $('body').children().addClass('d-print-none')
      $('body').prepend(packLabel)
      $('.qrcode').each(function () {
        $(this).qrcode({
          width: 93,
          height: 93,
          text: $(this).data('url')
        })
      })
      window.onafterprint = (event) => {
        $('#scanPackBoardLabelArea').remove()
        $('body').children().removeClass('d-print-none')
      }
      window.print()
      return true
    },
    parse_params (E) {
      this.data = {}
      let [ Query = '', Keys = '', Search = '', Column = '' ] = $(E).data('query').split('-')
      this.query = Query.split(',')
      this.keys = Keys.split(',')
      this.search = Search.split(',')
      let [HideColumn = '', ShowColumn = ''] = Column.split('/')
      this.hideColumn = HideColumn.split(',')
      this.showColumn = ShowColumn.split(',')
      this.target = $(E).data('target') || ''
      this.multiple = $(E).data('multiple') || false
      this.single = $(E).data('single') || false
    }
  }
}
</script>
