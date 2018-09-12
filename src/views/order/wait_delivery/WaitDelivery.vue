<template>
  <div class="row mt-3 j-page" :id="title">
    <div class="col-12 border-bottom rounded-bottom mb-2 border-primary text-center d-print-none"><h5>{{ label }}</h5></div>
    <div is="wait-delivery-page-search" :pageSearches="pageSearches" v-if="pageSearches" @work-out="save($event)"></div>
    <div is="wait-delivery-func" :funcs="funcs" @refresh="disposeRefresh($event)" v-if="funcs"></div>
    <div class="col-12">
      <div class="card border-0 mb-5">
        <div class="card-body p-0 card-body-h">
          <ul class="nav nav-tabs" id="waitDeliveryTab" role="tablist">
            <li class="nav-item">
              <a class="nav-link active" data-toggle="tab" href="#toFactory" role="tab" aria-controls="to-factory" aria-selected="true" @click="changeTab($event.target)">到厂自提</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" data-toggle="tab" href="#toLogistics" role="tab" aria-controls="to-logistics" aria-selected="false" @click="changeTab($event.target)">发货物流</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" data-toggle="tab" href="#toDadao" role="tab" aria-controls="to-dadao" aria-selected="false" @click="changeTab($event.target)">物流到厂</a>
            </li>
          </ul>
          <div class="tab-content" id="waitDeliveryTabContent" v-if="cards">
            <div is="wait-delivery-card" :card="get_card('to_factory_table')" class="show active" id="toFactory" :refresh="refresh" aria-labelledby="to-factory-tab"></div>
            <div is="wait-delivery-card" :card="get_card('to_logistics_table')" id="toLogistics" :refresh="refresh" aria-labelledby="to-logistics-tab"></div>
            <div is="wait-delivery-card" :card="get_card('to_dadao_table')" id="toDadao" :refresh="refresh" aria-labelledby="to-dadao-tab"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { nameToId, cloneData, dataToStr } from '@/assets/js/custom'
import $ from 'jquery'
import WaitDeliveryPageSearch from './WaitDeliveryPageSearch'
import WaitDeliveryFunc from './WaitDeliveryFunc'
import WaitDeliveryCard from './WaitDeliveryCard'

export default {
  name: 'WaitDelivery',
  data () {
    return {
      title: '',
      f: 'order',
      c: 'wait_delivery',
      refresh: false,
      activeTable: '#toFactoryTable',
      workOut: '/wait_delivery/work_out'
    }
  },
  computed: {
    ...mapGetters({
      cards: 'currentPageCards', // 当前页面应该展示的数据
      pageSearches: 'currentPageSearches',
      pageSearchValues: 'currentPageSearchValues',
      funcs: 'currentPageFuncs',
      label: 'currentLabel'
    }),
    activeLines: {
      get () {
        return this.cards && this.$store.getters.currentPageActiveLines({ source: this.activeTable, all: true })
      }
    },
    v: {
      get () {
        return this.cards && this.$store.getters.currentPageActiveLineVs({ source: this.activeTable, all: true }).map(__ => __.v)
      }
    }
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
    activeLines: {
      handler: function (to, from) {
        this.computePack()
      },
      deep: true
    }
  },
  methods: {
    computePack () {
      let pack = 0
      this.activeLines.map(__ => {
        pack += parseInt(__['wait_delivery'])
        return __
      })
      if (this.pageSearches['pack'] !== undefined) {
        this.pageSearches['pack'].dv = pack
      }
    },
    changeTab (E) {
      this.activeTable = $(E).attr('href') + 'Table'
      this.changeFuncTarget()
    },
    changeFuncTarget () {
      this.funcs.map(__ => {
        __.source = this.activeTable
        __['group_no'] = this.activeTable
        return __
      })
    },
    get_card ($Name) {
      return this.cards.filter(__ => {
        return __.name === $Name
      })[0]
    },
    disposeRefresh () { // 重置
      this.refresh = !this.refresh
    },
    save (e) {
      let Data = cloneData(this.pageSearchValues)
      Data.v = this.v
      let DataStr = dataToStr(Data)
      if (this.checkWaitDelivery()) {
        this.$router.push(this.workOut + '?' + DataStr)
      }
    },
    checkWaitDelivery () {
      if (this.pageSearchValues.pack <= 0) {
        alert('请选择需要发货的订单!')
        return false
      } else {
        let unPayed = []
        this.activeLines.map(__ => {
          if ((__['sum'] - __['payed']) > __['balance']) {
            if (__['pay_status'] !== 1 && __['pay_status'] !== '1') {
              if (__['payterms'] === '宽松发货') {
                if (__['application_status'] !== 2 && __['application_status'] !== '2') {
                  unPayed.push(__.num)
                }
              } else {
                unPayed.push(__.num)
              }
            }
          }
          return __
        })
        if (unPayed.length > 0) {
          alert(unPayed.join(',') + '订单还未支付!')
          return false
        }
      }
      return true
    },
    set_app_controller () {
      this.$store.commit('SET_APP_CONTROLLER', { controller: this.c })
    }
  },
  components: {
    WaitDeliveryPageSearch,
    WaitDeliveryFunc,
    WaitDeliveryCard
  }
}
</script>
