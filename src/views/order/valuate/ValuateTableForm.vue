<template>
  <table class="table-center table-form table table-bordered table-hover table-responsive-sm text-nowrap" v-if="!error&& valuateData && valuateData['content']">
    <thead>
    <tr>
      <th >#</th>
      <th >编号</th>
      <th >产品</th>
      <th >名称</th>
      <th v-if="show('speci')">规格</th>
      <th v-if="show('unit')">单位</th>
      <th v-if="show('remark')">备注</th>
      <th >数量</th>
      <th v-if="show('area')">面积</th>
      <th >单价</th>
      <th v-if="show('open_hole')">打孔</th>
      <th v-if="show('open_hole_unit_price')">单价</th>
      <th v-if="show('invisibility')">拉手</th>
      <th v-if="show('invisibility_unit_price')">单价</th>
      <th >金额</th>
      <th v-if="show('area_diff')">差面</th>
      <th v-if="show('sum_diff')">差额</th>
      <th class="d-none" v-if="show('virtual_area')">虚拟面积</th>
      <th class="d-none" v-if="show('virtual_sum')">虚拟金额</th>
      <th class="d-none">Index</th>
    </tr>
    </thead>
    <tbody>
    <tr v-for="(item, key, index) in valuateData['content']" :key="index">
      <td>{{ key + 1 }}</td>
      <td>{{ item['num'] }}</td>
      <td>{{ item['product'] }}</td>
      <td>{{ item['name'] }}</td>
      <td v-if="show('speci')">{{ item['speci'] }}</td>
      <td v-if="show('unit')">{{ item['unit'] }}</td>
      <td v-if="show('remark')">{{ item['remark'] }}</td>
      <td >{{ item.amount }}</td>
      <td v-if="show('area')">
        <input class="form-control input-sm bg-hint" name="area" type="text" v-model="item['area']" @focusout="minArea($event)" v-if="allowDiscountItem"/>
        <input class="form-control input-sm bg-hint" name="area" type="text" v-model="item['area']" readonly v-else/></td>
      <td >
        <input class="form-control input-sm bg-hint" name="unit_price" type="number" v-model="item['unit_price']" @focusout="computeSum($event)" v-if="allowDiscountItem"/>
        <input class="form-control input-sm bg-hint" name="unit_price" type="number" v-model="item['unit_price']" @focusout="computeSum($event)" readonly v-else/>
      </td>
      <td v-if="show('open_hole')">{{ item['open_hole'] }}</td>
      <td v-if="show('open_hole_unit_price')">
        <input class="form-control input-sm bg-hint" name="open_hole_unit_price" type="number" v-model="item['open_hole_unit_price']" @focusout="computeSum($event)" v-if="allowDiscountItem"/>
        <input class="form-control input-sm bg-hint" name="open_hole_unit_price" type="number" v-model="item['open_hole_unit_price']" @focusout="computeSum($event)" readonly v-else/>
      </td>
      <td v-if="show('invisibility')">{{ item['invisibility'] }}</td>
      <td v-if="show('invisibility_unit_price')">
        <input class="form-control input-sm bg-hint" name="handle_unit_price" type="number" v-model="item['invisibility_unit_price']" @focusout="computeSum($event)" v-if="allowDiscountItem"/>
        <input class="form-control input-sm bg-hint" name="handle_unit_price" type="number" v-model="item['invisibility_unit_price']" @focusout="computeSum($event)" readonly v-else/>
      </td>
      <td ><input class="form-control input-sm bg-hint" name="sum" type="number" v-model="item['sum']" readonly /></td>
      <td v-if="show('area_diff')" ><input class="form-control input-sm bg-hint" name="area_diff" type="number" v-model="item['area_diff']" @focusout="computeSum($event)"/></td>
      <td v-if="show('sum_diff')" ><input class="form-control input-sm bg-hint" name="sum_diff" type="number" v-model="item['sum_diff']" @focusout="computeSum($event)"/></td>
      <td class="d-none" v-if="show('virtual_area')" ><input class="form-control input-sm bg-hint" name="virtual_area" type="number" v-model="item['virtual_area']" /></td>
      <td class="d-none" v-if="show('virtual_sum')" ><input class="form-control input-sm bg-hint" name="virtual_sum" type="number" v-model="item['virtual_sum']" /></td>
      <td class="d-none"><input class="form-control input-sm" name="index" type="number" :value="key"/></td>
    </tr>
    </tbody>
  </table>
</template>

<script>
import $ from 'jquery'

export default {
  name: 'ValuateTableForm',
  props: {
    form: {
      type: Object
    },
    reload: {
      type: Boolean
    },
    allowDiscountItem: {
      type: Boolean
    }
  },
  data () {
    return {
      errorMsg: 'No Data Available',
      error: false
    }
  },
  computed: {
    valuateData: {
      get () {
        return this.form.valuate
      },
      set (Value) {
      }
    }
  },
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
    show (Name) {
      return this.form['page_forms'][Name] !== undefined
    },
    computeSum (e) {
      let Amount = 0
      let AreaDiff = 0
      let UnitPrice = 0
      let OpenHole = 0
      let OpenHoleUnitPrice = 0
      let Invisibility = 0
      let InvisibilityUnitPrice = 0
      let Data = this.valuateData['content'][$(e.target).parents('tr').eq(0).find('input[name="index"]').val()]
      UnitPrice = parseFloat(Data['unit_price'])
      if (Data['area'] === undefined) {
        Amount = parseFloat(Data['amount'])
      } else {
        Amount = parseFloat(Data['area'])
      }
      if (Data['area_diff'] !== undefined) {
        AreaDiff = parseFloat(Data['area_diff'])
      }
      if (Data['open_hole'] !== undefined) {
        OpenHole = parseInt(Data['open_hole'])
        OpenHoleUnitPrice = parseFloat(Data['open_hole_unit_price'])
      }
      if (Data['invisibility'] !== undefined) {
        Invisibility = parseFloat(Data['invisibility'])
        InvisibilityUnitPrice = parseFloat(Data['invisibility_unit_price'])
      }
      Data['sum'] = Math.ceil(UnitPrice * Amount + OpenHole * OpenHoleUnitPrice + Invisibility * InvisibilityUnitPrice)
      Data['virtual_sum'] = Data['sum']
      if (Data['sum_diff'] !== undefined) {
        Data['sum_diff'] = Math.ceil(UnitPrice * AreaDiff)
        Data['virtual_area'] = Amount + AreaDiff
        Data['virtual_sum'] = parseFloat(Data['virtual_sum']) + parseFloat(Data['sum_diff'])
      }
    },
    minArea (e) { // 修改面积最小不能低于原始面积
      let Amount = 0
      let VirtualAmount = 0
      let Data = this.valuateData['content'][$(e.target).parents('tr').eq(0).find('input[name="index"]').val()]
      Amount = parseFloat(Data['area'])
      VirtualAmount = parseFloat(Data['virtual_area'])
      if (VirtualAmount > Amount) {
        Data['area'] = Data['virtual_area']
      }
    },
    fetchData () { // 获取数据
      // if (typeof this.valuateData === 'undefined' || JSON.stringify(this.valuateData) === '{}') {
      this.$store.dispatch('FETCH_VALUATE_DATA', {
        url: this.form['source_url'],
        configs: {
          params: { ...this.$router.currentRoute.query }
        },
        target: this.form
      })
      /* } else {
        this.error = false
        this.loading = false
      } */
    }
  }
}
</script>
