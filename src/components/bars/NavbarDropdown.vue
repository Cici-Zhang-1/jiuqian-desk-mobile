<template>
  <div class="nav-item dropup">
    <router-link class="nav-link dropdown-toggle" exact-active-class="active" data-toggle="dropdown" :to="navbar.url" role="button" aria-haspopup="true" aria-expanded="false" ><i class="fa-2x" :class="[navbar.img]"></i></router-link>
    <div class="dropdown-menu">
      <router-link class="dropdown-item py-2" v-for="(fun, key) in funcsR" :key="key" :to="fun.url" ><i :class="fun.img"></i>{{ fun.name }}</router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NavbarDropdown',
  props: ['navbar'],
  data () {
    return {
      funcsR: []
    }
  },
  created () {
    this.funcsR = this.navbar.funcs.filter(__ => {
      return __.url !== 'javascript:void(0);' // 空值不需要显示
    }).reverse() // 从低到高显示
  }
}
</script>
