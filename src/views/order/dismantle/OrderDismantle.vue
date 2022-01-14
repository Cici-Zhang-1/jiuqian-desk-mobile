<template>
  <div class="row mt-3 j-page" :id="title">
    <div class="col-12 border-bottom rounded-bottom mb-2 border-primary text-center d-print-none"><h5>{{ label }}</h5></div>
    <div class="col-md-6 mb-2 mb-md-3 d-print-none" v-if="dismantleData"><small>{{ dismantleData['order_info']['num'] }}-{{ dismantleData['order_info']['dealer'] }}-{{ dismantleData['order_info']['owner'] }}</small></div>
    <div is="order-dismantle-func" @save-tmp="saveTmp($event)" @save="save($event)" @clear="clear($event)" @remove="remove($event)" @add="add($event)" @repeat="repeat($event)" @re_dismantle="reDismantle($event)"></div>
    <div class="col-12" v-if="!error && dismantleData">
      <div class="card border-0 mb-5">
        <div class="card-body p-0 card-body-h">
          <ul class="nav nav-tabs" id="orderDismantleTab" role="tablist">
            <li class="nav-item">
              <a class="nav-link" :class="{'diff-red': isDismantlable('W'), active: dismantleData['order_info']['code'] === 'W'}" data-toggle="tab" data-code="W" href="#dismantleW" role="tab" aria-controls="cabinet" :aria-selected="dismantleData['order_info']['code'] === 'W'">橱柜</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" :class="{active: dismantleData['order_info']['code'] === 'Y', 'diff-red': isDismantlable('Y')}" data-toggle="tab" data-code="Y" href="#dismantleY" role="tab" aria-controls="wardrobe" :aria-selected="dismantleData['order_info']['code'] === 'Y'">衣柜</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" :class="{'diff-red': isDismantlable('M'), active: dismantleData['order_info']['code'] === 'M'}" data-toggle="tab" data-code="M" href="#dismantleM" role="tab" aria-controls="door" :aria-selected="dismantleData['order_info']['code'] === 'M'">门板</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" :class="{'diff-red': isDismantlable('K'), active: dismantleData['order_info']['code'] === 'K'}" data-toggle="tab" data-code="K" href="#dismantleK" role="tab" aria-controls="wood" :aria-selected="dismantleData['order_info']['code'] === 'K'">木框门</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" :class="{'diff-red': isDismantlable('P'), active: dismantleData['order_info']['code'] === 'P'}" data-toggle="tab" data-code="P" href="#dismantleP" role="tab" aria-controls="fitting" :aria-selected="dismantleData['order_info']['code'] === 'P'">配件</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" :class="{'diff-red': isDismantlable('G'), active: dismantleData['order_info']['code'] === 'G'}" data-toggle="tab" data-code="G" href="#dismantleG" role="tab" aria-controls="other" :aria-selected="dismantleData['order_info']['code'] === 'G'">外购</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" :class="{'diff-red': isDismantlable('F'), active: dismantleData['order_info']['code'] === 'F'}" data-toggle="tab" data-code="F" href="#dismantleF" role="tab" aria-controls="server" :aria-selected="dismantleData['order_info']['code'] === 'F'">服务</a>
            </li>
          </ul>
          <div class="tab-content" id="orderDismantleTabContent">
            <div is="order-dismantle-cabinet" :class="{active: dismantleData['order_info']['code'] === 'W', show: dismantleData['order_info']['code'] === 'W'}" :dismantleUrl="dismantleUrl"></div>
            <div is="order-dismantle-wardrobe" :class="{active: dismantleData['order_info']['code'] === 'Y', show: dismantleData['order_info']['code'] === 'Y'}" :dismantleUrl="dismantleUrl"></div>
            <div is="order-dismantle-door" :class="{active: dismantleData['order_info']['code'] === 'M', show: dismantleData['order_info']['code'] === 'M'}" :dismantleUrl="dismantleUrl"></div>
            <div is="order-dismantle-wood" :class="{active: dismantleData['order_info']['code'] === 'K', show: dismantleData['order_info']['code'] === 'K'}" :dismantleUrl="dismantleUrl"></div>
            <div is="order-dismantle-fitting" :class="{active: dismantleData['order_info']['code'] === 'P', show: dismantleData['order_info']['code'] === 'P'}" :dismantleUrl="dismantleUrl"></div>
            <div is="order-dismantle-other" :class="{active: dismantleData['order_info']['code'] === 'G', show: dismantleData['order_info']['code'] === 'G'}" :dismantleUrl="dismantleUrl"></div>
            <div is="order-dismantle-server" :class="{active: dismantleData['order_info']['code'] === 'F', show: dismantleData['order_info']['code'] === 'F'}" :dismantleUrl="dismantleUrl"></div>
          </div>
        </div>
      </div>
    </div>
    <div class="col-12 mt-2" v-if="error">{{ errorMsg }}</div>
    <div class="col-12 mt-2 text-center" v-if="loading"><i class="fa fa-spinner fa-spin fa-5x"></i></div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { nameToId, cloneData } from '@/assets/js/custom'
import $ from 'jquery'
import { OP_CREATE, OP_DISMANTLING, OP_DISMANTLED } from '@/assets/js/constants'
import service from '@/axios'
import OrderDismantleFunc from './OrderDismantleFunc'
import OrderDismantleCabinet from './OrderDismantleCabinet'
import OrderDismantleWardrobe from './OrderDismantleWardrobe'
import OrderDismantleDoor from './OrderDismantleDoor'
import OrderDismantleWood from './OrderDismantleWood'
import OrderDismantleFitting from './OrderDismantleFitting'
import OrderDismantleOther from './OrderDismantleOther'
import OrderDismantleServer from './OrderDismantleServer'
import { pubMixins } from '@/views/mixins'

let self

export default {
  mixins: [ pubMixins ],
  name: 'OrderDismantle',
  data () {
    return {
      title: '',
      f: 'order',
      c: 'dismantle',
      activeCode: 'W',
      error: true,
      errorMsg: '',
      loading: false,
      dismantleUrl: '/order/dismantle/read'
    }
  },
  computed: {
    ...mapGetters({
      label: 'currentLabel'
    }),
    dismantleData: {
      get () {
        let a = this.$store.getters.getSourceData({ uri: this.dismantleUrl })
        return JSON.stringify(a) === '{}' ? false : a
      }
    }
  },
  created () {
    self = this
    this.set_app_controller()
    this.$store.commit('RESET_SOURCE_DATA', { target: this.dismantleUrl })
    this.fetchData(true)
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.title = nameToId(vm.c)
    })
  },
  watch: {
    '$route': function (to, from) { // route变化时更新数据
      if (this.dismantleData.order_info === false) {
      }
    },
    '$store.state.app.reload': {
      handler: function (to, from) {
        if (to) {
          this.$store.commit('RESET_SOURCE_DATA', { target: this.dismantleUrl })
          this.fetchData(true)
          this.$store.commit('SET_APP_RELOAD', { reload: false })
        }
      },
      deep: true
    }
  },
  methods: {
    async saveTmp (e) { // Modal数据数据提交
      let Code = $('#orderDismantleTab').find('a.active').data('code')
      let orderProduct = self.dismantleData[$('#orderDismantleTab').find('a.active').data('code')]['order_product'].filter(__ => {
        return __.v === self.dismantleData['order_info']['order_product_id']
      })[0]
      if (orderProduct === undefined) {
        alert('请先选择需要暂存的订单!')
      } else {
        orderProduct = cloneData(orderProduct)
        if (!this.checkStatus(orderProduct)) {
          return false
        }
        if (Code === 'W' || Code === 'Y') {
          if (!(self.checkBd(orderProduct))) {
            return false
          }
        }
        let postReturn = await service.post($(e).data('action'), { ...orderProduct, save: 'dismantling' })
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
      }
    },
    async save (e) {
      let Code = $('#orderDismantleTab').find('a.active').data('code')
      let orderProduct = self.dismantleData[Code]['order_product'].filter(__ => {
        return __.v === self.dismantleData['order_info']['order_product_id']
      })[0]
      if (orderProduct === undefined) {
        alert('请先选择需要确认的订单!')
      } else {
        if (!this.checkStatus(orderProduct)) {
          return false
        }
        if (Code === 'W' || Code === 'Y') {
          if (!(self.checkBd(orderProduct))) {
            return false
          }
        }
        orderProduct = cloneData(orderProduct)
        let postReturn = await service.post($(e).data('action'), { ...orderProduct, save: 'dismantled' })
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
      }
    },
    checkStatus (orderProduct) {
      let status = parseInt(orderProduct.status)
      if (status === OP_DISMANTLED) {
        if (!confirm(orderProduct['num'] + '已经确认拆单, 是否重新拆单?')) {
          return false
        } else {
          orderProduct['re_dismantle'] = true
        }
      }
      return true
    },
    checkBd (orderProduct) { // 检查Bd文件
      let NonQrocde = orderProduct['order_product_board_plate'].filter(__ => {
        return (__.qrcode !== null && __.qrcode !== '') && (__.bd_file === null || __.bd_file === '') && (__.mpr_file === null || __.mpr_file === '')
      }).map(__ => {
        return __.qrcode
      }).join(',') || ''
      if (NonQrocde !== '') {
        return confirm(NonQrocde + '没有上传BD或MPR文件, 是否继续提交?')
      }
      return true
    },
    async clear (e) {
      let orderProduct = self.dismantleData[$('#orderDismantleTab').find('a.active').data('code')]['order_product'].filter(__ => {
        return __.v === self.dismantleData['order_info']['order_product_id']
      })[0]
      if (orderProduct === undefined) {
        alert('请先选择需要清除的订单!')
      } else {
        if (confirm('您确定要清除' + orderProduct['num'] + '的板块信息吗?')) {
          let postReturn = await service.post($(e).data('action'), { order_product_id: orderProduct['v'] })
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
              alert('清除成功!')
              this.$store.commit('SET_APP_RELOAD', { reload: true })
            }
          } else {
            alert(postReturn.message)
          }
        }
      }
    },
    async add (e) {
      let product = self.dismantleData[$('#orderDismantleTab').find('a.active').data('code')]['product']
      if (product === undefined) {
        alert('请先选择需要要创建的产品!')
      } else {
        if (product['set'] === '' || product['set'] < 1) {
          product['set'] = 1
        }
        if (confirm('您确定要创建' + product['set'] + '套' + product['name'] + '吗?')) {
          let postReturn = await service.post($(e).data('action'), { order_id: self.dismantleData['order_info']['order_id'], product_id: product['v'], set: product['set'], product: product['name'], remark: product['remark'] })
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
              alert('创建成功!')
              this.$store.commit('SET_APP_RELOAD', { reload: true })
            }
          } else {
            alert(postReturn.message)
          }
        }
      }
    },
    async reDismantle (e) {
      if (confirm('您确定要重新拆单吗?')) {
        let postReturn = await service.post($(e).data('action'), { ...this.$router.currentRoute.query })
        if (!postReturn.code) {
          alert('重新拆单成功!')
          this.$store.commit('SET_APP_RELOAD', { reload: true })
        } else {
          alert(postReturn.message)
        }
      }
    },
    async remove (e) {
      let orderProduct = self.dismantleData[$('#orderDismantleTab').find('a.active').data('code')]['order_product'].filter(__ => {
        return __.v === self.dismantleData['order_info']['order_product_id']
      })[0]
      if (orderProduct === undefined) {
        alert('请先选择需要删除的订单产品!')
      } else {
        if (confirm('您确定要删除' + orderProduct['num'] + '吗?')) {
          let postReturn = await service.post($(e).data('action'), { v: orderProduct['v'] })
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
              alert('删除成功!')
              this.$store.commit('SET_APP_RELOAD', { reload: true })
            }
          } else {
            alert(postReturn.message)
          }
        }
      }
    },
    async repeat (e) {
      let product = self.dismantleData[$('#orderDismantleTab').find('a.active').data('code')]['product']
      let orderProduct = self.dismantleData[$('#orderDismantleTab').find('a.active').data('code')]['order_product'].filter(__ => {
        return __.v === self.dismantleData['order_info']['order_product_id']
      })[0]
      if (orderProduct === undefined) {
        alert('请先选择需要复制的订单产品!')
      } else {
        if (product['set'] === '' || product['set'] < 1) {
          product['set'] = 1
        }
        if (confirm('您确定要复制' + product['set'] + '套' + orderProduct['num'] + '的板块信息吗?')) {
          this.$bar.start()
          let postReturn = await service.post($(e).data('action'), { v: orderProduct['v'], set: product['set'] })
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
              alert('复制成功!')
              this.$store.commit('SET_APP_RELOAD', { reload: true })
            }
          } else {
            alert(postReturn.message)
          }
        }
      }
    },
    isDismantlable (Code) {
      return this.dismantleData[Code] && this.dismantleData[Code]['order_product'] && this.dismantleData[Code]['order_product'].filter(__ => {
        let status = parseInt(__.status)
        return status === OP_CREATE || status === OP_DISMANTLING
      }).length
    },
    set_app_controller () {
      this.$store.commit('SET_APP_CONTROLLER', { controller: this.c })
    },
    fetchData (Reload = false) {
      if (Reload || typeof this.dismantleData === 'undefined' || JSON.stringify(this.dismantleData) === '{}' || this.dismantleData.order_info === false) {
        let self = this
        this.loading = true
        this.error = false
        this.$store.dispatch('FETCH_SOURCE_DATA', {
          url: this.dismantleUrl,
          configs: {
            params: { ...this.$router.currentRoute.query }
          },
          target: this.dismantleUrl
        }).then((res) => {
          if (res.code > 0) {
            self.errorMsg = res.message
            self.error = true
          }
          self.loading = false
        })
      } else {
        this.error = false
      }
    }
  },
  components: {
    OrderDismantleFunc,
    OrderDismantleCabinet,
    OrderDismantleWardrobe,
    OrderDismantleDoor,
    OrderDismantleWood,
    OrderDismantleFitting,
    OrderDismantleOther,
    OrderDismantleServer
  }
}
</script>
