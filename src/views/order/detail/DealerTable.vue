<template>
  <table class="table table-striped table-bordered table-responsive-sm j-text-nowrap" id="orderDetailDealerTable">
    <tbody >
      <tr>
        <th v-if="show('dealer')">客户</th>
        <th v-if="show('dealer_balance')">余额</th>
        <th v-if="show('checker')">对单</th>
        <th v-if="show('checker_phone')">对单电话</th>
        <th v-if="show('payer')">支付</th>
        <th v-if="show('payer_phone')">支付电话</th>
        <th v-if="show('out_method')">出厂方式</th>
        <th v-if="show('logistics')">要求物流</th>
        <th v-if="show('delivery_area')">收货地址</th>
        <th v-if="show('delivery_linker')">收货人</th>
        <th v-if="show('delivery_phone')">收货电话</th>
      </tr>
      <tr>
        <td v-if="show('dealer')">{{ table.dealer }}</td>
        <td v-if="show('dealer_balance')"  v-html="dealerAccountBookLink()"></td>
        <td v-if="show('checker')">{{ table.checker }}</td>
        <td v-if="show('checker_phone')">{{ table.checker_phone }}</td>
        <td v-if="show('payer')">{{ table.payer }}</td>
        <td v-if="show('payer_phone')">{{ table.payer_phone }}</td>
        <td v-if="show('out_method')">{{ table.out_method }}</td>
        <td v-if="show('logistics')">{{ table.logistics }}</td>
        <td v-if="show('delivery_area')">{{ table.delivery_area }}{{ table.delivery_address }}</td>
        <td v-if="show('delivery_linker')">{{ table.delivery_linker }}</td>
        <td v-if="show('delivery_phone')">{{ table.delivery_phone }}</td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import { generateLink } from '@/assets/js/custom'
export default {
  name: 'DealerTable',
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
  methods: {
    show (Name) {
      return this.tableThead[Name] && this.tableThead[Name].checked_name
    },
    dealerAccountBookLink () {
      return generateLink(this.table['dealer_balance'], this.tableThead['dealer_balance'], this.table)
    }
  }
}
</script>

<style scoped>
  table thead, table tbody{
    min-width: 100%;
  }
</style>
