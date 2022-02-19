<template>
  <div class="row mt-3 j-page">
    <div v-for="(home, key, index) in homes" :is="getComponent(home['page_type_v'])" :home="home" :key="index" :update="update"></div>
  </div>
</template>

<script type="module">
import CountCard from '@/components/cards/CountCard'
import ListCard from '@/components/cards/ListCard'
import { mapGetters } from 'vuex'

export default {
  name: 'Home',
  data () {
    return {
      timer: '',
      timeInterval: 60000,
      update: false
    }
  },
  computed: {
    ...mapGetters({
      homes: 'getHomes' // 当前Home
    })
  },
  created () {
    this.timer = setInterval(() => {
      this.update = !this.update
    }, this.timeInterval)
  },
  beforeRouteLeave (to, from, next) {
    clearInterval(this.timer)
    next()
  },
  methods: {
    getComponent (home) {
      let Type = ''
      switch (home) {
        case 'h1':
          Type = 'count-card'
          break
        case 'list':
          Type = 'list-card'
          break
        case 'chart':
          Type = 'chart-card'
          break
      }
      return Type
    }
  },
  components: {
    CountCard,
    ListCard
  }
}
</script>
