<template>
  <router-link class="nav-item nav-link" exact-active-class="active" :to="navbar.url"><i class="fa-2x" :class="[navbar.img]"></i></router-link>
</template>

<script>
export default {
  name: 'NavbarItem',
  props: ['navbar']
}
</script>
