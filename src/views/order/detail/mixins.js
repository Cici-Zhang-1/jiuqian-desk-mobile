import service from '@/axios'
import $ from 'jquery'
import { highLightTable, generateLink } from '@/assets/js/custom'
let detailCardMixins = {
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
      detailData: []
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
      self.loading = true
      self.error = false
      service.get(self.card.url, { params: { ...this.$router.currentRoute.query } }).then(function (data) {
        if (data.code > 0) {
          self.errorMsg = data.message
          self.error = true
        } else {
          let Board = {}
          for (let i in data.contents.content) {
            if (Board[data.contents.content[i]['order_product_id']] === undefined) {
              Board[data.contents.content[i]['order_product_id']] = data.contents.content[i]
              Board[data.contents.content[i]['order_product_id']]['order_product_detail'] = []
            }
            Board[data.contents.content[i]['order_product_id']]['order_product_detail'].push(data.contents.content[i])
          }
          self.detailData = Board
        }
        self.loading = false
      })
    }
  }
}
let detailTableMixins = {
  props: {
    table: {
      type: Object | Array,
      required: true
    },
    tableThead: {
      type: Object | Array,
      required: true
    }
  },
  mounted () {
    highLightTable($('.table-highlight'))
  },
  updated () {
    highLightTable($('.table-highlight'))
  },
  methods: {
    show (Name) {
      return this.tableThead[Name] !== undefined
    },
    orderProductLink () {
      return generateLink(this.table.num, this.tableThead.num, this.table)
    }
  }
}
export { detailCardMixins, detailTableMixins }
