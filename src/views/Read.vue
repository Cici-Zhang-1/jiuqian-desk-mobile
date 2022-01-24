<template>
  <div class="row mt-3 j-page" :id="title">
    <div class="col-12 border-bottom rounded-bottom mb-2 border-primary text-center d-print-none"><h5>{{ label }}</h5></div>
    <div class="col-12 j-fixed-bottom d-print-none">
      <div class="row">
        <div is="page-search" :pageSearches="pageSearches" v-if="pageSearches"></div>
        <div is="func" :funcs="funcs" v-if="funcs"></div>
      </div>
    </div>
    <div is="regular-card" v-for="(card, index) in cards" :card="card" :key="index" v-if="cards.length"></div>
    <div is="regular-form" v-for="(form, key, index) in formPages" :form="form" :key="index" v-if="formPages.length"></div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import RegularCard from '@/components/cards/RegularCard'
import PageSearch from '@/components/forms/PageSearch'
import Func from '@/components/forms/Func'
import RegularForm from '@/components/forms/RegularForm'
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
      funcs: 'currentPageFuncs',
      formPages: 'currentFormPages',
      label: 'currentLabel'
    })
  },
  created () {
    this.set_app_controller()
    window.document.title = this.label + '|' + window.document.title.split('|').pop()
  },
  updated () {
    window.document.title = this.label + '|' + window.document.title.split('|').pop()
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
    Func,
    RegularForm
  }
}
</script>
