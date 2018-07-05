<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col">
        <navbar :navbars="navbars" />
      </div>
    </div>
    <main>
      <div class="row">
        <div class="col">
          <headerbar />
        </div>
      </div>
      <router-view></router-view>
    </main>
  </div>
</template>

<script type="module">
import { mapGetters } from 'vuex'
import Navbar from '@/components/bars/Navbar'
import Headerbar from '@/components/bars/Headerbar'

export default {
  name: 'App',
  data () {
    return {}
  },
  computed: {
    ...(mapGetters({
      navbars: 'activeNavbars'
    }))
  },
  components: {
    Navbar,
    Headerbar
  }
}
</script>
