<template>
  <div class="col-md-4 mb-2">
    <div class="card">
      <div class="card-header">
        <ul class="nav nav-pills justify-content-center card-header-pills">
          <li class="nav-item">
            <span class="nav-link">{{ home.label }}</span>
          </li>
          <li class="nav-item" v-for="(func, key, index) in funcs" :key="index">
            <a class="nav-link" :href="func.url" @click.prevent="fetchData(func.url)">{{ func.label }}</a>
          </li>
        </ul>
      </div>
      <div class="card-body text-center" v-if="loading">
        <i class="fa fa-spinner fa-spin fa-5x"></i>
      </div>
      <ul class="list-group list-group-flush">
        <li class="list-group-item d-flex justify-content-between align-items-center" v-for="(list, key, index) in lists" :key="index">
          {{ list.name }}
          <span class="badge badge-dark badge-pill">{{ list.value }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import service from '@/axios'
export default {
  name: 'ListCard',
  props: {
    home: {
      type: Object
    },
    update: {
      type: Boolean
    }
  },
  data () {
    return {
      card: {},
      func: {},
      lists: [],
      loading: false
    }
  },
  created () {
    this.card = this.home.cards[0]
    this.funcs = this.home.funcs
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
    async fetchData (url = '') {
      url = url === '' ? this.card.url : url
      this.loading = true
      let postReturn = await service.post(url)
      if (postReturn.code === 0) {
        this.lists = postReturn.contents.list
      } else {
        this.lists = []
      }
      this.loading = false
    }
  }
}
</script>
