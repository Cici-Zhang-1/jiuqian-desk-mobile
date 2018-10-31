<template>
  <div class="col-12">
    <table class="table table-striped table-bordered table-sm mb-0" v-if="card.data && card.data.content">
      <tbody >
        <tr>
          <th colspan="6">生产清单-{{ card.data.content.product }}</th>
        </tr>
        <tr>
          <th v-if="show('dealer')">客户</th>
          <th v-if="show('dealer')">{{ card.data.content.dealer }}</th>
          <th v-if="show('num')">编号</th>
          <th v-if="show('num')">{{ card.data.content.num }}</th>
          <th v-if="show('sure_datetime')">确认日期</th>
          <th v-if="show('sure_datetime')">{{ card.data.content.sure_datetime }}</th>
        </tr>
        <tr>
          <th v-if="show('product')">产品</th>
          <th v-if="show('product')">{{ card.data.content.product }}</th>
          <th v-if="show('request_outdate')">要求出厂</th>
          <th v-if="show('request_outdate')">{{ card.data.content.request_outdate }}</th>
          <th v-if="show('owner')">业主</th>
          <th v-if="show('owner')">{{ card.data.content.owner }}</th>
        </tr>
        <tr v-if="card.data.content.remark && card.data.content.remark !== ''">
          <th v-if="show('remark')">备注</th>
          <th colspan="5" v-if="show('remark')">{{ card.data.content.remark }}</th>
        </tr>
        <tr v-if="card.data.content.order_remark && card.data.content.order_remark !== ''">
          <th v-if="show('order_remark')">订单备注</th>
          <th colspan="5" v-if="show('order_remark')">{{ card.data.content.order_remark }}</th>
        </tr>
        <tr v-if="card.data.content.order_product">
          <th v-if="show('order_product')">其它产品</th>
          <th colspan="5" v-if="show('order_product')">{{ card.data.content.order_product }}</th>
        </tr>
      </tbody>
    </table>
    <div class="col-12 mt-2" v-if="loading"><i class="fa fa-spinner fa-spin fa-5x"></i></div>
  </div>
</template>

<script>
export default {
  name: 'PrintOrderTable',
  props: {
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
      loading: true
    }
  },
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
    show (Name) {
      return this.card.elements[Name] && this.card.elements[Name].checked_name
    },
    fetchData () { // 获取数据
      let self = this
      this.loading = true
      this.error = false
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
          self.errorMsg = res.message
          self.error = true
        }
      }).catch(err => {
        self.errorMsg = err.message
        self.error = true
      }).finally(() => {
        self.loading = false
      })
    }
  }
}
</script>
