<template>
  <table class="table-center table-form table table-bordered table-hover table-responsive-sm text-nowrap">
    <thead>
      <tr>
        <th >#</th>
        <th >编号</th>
        <th >客户</th>
        <th >业主</th>
        <th >名称</th>
        <th >明细</th>
        <th >件数</th>
        <th class="d-none">Index</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(item, key, index) in form" :key="index">
        <td>{{ key + 1 }}</td>
        <td>{{ item['num'] }}</td>
        <td>{{ item['dealer'] }}</td>
        <td>{{ item['owner'] }}</td>
        <td>{{ item['product'] }}</td>
        <td>{{ item['pack_detail'] }}</td>
        <td ><input class="form-control input-sm bg-hint" name="wait_delivery" type="number" v-model="item['wait_delivery']" min="0" @focusout="checkValue($event.target, item)"/></td>
        <td class="d-none"><input class="form-control input-sm" name="index" type="number" :value="key"/></td>
      </tr>
    </tbody>
  </table>
</template>

<script>
export default {
  name: 'WorkOutForm',
  props: {
    form: {
      type: Object | Array
    }
  },
  methods: {
    checkValue ($E, Item) {
      if (Item['wait_delivery'] > Item['pack']) {
        Item['wait_delivery'] = Item['pack']
      } else if (Item['wait_delivery'] < 0) {
        Item['wait_delivery'] = 0
      }
    }
  }
}
</script>
