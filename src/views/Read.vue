<template>
  <div class="row mt-3 j-page" :id="title">
    <div is="page-search" :pageSearches="pageSearches" v-if="pageSearches"></div>
    <div is="func" :funcs="funcs" v-if="funcs"></div>
    <div is="regular-card" v-for="(card, index) in cards" :card="card" :key="index" v-if="cards.length"></div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import RegularCard from '@/components/cards/RegularCard'
import PageSearch from '@/components/forms/PageSearch'
import Func from '@/components/forms/Func'
import { nameToId } from '@/assets/js/custom'

export default {
  name: 'Read',
  props: {
    f: {
      type: String
    },
    c: {
      type: String
    }
  },
  data () {
    return {
      title: ''
    }
  },
  computed: {
    ...mapGetters({
      cards: 'currentPageCards', // 当前页面应该展示的数据
      pageSearches: 'currentPageSearches',
      funcs: 'currentPageFuncs'
    })
  },
  created () {
    this.set_app_controller()
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.title = nameToId(vm.c)
    })
  },
  watch: {
    '$route': function (to, from) { // route变化时更新数据
      this.title = nameToId(this.c)
      this.set_app_controller()
    }
  },
  methods: {
    set_app_controller () {
      this.$store.commit('SET_APP_CONTROLLER', { controller: this.c })
    }
  },
  components: {
    RegularCard,
    PageSearch,
    Func
  }
}
</script>
