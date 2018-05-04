<template>
  <div class="col-3 my-2" @click="openApp({app})">
    <router-link class="btn p-1 text-center" :to="app.url" tag="a"><i class="d-block fa-2x" :class="[app.img]"></i><small>{{ app.name }}</small></router-link>
  </div>
</template>

<script type="module">
import { mapMutations } from 'vuex'

export default {
  name: 'RegularApp',
  props: ['app'],
  data () {
    return {}
  },
  methods: {
    ...mapMutations({
      openApp: 'OPEN_APP'
    })
  }
}
</script>
