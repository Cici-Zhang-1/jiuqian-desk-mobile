<template>
  <div class="row mt-3 j-page" :id="title">
    <div class="col-12 border-bottom rounded-bottom mb-2 border-primary text-center d-print-none"><h5>{{ label }}</h5></div>
    <div class="col-md-6 mb-2 mb-md-3 d-print-none"></div>
    <div is="valuate-func" @save-tmp="saveTmp($event)" @save="save($event)" @re_valuate="reValuate($event)"></div>
    <div is="order-card" :card="get_card('valuate_add_table')" :formPages="formPages" v-if="cards" :reload="reload"></div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import OrderCard from './OrderCard'
import ValuateFunc from './ValuateFunc'
import { nameToId, cloneData } from '@/assets/js/custom'
import $ from 'jquery'
import service from '@/axios'
let self

export default {
  name: 'Valuate',
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
      formPages: 'currentFormPages',
      label: 'currentLabel'
    })
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
    async saveTmp (e) {
      let formData = {}
      self.formPages.map(__ => {
        if (__.valuate.content) {
          formData[__.name] = cloneData(__.valuate.content)
        }
        return __
      })
      let postReturn = await service.post($(e).data('action'), { ...formData, save: 'valuating', ...self.$router.currentRoute.query })
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
          alert('暂存成功!')
          this.$store.commit('SET_APP_RELOAD', { reload: true })
        }
      } else {
        alert(postReturn.message)
      }
    },
    async save (e) {
      let formData = {}
      self.formPages.map(__ => {
        if (__.valuate.content) {
          formData[__.name] = cloneData(__.valuate.content)
        }
        return __
      })
      if (!(self.checkSum(formData))) {
        return false
      }
      let postReturn = await service.post($(e).data('action'), { ...formData, save: 'valuated', ...self.$router.currentRoute.query })
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
    async reValuate (e) {
      if (confirm('您确定要重新计价吗?')) {
        let postReturn = await service.post($(e).data('action'), { ...this.$router.currentRoute.query })
        if (!postReturn.code) {
          alert('重新计价成功!')
          this.$store.commit('SET_APP_RELOAD', { reload: true })
        } else {
          alert(postReturn.message)
        }
      }
    },
    checkSum (formData) { // 检查金额是否存在为0的项目
      let str = ''
      Object.keys(formData).map(__ => {
        formData[__].map(___ => {
          if (___.sum <= 0) {
            str += ___.num + ___.name + '计价为0;'
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
    ValuateFunc
  }
}
</script>
