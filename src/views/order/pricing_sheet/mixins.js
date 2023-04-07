import service from '@/axios'
import { highLightTable, generateLink } from '@/assets/js/custom'
import $ from 'jquery'
let pricingSheetCardMixins = {
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
      pricingSheetData: []
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
              Board[data.contents.content[i]['order_product_id']]['order_product_board'] = []
            }
            Board[data.contents.content[i]['order_product_id']]['order_product_board'].push(data.contents.content[i])
          }
          self.pricingSheetData = Board
        }
        self.loading = false
      })
    }
  }
}

let pricingSheetTableMixins = {
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
      console.log(this.table)
      return generateLink(this.table.num, this.tableThead.num, this.table)
    }
  }
}
export { pricingSheetCardMixins, pricingSheetTableMixins }
