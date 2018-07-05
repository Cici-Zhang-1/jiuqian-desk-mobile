<template>
  <div id="app">
    <div is="Header" v-if="!is_signin" ></div>
    <div class="container-fluid j-contanier-top">
      <div class="row">
        <div class="col-12 col-sm-12 col-md-11 col-lg-11 offset-md-1 offset-lg-1" id="jContent">
          <router-view />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Header from '@/views/Header'
import { mapGetters } from 'vuex'

export default {
  name: 'App',
  computed: {
    ...mapGetters({
      is_signin: 'getSignin',
      configs: 'getConfigs'
    })
  },
  created () {
    document.title = this.configs.title
  },
  components: {
    Header
  }
}
</script>
