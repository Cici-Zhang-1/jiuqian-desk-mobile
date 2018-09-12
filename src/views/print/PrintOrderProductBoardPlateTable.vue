<template>
  <div class="col-12">
    <table class="table table-striped table-bordered table-sm mb-0" v-if="card.data && card.data.statistic" >
      <tbody>
        <tr>
          <td>{{ card.data.statistic.face }}</td>
        </tr>
      </tbody>
    </table>
    <table class="table table-striped table-bordered table-sm mb-0" v-if="card.data && card.data.content">
      <thead>
        <tr>
          <th>编号</th>
          <th>板件名称</th>
          <th>长</th>
          <th>宽</th>
          <th>厚</th>
          <th>数量</th>
          <th>板材</th>
          <th>封边</th>
          <th>备注</th>
        </tr>
      </thead>
      <tbody >
        <tr v-for="(plate, key, index) in card.data.content" :key="index">
          <td>{{ key + 1 }}</td>
          <td>{{ plate['plate_name'] }}</td>
          <td>{{ plate['length'] }}</td>
          <td>{{ plate['width'] }}</td>
          <td>{{ plate['thick'] }}</td>
          <td>{{ plate['amount'] }}</td>
          <td>{{ plate['board'] }}</td>
          <td>{{ plate['edge'] }}</td>
          <td>{{ plate['remark'] }}</td>
        </tr>
      </tbody>
    </table>
    <table class="table table-striped table-bordered table-sm mb-0" v-if="card.data && card.data.statistic">
      <thead>
        <tr>
          <th colspan="3">统计</th>
        </tr>
      </thead>
      <tbody >
        <tr>
          <td>厚板</td>
          <td>{{ card.data.statistic['thick_amount'] }}(块)</td>
          <td>{{ card.data.statistic['thick_area'] }}(平方)</td>
        </tr>
        <tr>
          <td>薄板</td>
          <td>{{ card.data.statistic['thin_amount'] }}(块)</td>
          <td>{{ card.data.statistic['thin_area'] }}(平方)</td>
        </tr>
        <tr>
          <td>合计</td>
          <td>{{ card.data.statistic['total_amount'] }}(块)</td>
          <td>{{ card.data.statistic['total_area'] }}(平方)</td>
        </tr>
        <tr>
          <td>4H合计</td>
          <td>{{ card.data.statistic['4h_amount'] }}(块)</td>
          <td>{{ card.data.statistic['4h_area'] }}(平方)</td>
        </tr>
      </tbody>
    </table>
    <div class="col-12 mt-2" v-if="loading"><i class="fa fa-spinner fa-spin fa-5x"></i></div>
  </div>
</template>

<script>
export default {
  name: 'PrintOrderProductBoardPlateTable',
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
        self.loading = false
      })
    }
  }
}
</script>
