import PrintOrderTable from './PrintOrderTable'
import { mapGetters } from 'vuex'
import { nameToId } from '@/assets/js/custom'
let printMixins = {
  data () {
    return {
      title: '',
      f: 'print',
      reload: false
    }
  },
  computed: {
    ...mapGetters({
      cards: 'currentPageCards', // 当前页面应该展示的数据
      label: 'currentLabel'
    })
  },
  created () {
    this.set_app_controller()
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.title = nameToId(vm.c)
    })
  },
  watch: {
    '$store.state.app.reload': {
      handler: function (to, from) {
        if (to) {
          this.reload = !this.reload
          this.$store.commit('SET_APP_RELOAD', { reload: false })
        }
      },
      deep: true
    }
  },
  methods: {
    get_card ($Name) {
      return this.cards.filter(__ => {
        return __.name === $Name
      })[0]
    },
    set_app_controller () {
      this.$store.commit('SET_APP_CONTROLLER', { controller: this.c })
    }
  },
  components: {
    PrintOrderTable
  }
}

let printTableMixins = {
  props: {
    card: {
      type: Object
    },
    reload: {
      type: Boolean
    }
  },
  data () {
    return {
      errorMsg: 'No Data Available',
      error: false,
      loading: true
    }
  },
  created () {
    this.fetchData()
  },
  watch: {
    reload: {
      handler: function (to, from) {
        this.fetchData()
      }
    }
  },
  methods: {
    show (Name) {
      return this.card.elements[Name] && this.card.elements[Name].checked_name
    },
    fetchData () { // 获取数据
      let self = this
      this.loading = true
      this.error = false
      this.$store.dispatch('FETCH_DATA', {
        url: this.card.url,
        configs: {
          params: {
            ...this.$router.currentRoute.query
          }
        },
        target: this.card
      }).then((res) => {
        if (res.code > 0) {
          self.errorMsg = res.message
          self.error = true
        }
      }).catch(err => {
        self.errorMsg = err.message
        self.error = true
      }).finally(() => {
        self.loading = false
      })
    }
  }
}

export { printMixins, printTableMixins }
