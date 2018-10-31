<template>
  <table class="table table-striped table-bordered table-sm table-responsive-sm text-nowrap table-highlight">
    <caption class="j-caption"><span v-html="orderProductLink()"></span>{{ table.product }}</caption>
    <thead>
      <tr>
        <th>#</th>
        <th v-if="show('board')">板材</th>
        <th v-if="show('virtual_area')">面积</th>
        <th v-if="show('unit_price')">单价</th>
        <th v-if="show('virtual_sum')">金额</th>
      </tr>
    </thead>
    <tbody >
      <tr v-for="(item, key, index) in table['order_product_board']" :key="index">
        <td>{{ key + 1 }}</td>
        <td v-if="show('board')">{{ item.board }}</td>
        <td v-if="show('virtual_area')">{{ item['virtual_area'] }}</td>
        <td v-if="show('unit_price')">{{ item['unit_price'] }}</td>
        <td v-if="show('virtual_sum')">{{ item['virtual_sum'] }}</td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import { quoteTableMixins } from './mixins'

export default {
  mixins: [ quoteTableMixins ],
  name: 'QuoteBoardTable'/* ,
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
