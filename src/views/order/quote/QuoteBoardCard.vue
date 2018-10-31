<template>
  <div class="col-12">
    <div class="card mb-3" v-if="!error && !loading">
      <div class="card-body p-0 card-body-h">
        <quote-board-table v-for="(value, key, index) in quoteData" :key="index" :table="value" :tableThead="card.elements" />
      </div>
    </div>
    <div class="col-12 mt-2" v-if="loading"><i class="fa fa-spinner fa-spin fa-5x"></i></div>
  </div>
</template>

<script>
import { quoteCardMixins } from './mixins'
import QuoteBoardTable from './QuoteBoardTable'

export default {
  mixins: [ quoteCardMixins ],
  name: 'QuoteBoardCard',
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
      quoteData: []
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
      this.error = false
      service.get(this.card.url, { params: { ...this.$router.currentRoute.query } }).then(function (data) {
        if (data.code > 0) {
          self.errorMsg = data.message
          self.error = true
        } else {
          let Board = {}
          for (let i in data.contents.content) {
            if (Board[data.contents.content[i]['order_product_id']] === undefined) {
              Board[data.contents.content[i]['order_product_id']] = data.contents.content[i]
              Board[data.contents.content[i]['order_product_id']]['order_product_board'] = []
            }
            Board[data.contents.content[i]['order_product_id']]['order_product_board'].push(data.contents.content[i])
          }
          self.boardData = Board
        }
        self.loading = false
      })
    }
  }, */
  components: {
    QuoteBoardTable
  }
}
</script>
