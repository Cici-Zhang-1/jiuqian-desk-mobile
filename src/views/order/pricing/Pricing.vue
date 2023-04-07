<template>
  <div class="row mt-3 j-page" :id="title">
    <div class="col-12 border-bottom rounded-bottom mb-2 border-primary text-center d-print-none"><h5>{{ label }}</h5></div>
    <div class="col-md-6 mb-2 mb-md-3 d-print-none"></div>
    <div is="pricing-func" @save="save($event)" ></div>
    <div is="order-card" :card="get_card('pricing_add_table')" :formPages="formPages" v-if="cards" :reload="reload"></div>
    <div class="col-12">
      <div class="form-group row">
        <label class="col-md-2 col-form-label float-right">总额:</label>
        <div class="col-md-9">
          <input class="form-control input-sm bg-hint" name="check_sum" type="number" v-model="sum" readonly />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import OrderCard from './OrderCard'
import PricingFunc from './PricingFunc.vue'
import { nameToId, cloneData } from '@/assets/js/custom'
import $ from 'jquery'
import service from '@/axios'
import { pubMixins } from '@/views/mixins'
let self

export default {
  mixins: [ pubMixins ],
  name: 'Pricing',
  data () {
    return {
      title: '',
      f: 'order',
      c: 'order_detail',
      reload: false,
      diff: 0
    }
  },
  computed: {
    ...mapGetters({
      cards: 'currentPageCards', // 当前页面应该展示的数据
      formPages: 'currentFormPages',
      label: 'currentLabel'
    }),
    formSum: {
      get () {
        let a = 0
        this.formPages && this.formPages.map(__ => {
          if (__.pricing && __.pricing.content) {
            __.pricing.content.map(___ => {
              a = a + ___.check_sum * 1
              return ___
            })
          }
          return __
        })
        return a
      }
    },
    sum: {
      get () {
        return Math.ceil(this.formSum + this.diff)
      },
      set (newValue) {
        this.diff = newValue - this.formSum
      }
    }
  },
  created () {
    self = this
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
    },
    'formSum': {
      handler: function (to, from) {
        this.diff = 0
      }
    }
  },
  methods: {
    get_card ($Name) {
      return this.cards.filter(__ => {
        return __.name === $Name
      })[0]
    },
    get_form ($Name) {
      return this.formPages.filter(__ => {
        return __.name === $Name
      })[0]
    },
    set_app_controller () {
      this.$store.commit('SET_APP_CONTROLLER', { controller: this.c })
    },
    async save (e) {
      let formData = {}
      self.formPages.map(__ => {
        if (__.pricing.content) {
          formData[__.name] = cloneData(__.pricing.content)
        }
        return __
      })
      if (!(self.checkSum(formData))) {
        return false
      }
      let postReturn = await service.post($(e).data('action'), { ...formData, sum: self.sum, ...self.$router.currentRoute.query })
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
          this.$store.commit('SET_APP_RELOAD', { reload: true })
        }
      } else {
        alert(postReturn.message)
      }
    },
    checkSum (formData) { // 检查金额是否存在为0的项目
      let str = ''
      Object.keys(formData).map(__ => {
        formData[__].map(___ => {
          if (___.sum <= 0) {
            str += ___.num + ___.name + '核价为0;'
          }
          return ___
        })
        return __
      })
      if (str !== '') {
        return confirm(str)
      } else {
        return true
      }
    }
  },
  components: {
    OrderCard,
    PricingFunc
  }
}
</script>
