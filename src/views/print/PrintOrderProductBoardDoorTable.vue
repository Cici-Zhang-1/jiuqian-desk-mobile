<template>
  <div class="col-12">
    <table class="table table-striped table-bordered table-sm mb-0" v-if="card.data && card.data.content">
      <thead>
        <tr>
          <th>编号</th>
          <th>宽</th>
          <th>长</th>
          <th>数量</th>
          <th>铰链孔方向</th>
          <th>封边拉手</th>
          <th>开孔(个)</th>
          <th>隐形拉手(米)</th>
          <th>备注</th>
        </tr>
      </thead>
      <tbody >
        <tr v-for="(plate, key, index) in card.data.content" :key="index">
          <td class="font-weight-bold" colspan="9" v-if="plate.divide">{{ plate['board'] }}, {{ card.data.struct.edge }}</td>
          <td v-if="!plate.divide">{{ plate['key'] }}</td>
          <td v-if="!plate.divide">{{ plate['width'] }}</td>
          <td v-if="!plate.divide">{{ plate['length'] }}</td>
          <td v-if="!plate.divide">{{ plate['amount'] }}</td>
          <td v-if="!plate.divide">{{ plate['punch'] }}</td>
          <td v-if="!plate.divide">{{ plate['handle'] }}</td>
          <td v-if="!plate.divide">{{ plate['open_hole'] }}</td>
          <td v-if="!plate.divide">{{ plate['invisibility'] }}</td>
          <td v-if="!plate.divide">{{ plate['remark'] }}</td>
        </tr>
      </tbody>
    </table>
    <table class="table table-striped table-bordered table-sm mb-0" v-if="card.data && card.data.statistic">
      <thead>
        <tr>
          <th colspan="8">统计</th>
        </tr>
      </thead>
      <tbody >
        <tr>
          <td>块数</td>
          <td>{{ card.data.statistic['total_amount'] }}(块)</td>
          <td>面积</td>
          <td>{{ card.data.statistic['total_area'] }}(平方)</td>
          <td>开孔</td>
          <td>{{ card.data.statistic['total_open_hole'] }}(个)</td>
          <td>隐形拉手</td>
          <td>{{ card.data.statistic['total_invisibility'] }}(米)</td>
        </tr>
      </tbody>
    </table>
    <div class="col-12 mt-2" v-if="loading"><i class="fa fa-spinner fa-spin fa-5x"></i></div>
  </div>
</template>

<script>
export default {
  name: 'PrintOrderProductBoardDoorTable',
  props: {
    card: {
      type: Object
    },
    reload: {
      type: Boolean
    }
  },
  data () {
    return {
      errorMsg: 'No Data Available',
      error: false,
      loading: true
    }
  },
  created () {
    this.fetchData()
  },
  watch: {
    reload: {
      handler: function (to, from) {
        this.fetchData()
      }
    }
  },
  methods: {
    show (Name) {
      return this.card.elements[Name] && this.card.elements[Name].checked_name
    },
    fetchData () { // 获取数据
      let self = this
      this.loading = true
      this.error = false
      this.$store.dispatch('FETCH_DATA', {
        url: this.card.url,
        configs: {
          params: {
            ...this.$router.currentRoute.query
          }
        },
        target: this.card
      }).then((res) => {
        if (res.code > 0) {
          self.errorMsg = res.message
          self.error = true
        }
      }).catch(err => {
        self.errorMsg = err.message
        self.error = true
      }).finally(() => {
        self.loading = false
      })
    }
  }
}
</script>
