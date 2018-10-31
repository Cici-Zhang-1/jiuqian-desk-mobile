<template>
  <table class="table table-striped table-bordered table-sm table-responsive-sm text-nowrap table-highlight">
    <caption class="j-caption"><span v-html="orderProductLink()"></span>{{ table.product }}</caption>
    <thead>
      <tr>
        <th>#</th>
        <th v-if="show('server')">服务</th>
        <th v-if="show('speci')">规格</th>
        <th v-if="show('unit')">单位</th>
        <th v-if="show('unit_price')">单价</th>
        <th v-if="show('amount')">数量</th>
        <th v-if="show('sum')">金额</th>
        <th v-if="show('remark')">备注</th>
      </tr>
    </thead>
    <tbody >
      <tr v-for="(item, key, index) in table['order_product_board']" :key="index">
        <td>{{ key + 1 }}</td>
        <td v-if="show('server')">{{ item.server }}</td>
        <td v-if="show('speci')">{{ item.speci }}</td>
        <td v-if="show('unit')">{{ item.unit }}</td>
        <td v-if="show('unit_price')">{{ item.unit_price }}</td>
        <td v-if="show('amount')">{{ item.amount }}</td>
        <td v-if="show('sum')">{{ item.sum }}</td>
        <td v-if="show('remark')">{{ item.remark }}</td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import { quoteTableMixins } from './mixins'
export default {
  mixins: [ quoteTableMixins ],
  name: 'QuoteServerTable'
}
</script>

<style scoped>
  table thead, table tbody{
    min-width: 100%;
  }
</style>
