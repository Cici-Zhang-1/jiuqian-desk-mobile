<template>
  <table class="table table-striped table-bordered table-sm table-responsive-sm text-nowrap table-highlight">
    <caption class="j-caption"><span v-html="orderProductLink()"></span>{{ table.product }}</caption>
    <thead>
      <tr>
        <th>#</th>
        <th>板材</th>
        <th>面积</th>
        <th>单价</th>
        <th>金额</th>
      </tr>
    </thead>
    <tbody >
      <tr v-for="(item, key, index) in table['order_product_board']" :key="index">
        <td>{{ key + 1 }}</td>
        <td>{{ item.board }}</td>
        <td>{{ item['area'] }}</td>
        <td>{{ item['check_unit_price'] }}</td>
        <td>{{ item['check_sum'] }}</td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import { pricingSheetTableMixins } from './mixins'

export default {
  mixins: [ pricingSheetTableMixins ],
  name: 'PricingSheetBoardTable'
}
</script>

<style scoped>
  table thead, table tbody{
    min-width: 100%;
  }
</style>
