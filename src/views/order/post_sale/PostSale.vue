<template>
  <div class="row mt-3 j-page" :id="title">
    <div class="col-12 border-bottom rounded-bottom mb-2 border-primary text-center d-print-none"><h5>{{ label }}</h5></div>
    <div class="col-md-6 mb-2 mb-md-3 d-print-none" v-if="postSaleData"><small>{{ postSaleData['order_info']['num'] }}-{{ postSaleData['order_info']['dealer'] }}-{{ postSaleData['order_info']['owner'] }}</small></div>
    <div is="post-sale-func" @save="save($event)" ></div>
    <div class="col-12" v-if="!error && postSaleData">
      <div class="card border-0 mb-5">
        <div class="card-body p-0 card-body-h">
          <ul class="nav nav-tabs" id="postSaleTab" role="tablist">
            <li class="nav-item">
              <a class="nav-link" :class="{'diff-red': isPostSalable('P'), active: postSaleData['order_info']['code'] === 'P'}" data-toggle="tab" data-code="P" href="#postSaleP" role="tab" aria-controls="fitting" :aria-selected="postSaleData['order_info']['code'] === 'P'">配件</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" :class="{'diff-red': isPostSalable('G'), active: postSaleData['order_info']['code'] === 'G'}" data-toggle="tab" data-code="G" href="#postSaleG" role="tab" aria-controls="other" :aria-selected="postSaleData['order_info']['code'] === 'G'">外购</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" :class="{'diff-red': isPostSalable('F'), active: postSaleData['order_info']['code'] === 'F'}" data-toggle="tab" data-code="F" href="#postSaleF" role="tab" aria-controls="server" :aria-selected="postSaleData['order_info']['code'] === 'F'">服务</a>
            </li>
          </ul>
          <div class="tab-content" id="postSaleTabContent">
            <div is="post-sale-fitting" :class="{active: postSaleData['order_info']['code'] === 'P', show: postSaleData['order_info']['code'] === 'P'}" :postSaleUrl="postSaleUrl"></div>
            <div is="post-sale-other" :class="{active: postSaleData['order_info']['code'] === 'G', show: postSaleData['order_info']['code'] === 'G'}" :postSaleUrl="postSaleUrl"></div>
            <div is="post-sale-server" :class="{active: postSaleData['order_info']['code'] === 'F', show: postSaleData['order_info']['code'] === 'F'}" :postSaleUrl="postSaleUrl"></div>
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
import { OP_DISMANTLED } from '@/assets/js/constants'
import service from '@/axios'
import PostSaleFunc from './PostSaleFunc'
import PostSaleFitting from './PostSaleFitting'
import PostSaleOther from './PostSaleOther'
import PostSaleServer from './PostSaleServer'

let self

export default {
  name: 'PostSale',
  data () {
    return {
      title: '',
      f: 'order',
      c: 'post_sale',
      activeCode: 'P',
      error: true,
      errorMsg: '',
      loading: false,
      postSaleUrl: '/order/post_sale/read'
    }
  },
  computed: {
    ...mapGetters({
      label: 'currentLabel'
    }),
    postSaleData: {
      get () {
        let a = this.$store.getters.getSourceData({ uri: this.postSaleUrl })
        return JSON.stringify(a) === '{}' ? false : a
      }
    }
  },
  created () {
    self = this
    this.set_app_controller()
    this.$store.commit('RESET_SOURCE_DATA', { target: this.postSaleUrl })
    this.fetchData(true)
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
          this.$store.commit('RESET_SOURCE_DATA', { target: this.postSaleUrl })
          this.fetchData(true)
          this.$store.commit('SET_APP_RELOAD', { reload: false })
        }
      },
      deep: true
    }
  },
  methods: {
    async save (e) {
      let Code = $('#postSaleTab').find('a.active').data('code')
      let orderProduct = self.postSaleData[Code]['order_product'].filter(__ => {
        return __.v === self.postSaleData['order_info']['order_product_id']
      })[0]
      if (orderProduct === undefined) {
        alert('请先选择需要确认的订单!')
      } else {
        orderProduct = cloneData(orderProduct)
        let postReturn = await service.post($(e).data('action'), { ...orderProduct })
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
    isPostSalable (Code) {
      return this.postSaleData[Code] && this.postSaleData[Code]['order_product'] && this.postSaleData[Code]['order_product'].filter(__ => {
        let status = parseInt(__.status)
        return status >= OP_DISMANTLED
      }).length
    },
    set_app_controller () {
      this.$store.commit('SET_APP_CONTROLLER', { controller: this.c })
    },
    fetchData (Reload = false) {
      if (Reload || typeof this.postSaleData === 'undefined' || JSON.stringify(this.postSaleData) === '{}' || this.postSaleData.order_info === false) {
        let self = this
        this.loading = true
        this.error = false
        this.$store.dispatch('FETCH_SOURCE_DATA', {
          url: this.postSaleUrl,
          configs: {
            params: { ...this.$router.currentRoute.query }
          },
          target: this.postSaleUrl
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
    PostSaleFunc,
    PostSaleFitting,
    PostSaleOther,
    PostSaleServer
  }
}
</script>
