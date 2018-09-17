<template>
  <table class="table table-striped table-bordered table-responsive-sm text-nowrap" id="orderDetailOrderTable">
    <tbody >
      <tr>
        <th v-if="show('num')">编号</th>
        <th v-if="show('status_label')">当前状态</th>
        <th v-if="show('create_datetime')">创建时间</th>
        <th v-if="show('request_outdate')">要求出厂</th>
        <th v-if="show('owner')">业主</th>
        <th v-if="show('virtual_sum')">金额</th>
        <th v-if="show('virtual_payed')">已支付</th>
        <th v-if="show('dealer_virtual_balance')">客户余额</th>
        <th v-if="show('dealer_remark')">客户备注</th>
      </tr>
      <tr>
        <td v-if="show('num')">{{ table.num }}</td>
        <td v-if="show('status_label')">{{ table.status_label }}</td>
        <td v-if="show('create_datetime')">{{ table.create_datetime }}</td>
        <td v-if="show('request_outdate')">{{ table.request_outdate }}</td>
        <td v-if="show('owner')">{{ table.owner }}</td>
        <td v-if="show('virtual_sum')">{{ table['virtual_sum'] }}</td>
        <td v-if="show('virtual_payed')">{{ table['virtual_payed'] }}</td>
        <td v-if="show('dealer_virtual_balance')">{{ table['dealer_virtual_balance'] }}</td>
        <td v-if="show('dealer_remark')">{{ table.dealer_remark }}</td>
      </tr>
    </tbody>
  </table>
</template>

<script>
export default {
  name: 'QuoteTable',
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
  created () {
  },
  methods: {
    show (Name) {
      return this.tableThead[Name] && this.tableThead[Name].checked_name
    }
  }
}
</script>

<style scoped>
  table thead, table tbody{
    min-width: 100%;
  }
</style>
