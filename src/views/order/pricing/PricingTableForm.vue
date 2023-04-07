<template>
  <table class="table-center table-form table table-bordered table-hover table-responsive-sm text-nowrap" v-if="!error&& pricingData && pricingData['content']">
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
      <th >核价单价 </th>
      <th v-if="show('open_hole')">打孔</th>
      <th v-if="show('open_hole_unit_price')">单价</th>
      <th v-if="show('open_hole_unit_price')">核价</th>
      <th v-if="show('invisibility')">拉手</th>
      <th v-if="show('invisibility_unit_price')">单价</th>
      <th v-if="show('invisibility_unit_price')">核价</th>
      <th >金额</th>
      <th >核价</th>
      <th class="d-none">Index</th>
    </tr>
    </thead>
    <tbody>
    <tr v-for="(item, key, index) in pricingData['content']" :key="index">
      <td>{{ key + 1 }}</td>
      <td>{{ item['num'] }}</td>
      <td>{{ item['product'] }}</td>
      <td>{{ item['name'] }}</td>
      <td v-if="show('speci')">{{ item['speci'] }}</td>
      <td v-if="show('unit')">{{ item['unit'] }}</td>
      <td v-if="show('remark')">{{ item['remark'] }}</td>
      <td >{{ item.amount }}</td>
      <td v-if="show('area')">{{ item['area'] }}</td>
      <td >{{ item['unit_price'] }}</td>
      <td >
        <input class="form-control input-sm bg-hint" name="check_unit_price" type="number" v-model="item['check_unit_price']" @focusout="computeSum($event)" />
      </td>
      <td v-if="show('open_hole')">{{ item['open_hole'] }}</td>
      <td v-if="show('open_hole_unit_price')">{{ item['open_hole_unit_price'] }}</td>
      <td v-if="show('open_hole_unit_price')">
        <input class="form-control input-sm bg-hint" name="open_hole_check_unit_price" type="number" v-model="item['open_hole_check_unit_price']" @focusout="computeSum($event)" />
      </td>
      <td v-if="show('invisibility')">{{ item['invisibility'] }}</td>
      <td v-if="show('invisibility_unit_price')">{{ item['invisibility_unit_price'] }}</td>
      <td v-if="show('invisibility_unit_price')">
        <input class="form-control input-sm bg-hint" name="invisibility_check_unit_price" type="number" v-model="item['invisibility_check_unit_price']" @focusout="computeSum($event)"/>
      </td>
      <td >{{ item['sum'] }}</td>
      <td ><input class="form-control input-sm bg-hint" name="check_sum" type="number" v-model="item['check_sum']" readonly /></td>
      <td class="d-none"><input class="form-control input-sm" name="index" type="number" :value="key"/></td>
    </tr>
    </tbody>
  </table>
</template>

<script>
import $ from 'jquery'
import { M_TWO } from '@/assets/js/constants'

export default {
  name: 'PricingTableForm',
  props: {
    form: {
      type: Object
    },
    reload: {
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
    pricingData: {
      get () {
        return this.form.pricing
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
      let UnitPrice = 0
      let OpenHole = 0
      let OpenHoleUnitPrice = 0
      let Invisibility = 0
      let InvisibilityUnitPrice = 0
      let Data = this.pricingData['content'][$(e.target).parents('tr').eq(0).find('input[name="index"]').val()]
      UnitPrice = parseFloat(Data['check_unit_price'])
      if (Data['area'] === undefined) {
        Amount = parseFloat(Data['amount'])
      } else {
        Amount = parseFloat(Data['area'])
      }
      if (Data['open_hole'] !== undefined) {
        OpenHole = parseInt(Data['open_hole'])
        OpenHoleUnitPrice = parseFloat(Data['open_hole_check_unit_price'])
      }
      if (Data['invisibility'] !== undefined) {
        Invisibility = parseFloat(Data['invisibility'])
        InvisibilityUnitPrice = parseFloat(Data['invisibility_check_unit_price'])
      }
      Data['check_sum'] = Math.ceil((UnitPrice * Amount + OpenHole * OpenHoleUnitPrice + Invisibility * InvisibilityUnitPrice) * M_TWO) / M_TWO
    },
    fetchData () { // 获取数据
      // if (typeof this.pricingData === 'undefined' || JSON.stringify(this.pricingData) === '{}') {
      this.$store.dispatch('FETCH_PRICING_DATA', {
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
