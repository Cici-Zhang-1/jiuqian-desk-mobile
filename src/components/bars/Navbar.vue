<template>
  <nav class="nav nav-pills nav-fill fixed-bottom border-top border-secondary bg-light j-nav-lg">
    <div v-for="(navbar, key, index) in navbars" :navbar="navbar" :key="index" :is="navbar.component" ></div>
  </nav>
</template>

<script type="module">
import NavbarItem from './NavbarItem.vue'
import NavbarDropdown from './NavbarDropdown.vue'

export default {
  name: 'Navbar',
  props: ['navbars'],
  components: {
    NavbarItem,
    NavbarDropdown
  }
}
</script>
