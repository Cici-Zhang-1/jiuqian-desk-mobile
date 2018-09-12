<template>
  <div class="col-12">
    <div class="card border-0 mb-3" v-if="!error && !loading && card.data && card.data.num">
      <div class="card-body p-0 card-body-h">
        <table class="table table-striped table-bordered table-responsive-sm j-text-nowrap">
          <tbody >
            <tr>
              <td>编号</td>
              <td>{{ card.data['order_product']['order_product_num'] }}</td>
              <td>要求出厂</td>
              <td>{{ card.data['order_product']['request_outdate'] }}</td>
            </tr>
            <tr>
              <td>客户</td>
              <td>{{ card.data['order_product']['dealer'] }}</td>
              <td>业主</td>
              <td>{{ card.data['order_product']['owner'] }}</td>
            </tr>
          </tbody>
        </table>
        <scan-board-table :table="card.data.content" :tableThead="card.elements" :qrcode="qrcode" :showAll="showAll" :thick="thick"/>
        <scan-num :num="card.data.num" :unCheck="unCheck"/>
        <scan-info :scanning="scanning"/>
        <scan-board-modal :abnormity="abnormity" :nonExist="nonExist" :qrcode="pageSearchValues.qrcode" :scanning="scanning" @sure="disposeSure($event)" @hidden-modal="$emit('focus-qrcode', $event)"/>
      </div>
    </div>
    <audio id="scanBoardRightAudio" preload="auto">
      <source :src="audioLink()" type="audio/mpeg" />
    </audio>
    <div class="col-12 mt-2" v-if="error">{{ errorMsg }}</div>
    <div class="col-12 mt-2" v-if="loading"><i class="fa fa-spinner fa-spin fa-5x"></i></div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { baseUrl } from '@/axios/env'
import ScanBoardTable from './ScanBoardTable'
import ScanNum from './ScanNum'
import ScanInfo from './ScanInfo'
import ScanBoardModal from './ScanBoardModal'
export default {
  name: 'ScanBoardCard',
  props: {
    card: {
      type: Object
    },
    reload: {
      type: Boolean
    },
    search: {
      type: Boolean
    },
    showAll: {
      type: Boolean,
      default: false
    },
    refresh: {
      type: Boolean
    }
  },
  data () {
    return {
      errorMsg: 'No Data Available',
      error: false,
      loading: false,
      searching: false,
      qrcode: '',
      thick: '',
      scanning: {},
      abnormity: false,
      nonExist: false
    }
  },
  computed: {
    ...mapGetters({
      pageSearchValues: 'currentPageSearchValues'
    }),
    unCheck: { // 未扫描的板块
      get () {
        return (this.card.data && this.card.data.num && this.card.data.content.filter(__ => {
          return !__.checked
        }).length) || 0
      }
    }
  },
  watch: {
    reload: {
      handler: function (to, from) { // 对于
        this.thick = this.pageSearchValues.thick
      }
    },
    search: {
      handler: function (to, from) {
        if (this.searching) {
          this.dispose()
        } else {
          this.fetchData()
        }
      }
    },
    refresh: {
      handler: function (to, from) {
        this.$store.commit('RESET_CARD', { card: this.card })
        this.searching = false
        this.scanning = {}
      }
    }
  },
  methods: {
    dispose () {
      this.setScanning()
      if (!this.setNonExist()) {
        if (!this.setAbnormity()) {
          this.setQrcode()
        }
      }
    },
    setScanning () { // 正在扫描的qrcode
      this.scanning = (this.card.data && this.card.data.num && this.card.data.content.filter(__ => {
        return __.qrcode === this.pageSearchValues.qrcode
      })[0]) || {}
    },
    setNonExist () {
      if (JSON.stringify(this.scanning) === '{}') {
        this.nonExist = !this.nonExist
        return true
      }
      return false
    },
    setQrcode () {
      this.qrcode = this.pageSearchValues.qrcode
      this.playAudio()
    },
    setAbnormity () {
      if (this.scanning.abnormity !== undefined && (this.scanning.abnormity === '1' || this.scanning.abnormity === 1)) {
        this.abnormity = !this.abnormity
        return true
      }
      return false
    },
    disposeSure (e) {
      this.setQrcode()
    },
    fetchData () { // 获取数据
      this.$bar.start()
      this.loading = true
      this.error = false
      this.$store.dispatch('FETCH_DATA', {
        url: this.card.url,
        configs: {
          params: {
            ...this.pageSearchValues,
            ...this.$router.currentRoute.query
          }
        },
        target: this.card
      }).then((res) => {
        this.loading = false
        this.$bar.finish()
        if (res.code > 0) {
          this.errorMsg = res.message
          this.error = true
        } else {
          this.searching = true
          this.dispose()
        }
      })
    },
    audioLink () {
      return baseUrl + '/style/audio/right.mp3'
    },
    playAudio () {
      let audio = document.getElementById('scanBoardRightAudio')
      audio.currentTime = 0
      audio.play()
    },
    pauseAudio () {
      let audio = document.getElementById('scanBoardRightAudio')
      audio.currentTime = 0
      audio.pause()
    }
  },
  components: {
    ScanBoardModal,
    ScanBoardTable,
    ScanNum,
    ScanInfo
  }
}
</script>
