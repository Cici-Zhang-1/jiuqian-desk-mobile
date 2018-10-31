<template>
  <div class="col-12">
    <div class="card mb-3" v-if="!error && !loading">
      <div class="card-body p-0 card-body-h">
        <order-product-fitting-table v-for="(value, key, index) in detailData" :key="index" :table="value" :tableThead="card.elements" />
      </div>
    </div>
    <div class="col-12 mt-2" v-if="loading"><i class="fa fa-spinner fa-spin fa-5x"></i></div>
  </div>
</template>

<script>
import { detailCardMixins } from './mixins'
import OrderProductFittingTable from './OrderProductFittingTable'
export default {
  mixins: [ detailCardMixins ],
  name: 'OrderProductFittingCard',
  /* props: {
    card: {
      type: Object
    },
    reload: {
      type: Boolean
    }
  },
  data () {
    return {
      errorMsg: 'No Data Available',
      error: false,
      loading: true,
      fittingData: []
    }
  },
  computed: {},
  created () {
    this.fetchData()
  },
  watch: {
    reload: {
      handler: function (to, from) {
        this.fetchData()
      }
    }
  },
  methods: {
    fetchData () { // 获取数据
      let self = this
      this.loading = true
      service.get(this.card.url, { params: { ...this.$router.currentRoute.query } }).then(function (data) {
        if (data.code > 0) {
          self.errorMsg = data.message
          self.error = true
        } else {
          let Fitting = {}
          for (let i in data.contents.content) {
            if (Fitting[data.contents.content[i]['order_product_id']] === undefined) {
              Fitting[data.contents.content[i]['order_product_id']] = data.contents.content[i]
              Fitting[data.contents.content[i]['order_product_id']]['order_product_fitting'] = []
            }
            Fitting[data.contents.content[i]['order_product_id']]['order_product_fitting'].push(data.contents.content[i])
          }
          self.fittingData = Fitting
        }
        self.loading = false
      })
    }
  }, */
  components: {
    OrderProductFittingTable
  }
}
</script>
