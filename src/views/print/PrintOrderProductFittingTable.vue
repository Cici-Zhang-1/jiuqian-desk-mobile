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
export default {
  name: 'PrintOrderProductFittingTable',
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
