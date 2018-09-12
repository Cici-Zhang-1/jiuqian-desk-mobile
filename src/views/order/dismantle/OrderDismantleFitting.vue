<template>
  <div class="tab-pane fade" id="dismantleP" role="tabpanel" aria-labelledby="door">
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
    <table class="table-center table-form table table-bordered table-responsive text-nowrap" id="dismantlePTable" v-if="!loading && activeOrderProduct">
      <thead>
      <tr>
        <th class="td-xs" >#</th>
        <th class="d-none">配件名称#</th>
        <th >配件名称</th>
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
        <td>{{ key + 1 }}</td>
        <td class="d-none"><input class="form-control input-sm" name="goods_speci_id" type="hidden" v-model="item['goods_speci_id']"/></td>
        <td is="dismantle-fitting" :fitting="item['fitting']" v-model="item['fitting']" @focusout-fitting="changeFitting($event)"></td>
        <td><input class="form-control input-sm" name="speci" type="text" v-model="item['speci']" readonly/></td>
        <td><input class="form-control input-sm" name="unit" type="text" v-model="item['unit']" readonly /></td>
        <td><input class="form-control input-sm" name="remark" type="text" v-model="item['remark']" /></td>
        <td><input class="form-control input-sm" name="amount" type="number" v-model="item['amount']"/></td>
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
import $ from 'jquery'
import { cloneData } from '@/assets/js/custom'
import DismantleFitting from './DismantleFitting'
export default {
  name: 'OrderDismantleFitting',
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
        fitting: '',
        speci: '',
        unit: '',
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
        return this.$store.getters.getDismantleData({ uri: this.dismantleUrl, child: 'P' })
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
        return this.$store.getters.getActiveDismantleData({ uri: this.dismantleUrl, child: 'P' })
      }
    }
  },
  created () {
  },
  mounted () {
    this.highlightTr()
    this.addLine()
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
          if (to['order_product_board_plate'] === undefined) {
            this.fetchData()
          }
        }
      },
      deep: true
    }
  },
  updated () {
    this.highlightTr()
    this.addLine()
    this.copy()
  },
  methods: {
    changeFitting (e) {
      if (e) {
        let Data = this.activeOrderProduct['order_product_board_plate'][$(e.target).parents('tr').eq(0).find('input[name="index"]').val()]
        Data['fitting'] = e.name
        Data['speci'] = e.speci
        Data['unit'] = e.unit
        Data['goods_speci_id'] = e.v
      }
    },
    copy () { // 复制一行内容
      let self = this
      $('#dismantlePTable tbody tr input[name="copy"]').off('change.copy').on('change.copy', function (i, v) {
        let copy = $(this).val()
        if (copy > 0) {
          let Index = $(this).parents('tr').eq(0).find('input[name="index"]').val()
          let Data = self.activeOrderProduct['order_product_board_plate'][Index]
          let C = {}
          for (let I = 0; I < copy; I++) {
            C = cloneData(Data)
            C.qrcode = ''
            C.bd_file = ''
            self.activeOrderProduct['order_product_board_plate'].splice(Index, 0, C)
          }
          self.maxNum = self.activeOrderProduct['order_product_board_plate'].length + 1
          $(this).val(0)
        }
      })
    },
    addLine () { // 新建一行
      let self = this
      $('#dismantlePTable tbody tr:last').off('click.addLine').on('click.addLine', function (i, v) {
        self.activeOrderProduct['order_product_board_plate'].push(cloneData(self.demoData))
        self.maxNum = self.activeOrderProduct['order_product_board_plate'].length + 1
      })
    },
    highlightTr () { // 高亮选中一行
      $('#dismantlePTable').find('tbody tr').each(function (i, v) {
        $(this).off('click.highlight').on('click.highlight', function (e) {
          $(this).addClass('table-success').siblings().removeClass('table-success')
        })
      })
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
    }
  },
  components: {
    DismantleFitting
  }
}
</script>
