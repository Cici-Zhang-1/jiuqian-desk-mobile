<template>
  <div id="app">
    <nav class="navbar navbar-expand-md navbar-light bg-light j-navbar">
      <a class="navbar-brand" href="/">{{ configs.title }}</a>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#jNavbar" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="jNavbar">
        <ul id="jMenu" is="Menubar" :apps="apps"></ul>
        <ul class="navbar-nav ml-auto">
          <li class="nav-item"><a class="nav-link" href="javascript:void(0);">{{ user.truename }}</a></li>
          <li class="nav-item"><a class="nav-link" href="/sign/out"><i class="fa fa-sign-out"></i>退出</a></li>
        </ul>
      </div>
    </nav>
    <div class="container-fluid">
      <div class="row">
        <div class="col-12 col-sm-12 col-md-11 col-lg-11 offset-md-1 offset-lg-1" id="jContent">
          <router-view />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Menubar from '@/components/bars/Menubar'
import { mapGetters } from 'vuex'
export default {
  name: 'App',
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
  components: {
    Menubar
  },
  created () {
    /* if (JSON.stringify(this.user) === '{}') {
      this.$store.dispatch('FETCH_USER')
    }
    if (JSON.stringify(this.configs) === '{}') {
      this.$store.dispatch('FETCH_CONFIGS')
    } */
    document.title = this.configs.title
  }
}
</script>
