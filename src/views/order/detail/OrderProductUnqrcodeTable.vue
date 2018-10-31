<template>
  <table class="table table-striped table-bordered table-sm table-responsive-sm text-nowrap table-highlight">
    <caption class="j-caption">无码入库</caption>
    <thead>
      <tr>
        <th>#</th>
        <th v-if="show('num')">编号</th>
        <th v-if="show('product')">名称</th>
        <th v-if="show('pack')">件数</th>
        <th v-if="show('creator')">入库人</th>
        <th v-if="show('create_datetime')">入库日期</th>
      </tr>
    </thead>
    <tbody >
      <tr v-for="(item, key, index) in table['order_product_detail']" :key="index">
        <td>{{ key + 1 }}</td>
        <td v-if="show('num')">{{ item.num }}</td>
        <td v-if="show('product')">{{ item.product }}</td>
        <td v-if="show('pack')">{{ item.pack }}</td>
        <td v-if="show('creator')">{{ item['creator'] }}</td>
        <td v-if="show('create_datetime')">{{ item['create_datetime'] }}</td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import { detailTableMixins } from './mixins'
export default {
  mixins: [ detailTableMixins ],
  name: 'OrderProductUnqrcodeTable'
}
</script>

<style scoped>
  table thead, table tbody{
    min-width: 100%;
  }
</style>
