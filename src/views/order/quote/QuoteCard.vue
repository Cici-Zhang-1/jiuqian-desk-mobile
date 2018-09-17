<template>
  <div class="col-12">
    <div class="card border-0 mb-3" v-if="!error && !loading">
      <div class="card-body p-0 card-body-h">
        <quote-table :table="card.data.content" :tableThead="card.elements" />
      </div>
    </div>
    <div class="col-12 mt-2" v-if="error">{{ errorMsg }}</div>
    <div class="col-12 mt-2" v-if="loading"><i class="fa fa-spinner fa-spin fa-5x"></i></div>
  </div>
</template>

<script>
import QuoteTable from './QuoteTable'

export default {
  name: 'QuoteCard',
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
  computed: {},
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
  },
  components: {
    QuoteTable
  }
}
</script>
