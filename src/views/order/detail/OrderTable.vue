<template>
  <table class="table table-striped table-bordered table-responsive-sm text-nowrap" id="orderDetailOrderTable">
    <tbody >
      <tr>
        <th v-if="show('num')">编号</th>
        <th v-if="show('status_label')">当前状态</th>
        <th v-if="show('create_datetime')">创建时间</th>
        <th v-if="show('produce_datetime')">确认时间</th>
        <th v-if="show('request_outdate')">要求出厂</th>
        <th v-if="show('end_datetime')">实际出厂</th>
        <th v-if="show('owner')">业主</th>
        <th v-if="show('sum')">实收</th>
        <th v-if="show('virtual_sum')">应收</th>
        <th v-if="show('payed')">已支付</th>
        <th v-if="show('remark')">备注</th>
        <th v-if="show('dealer_remark')">客户备注</th>
        <th v-if="show('pack')">件数</th>
        <th v-if="show('warehouse_num')">库位</th>
      </tr>
      <tr>
        <td v-if="show('num')">{{ table.num }}</td>
        <td v-if="show('status_label')">{{ table.status_label }}</td>
        <td v-if="show('create_datetime')">{{ table.create_datetime }}</td>
        <td v-if="show('produce_datetime')">{{ table.produce_datetime }}</td>
        <td v-if="show('request_outdate')">{{ table.request_outdate }}</td>
        <td v-if="show('end_datetime')">{{ table.end_datetime }}</td>
        <td v-if="show('owner')">{{ table.owner }}</td>
        <td v-if="show('sum')">{{ table.sum }}</td>
        <td v-if="show('virtual_sum')">{{ table['virtual_sum'] }}</td>
        <td v-if="show('payed')">{{ table.payed }}</td>
        <td v-if="show('remark')">{{ table.remark }}</td>
        <td v-if="show('dealer_remark')">{{ table.dealer_remark }}</td>
        <td v-if="show('pack')">{{ table.pack }}</td>
        <td v-if="show('warehouse_num')">{{ table.warehouse_num }}</td>
      </tr>
    </tbody>
  </table>
</template>

<script>
export default {
  name: 'OrderTable',
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
