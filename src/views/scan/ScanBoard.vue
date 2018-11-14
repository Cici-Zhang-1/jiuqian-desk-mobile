<template>
  <div class="row mt-3 j-page" :id="title">
    <div class="col-12 border-bottom rounded-bottom mb-2 border-primary text-center d-print-none"><h5>{{ label }}</h5></div>
    <div is="scan-board-page-search" :pageSearches="disposeThick(pageSearches)" v-if="pageSearches" @search="searchQrcode($event)" :qrcodeFocus="focus"></div>
    <div is="scan-board-func" @show="show($event)" @save="save($event)" @refresh="disposeRefresh($event)" @last="disposeLast($event)"></div>
    <div is="scan-board-card" :card="get_card('scan_board_table')" v-if="cards" :reload="reload" :search="search" :showAll="showAll" :refresh="refresh" :last="last" @focus-qrcode="disposeFocus()"></div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import ScanBoardPageSearch from './ScanBoardPageSearch'
import ScanBoardFunc from './ScanBoardFunc'
import ScanBoardCard from './ScanBoardCard'
import { nameToId } from '@/assets/js/custom'
import service from '@/axios'
import $ from 'jquery'
import { pubMixins } from '@/views/mixins'
export default {
  mixins: [ pubMixins ],
  name: 'ScanBoard',
  data () {
    return {
      title: '',
      f: 'order',
      c: 'scan_board',
      reload: false,
      search: false,
      showAll: false,
      refresh: false,
      focus: false,
      last: false,
      data: {},
      thick: ''
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
    this.thick = this.$localStorage.get('scan_thick', '')
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
    'pageSearches.thick.dv': {
      handler: function (to, from) {
        if (to !== from) {
          this.thick = to
          this.$localStorage.set('scan_thick', to)
        }
      }
    }
  },
  methods: {
    disposeThick (pageSearches) {
      pageSearches.thick.dv = this.thick
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
      this.showAll = !!e
      this.disposeFocus()
    },
    searchQrcode (e) {
      this.search = !this.search
    },
    disposeLast (E) {
      if (window.confirm('确认找回上次扫描?')) {
        this.last = !this.last
      }
      this.disposeFocus()
      return true
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
    async submit (E) {
      let postReturn = await service.post($(E).attr('href'), this.data)
      if (!postReturn.code) {
        // alert(postReturn.message)
        this.disposeReset()
        this.disposeFocus()
        return true
      } else {
        alert(postReturn.message)
        return false
      }
    }
  },
  components: {
    ScanBoardPageSearch,
    ScanBoardFunc,
    ScanBoardCard
  }
}
</script>
