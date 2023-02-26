<template>
  <div class="col-12">
    <div class="card border-0 mb-3" v-if="!error && !loading && card.data && card.data.num">
      <div class="card-body p-0 card-body-h">
        <qualification-table :table="card.data.content" :tableThead="card.elements" :qrcode="qrcode" />
        <scan-info :scanning="scanning"/>
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
      scanning: {}
    }
  },
  computed: {
    ...mapGetters({
      pageSearchValues: 'currentPageSearchValues'
    })
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
          this.errorMsg = res.message
          this.error = true
        } else {
          this.scanning = res.contents.content[0]
        }
      }).catch(err => {
        this.errorMsg = err.message
        this.error = true
      }).finally(() => {
        // this.loading = false
        this.$bar.finish()
      })
    }
  },
  components: {
    QualificationTable,
    ScanInfo
  }
}
</script>
