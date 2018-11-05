<template>
  <div class="tab-pane fade" id="dismantleK" role="tabpanel" aria-labelledby="door">
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
      <board :board="board" v-model="board" @focusout-board="changeBoard($event)"></board>
      <div class="form-group col-md-3">
        <label>备注</label>
        <input type="text" class="form-control" name="remark" v-model="activeOrderProduct['remark']" placeholder="添加备注" v-if="activeOrderProduct">
        <input type="text" class="form-control" name="remark" v-model="orderProduct['product']['remark']" placeholder="添加备注" v-if="!activeOrderProduct">
      </div>
    </div>
    <table class="table-center table-form table table-bordered table-responsive text-nowrap" id="dismantleKTable" v-if="!loading && activeOrderProduct">
      <thead>
      <tr>
        <th class="td-xs" >#</th>
        <th >木框门名称</th>
        <th >门芯</th>
        <th >板材</th>
        <th class="td-sm" >宽</th>
        <th class="td-sm" >长</th>
        <th class="td-sm" >面积</th>
        <th >中横</th>
        <th >铰链孔</th>
        <th class="td-md">备注</th>
        <th class="td-xs" >复制</th>
        <th class="td-xs" >块数</th>
        <th class="d-none">Index</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(item, key, index) in activeOrderProduct['order_product_board_plate']" :key="index">
        <td>{{ key + 1 }}</td>
        <td is="wood-plate" :plate="item['wood_name']" v-model="item['wood_name']"></td>
        <td><input class="form-control input-sm" name="core" type="text" v-model="item['core']"/></td>
        <td><input class="form-control input-sm" name="good" type="text" v-model="item['board']"/></td>
        <td><input class="form-control input-sm" name="width" type="text" v-model="item['width']" @change="computeArea($event)" /></td>
        <td><input class="form-control input-sm" name="length" type="text" v-model="item['length']" @change="computeArea($event)"/></td>
        <td><input class="form-control input-sm" name="area" type="text" value="" readonly="readonly" v-model="item['area']"/></td>
        <td is="wood-center" :center="item['center']" v-model="item['center']"></td>
        <td is="hinge-punch" :punch="item['punch']" v-model="item['punch']"></td>
        <td><input class="form-control input-sm" name="remark" type="text" v-model="item['remark']" /></td>
        <td><input class="form-control input-sm" name="amount" type="text" v-model="item['amount']"/></td>
        <td><input class="form-control input-sm" name="copy" type="number" value="0"/></td>
        <td class="d-none"><input class="form-control input-sm" name="index" type="number" :value="key"/></td>
      </tr>
      <tr>
        <td>{{ maxNum }}</td>
        <td><input class="form-control input-sm" name="plate_name" type="text" /></td>
        <td><input class="form-control input-sm" name="core" type="text" /></td>
        <td><input class="form-control input-sm" name="good" type="text" /></td>
        <td><input class="form-control input-sm" name="length" type="text" /></td>
        <td><input class="form-control input-sm" name="width" type="text" /></td>
        <td><input class="form-control input-sm" name="area" type="text" value="" readonly="readonly"/></td>
        <td><select class="form-control input-sm" name="center">
          <option value="">--请选择--</option>
        </select></td>
        <td><select class="form-control input-sm" name="punch">
          <option value="">--请选择--</option>
        </select></td>
        <td><input class="form-control input-sm" name="remark" type="text" value=""/></td>
        <td><input class="form-control input-sm" name="amount" type="number" value="1"/></td>
        <td><input class="form-control input-sm" name="copy" type="number" value="0"/></td>
        <td class="d-none"><input class="form-control input-sm" name="index" type="number" value=""/></td>
      </tr>
      </tbody>
    </table>
    <div class="col-12 mt-2 text-center" v-if="loading"><i class="fa fa-spinner fa-spin fa-5x"></i></div>
  </div>
</template>

<script>
import { dismantleMixins } from './mixins'
import Board from './Board'
import HingePunch from './HingePunch'
import WoodPlate from './WoodPlate'
import WoodCenter from './WoodCenter'
import DismantleRemark from './DismantleRemark'
let self
export default {
  mixins: [ dismantleMixins ],
  name: 'OrderDismantleWood',
  props: {
    dismantleUrl: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      board: '',
      demoData: {
        wood_name: '',
        core: '',
        board: '',
        length: '',
        width: '',
        area: '',
        center: '',
        punch: '',
        remark: '',
        amount: 1
      },
      loading: false,
      maxNum: 1,
      reDismantleUrl: '/order/dismantle/re_dismantle'
    }
  },
  computed: {
    orderProduct: {
      get () {
        return this.$store.getters.getDismantleData({ uri: this.dismantleUrl, child: 'K' })
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
        return this.$store.getters.getActiveDismantleData({ uri: this.dismantleUrl, child: 'K' })
      }
    }
  },
  created () {
    self = this
  },
  mounted () {
    this.highlightTr('dismantleKTable')
    this.addLine('dismantleKTable')
    this.handleDirection('dismantleKTable')
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
    } /*
    activeOrderProduct: {
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
    this.highlightTr('dismantleKTable')
    this.addLine('dismantleKTable')
    this.copy('dismantleKTable')
    this.handleDirection('dismantleKTable')
    this.disposeAppendLine('dismantleKTable')
  },
  methods: {
    changeBoard (board) { // 更换板材颜色
      self.demoData.board = board
      self.activeOrderProduct['order_product_board_plate'] && self.activeOrderProduct['order_product_board_plate'].forEach(__ => {
        __.board = board
      })
    },
    async fetchData () { // 获取板块数据
      this.loading = true
      let self = this
      this.$store.dispatch('FETCH_DISMANTLE_ORDER_PRODUCT_BOARD_PLATE', {
        url: '/order/order_product_board_wood/read',
        configs: {
          params: { order_product_id: this.orderInfo['order_product_id'] }
        },
        target: this.activeOrderProduct
      }).then(res => {
        self.loading = false
      })
    }
  },
  components: {
    Board,
    HingePunch,
    WoodCenter,
    WoodPlate,
    DismantleRemark
  }
}
</script>
