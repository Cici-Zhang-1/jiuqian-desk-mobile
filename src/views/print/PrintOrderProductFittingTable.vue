<template>
  <div class="col-12">
    <table class="table table-striped table-bordered table-sm mb-0" v-if="card.data && card.data.content">
      <thead>
        <tr>
          <th>编号</th>
          <th>名称</th>
          <th>规格</th>
          <th>单位</th>
          <th>数量</th>
          <th>备注</th>
        </tr>
      </thead>
      <tbody >
        <tr v-for="(plate, key, index) in card.data.content" :key="index">
          <td>{{ key + 1 }}</td>
          <td>{{ plate['fitting'] }}</td>
          <td>{{ plate['speci'] }}</td>
          <td>{{ plate['unit'] }}</td>
          <td>{{ plate['amount'] }}</td>
          <td>{{ plate['remark'] }}</td>
        </tr>
      </tbody>
    </table>
    <div class="col-12 mt-2" v-if="loading"><i class="fa fa-spinner fa-spin fa-5x"></i></div>
  </div>
</template>

<script>
import { printTableMixins } from './mixins'
export default {
  mixins: [ printTableMixins ],
  name: 'PrintOrderProductFittingTable'
}
</script>
