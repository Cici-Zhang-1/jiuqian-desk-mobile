<template>
  <div class="tab-pane fade" id="dismantleW" role="tabpanel" aria-labelledby="cabinet">
    <div class="form-row" v-if="orderProduct">
      <input type="hidden" name="order_product_cabinet_struct_id" v-model="activeOrderProduct['struct']['v']" v-if="activeOrderProduct && activeOrderProduct['struct']" />
      <div class="form-group col-md-2">
        <label>选择订单</label>
        <select class="form-control" name="order_product_id" v-model="orderInfo['order_product_id']" id="orderId">
          <option value="0">请选择订单</option>
          <option v-for="(item, key, index) in orderProduct['order_product']" :key="index" :value="item.v" v-if="orderProduct['order_product']">{{ item.num }}-{{ item.product }}-{{ item.status_label }}</option>
        </select>
      </div>
      <div class="form-group col-md-1">
        <label>产品名称</label>
        <input type="text" class="form-control" name="product" v-model="activeOrderProduct['product']" placeholder="请添加产品名称" v-if="activeOrderProduct">
        <input type="text" class="form-control" name="product" v-model="orderProduct['product']['name']" placeholder="请添加产品名称" v-if="!activeOrderProduct">
      </div>
      <div class="form-group col-md-1">
        <label for="set">套数</label>
        <input type="number" class="form-control" id="set" v-model="orderProduct['product']['set']" min="1" max="20" placeholder="套数">
      </div>
      <board :board="activeOrderProduct['struct']['board']" v-model="activeOrderProduct['struct']['board']" @focusout-board="changeBoard($event)" v-if="activeOrderProduct && activeOrderProduct['struct']" ></board>
      <thick :thick="changeLine" v-model="changeLine" v-if="activeOrderProduct"></thick>
      <dismantle-facefb :facefb="activeOrderProduct['struct']['facefb']" v-model="activeOrderProduct['struct']['facefb']" v-if="activeOrderProduct && activeOrderProduct['struct']"></dismantle-facefb>
      <div class="form-group col-md-2">
        <label>备注</label>
        <input type="text" class="form-control" name="remark" v-model="activeOrderProduct['remark']" placeholder="添加备注" v-if="activeOrderProduct">
        <input type="text" class="form-control" name="remark" v-model="orderProduct['product']['remark']" placeholder="添加备注" v-if="!activeOrderProduct">
      </div>
      <div class="form-group col-md-2" v-if="activeOrderProduct">
        <label>设计图集</label>
        <input type="text" class="form-control" name="design_atlas" v-model="activeOrderProduct['design_atlas']" readonly placeholder="设计图集">
      </div>
    </div>
    <table class="table-center table-form table table-bordered table-responsive text-nowrap" id="dismantleWTable" v-if="!loading && activeOrderProduct">
      <thead>
        <tr>
          <th class="td-xs" >#</th>
          <th class="td-md" >板块名称</th>
          <th class="td-md">板材</th>
          <th class="td-sm" >长</th>
          <th class="td-sm" >宽</th>
          <th class="td-sm" >面积</th>
          <th >封边</th>
          <th >开槽</th>
          <th >打孔</th>
          <th >尺判</th>
          <th class="td-md">备注</th>
          <th class="td-xs" >复制</th>
          <th class="td-xs" >块数</th>
          <th >Qrcode</th>
          <th class="d-none">柜体名称</th>
          <th class="d-none">柜体编号</th>
          <th class="d-none">板块编号</th>
          <th class="d-none">BD文件</th>
          <th class="d-none">Index</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, key, index) in activeOrderProduct['order_product_board_plate']" :key="index">
          <td>{{ key + 1 }}</td>
          <td is="dismantle-plate" :plate="item['plate_name']" v-model="item['plate_name']"></td>
          <td><input class="form-control input-sm" name="good" type="text" v-model="item['board']"/></td>
          <td><input class="form-control input-sm" name="length" type="text" v-model="item['length']" @change="computeArea($event)"/></td>
          <td><input class="form-control input-sm" name="width" type="text" v-model="item['width']" @change="computeArea($event)" /></td>
          <td><input class="form-control input-sm" name="area" type="text" value="" readonly="readonly" v-model="item['area']"/></td>
          <td is="dismantle-edge" :edge="item['edge']" v-model="item['edge']"></td>
          <td is="dismantle-slot" :slots="item['slot']" v-model="item['slot']"></td>
          <td is="dismantle-punch" :punch="item['punch']" v-model="item['punch']"></td>
          <td><input class="form-control input-sm" name="decide_size" type="text" v-model="item['decide_size']" /></td>
          <td is="dismantle-remark" :remark="item['remark']" v-model="item['remark']"></td>
          <td><input class="form-control input-sm" name="amount" type="number" v-model="item['amount']"/></td>
          <td><input class="form-control input-sm" name="copy" type="number" value="0"/></td>
          <td><input class="form-control input-sm" name="qrcode" type="text" v-model="item['qrcode']" /></td>
          <td class="d-none"><input class="form-control input-sm" name="cubicle_name" type="text" v-model="item['cubicle_name']"/></td>
          <td class="d-none"><input class="form-control input-sm" name="cubicle_num" type="text" v-model="item['cubicle_num']"/></td>
          <td class="d-none"><input class="form-control input-sm" name="plate_num" type="text" v-model="item['plate_num']"/></td>
          <td class="d-none"><input class="form-control input-sm" name="bd_file" type="text" v-model="item['bd_file']"/></td>
          <td class="d-none"><input class="form-control input-sm" name="index" type="number" :value="key"/></td>
        </tr>
        <tr>
          <td>{{ maxNum }}</td>
          <td><input class="form-control input-sm" name="plate_name" type="text"/></td>
          <td><input class="form-control input-sm" name="good" type="text" /></td>
          <td><input class="form-control input-sm" name="length" type="text" /></td>
          <td><input class="form-control input-sm" name="width" type="text" /></td>
          <td><input class="form-control input-sm" name="area" type="text" value="" readonly="readonly"/></td>
          <td><select class="form-control input-sm" name="edge">
            <option value="">--请选择--</option>
          </select></td>
          <td><select class="form-control input-sm" name="slot">
            <option value="">--请选择--</option>
          </select></td>
          <td><select class="form-control input-sm" name="punch">
            <option value="">--请选择--</option>
          </select></td>
          <td><input class="form-control input-sm" name="decide_size" type="text" /></td>
          <td><input class="form-control input-sm" name="remark" type="text" value=""/></td>
          <td><input class="form-control input-sm" name="num" type="number" value="1"/></td>
          <td><input class="form-control input-sm" name="copy" type="number" value="0"/></td>
          <td><input class="form-control input-sm" name="qrcode" data-unique="true" type="text" /></td>
          <td class="d-none"><input class="form-control input-sm" name="cubicle_name" type="text" value=""/></td>
          <td class="d-none"><input class="form-control input-sm" name="cubicle_num" type="text" value=""/></td>
          <td class="d-none"><input class="form-control input-sm" name="plate_num" type="text" value=""/></td>
          <td class="d-none"><input class="form-control input-sm" name="bd_file" data-unique="true" type="text" value=""/></td>
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
import Thick from './Thick'
import DismantleFacefb from './DismantleFacefb'
import DismantlePlate from './DismantlePlate'
import DismantleEdge from './DismantleEdge'
import DismantleSlot from './DismantleSlot'
import DismantlePunch from './DismantlePunch'
import DismantleRemark from './DismantleRemark'
let self
export default {
  mixins: [ dismantleMixins ],
  name: 'OrderDismantleCabinet',
  props: {
    dismantleUrl: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      changeLine: '*',
      demoData: {
        plate_name: '',
        board: '',
        length: '',
        width: '',
        area: '',
        edge: '',
        slot: '',
        punch: '',
        decide_size: '',
        remark: '',
        amount: 1,
        qrcode: '',
        cubicle_name: '',
        cubicle_num: '',
        plate_num: '',
        bd_file: ''
      },
      loading: false,
      maxNum: 1,
      reDismantleUrl: '/order/dismantle/re_dismantle'
    }
  },
  computed: {
    orderProduct: {
      get () {
        return this.$store.getters.getDismantleData({ uri: this.dismantleUrl, child: 'W' })
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
        return this.$store.getters.getActiveDismantleData({ uri: this.dismantleUrl, child: 'W' })
      }
    }
  },
  created () {
    self = this
  },
  mounted () {
    this.highlightTr('dismantleWTable')
    this.addLine('dismantleWTable')
    this.handleDirection('dismantleWTable')
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
    reload: {
      handler: function (to, from) {
        this.fetchData()
      }
    },
    activeOrderProduct: {
      handler: function (to, from) {
        if (to !== undefined) {
          if (to['struct'] === undefined) {
            this.fetchStruct()
          }
          if (to['order_product_board_plate'] === undefined) {
            this.fetchData()
          }
        }
      },
      deep: true
    }
  },
  updated () {
    this.highlightTr('dismantleWTable')
    this.addLine('dismantleWTable')
    this.copy('dismantleWTable')
    this.handleDirection('dismantleWTable')
  },
  methods: {
    changeBoard (board) { // 更换板材颜色
      let Nature = board.replace(/(\d{1,2})(.*)/g, '$2')
      let ChangeLine = self.changeLine === '*' ? self.changeLine : parseInt(self.changeLine)
      self.activeOrderProduct['order_product_board_plate'] && self.activeOrderProduct['order_product_board_plate'].forEach(__ => {
        let Thick = parseInt(__.board)
        if (Thick) {
          if (ChangeLine === '*') {
            __.board = Thick + Nature
          } else if (Thick === ChangeLine) {
            __.board = ChangeLine + Nature
          }
        } else {
          __.board = board
        }
      })
    },
    fetchStruct () { // 获取柜体结构
      this.$store.dispatch('FETCH_CABINET_STRUCT', {
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
        url: '/order/order_product_board_plate/read',
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
    Thick,
    DismantleFacefb,
    DismantlePlate,
    DismantleEdge,
    DismantleSlot,
    DismantlePunch,
    DismantleRemark
  }
}
</script>
