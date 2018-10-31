<template>
  <div class="tab-pane fade" id="postSaleP" role="tabpanel" aria-labelledby="fitting">
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
        <input type="text" class="form-control" readonly="readonly" name="product" v-model="activeOrderProduct['product']" placeholder="请添加产品名称" v-if="activeOrderProduct">
        <input type="text" class="form-control" name="product" v-model="orderProduct['product']['name']" placeholder="请添加产品名称" v-if="!activeOrderProduct">
      </div>
      <div class="form-group col-md-1">
        <label>套数</label>
        <input type="number" class="form-control" readonly="readonly" v-model="orderProduct['product']['set']" min="1" max="20" placeholder="套数">
      </div>
      <div class="form-group col-md-7">
        <label>备注</label>
        <input type="text" class="form-control" readonly="readonly" name="remark" v-model="activeOrderProduct['remark']" placeholder="添加备注" v-if="activeOrderProduct">
        <input type="text" class="form-control" name="remark" v-model="orderProduct['product']['remark']" placeholder="添加备注" v-if="!activeOrderProduct">
      </div>
    </div>
    <div class="row">
      <div class="col-9">
        <table class="table-center table-form table table-bordered table-responsive text-nowrap" id="postSalePTable" v-if="!loading && activeOrderProduct">
          <thead>
          <tr>
            <th class="td-xs" >#</th>
            <th class="d-none">配件名称#</th>
            <th >配件名称</th>
            <th class="td-md">规格</th>
            <th class="td-sm" >单位</th>
            <th class="td-md">备注</th>
            <th class="td-sm" >数量</th>
            <th class="td-sm" >单价</th>
            <th class="td-xs" >份数</th>
            <th class="d-none">Index</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(item, key, index) in activeOrderProduct['order_product_board_plate']" :key="index">
            <td @dblclick="removeLine($event.target)" :data-index="key">{{ key + 1 }}</td>
            <td class="d-none"><input class="form-control input-sm" name="goods_speci_id" type="hidden" v-model="item['goods_speci_id']"/></td>
            <td><input class="form-control input-sm" name="fitting" type="text" v-model="item['fitting']" /></td>
            <td><input class="form-control input-sm" name="speci" type="text" v-model="item['speci']"/></td>
            <td><input class="form-control input-sm" name="unit" type="text" v-model="item['unit']" readonly /></td>
            <td><input class="form-control input-sm" name="remark" type="text" v-model="item['remark']" /></td>
            <td><input class="form-control input-sm" name="amount" type="number" v-model="item['amount']"/></td>
            <td><input class="form-control input-sm" name="unit_price" type="number" v-model="item['unit_price']"/></td>
            <td><input class="form-control input-sm" name="copy" type="number" value="0"/></td>
            <td class="d-none"><input class="form-control input-sm" name="index" type="number" :value="key"/></td>
          </tr>
          <tr>
            <td>{{ maxNum }}</td>
            <td class="d-none"><input class="form-control input-sm" name="goods_speci_id" type="hidden"/></td>
            <td><input class="form-control input-sm" name="fitting" type="text" /></td>
            <td><input class="form-control input-sm" name="speci" type="text" readonly /></td>
            <td><input class="form-control input-sm" name="unit" type="text" readonly /></td>
            <td><input class="form-control input-sm" name="remark" type="text" value=""/></td>
            <td><input class="form-control input-sm" name="amount" type="number" value=""/></td>
            <td><input class="form-control input-sm" name="unit_price" type="number" value=""/></td>
            <td><input class="form-control input-sm" name="copy" type="number" value="0"/></td>
            <td class="d-none"><input class="form-control input-sm" name="index" type="number" value=""/></td>
          </tr>
          </tbody>
        </table>
      </div>
      <div class="col-3">
        <table class="table-center table-form table table-bordered table-responsive text-nowrap" v-if="!loading && activeOrderProduct && fittingData && fittingData.num">
          <thead>
            <tr>
              <th><input class="form-control input-sm" name="select_fitting" type="text"  v-model="select_fitting" placeholder="搜索配件"/></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, key, index) in fittingData.content" :key="index">
              <td :data-index="key" v-if="quickSearch(item.name)" @dblclick="changeFitting($event.target)">{{ item.name + '-' + item.speci + '-' + item.unit }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="col-12 mt-2 text-center" v-if="loading"><i class="fa fa-spinner fa-spin fa-5x"></i></div>
  </div>
</template>

<script>
import { postSaleMixins } from './mixins'
import $ from 'jquery'
export default {
  mixins: [ postSaleMixins ],
  name: 'PostSaleFitting',
  props: {
    postSaleUrl: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      demoData: {
        goods_speci_id: '',
        fitting: '',
        speci: '',
        unit: '',
        remark: '',
        amount: '',
        unit_price: ''
      },
      loading: false,
      maxNum: 1,
      fittingUrl: '/product/goods_speci/fitting',
      select_fitting: '',
      amountFocus: false
    }
  },
  computed: {
    orderProduct: {
      get () {
        return this.$store.getters.getDismantleData({ uri: this.postSaleUrl, child: 'P' })
      },
      set (Value) {
      }
    },
    orderInfo: {
      get () {
        return this.$store.getters.getDismantleData({ uri: this.postSaleUrl, child: 'order_info' })
      },
      set (Value) {
      }
    },
    activeOrderProduct: {
      get () {
        return this.$store.getters.getActiveDismantleData({ uri: this.postSaleUrl, child: 'P' })
      }
    },
    fittingData: {
      get () {
        return this.$store.getters.getSourceData({ uri: this.fittingUrl })
      }
    }
  },
  created () {
    this.loadPlateData()
  },
  mounted () {
    this.highlightTr('postSalePTable')
    this.addLine('postSalePTable')
    this.handleDirection('postSalePTable')
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
    }
  },
  updated () {
    this.highlightTr('postSalePTable')
    this.addLine('postSalePTable')
    this.copy('postSalePTable')
    this.handleDirection('postSalePTable')
    if (this.amountFocus) {
      this.amountFocus = false
      $('#postSalePTable').find('tbody tr').eq(this.activeOrderProduct['order_product_board_plate'].length - 1).find('input[name="amount"]').focus()
    }
  },
  methods: {
    quickSearch (item) { // 当输入关键字时快速搜索
      if (this.select_fitting && this.select_fitting.length > 0) {
        if (item.toString().search(this.select_fitting) >= 0) {
          return true
        }
        return false
      } else {
        return true
      }
    },
    changeFitting (e) {
      this.newLine()
      let Data = this.activeOrderProduct['order_product_board_plate'][this.activeOrderProduct['order_product_board_plate'].length - 1]
      let fittingData = this.fittingData.content[$(e).data('index')]
      Data['fitting'] = fittingData.name
      Data['speci'] = fittingData.speci
      Data['unit'] = fittingData.unit
      Data['unit_price'] = fittingData.saler_unit_price
      Data['goods_speci_id'] = fittingData.v
      this.amountFocus = true
    },
    async fetchData () { // 获取板块数据
      this.loading = true
      let self = this
      this.$store.dispatch('FETCH_DISMANTLE_ORDER_PRODUCT_BOARD_PLATE', {
        url: '/order/order_product_fitting/read',
        configs: {
          params: { order_product_id: this.orderInfo['order_product_id'] }
        },
        target: this.activeOrderProduct
      }).then(res => {
        self.loading = false
      })
    },
    loadPlateData () {
      if ((typeof this.fittingData === 'undefined' || JSON.stringify(this.fittingData) === '{}')) {
        this.$store.dispatch('FETCH_SOURCE_DATA', {
          url: this.fittingUrl,
          configs: {},
          target: this.fittingUrl
        })
      }
    }
  },
  components: {
  }
}
</script>
