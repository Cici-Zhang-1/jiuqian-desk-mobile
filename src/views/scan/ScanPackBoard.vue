<template>
  <div class="row mt-3 j-page" :id="title">
    <div class="col-12 border-bottom rounded-bottom mb-2 border-primary text-center d-print-block"><h5>{{ label }}</h5></div>
    <div is="scan-pack-board-page-search" :pageSearches="disposeThick(pageSearches)" :qrcodeFocus="focus" v-if="pageSearches" @search="searchQrcode($event)"></div>
    <div is="scan-pack-board-func" @show="show($event)" @save="save($event)" @refresh="disposeRefresh($event)">
    </div>
    <div is="scan-pack-board-card" :card="get_card('scan_pack_board_table')" v-if="cards" :reload="reload" :search="search" :showAll="showAll" :refresh="refresh" @focus-qrcode="disposeFocus()"></div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import ScanPackBoardPageSearch from './ScanPackBoardPageSearch'
import ScanPackBoardFunc from './ScanPackBoardFunc'
import ScanPackBoardCard from './ScanPackBoardCard'
import { nameToId } from '@/assets/js/custom'
import service from '@/axios'
import $ from 'jquery'
import 'jquery.qrcode'
import { pubMixins } from '@/views/mixins'
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
  mixins: [ pubMixins ],
  name: 'ScanPackBoard',
  data () {
    return {
      title: '',
      f: 'order',
      c: 'scan_pack_board',
      reload: false,
      search: false,
      showAll: 2,
      refresh: false,
      focus: false,
      last: false,
      bug: false,
      data: {},
      packType: 'both',
      autoSaveId: undefined,
      firstOrderProduct: {}
    }
  },
  computed: {
    ...mapGetters({
      cards: 'currentPageCards', // 当前页面应该展示的数据
      pageSearches: 'currentPageSearches',
      label: 'currentLabel'
    })
  },
  created () {
    this.set_app_controller()
    this.packType = this.$localStorage.get('scan_pack_type', 'both')
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.title = nameToId(vm.c)
    })
  },
  watch: {
    '$store.state.app.reload': {
      handler: function (to, from) {
        if (to) {
          this.reload = !this.reload
          this.$store.commit('SET_APP_RELOAD', { reload: false })
        }
      },
      deep: true
    },
    'pageSearches.pack_type.dv': {
      handler: function (to, from) {
        if (to !== from) {
          this.packType = to
          this.$localStorage.set('scan_pack_type', to)
        }
      }
    }
  },
  methods: {
    disposeThick (pageSearches) {
      pageSearches.pack_type.dv = this.packType
      return pageSearches
    },
    get_card ($Name) {
      return this.cards.filter(__ => {
        return __.name === $Name
      })[0]
    },
    set_app_controller () {
      this.$store.commit('SET_APP_CONTROLLER', { controller: this.c })
    },
    show (e) {
      this.showAll = e
      this.disposeFocus()
    },
    searchQrcode (e) {
      this.search = !this.search
      if (typeof this.autoSaveId === 'number') {
        clearTimeout(this.autoSaveId)
      }
      this.autoSaveId = setTimeout(() => {
        // this.save(document.getElementById('autoSave'))
        this.autoSave(document.getElementById('autoSave'))
      }, 10000)
    },
    disposeRefresh (E) { // 刷新
      if (this.setData(E)) {
        if (window.confirm('您有未确认的扫描，是否确认?')) {
          this.submit(E)
          return true
        }
      }
      this.disposeReset()
      this.disposeFocus()
      return false
    },
    disposeReset () { // 重置
      this.refresh = !this.refresh
    },
    disposeFocus () {
      this.focus = !this.focus
    },
    setData (E) {
      let Target = $(E).data('target')
      let V = this.$store.getters.currentPageActiveLineVs({source: Target, all: $(E).data('multiple')}).map(__ => __.v)
      if (V && V.length !== 0) {
        this.data.v = V
        this.data.pack_type = this.packType
        this.firstOrderProduct = this.get_card('scan_pack_board_table').data['order_product']
        this.data.pack = parseInt(this.firstOrderProduct.pack) + 1
        this.data.order_product_board_plate_id = this.firstOrderProduct['v']
        return true
      } else {
        return false
      }
    },
    save (E) {
      if (this.setData(E)) {
        // if (window.confirm('确定执行' + $(E).text() + '操作?')) {
        this.submit(E)
        return true
        // }
        // return false
      } else {
        alert('请先选中')
        return false
      }
    },
    async autoSave (E) {
      if (this.setData(E)) {
        let postReturn = await service.post($(E).attr('href'), this.data)
        return !postReturn.code
      }
    },
    async submit (E) {
      let postReturn = await service.post($(E).attr('href'), this.data)
      if (!postReturn.code) {
        // alert(postReturn.message)
        this.printLabel(E)
        this.disposeReset()
        this.disposeFocus()
        return true
      } else {
        alert(postReturn.message)
        return false
      }
    },
    printLabel (E) { // 打印标签
      let activeLines = this.$store.getters.currentPageActiveLines({source: $(E).data('target'), all: $(E).data('multiple')})
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
          // let key = v['plate_name'] + '-' + v.length + '-' + v.width + '-' + v.thick
          // if (activeLinesMerge[key] === undefined) {
          //   activeLinesMerge[key] = 1
          // } else {
          //   activeLinesMerge[key] += 1
          // }
        })
        plates = Object.keys(activeLinesMerge).map((v) => {
          return '<tr><td>' + v + ':' + activeLinesMerge[v].join(', ') + '</td></tr>'
          // if (i % 2 === 0) {
          //   return '<tr><td>' + v + '-' + activeLinesMerge[v] + '</td>'
          // } else {
          //   return '<td>' + v + '-' + activeLinesMerge[v] + '</td></tr>'
          // }
        }).join('')
      } else {
        return false
      }
      let printDate = new Date().Format('yyyy-MM-dd')
      // let orderProduct = this.get_card('scan_pack_board_table').data['order_product']
      let pack = parseInt(this.firstOrderProduct.pack) + 1
      if (this.firstOrderProduct['delivery_area'] === '') {
        this.firstOrderProduct['delivery_area'] = '--'
      }
      if (this.firstOrderProduct['delivery_linker'] === '') {
        this.firstOrderProduct['delivery_linker'] = '--'
      }
      if (this.firstOrderProduct['owner'] === '') {
        this.firstOrderProduct['owner'] = '--'
      }
      let dealerName = this.firstOrderProduct['dealer']
      let dealer = dealerName.split('-')
      if (dealer.length > 4) {
        let dealerNum = dealer.shift() // 客户编号
        dealerName = dealer.shift() // 客户名称
        let shopName = dealer.shift() // 店面编号
        dealerName = dealerName === shopName ? dealerNum + dealerName : dealerNum + dealerName + shopName
      }
      let packLabel = ''
      let url = ''

      // let packType = ''
      // if (this.packType === 'thick') {
      //   packType = '-柜体'
      // } else if (this.packType === 'thin') {
      //   packType = '-背板'
      // }
      url = pubUrl + '/' + this.firstOrderProduct['order_product_num'] + '-' + pack + '-' + pack + '-' + this.packType
      packLabel = '<div class="print-area d-none d-print-block" id="scanPackBoardLabelArea">' +
        '<div class="print-label">' +
          '<div class="delivery-address">' +
            '<div class="middle">' + this.firstOrderProduct['delivery_area'] + '</div>' +
          '</div>' +
          '<table class="basic-info">' +
            '<tr>' +
              '<td>' + this.firstOrderProduct['order_product_num'] + '</td>' +
              '<td>' + dealerName + '</td>' +
            '</tr>'

      if (this.firstOrderProduct['delivery_area'] !== 'OEA') {
        packLabel = packLabel + '<tr>' +
          '<td>' + this.firstOrderProduct['delivery_linker'] + '</td>' +
          '<td>' + this.firstOrderProduct['owner'] + '</td>' +
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
    }
  },
  components: {
    ScanPackBoardPageSearch,
    ScanPackBoardFunc,
    ScanPackBoardCard
  }
}
</script>
