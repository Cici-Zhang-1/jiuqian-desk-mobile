<template>
  <div class="row mt-3 j-page" :id="title">
    <div class="col-12 border-bottom rounded-bottom mb-2 border-primary text-center d-print-none"><h5>{{ label }}</h5></div>
    <div class="col-md-3 mb-2 mb-md-3 d-print-none"></div>
    <div is="work-out-func" :funcs="funcs" @save="save($event)" v-if="funcs"></div>
    <div is="work-out-info"></div>
    <div is="work-out-card" :card="get_card('work_out_table')" v-if="cards" @input-remark="disposeRemark($event)"></div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { nameToId } from '@/assets/js/custom'
import $ from 'jquery'
import service from '@/axios'
import WorkOutFunc from './WorkOutFunc'
import WorkOutInfo from './WorkOutInfo'
import WorkOutCard from './WorkOutCard'
import { pubMixins } from '@/views/mixins'
export default {
  mixins: [ pubMixins ],
  name: 'WorkOut',
  data () {
    return {
      title: '',
      f: 'wait_delivery',
      c: 'work_out',
      remark: ''
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
  methods: {
    get_card ($Name) {
      return this.cards.filter(__ => {
        return __.name === $Name
      })[0]
    },
    disposeRemark (remark) {
      this.remark = remark
    },
    async save (e) {
      let formData = []
      this.cards.map(__ => {
        __.data.content.map(___ => {
          formData.push({
            'v': ___.v,
            'order_id': ___['order_id'],
            'delivered': ___['delivered'],
            'pack': ___['pack'],
            'wait_delivery': ___['wait_delivery'],
            'collection': ___['collection']
          })
          return ___
        })
        return __
      })
      this.$bar.start()
      let postReturn = await service.post($(e).data('action'), { order_product: formData, remark: this.remark, ...this.$route.query })
      this.$bar.finish()
      if (!postReturn.code) {
        if (postReturn.location !== '') {
          if (postReturn.confirm !== '') {
            if (window.confirm(postReturn.confirm)) {
              this.$router.push(postReturn.location)
            }
          } else {
            this.$router.push(postReturn.location)
          }
        } else {
          alert('确认成功!')
          this.$router.go(-1)
        }
      } else {
        alert(postReturn.message)
      }
    },
    set_app_controller () {
      this.$store.commit('SET_APP_CONTROLLER', { controller: this.c })
    }
  },
  components: {
    WorkOutFunc,
    WorkOutInfo,
    WorkOutCard
  }
}
</script>
