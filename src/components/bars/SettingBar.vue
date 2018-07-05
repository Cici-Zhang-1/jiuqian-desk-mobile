<template>
  <header class="navbar navbar-expand navbar-light bg-light fixed-top">
    <a class="navbar-brand mr-auto" @click.prevent="goBack" href="#"><i class="fa fa-angle-double-left"></i></a>
    <ul class="navbar-nav">
      <li class="nav-item">
        <a class="nav-link" @click.prevent="settingSave" href="#">保存</a>
      </li>
    </ul>
  </header>
</template>

<script>
// import $ from 'jquery'
// import { settingSave } from '@/assets/js/custom'

export default {
  name: 'SettingBar',
  data () {
    return {

    }
  },
  methods: {
    goBack () {
      window.history.length > 1
        ? this.$router.go(-1)
        : this.$router.push('/')
    },
    settingSave () {
      this.goBack()
    }
  }
}
</script>
