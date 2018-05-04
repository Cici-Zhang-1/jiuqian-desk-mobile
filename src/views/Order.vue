<template>
  <div class="row j-page" id="{{ title }}">
    <div is="page-search" :pageSearches="pageSearch" v-if="pageSearch"></div>
    <div is="func" :funcs="funcs" v-if="funcs"></div>
    <div is="regular-card" v-for="(card, index) in cards" :card="card" :key="index" v-if="cards.length"></div>
  </div>
</template>

<script type="module">
import { mapGetters } from 'vuex'
import Navbar from '@/components/bars/Navbar'
import Headerbar from '@/components/bars/Headerbar'
import Funcbars from '@/components/bars/Funcbars'

export default {
  name: 'Order',
  data () {
    return {
      showNavbars: true,
      showHeaderbar: true,
      showFuncbars: false
    }
  },
  computed: {
    ...(mapGetters({
      navbars: 'activeNavbars'
    }))
  },
  created () {
    this.setBars(this.$router.currentRoute.meta)
  },
  methods: {
    setBars (Value) {
      if (Value.showHeaderbar !== undefined) {
        this.showHeaderbar = Value.showHeaderbar
        this.showNavbars = Value.showNavbars
        this.showFuncbars = Value.showFuncbars
      } else {
        this.showHeaderbar = true
        this.showNavbars = true
        this.showFuncbars = false
      }
    }
  },
  watch: {
    '$route': function (to, from) {
      this.$store.commit('SET_APP_URI', to)
    },
    '$route.meta': function (to, from) {
      this.setBars(to)
    }
  },
  components: {
    Navbar,
    Headerbar,
    Funcbars
  }
}
</script>
