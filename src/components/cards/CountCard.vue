<template>
  <div class="col-md-4 mb-2">
    <div class="card text-center">
      <div class="card-header" @click="fetchData()">{{ home.label }}</div>
      <div class="card-body text-white bg-danger">
        <h1>{{ count }}</h1>
      </div>
    </div>
  </div>
</template>

<script>
import service from '@/axios'
export default {
  name: 'CountCard',
  props: {
    home: {
      type: Object | Array,
      required: true
    },
    update: {
      type: Boolean
    }
  },
  data () {
    return {
      card: {},
      count: 0
    }
  },
  created () {
    this.card = this.home.cards[0]
    this.fetchData()
  },
  watch: {
    update: {
      handler: function (to, from) {
        this.fetchData()
      }
    }
  },
  methods: {
    async fetchData () {
      this.count = '0'
      let postReturn = await service.post(this.card.url)
      if (postReturn.code === 0) {
        this.count = postReturn.contents.count
      } else {
        this.count = '--'
      }
    }
  }
}
</script>
