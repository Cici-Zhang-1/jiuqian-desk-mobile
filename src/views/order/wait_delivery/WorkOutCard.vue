<template>
  <div class="col-12">
    <div class="card border-0 mb-3">
      <div class="card-body p-0 card-body-h" v-if="!error">
        <div is="work-out-form" :form="card.data.content"></div>
        <div><input class="form-control input-sm bg-hint" name="remark" type="text" placeholder="发货备注" @input="$emit('input-remark', $event.target.value)" maxlength="128"/></div>
      </div>
      <div class="col-12 mt-2" v-if="error">{{ errorMsg }}</div>
    </div>
  </div>
</template>

<script>
import WorkOutForm from './WorkOutForm'
export default {
  name: 'WorkOutCard',
  props: {
    card: {
      type: Object
    }
  },
  data () {
    return {
      errorMsg: 'No Data Available',
      error: false,
      remark: ''
    }
  },
  computed: {
    num () { // 总条数
      return parseInt(this.card.data.num)
    }
  },
  created () {
    this.error = this.num > 0
    this.fetchData()
  },
  methods: {
    fetchData () { // 获取数据
      this.error = false
      this.errorMsg = ''
      this.$bar.start()
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
          this.errorMsg = res.message
          this.error = true
        }
      }).catch(err => {
        self.errorMsg = err.message
        self.error = true
      }).finally(() => {
        this.$bar.finish()
      })
    }
  },
  components: {
    WorkOutForm
  }
}
</script>
