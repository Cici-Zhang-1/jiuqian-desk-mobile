<template>
  <div class="row mt-3 j-page" :id="title">
    <div class="col-12 border-bottom rounded-bottom mb-2 border-primary text-center d-print-none"><h5>{{ label }}</h5></div>
    <div is="qualification-scan-search" :pageSearches="pageSearches" v-if="pageSearches" @search="searchQrcode($event)" :qrcodeFocus="focus"></div>
    <div is="qualification-scan-func" @show="show($event)" @refresh="disposeRefresh($event)">
      <a class="d-none" id="autoSave" href="/order/qualification_scan/edit" data-toggle="save"
         data-target="#qualificationScanTable" data-multiple="true">自动保存</a>
    </div>
    <div is="qualification-card" :card="get_card('qualification_scan_table')" v-if="cards" :reload="reload"
         :search="search" :showAll="showAll" :refresh="refresh" @focus-qrcode="disposeFocus()"></div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import QualificationScanSearch from './QualificationScanSearch'
import QualificationScanFunc from './QualificationScanFunc'
import QualificationCard from './QualificationCard'
import { nameToId } from '@/assets/js/custom'
import { pubMixins } from '@/views/mixins'
export default {
  mixins: [ pubMixins ],
  name: 'QualificationScan',
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
      data: {},
      autoSaveId: undefined
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
    }
  },
  methods: {
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
    disposeRefresh (E) { // 刷新
      this.disposeReset()
      this.disposeFocus()
      return true
    },
    disposeReset () { // 重置
      this.refresh = !this.refresh
    },
    disposeFocus () {
      this.focus = !this.focus
    }
  },
  components: {
    QualificationScanSearch,
    QualificationScanFunc,
    QualificationCard
  }
}
</script>
