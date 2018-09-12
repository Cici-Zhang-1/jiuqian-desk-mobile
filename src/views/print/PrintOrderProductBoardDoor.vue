<template>
  <div class="row mt-3 j-page" :id="title">
    <div class="col-12 border-bottom rounded-bottom mb-2 border-primary text-center d-print-none"><h5>{{ label }}</h5></div>
    <div class="col-md-3 mb-2 mb-md-3 d-print-none"></div>
    <div is="print-order-table" :card="get_card('print_opbd_basic_info')" v-if="cards" :reload="reload"></div>
    <div is="print-order-product-board-door-table" :card="get_card('print_order_product_board_door_table')" v-if="cards" :reload="reload"></div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import PrintOrderTable from './PrintOrderTable'
import PrintOrderProductBoardDoorTable from './PrintOrderProductBoardDoorTable'
import { nameToId } from '@/assets/js/custom'

export default {
  name: 'PrintOrderProductBoardDoor',
  data () {
    return {
      title: '',
      f: 'print',
      c: 'print_order_product_board_door',
      reload: false
    }
  },
  computed: {
    ...mapGetters({
      cards: 'currentPageCards', // 当前页面应该展示的数据
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
    PrintOrderTable,
    PrintOrderProductBoardDoorTable
  }
}
</script>
