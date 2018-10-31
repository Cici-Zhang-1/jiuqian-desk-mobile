<template>
  <div class="tab-pane fade" role="tabpanel">
    <div class="col-12">
      <div class="card border-0 mb-3" v-if="!error && !loading && card.data && card.data.num">
        <div class="card-body p-0 card-body-h">
          <input class="form-control mb-3 mt-2" type="text" name="search" v-model="search" placeholder="编号/客户/业主"/>
          <wait-delivery-table :table="card.data.content" :tableThead="card.elements" :search="search"/>
        </div>
      </div>
      <div class="col-12 mt-2" v-if="error">{{ errorMsg }}</div>
      <div class="col-12 mt-2" v-if="loading"><i class="fa fa-spinner fa-spin fa-5x"></i></div>
    </div>
  </div>
</template>

<script>
import WaitDeliveryTable from './WaitDeliveryTable'
export default {
  name: 'WaitDeliveryCard',
  props: {
    card: {
      type: Object
    },
    refresh: {
      type: Boolean
    }
  },
  data () {
    return {
      error: false,
      errorMsg: 'No Data Available',
      loading: false,
      search: ''
    }
  },
  computed: {
    num () { // 总条数
      return parseInt(this.card.data.num)
    }
  },
  created () {
    this.fetchData()
  },
  watch: {
    refresh: {
      handler: function (to, from) {
        this.$store.commit('RESET_CARD', { card: this.card })
        this.fetchData()
      }
    }
  },
  methods: {
    fetchData () { // 获取数据
      this.error = false
      this.loading = true
      this.errorMsg = ''
      this.$store.dispatch('FETCH_DATA', {
        url: this.card.url,
        configs: {
          params: {
            ...this.$router.currentRoute.query
          }
        },
        target: this.card
      }).then((res) => {
        if (res.code > 0) {
          this.error = true
          this.errorMsg = res.message
        }
      }).catch(err => {
        self.errorMsg = err.message
        self.error = true
      }).finally(() => {
        this.loading = false
      })
    }
  },
  components: {
    WaitDeliveryTable
  }
}
</script>
