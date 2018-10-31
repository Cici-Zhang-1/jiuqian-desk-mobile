<template>
  <table class="table table-striped table-bordered table-sm table-responsive-sm text-nowrap table-highlight">
    <caption class="j-caption"><span v-html="orderProductLink()"></span>{{ table.product }}, 状态: {{ table['status_label'] }}, 入库件数: {{ table.pack }}, 库位: {{ table['warehouse'] }}</caption>
    <thead>
      <tr>
        <th>#</th>
        <th v-if="show('board')">板材</th>
        <th v-if="show('amount')">数量</th>
        <th v-if="show('area')">面积</th>
        <th v-if="show('virtual_area')">报价面积</th>
        <th v-if="show('purchase')">采购价</th>
        <th v-if="show('unit_price')">单价</th>
        <th v-if="show('sum')">金额</th>
        <th v-if="show('virtual_sum')">报价金额</th>
      </tr>
    </thead>
    <tbody >
      <tr v-for="(item, key, index) in table['order_product_detail']" :key="index">
        <td>{{ key + 1 }}</td>
        <td v-if="show('board')">{{ item.board }}</td>
        <td v-if="show('amount')">{{ item.amount }}</td>
        <td v-if="show('area')">{{ item.area }}</td>
        <td v-if="show('virtual_area')">{{ item['virtual_area'] }}</td>
        <td v-if="show('purchase')">{{ item['purchase'] }}</td>
        <td v-if="show('unit_price')">{{ item['unit_price'] }}</td>
        <td v-if="show('sum')">{{ item.sum }}</td>
        <td v-if="show('virtual_sum')">{{ item['virtual_sum'] }}</td>
      </tr>
    </tbody>
    <tfoot>
      <tr>
        <td colspan="10">
          {{ table['order_product_remark'] }}
        </td>
      </tr>
    </tfoot>
  </table>
</template>

<script>
import { detailTableMixins } from './mixins'

export default {
  mixins: [ detailTableMixins ],
  name: 'OrderProductBoardTable'/* ,
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
      return generateLink(this.table.num, this.tableThead.num, this.table)
    }
  } */
}
</script>

<style scoped>
  table thead, table tbody{
    min-width: 100%;
  }
</style>
