<template>
  <div class="col-12">
    <div class="card mb-3" v-if="!error && !loading">
      <div class="card-body p-0 card-body-h">
        <quote-server-table v-for="(value, key, index) in serverData" :key="index" :table="value" :tableThead="card.elements" />
      </div>
    </div>
    <div class="col-12 mt-2" v-if="loading"><i class="fa fa-spinner fa-spin fa-5x"></i></div>
  </div>
</template>

<script>
import service from '@/axios'
import QuoteServerTable from './QuoteServerTable'
export default {
  name: 'QuoteServerCard',
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
      loading: true,
      serverData: []
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
          let Server = {}
          for (let i in data.contents.content) {
            if (Server[data.contents.content[i]['order_product_id']] === undefined) {
              Server[data.contents.content[i]['order_product_id']] = data.contents.content[i]
              Server[data.contents.content[i]['order_product_id']]['order_product_server'] = []
            }
            Server[data.contents.content[i]['order_product_id']]['order_product_server'].push(data.contents.content[i])
          }
          self.serverData = Server
        }
        self.loading = false
      })
    }
  },
  components: {
    QuoteServerTable
  }
}
</script>
