<template>
  <div class="row mt-3 j-page" :id="title">
    <div class="col-12 border-bottom rounded-bottom mb-2 border-primary text-center d-print-none"><h5>{{ label }}</h5></div>
    <div class="col-md-3 mb-2 mb-md-3 d-print-none"></div>
    <div is="func" :funcs="funcs" v-if="funcs"></div>
    <div is="pricing-sheet-card" :card="get_card('pricing_sheet_basic_info_table')" v-if="cards" :reload="reload"></div>
    <div is="pricing-sheet-board-card" :card="get_card('pricing_sheet_cabinet_table')" v-if="cards" :reload="reload"></div>
    <div is="pricing-sheet-board-card" :card="get_card('pricing_sheet_wardrobe_table')" v-if="cards" :reload="reload"></div>
    <div is="pricing-sheet-board-card" :card="get_card('pricing_sheet_doorw_table')" v-if="cards" :reload="reload"></div>
    <div is="pricing-sheet-board-card" :card="get_card('pricing_sheet_door_table')" v-if="cards" :reload="reload"></div>
    <div is="pricing-sheet-board-card" :card="get_card('pricing_sheet_wood_table')" v-if="cards" :reload="reload"></div>
    <div is="pricing-sheet-fitting-card" :card="get_card('pricing_sheet_fitting_table')" v-if="cards" :reload="reload"></div>
    <div is="pricing-sheet-other-card" :card="get_card('pricing_sheet_other_table')" v-if="cards" :reload="reload"></div>
    <div is="pricing-sheet-server-card" :card="get_card('pricing_sheet_server_table')" v-if="cards" :reload="reload"></div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import PricingSheetCard from './PricingSheetCard.vue'
import PricingSheetBoardCard from './PricingSheetBoardCard.vue'
import PricingSheetFittingCard from './PricingSheetFittingCard.vue'
import PricingSheetOtherCard from './PricingSheetOtherCard.vue'
import PricingSheetServerCard from './PricingSheetServerCard.vue'
import Func from '@/components/forms/Func'
import { nameToId } from '@/assets/js/custom'
import { pubMixins } from '@/views/mixins'

export default {
  mixins: [ pubMixins ],
  name: 'PricingSheet',
  data () {
    return {
      title: '',
      f: 'order',
      c: 'pricing_sheet',
      reload: false
    }
  },
  computed: {
    ...mapGetters({
      cards: 'currentPageCards', // 当前页面应该展示的数据
      funcs: 'currentPageFuncs',
      label: 'currentLabel'
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
    '$store.state.app.reload': {
      handler: function (to, from) {
        if (to) {
          this.reload = !this.reload
          this.$store.commit('SET_APP_RELOAD', { reload: false })
        }
      },
      deep: true
    }
  },
  methods: {
    get_card ($Name) {
      return this.cards.filter(__ => {
        return __.name === $Name
      })[0]
    },
    set_app_controller () {
      this.$store.commit('SET_APP_CONTROLLER', { controller: this.c })
    }
  },
  components: {
    PricingSheetCard,
    PricingSheetBoardCard,
    PricingSheetFittingCard,
    PricingSheetOtherCard,
    PricingSheetServerCard,
    Func
  }
}
</script>
