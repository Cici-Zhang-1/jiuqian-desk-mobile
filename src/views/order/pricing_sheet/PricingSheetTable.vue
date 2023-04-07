<template>
  <table class="table table-striped table-bordered table-responsive-sm text-nowrap" id="pricingSheetBasicInfoTable">
    <tbody >
      <tr>
        <th>编号</th>
        <th>当前状态</th>
        <th>创建时间</th>
        <th>要求出厂</th>
        <th>业主</th>
        <th>金额</th>
        <th>已支付</th>
        <th>客户余额</th>
        <th>客户备注</th>
      </tr>
      <tr>
        <td>{{ table.num }}</td>
        <td>{{ table.status_label }}</td>
        <td>{{ table.create_datetime }}</td>
        <td>{{ table.request_outdate }}</td>
        <td>{{ table.owner }}</td>
        <td>{{ table['check_sum'] }}</td>
        <td>{{ table['payed'] }}</td>
        <td>{{ table['dealer_balance'] }}</td>
        <td>{{ table.dealer_remark }}</td>
      </tr>
    </tbody>
  </table>
</template>

<script>
export default {
  name: 'PricingSheetTable',
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
