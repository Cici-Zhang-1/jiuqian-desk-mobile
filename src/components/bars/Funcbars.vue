<template>
  <header class="navbar navbar-expand navbar-light bg-light fixed-top">
    <a class="navbar-brand mr-auto" @click.prevent="goBack" href="#"><i class="fa fa-angle-double-left"></i></a>
    <ul class="navbar-nav">
      <li class="nav-item"></li>
    </ul>
  </header>
</template>

<script>
export default {
  name: 'Funcbars',
  data () {
    return {}
  },
  methods: {
    goBack () {
      window.history.length > 1
        ? this.$router.go(-1)
        : this.$router.push('/')
    },
    funcSave () {
      this.goBack()
    }
  }
}
</script>
