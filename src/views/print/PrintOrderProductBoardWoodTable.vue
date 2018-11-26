<template>
  <div class="col-12">
    <table class="table table-striped table-bordered table-sm mb-0" v-if="card.data && card.data.content">
      <thead>
        <tr>
          <th>编号</th>
          <th>名称</th>
          <th>门芯</th>
          <th>板材</th>
          <th>成型高</th>
          <th>成型宽</th>
          <th>物料高</th>
          <th>物料宽</th>
          <th>数量</th>
          <th>中横</th>
          <th>打孔</th>
          <th>备注</th>
        </tr>
      </thead>
      <tbody >
        <tr v-for="(plate, key, index) in card.data.content" :key="index">
          <td>{{ plate['key'] }}</td>
          <td>{{ plate['wood_name'] }}</td>
          <td>{{ plate['core'] }}</td>
          <td>{{ plate['board'] }}</td>
          <td>{{ plate['length'] }}</td>
          <td>{{ plate['width'] }}</td>
          <td>{{ plate['m_length'] }}</td>
          <td>{{ plate['m_width'] }}</td>
          <td>{{ plate['amount'] }}</td>
          <td>{{ plate['center'] }}</td>
          <td>{{ plate['punch'] }}</td>
          <td>{{ plate['remark'] }}</td>
        </tr>
      </tbody>
    </table>
    <table class="table table-striped table-bordered table-sm mb-0" v-if="card.data">
      <thead>
        <tr>
          <th >编号</th>
          <th >板件名称</th>
          <th >板材</th>
          <th >高</th>
          <th >宽</th>
          <th >数量</th>
        </tr>
      </thead>
      <tbody >
        <tr v-for="(plate, key, index) in card.data.horizontal" :key="index">
          <td>{{ plate['flag'] }}</td>
          <td>{{ plate['name'] }}</td>
          <td>{{ plate['board'] }}</td>
          <td>{{ plate['length'] }}</td>
          <td>{{ plate['width'] }}</td>
          <td>{{ plate['amount'] }}</td>
        </tr>
        <tr v-for="(plate, key, index) in card.data.vertical" :key="index">
          <td>{{ plate['flag'] }}</td>
          <td>{{ plate['name'] }}</td>
          <td>{{ plate['board'] }}</td>
          <td>{{ plate['length'] }}</td>
          <td>{{ plate['width'] }}</td>
          <td>{{ plate['amount'] }}</td>
        </tr>
        <tr v-for="(plate, key, index) in card.data.center" :key="index">
          <td>{{ plate['flag'] }}</td>
          <td>{{ plate['name'] }}</td>
          <td>{{ plate['board'] }}</td>
          <td>{{ plate['length'] }}</td>
          <td>{{ plate['width'] }}</td>
          <td>{{ plate['amount'] }}</td>
        </tr>
        <tr v-for="(plate, key, index) in card.data.blinds" :key="index">
          <td>{{ plate['flag'] }}</td>
          <td>{{ plate['name'] }}</td>
          <td>{{ plate['board'] }}</td>
          <td>{{ plate['length'] }}</td>
          <td>{{ plate['width'] }}</td>
          <td>{{ plate['amount'] }}</td>
        </tr>
      </tbody>
    </table>
    <table class="table table-striped table-bordered table-sm mb-0" v-if="card.data && card.data.statistic">
      <thead>
        <tr>
          <th colspan="4">统计</th>
        </tr>
      </thead>
      <tbody >
        <tr>
          <td>块数</td>
          <td>{{ card.data.statistic['total_amount'] }}(块)</td>
          <td>面积</td>
          <td>{{ card.data.statistic['total_area'] }}(平方)</td>
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
  name: 'PrintOrderProductBoardWoodTable'
}
</script>
