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
      <div class="row">
        <div class="col-12">
          <ul class="list-group">
            <li class="list-group-item">
              <div class="row align-items-center">
                <div class="col-2 offset-1 bg-primary name-image rounded text-white"><h3 class="">{{ myself.name.slice(myself.name.length - 1) }}</h3></div>
                <div class="col-7 offset-1">
                  <ul class="list-unstyled text-primary">
                    <li><h5>{{ myself.name }}</h5></li>
                    <li>{{ myself.telephone }}</li>
                    <li>{{ myself.department }}</li>
                  </ul>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div is="func-lists" class="row my-3" v-for="(value, key, index) in myself.funcs" :funcList="value" :key="index"></div>
    </main>
  </div>
</template>

<script type="module">
import { mapGetters } from 'vuex'
import Navbar from '@/components/bars/Navbar'
import Headerbar from '@/components/bars/Headerbar'
import FuncLists from '@/components/lists/FuncLists'

export default {
  name: 'myself',
  data () {
    return {}
  },
  computed: {
    myself () {
      return this.$root.$data.myself
    },
    ...(mapGetters({
      navbars: 'activeNavbars'
    }))
  },
  components: {
    Navbar,
    Headerbar,
    FuncLists
  }
}
</script>

<style scoped>
.name-image {
  padding: 15px;
}
.name-image h3 {
  margin: 0;
}
</style>
