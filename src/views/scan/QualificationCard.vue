<template>
  <div class="col-12">
    <div class="card border-0 mb-3" v-if="!error && !loading && card.data && card.data.num">
      <div class="card-body p-0 card-body-h">
        <qualification-table :table="card.data.content" :tableThead="card.elements" :qrcode="qrcode" />
        <scan-info :scanning="scanning"/>
        <qualification-modal :nonExist="nonExist" :qrcode="pageSearchValues.qrcode" :scanning="scanning" @hidden-modal="$emit('focus-qrcode', $event)"/>
      </div>
    </div>
    <div class="col-12 mt-2" v-if="error">{{ errorMsg }}</div>
    <div class="col-12 mt-2" v-if="loading"><i class="fa fa-spinner fa-spin fa-5x"></i></div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import QualificationTable from './QualificationTable'
import ScanInfo from './ScanInfo'
import QualificationModal from './QualificationModal'
export default {
  name: 'QualificationCard',
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
    refresh: {
      type: Boolean
    }
  },
  data () {
    return {
      errorMsg: 'No Data Available',
      error: false,
      loading: false,
      qrcode: '',
      nonExist: false,
      scanning: {},
      synth: null,
      voice: null
    }
  },
  computed: {
    ...mapGetters({
      pageSearchValues: 'currentPageSearchValues'
    })
  },
  created () {
    this.synth = window.speechSynthesis
  },
  watch: {
    reload: {
      handler: function (to, from) { // 对于
        this.thick = this.pageSearchValues.thick
      }
    },
    search: {
      handler: function (to, from) {
        if (!(this.card.data && this.card.data.num && this.card.data.content.filter(__ => {
          return __.qrcode === this.pageSearchValues.qrcode
        }).length > 0)) {
          this.fetchData()
        } else {
          this.scanning = this.card.data.content.filter(__ => {
            return __.qrcode === this.pageSearchValues.qrcode
          })[0]
          this.speak()
        }
      }
    },
    refresh: {
      handler: function (to, from) {
        this.$store.commit('RESET_CARD', { card: this.card })
        this.scanning = {}
      }
    }
  },
  methods: {
    setNonExist () {
      if (JSON.stringify(this.scanning) === '{}') {
        this.nonExist = !this.nonExist
        return true
      }
      return false
    },
    fetchData (params = {}) { // 获取数据
      this.$bar.start()
      // this.loading = true
      this.error = false
      this.$store.dispatch('FETCH_ACC_DATA', {
        url: this.card.url,
        configs: {
          params: {
            ...this.pageSearchValues,
            ...this.$router.currentRoute.query,
            ...params
          }
        },
        target: this.card
      }).then((res) => {
        if (res.code > 0) {
          // this.errorMsg = res.message
          // this.error = true
          this.setNonExist()
        } else {
          this.scanning = res.contents.content[0]
          this.speak()
        }
      }).catch(err => {
        this.errorMsg = err.message
        this.error = true
      }).finally(() => {
        // this.loading = false
        this.$bar.finish()
      })
    },
    setupVoice () {
      this.voice = this.synth.getVoices().filter(__ => {
        return __.lang === 'zh-CN'
      })[0]
    },
    speak () {
      if (this.voice === null) this.setupVoice()
      console.log('start speaking')
      if (this.synth.speaking) {
        console.error('speechSynthesis.speaking')
        return false
      }
      const msg = this.getMsg()
      console.log(msg)
      if (msg !== '') {
        const utterThis = new SpeechSynthesisUtterance(msg)

        utterThis.onend = function (event) {
          console.log('SpeechSynthesisUtterance.onend')
        }

        utterThis.onerror = function (event) {
          console.error('SpeechSynthesisUtterance.onerror')
        }

        utterThis.voice = this.voice

        utterThis.pitch = 1
        utterThis.rate = 1
        this.synth.speak(utterThis)
      }
    },
    getMsg () {
      if (JSON.stringify(this.scanning) === '{}') {
        return ''
      } else {
        const tmp = this.pageSearchValues.qrcode.match(/\w\d{10,}-\w(\d+).*/)
        if (tmp !== null) {
          return tmp[1]
        } else {
          return ''
        }
      }
    }
  },
  components: {
    QualificationTable,
    ScanInfo,
    QualificationModal
  }
}
</script>
