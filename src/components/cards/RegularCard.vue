<template>
  <div class="col-12">
    <div class="card mb-5" v-if="!error">
      <div class="card-body p-0 card-body-h">
        <regular-table v-if="card.card_type_name === 'table'" :table="card.data.content" :tableThead="card.elements" :search="search"/>
        <regular-list-group v-else-if="card.card_type_name === 'list'" :lists="card.data.content"/>
        <check-lists class="p-1" v-else-if="card.card_type_name === 'checkbox'" :checkLists="card.data.content"/>
      </div>
      <div class="card-footer p-0">
        <pagination :page="page" :maxPage="maxPage" :num="num" :pagesize="pagesize"/>
      </div>
    </div>
    <div class="col-12 mt-2" v-if="error">No Data Available</div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import RegularTable from '@/components/tables/RegularTable'
import RegularListGroup from '@/components/lists/RegularListGroup'
import CheckLists from '@/components/forms/CheckLists'
import Pagination from '@/components/others/Pagination'

export default {
  name: 'RegularCard',
  props: {
    card: {
      type: Object
    }
  },
  data () {
    return {
      page: Number(this.$router.currentRoute.query.page) || 1 // 当前展示的页数
    }
  },
  computed: {
    ...mapGetters({
      reload: 'getReload',
      pageSearchValues: 'currentPageSearchValues'
    }),
    maxPage () { // 页面总数
      return parseInt(this.card.data.pn)
    },
    num () { // 总条数
      return parseInt(this.card.data.num)
    },
    pagesize () { // 页面条数
      return parseInt(this.card.data.pagesize)
    },
    search () { // 搜索关键字
      return this.pageSearchValues.keyword || ''
    },
    error () {
      return !this.maxPage
    }
  },
  created () {
    if (this.$store.state.app.reload ||
      (!this.card.data.num && !parseInt(this.card.lazy_load)) ||
      (this.card.data.p !== undefined && this.page !== this.card.data.p)) { // 第一种情况是因为数据还没有加载，第二种情况是因为加载的page不同
      this.fetchData(this.pageSearchValues)
    }
  },
  watch: {
    '$route': function (to, from) { // route变化时更新数据
      let page = to.query.page || 1
      if ((!this.card.data.num && !parseInt(this.card.lazy_load)) || JSON.stringify(to.query) !== '{}' ||
        (this.card.data.p !== undefined && page !== parseInt(this.card.data.p))) { // 第一种情况是因为数据还没有加载，第二种情况是因为加载的page不同
        this.$store.commit('RESET_CARD', { card: this.card })
        this.fetchData(this.pageSearchValues, page)
      }
      // this.$store.commit('RESET_CARD', { card: this.card })
      // !parseInt(this.card.lazy_load) && this.fetchData(this.pageSearchValues, to.query.page || 1)
    },
    '$store.state.app.reload': {
      handler: function (to, from) {
        if (to) {
          this.$store.commit('RESET_CARD', { card: this.card })
          this.fetchData(this.pageSearchValues)
          this.$store.commit('SET_APP_RELOAD', { reload: false })
        }
      },
      deep: true
    }
  },
  methods: {
    fetchData (pageSearch = {}, to = this.page) { // 获取数据
      this.$bar.start()
      this.$store.dispatch('FETCH_DATA', {
        url: this.card.url,
        configs: {
          params: {
            ...pageSearch,
            ...this.$router.currentRoute.query,
            p: to
          }
        },
        target: this.card
      }).then(() => {
        this.page = Number(to)
        this.$bar.finish()
      })
    }
  },
  components: {
    RegularTable,
    RegularListGroup,
    CheckLists,
    Pagination
  }
}
</script>
