<template>
  <div class="tab-pane fade" id="dismantleG" role="tabpanel" aria-labelledby="door">
    <div class="form-row" v-if="orderProduct">
      <div class="form-group col-md-2">
        <label>选择订单</label>
        <select class="form-control" name="order_product_id" v-model="orderInfo['order_product_id']">
          <option value="0">请选择订单</option>
          <option v-for="(item, key, index) in orderProduct['order_product']" :key="index" :value="item.v">{{ item.num }}-{{ item.product }}-{{ item.status_label }}</option>
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
        <table class="table-center table-form table table-bordered table-responsive text-nowrap" id="dismantleGTable" v-if="!loading && activeOrderProduct">
          <thead>
          <tr>
            <th class="td-xs" >#</th>
            <th class="d-none">外购商品名称#</th>
            <th >外购商品名称</th>
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
            <td><input class="form-control input-sm" name="other" type="text" v-model="item['other']"/></td>
            <td><input class="form-control input-sm" name="speci" type="text" v-model="item['speci']"/></td>
            <td><input class="form-control input-sm" name="unit" type="text" v-model="item['unit']" /></td>
            <td><input class="form-control input-sm" name="remark" type="text" v-model="item['remark']" /></td>
            <td><input class="form-control input-sm" name="amount" type="text" v-model="item['amount']"/></td>
            <td><input class="form-control input-sm" name="copy" type="number" value="0"/></td>
            <td class="d-none"><input class="form-control input-sm" name="index" type="number" :value="key"/></td>
          </tr>
          <tr>
            <td>{{ maxNum }}</td>
            <td class="d-none"><input class="form-control input-sm" name="goods_speci_id" type="hidden"/></td>
            <td><input class="form-control input-sm" name="other" type="text" /></td>
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
        <table class="table-center table-form table table-bordered table-responsive text-nowrap" v-if="!loading && activeOrderProduct && otherData && otherData.num">
          <thead>
            <tr>
              <th><input class="form-control input-sm" name="select_other" type="text"  v-model="select_other" placeholder="搜索外购"/></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, key, index) in otherData.content" :key="index">
              <td :data-index="key" v-if="quickSearch(item.name)" @dblclick="changeOther($event.target)">{{ item.name + '-' + item.speci + '-' + item.unit }}</td>
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
import DismantleOther from './DismantleOther'
export default {
  mixins: [ dismantleMixins ],
  name: 'OrderDismantleOther',
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
        other: '',
        speci: '',
        unit: '',
        remark: '',
        amount: ''
      },
      loading: false,
      maxNum: 1,
      reDismantleUrl: '/order/dismantle/re_dismantle',
      otherUrl: '/product/goods_speci/other',
      select_other: '',
      amountFocus: false
    }
  },
  computed: {
    orderProduct: {
      get () {
        return this.$store.getters.getDismantleData({ uri: this.dismantleUrl, child: 'G' })
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
        return this.$store.getters.getActiveDismantleData({ uri: this.dismantleUrl, child: 'G' })
      }
    },
    otherData: {
      get () {
        return this.$store.getters.getSourceData({ uri: this.otherUrl })
      }
    }
  },
  created () {
    this.loadPlateData()
  },
  mounted () {
    this.highlightTr('dismantleGTable')
    this.addLine('dismantleGTable')
    this.handleDirection('dismantleGTable')
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
    }/* activeOrderProduct: {
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
    this.highlightTr('dismantleGTable')
    this.addLine('dismantleGTable')
    this.copy('dismantleGTable')
    this.handleDirection('dismantleGTable')
    this.disposeAppendLine('dismantleGTable')
    if (this.amountFocus) {
      this.amountFocus = false
      $('#dismantleGTable').find('tbody tr').eq(this.activeOrderProduct['order_product_board_plate'].length - 1).find('input[name="amount"]').focus()
    }
  },
  methods: {
    quickSearch (item) { // 当输入关键字时快速搜索
      if (this.select_other && this.select_other.length > 0) {
        if (item.toString().search(this.select_other) >= 0) {
          return true
        }
        return false
      } else {
        return true
      }
    },
    changeOther (e) {
      this.newLine()
      let Data = this.activeOrderProduct['order_product_board_plate'][this.activeOrderProduct['order_product_board_plate'].length - 1]
      let otherData = this.otherData.content[$(e).data('index')]
      Data['other'] = otherData.name
      Data['speci'] = otherData.speci
      Data['unit'] = otherData.unit
      Data['goods_speci_id'] = otherData.v
      this.amountFocus = true
    },
    async fetchData () { // 获取板块数据
      this.loading = true
      let self = this
      this.$store.dispatch('FETCH_DISMANTLE_ORDER_PRODUCT_BOARD_PLATE', {
        url: '/order/order_product_other/read',
        configs: {
          params: { order_product_id: this.orderInfo['order_product_id'] }
        },
        target: this.activeOrderProduct
      }).then(res => {
        self.loading = false
      })
    },
    loadPlateData () {
      if ((typeof this.otherData === 'undefined' || JSON.stringify(this.otherData) === '{}')) {
        this.$store.dispatch('FETCH_SOURCE_DATA', {
          url: this.otherUrl,
          configs: {},
          target: this.otherUrl
        })
      }
    }
  },
  components: {
    DismantleOther
  }
}
</script>
