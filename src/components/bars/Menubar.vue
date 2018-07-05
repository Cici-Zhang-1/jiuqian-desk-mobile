<template>
  <ul class="navbar-nav mr-auto menu">
    <li v-for="(app, key, index) in apps" :is="li_type(app)" :app="app" :key="index"></li>
  </ul>
</template>

<script>
import RegularLi from './RegularLi'
import DropdownLi from './DropdownLi'
export default {
  name: 'Menubar',
  props: {
    apps: {
      required: true
    }
  },
  methods: {
    li_type (app) {
      if (app.class === 0 && app.url !== 'javascript:void(0);' && app.url !== '#') {
        return 'RegularLi'
      } else {
        return 'DropdownLi'
      }
    }
  },
  components: {
    RegularLi,
    DropdownLi
  }
}
</script>
