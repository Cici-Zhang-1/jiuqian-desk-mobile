<template>
  <nav class="navbar navbar-expand-md navbar-light bg-light d-print-none j-navbar j-fixed-top">
    <a class="navbar-brand" href="/#/home" >{{ configs.title }}</a>
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#jNavbar" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="jNavbar" >
      <ul id="jMenu" is="Menubar" :apps="apps"></ul>
      <ul class="navbar-nav ml-auto">
        <li class="nav-item"><a class="nav-link" href="javascript:void(0);" @click="clearCache()">清缓存</a></li>
        <li class="nav-item"><a class="nav-link" href="javascript:void(0);">{{ user.truename }}</a></li>
        <li class="nav-item"><a class="nav-link" href="/sign/out" @click.prevent="sign_out"><i class="fa fa-sign-out"></i>退出</a></li>
      </ul>
    </div>
  </nav>
</template>

<script>
import Menubar from '@/components/bars/Menubar'
import { mapGetters } from 'vuex'
import service from '@/axios'
import $ from 'jquery'

export default {
  name: 'Header',
  computed: {
    user () {
      return this.$store.state.user
    },
    configs () {
      return this.$store.state.configs
    },
    ...mapGetters({
      apps: 'getApps'
    })
  },
  watch: {
    '$store.state.collapse': { // 改变collapse状态
      handler: function (to, from) {
        if (to) {
          this.collapse()
          this.$store.commit('SET_COLLAPSE', { collapse: false })
        }
      }
    }
  },
  methods: {
    async sign_out (event) { // 退出登录
      let getReturn = await service.get('/sign/out')
      this.$store.commit('SET_SIGNIN', { signin: true })
      !parseInt(getReturn.code) && this.$router.push('/sign/index/in')
    },
    collapse: function () {
      $('.collapse').collapse('toggle')
    },
    clearCache: function () {
      localStorage.clear()
    }
  },
  components: {
    Menubar
  }
}
</script>
