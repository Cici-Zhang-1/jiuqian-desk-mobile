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
      <div is="regular-app-group" v-for="(value, index) in apps" :appItem="value" :key="index" class="row mb-4"></div>
    </main>
  </div>
</template>

<script type="module">
import { mapGetters } from 'vuex'
import Navbar from '@/components/bars/Navbar'
import Headerbar from '@/components/bars/Headerbar'
import RegularAppGroup from '@/components/apps/RegularAppGroup.vue'

export default {
  name: 'apps',
  computed: {
    apps () {
      return this.$store.getters.getStateByKey('apps')
    },
    ...(mapGetters({
      navbars: 'activeNavbars'
    }))
  },
  components: {
    Navbar,
    Headerbar,
    RegularAppGroup
  }
}
</script>
