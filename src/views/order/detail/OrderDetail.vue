<template>
  <div class="row mt-3 j-page" :id="title">
    <div class="col-12 border-bottom rounded-bottom mb-2 border-primary text-center d-print-none"><h5>{{ label }}</h5></div>
    <div class="col-md-3 mb-2 mb-md-3 d-print-none"></div>
    <div is="func" :funcs="funcs" v-if="funcs"></div>
    <div is="order-card" :card="get_card('order_detail_order_table')" v-if="cards" :reload="reload"></div>
    <div is="order-product-board-card" :card="get_card('order_detail_order_product_board_cabinet_table')" v-if="cards" :reload="reload"></div>
    <div is="order-product-board-card" :card="get_card('order_detail_order_product_board_wardrobe_table')" v-if="cards" :reload="reload"></div>
    <div is="order-product-board-card" :card="get_card('order_detail_order_product_board_door_table')" v-if="cards" :reload="reload"></div>
    <div is="order-product-board-card" :card="get_card('order_detail_order_product_board_wood_table')" v-if="cards" :reload="reload"></div>
    <div is="order-product-fitting-card" :card="get_card('order_detail_order_product_fitting_table')" v-if="cards" :reload="reload"></div>
    <div is="order-product-other-card" :card="get_card('order_detail_order_product_other_table')" v-if="cards" :reload="reload"></div>
    <div is="order-product-server-card" :card="get_card('order_detail_order_product_server_table')" v-if="cards" :reload="reload"></div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import OrderCard from './OrderCard'
import OrderProductBoardCard from './OrderProductBoardCard'
import OrderProductFittingCard from './OrderProductFittingCard'
import OrderProductOtherCard from './OrderProductOtherCard'
import OrderProductServerCard from './OrderProductServerCard'
import Func from '@/components/forms/Func'
import { nameToId } from '@/assets/js/custom'

export default {
  name: 'OrderDetail',
  data () {
    return {
      title: '',
      f: 'order',
      c: 'order_detail',
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
    OrderCard,
    OrderProductBoardCard,
    OrderProductFittingCard,
    OrderProductOtherCard,
    OrderProductServerCard,
    Func
  }
}
</script>
