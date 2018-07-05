<template>
  <header class="navbar navbar-expand navbar-light bg-light fixed-top">
    <router-link class="navbar-brand mr-auto" :to="config.url" >{{ config.label || config.name }}</router-link>
    <ul class="navbar-nav">
      <li class="nav-item">
        <span class="navbar-text">{{ myselfName }}</span>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="#"><i class="fa fa-sign-out"></i></a>
      </li>
    </ul>
  </header>
</template>

<script type="module">
import { mapState } from 'vuex'

export default {
  name: 'Headerbar',
  data () {
    return {}
  },
  computed: {
    ...mapState({
      config: 'configs',
      myselfName: state => state.myself.name
    })
  }
}
</script>
