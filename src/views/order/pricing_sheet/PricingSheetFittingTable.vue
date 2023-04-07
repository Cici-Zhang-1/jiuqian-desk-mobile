<template>
  <table class="table table-striped table-bordered table-sm table-responsive-sm text-nowrap table-highlight">
    <caption class="j-caption"><span v-html="orderProductLink()"></span>{{ table.product }}</caption>
    <thead>
      <tr>
        <th>#</th>
        <th>配件</th>
        <th>规格</th>
        <th>单位</th>
        <th>单价</th>
        <th>数量</th>
        <th>金额</th>
        <th>备注</th>
      </tr>
    </thead>
    <tbody >
      <tr v-for="(item, key, index) in table['order_product_board']" :key="index">
        <td>{{ key + 1 }}</td>
        <td>{{ item.fitting }}</td>
        <td>{{ item.speci }}</td>
        <td>{{ item.unit }}</td>
        <td>{{ item.check_unit_price }}</td>
        <td>{{ item.amount }}</td>
        <td>{{ item.check_sum }}</td>
        <td>{{ item.remark }}</td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import { pricingSheetTableMixins } from './mixins'

export default {
  mixins: [ pricingSheetTableMixins ],
  name: 'PricingSheetFittingTable'
}
</script>

<style scoped>
  table thead, table tbody{
    min-width: 100%;
  }
</style>
