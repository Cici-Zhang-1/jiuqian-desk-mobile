<template>
  <div class="tab-pane fade" id="dismantleF" role="tabpanel" aria-labelledby="door">
    <div class="form-row" v-if="orderProduct">
      <div class="form-group col-md-2">
        <label>选择订单</label>
        <select class="form-control" name="order_product_id" v-model="orderInfo['order_product_id']">
          <option value="0">请选择订单</option>
          <option v-for="(item, key, index) in orderProduct['order_product']" :key="index" :value="item.v" v-if="orderProduct['order_product']">{{ item.num }}-{{ item.product }}-{{ item.status_label }}</option>
        </select>
      </div>
      <div class="form-group col-md-2">
        <label>产品名称</label>
        <input type="text" class="form-control" name="product" v-model="activeOrderProduct['product']" placeholder="请添加产品名称" v-if="activeOrderProduct">
        <input type="text" class="form-control" name="product" v-model="orderProduct['product']['name']" placeholder="请添加产品名称" v-if="!activeOrderProduct">
      </div>
      <div class="form-group col-md-1">
        <label>套数</label>
        <input type="number" class="form-control" v-model="orderProduct['product']['set']" min="1" max="20" placeholder="套数">
      </div>
      <div class="form-group col-md-7">
        <label>备注</label>
        <input type="text" class="form-control" name="remark" v-model="activeOrderProduct['remark']" placeholder="添加备注" v-if="activeOrderProduct">
        <input type="text" class="form-control" name="remark" v-model="orderProduct['product']['remark']" placeholder="添加备注" v-if="!activeOrderProduct">
      </div>
    </div>
    <div class="row">
      <div class="col-9">
        <table class="table-center table-form table table-bordered table-responsive text-nowrap" id="dismantleFTable" v-if="!loading && activeOrderProduct">
          <thead>
          <tr>
            <th class="td-xs" >#</th>
            <th class="d-none">服务名称#</th>
            <th >服务名称</th>
            <th class="td-md">规格</th>
            <th class="td-sm" >单位</th>
            <th class="td-md">备注</th>
            <th class="td-sm" >数量</th>
            <th class="td-xs" >份数</th>
            <th class="d-none">Index</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(item, key, index) in activeOrderProduct['order_product_board_plate']" :key="index">
            <td @dblclick="removeLine($event.target)" :data-index="key">{{ key + 1 }}</td>
            <td class="d-none"><input class="form-control input-sm" name="goods_speci_id" type="hidden" v-model="item['goods_speci_id']"/></td>
            <td><input class="form-control input-sm" name="server" type="text" v-model="item['server']" /></td>
            <td><input class="form-control input-sm" name="speci" type="text" v-model="item['speci']" /></td>
            <td><input class="form-control input-sm" name="unit" type="text" v-model="item['unit']" /></td>
            <td><input class="form-control input-sm" name="remark" type="text" v-model="item['remark']" autocomplete="off" /></td>
            <td><input class="form-control input-sm" name="amount" type="text" v-model="item['amount']"/></td>
            <td><input class="form-control input-sm" name="copy" type="number" value="0"/></td>
            <td class="d-none"><input class="form-control input-sm" name="index" type="number" :value="key"/></td>
          </tr>
          <tr>
            <td>{{ maxNum }}</td>
            <td class="d-none"><input class="form-control input-sm" name="goods_speci_id" type="hidden"/></td>
            <td><input class="form-control input-sm" name="server" type="text" /></td>
            <td><input class="form-control input-sm" name="speci" type="text" /></td>
            <td><input class="form-control input-sm" name="unit" type="text" readonly /></td>
            <td><input class="form-control input-sm" name="remark" type="text" value=""/></td>
            <td><input class="form-control input-sm" name="amount" type="number" value=""/></td>
            <td><input class="form-control input-sm" name="copy" type="number" value="0"/></td>
            <td class="d-none"><input class="form-control input-sm" name="index" type="number" value=""/></td>
          </tr>
          </tbody>
        </table>
      </div>
      <div class="col-3">
        <table class="table-center table-form table table-bordered table-responsive text-nowrap" v-if="!loading && activeOrderProduct && serverData && serverData.num">
          <thead>
          <tr>
            <th><input class="form-control input-sm" name="select_server" type="text"  v-model="select_server" placeholder="搜索服务"/></th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(item, key, index) in serverData.content" :key="index">
            <td :data-index="key" v-if="quickSearch(item.name)" @dblclick="changeServer($event.target)">{{ item.name + '-' + item.speci + '-' + item.unit }}</td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="col-12 mt-2 text-center" v-if="loading"><i class="fa fa-spinner fa-spin fa-5x"></i></div>
  </div>
</template>

<script>
import { dismantleMixins } from './mixins'
import $ from 'jquery'
import DismantleServer from './DismantleServer'
export default {
  mixins: [ dismantleMixins ],
  name: 'OrderDismantleServer',
  props: {
    dismantleUrl: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      demoData: {
        goods_speci_id: '',
        server: '',
        speci: '',
        unit: '',
        remark: '',
        amount: ''
      },
      loading: false,
      maxNum: 1,
      reDismantleUrl: '/order/dismantle/re_dismantle',
      serverUrl: '/product/goods_speci/server',
      select_server: '',
      amountFocus: false
    }
  },
  computed: {
    orderProduct: {
      get () {
        return this.$store.getters.getDismantleData({ uri: this.dismantleUrl, child: 'F' })
      },
      set (Value) {
      }
    },
    orderInfo: {
      get () {
        return this.$store.getters.getDismantleData({ uri: this.dismantleUrl, child: 'order_info' })
      },
      set (Value) {
      }
    },
    activeOrderProduct: {
      get () {
        return this.$store.getters.getActiveDismantleData({ uri: this.dismantleUrl, child: 'F' })
      }
    },
    serverData: {
      get () {
        return this.$store.getters.getSourceData({ uri: this.serverUrl })
      }
    }
  },
  created () {
    this.loadPlateData()
  },
  mounted () {
    this.highlightTr('dismantleFTable')
    this.addLine('dismantleFTable')
    this.handleDirection('dismantleFTable')
    if (this.amountFocus) {
      this.amountFocus = false
      $('#dismantleFTable').find('tbody tr').eq(this.activeOrderProduct['order_product_board_plate'].length - 1).find('input[name="amount"]').focus()
    }
    if (this.activeOrderProduct && this.activeOrderProduct['order_product_board_plate'] === undefined) {
      this.fetchData()
    }
  },
  watch: {
    reload: {
      handler: function (to, from) {
        this.fetchData()
      }
    },
    'activeOrderProduct.v': {
      handler: function (to, from) {
        if (to !== undefined && to !== from) {
          if (this.activeOrderProduct['order_product_board_plate'] === undefined) {
            this.fetchData()
          }
        }
      },
      deep: true
    } /* activeOrderProduct: {
      handler: function (to, from) {
        if (to !== undefined) {
          if (to['order_product_board_plate'] === undefined) {
            this.fetchData()
          }
        }
      },
      deep: true
    } */
  },
  updated () {
    this.highlightTr('dismantleFTable')
    this.addLine('dismantleFTable')
    this.copy('dismantleFTable')
    this.handleDirection('dismantleFTable')
    this.disposeAppendLine('dismantleFTable')
    if (this.amountFocus) {
      this.amountFocus = false
      $('#dismantleFTable').find('tbody tr').eq(this.activeOrderProduct['order_product_board_plate'].length - 1).find('input[name="amount"]').focus()
    }
  },
  methods: {
    quickSearch (item) { // 当输入关键字时快速搜索
      if (this.select_server && this.select_server.length > 0) {
        if (item.toString().search(this.select_server) >= 0) {
          return true
        }
        return false
      } else {
        return true
      }
    },
    changeServer (e) {
      this.newLine()
      let Data = this.activeOrderProduct['order_product_board_plate'][this.activeOrderProduct['order_product_board_plate'].length - 1]
      let serverData = this.serverData.content[$(e).data('index')]
      Data['server'] = serverData.name
      Data['speci'] = serverData.speci
      Data['unit'] = serverData.unit
      Data['goods_speci_id'] = serverData.v
      this.amountFocus = true
    },
    async fetchData () { // 获取板块数据
      this.loading = true
      let self = this
      this.$store.dispatch('FETCH_DISMANTLE_ORDER_PRODUCT_BOARD_PLATE', {
        url: '/order/order_product_server/read',
        configs: {
          params: { order_product_id: this.orderInfo['order_product_id'] }
        },
        target: this.activeOrderProduct
      }).then(res => {
        self.loading = false
      })
    },
    loadPlateData () {
      if ((typeof this.serverData === 'undefined' || JSON.stringify(this.serverData) === '{}')) {
        this.$store.dispatch('FETCH_SOURCE_DATA', {
          url: this.serverUrl,
          configs: {},
          target: this.serverUrl
        })
      }
    }
  },
  components: {
    DismantleServer
  }
}
</script>
