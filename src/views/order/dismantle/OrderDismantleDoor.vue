<template>
  <div class="tab-pane fade" id="dismantleM" role="tabpanel" aria-labelledby="door">
    <div class="form-row" v-if="orderProduct">
      <input type="hidden" name="order_product_door_id" v-model="activeOrderProduct['struct']['v']" v-if="activeOrderProduct && activeOrderProduct['struct']" />
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
      <board :board="activeOrderProduct['struct']['board']" v-model="activeOrderProduct['struct']['board']" @focusout-board="changeBoard($event)" v-if="activeOrderProduct && activeOrderProduct['struct']" ></board>
      <door-edge :edge="activeOrderProduct['struct']['edge']" v-model="activeOrderProduct['struct']['edge']" v-if="activeOrderProduct && activeOrderProduct['struct']"></door-edge>
      <div class="form-group col-md-3">
        <label>备注</label>
        <input type="text" class="form-control" name="remark" v-model="activeOrderProduct['remark']" placeholder="添加备注" v-if="activeOrderProduct">
        <input type="text" class="form-control" name="remark" v-model="orderProduct['product']['remark']" placeholder="添加备注" v-if="!activeOrderProduct">
      </div>
    </div>
    <table class="table-center table-form table table-bordered table-responsive text-nowrap" id="dismantleMTable" v-if="!loading && activeOrderProduct">
      <thead>
      <tr>
        <th class="td-xs" >#</th>
        <th >板材</th>
        <th class="td-sm" >宽</th>
        <th class="td-sm" >高</th>
        <th class="td-sm" >面积</th>
        <th >铰链孔</th>
        <th >封边拉手</th>
        <th class="td-xs" >开孔</th>
        <th class="td-sm" >隐形拉手</th>
        <th class="td-md">备注</th>
        <th class="td-xs" >复制</th>
        <th class="td-xs" >块数</th>
        <th class="d-none">Index</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(item, key, index) in activeOrderProduct['order_product_board_plate']" :key="index">
        <td>{{ key + 1 }}</td>
        <td><input class="form-control input-sm" name="good" type="text" v-model="item['board']"/></td>
        <td><input class="form-control input-sm" name="width" type="text" v-model="item['width']" @change="computeArea($event, 'M')" /></td>
        <td><input class="form-control input-sm" name="length" type="text" v-model="item['length']" @change="computeArea($event, 'M')"/></td>
        <td><input class="form-control input-sm" name="area" type="text" value="" readonly="readonly" v-model="item['area']"/></td>
        <td is="hinge-punch" :punch="item['punch']" v-model="item['punch']"></td>
        <td is="handle-edge" :handle="item['handle']" v-model="item['handle']" @focusout-handle="changeHandle($event)"></td>
        <td><input class="form-control input-sm" name="open_hole" type="number" v-model="item['open_hole']" /></td>
        <td><input class="form-control input-sm" name="invisibility" type="number" v-model="item['invisibility']" /></td>
        <td><input class="form-control input-sm" name="remark" type="text" v-model="item['remark']" /></td>
        <td><input class="form-control input-sm" name="amount" type="text" v-model="item['amount']"/></td>
        <td><input class="form-control input-sm" name="copy" type="number" value="0"/></td>
        <td class="d-none"><input class="form-control input-sm" name="index" type="number" :value="key"/></td>
      </tr>
      <tr>
        <td>{{ maxNum }}</td>
        <td><input class="form-control input-sm" name="good" type="text" /></td>
        <td><input class="form-control input-sm" name="length" type="text" /></td>
        <td><input class="form-control input-sm" name="width" type="text" /></td>
        <td><input class="form-control input-sm" name="area" type="text" value="" readonly="readonly"/></td>
        <td><select class="form-control input-sm" name="punch">
          <option value="">--请选择--</option>
        </select></td>
        <td><select class="form-control input-sm" name="handle">
          <option value="">--请选择--</option>
        </select></td>
        <td><input class="form-control input-sm" name="open_hole" type="text" /></td>
        <td><input class="form-control input-sm" name="invisibility" type="text" /></td>
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
import $ from 'jquery'
import Board from './Board'
import DoorEdge from './DoorEdge'
import HingePunch from './HingePunch'
import HandleEdge from './HandleEdge'
import DismantleRemark from './DismantleRemark'
let self
export default {
  mixins: [ dismantleMixins ],
  name: 'OrderDismantleDoor',
  data () {
    return {
      demoData: {
        board: '',
        length: '',
        width: '',
        area: '',
        handle: '',
        open_hole: '',
        punch: '',
        invisibility: '',
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
        return this.$store.getters.getDismantleData({ uri: this.dismantleUrl, child: 'M' })
      },
      set (Value) {
      }
    },
    activeOrderProduct: {
      get () {
        return this.$store.getters.getActiveDismantleData({ uri: this.dismantleUrl, child: 'M' })
      }
    }
  },
  created () {
    self = this
  },
  mounted () {
    this.highlightTr('dismantleMTable')
    this.addLine('dismantleMTable')
    if (this.activeOrderProduct) {
      if (this.activeOrderProduct['struct'] === undefined) {
        this.fetchStruct()
      }
      if (this.activeOrderProduct['order_product_board_plate'] === undefined) {
        this.fetchData()
      }
    }
  },
  watch: {
    'activeOrderProduct.v': {
      handler: function (to, from) {
        if (to !== undefined && to !== from) {
          if (this.activeOrderProduct['struct'] === undefined) {
            this.fetchStruct()
          }
          if (this.activeOrderProduct['order_product_board_plate'] === undefined) {
            this.fetchData()
          }
        }
      },
      deep: true
    }
  },
  updated () {
    this.highlightTr('dismantleMTable')
    this.addLine('dismantleMTable')
    this.copy('dismantleMTable')
    this.handleDirection('dismantleMTable')
    this.disposeAppendLine('dismantleMTable')
  },
  methods: {
    changeBoard (board) { // 更换板材颜色
      self.activeOrderProduct['order_product_board_plate'] && self.activeOrderProduct['order_product_board_plate'].forEach(__ => {
        __.board = board
      })
      self.demoData.board = board
    },
    changeHandle (e) {
      let Data = this.activeOrderProduct['order_product_board_plate'][$(e).parents('tr').eq(0).find('input[name="index"]').val()]
      let OpenHole = $(e).children('option:selected').data('open-hole')
      let Invisibility = $(e).children('option:selected').data('invisibility')
      if (OpenHole) {
        Data['open_hole'] = 1
      } else {
        Data['open_hole'] = 0
      }
      if (Invisibility) {
        Data['invisibility'] = parseInt(Data['width']) / 1000
      } else {
        Data['invisibility'] = 0
      }
    },
    fetchStruct () { // 获取柜体结构
      this.$store.dispatch('FETCH_DOOR_STRUCT', {
        configs: {
          params: { order_product_id: this.orderInfo['order_product_id'] }
        },
        target: this.activeOrderProduct
      })
    },
    async fetchData () { // 获取板块数据
      this.loading = true
      let self = this
      this.$store.dispatch('FETCH_DISMANTLE_ORDER_PRODUCT_BOARD_PLATE', {
        url: '/order/order_product_board_door/read',
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
    DoorEdge,
    HingePunch,
    HandleEdge,
    DismantleRemark
  }
}
</script>
