<template>
  <div class="col-12">
    <div class="card border-0 mb-3" v-if="!error && !loading && orderData && orderData['content']">
      <div class="card-body p-0 card-body-h">
        <table class="table table-striped table-bordered table-responsive-sm j-text-nowrap">
          <thead>
            <tr>
              <th >编号</th>
              <th >客户</th>
              <th >业主</th>
              <th >备注</th>
              <th >金额</th>
              <th >橱</th>
              <th >衣</th>
              <th >门</th>
              <th >木</th>
              <th >配</th>
              <th >外</th>
              <th >服</th>
            </tr>
          </thead>
          <tbody >
            <tr v-for="(item, key, index) in orderData['content']" :key="index">
              <td v-html="orderProductLink(item['num'], item)"></td>
              <td>{{ item['dealer'] }}</td>
              <td>{{ item['owner'] }}</td>
              <td >{{ item['remark'] }}</td>
              <td >{{ item['sum'] }}</td>
              <td >{{ item['cabinet'] }}</td>
              <td >{{ item['wardrobe'] }}</td>
              <td >{{ item['door'] }}</td>
              <td >{{ item['wood'] }}</td>
              <td >{{ item['fitting'] }}</td>
              <td >{{ item['other'] }}</td>
              <td >{{ item['server'] }}</td>
            </tr>
          </tbody>
        </table>
        <div is="valuate-table-form" :form="get_form('valuate_cabinet_form')" v-if="formPages" :reload="reload"></div>
        <div is="valuate-table-form" :form="get_form('valuate_cabinet_form')" v-if="formPages" :reload="reload"></div>
        <div is="valuate-table-form" :form="get_form('valuate_wardrobe_form')" v-if="formPages" :reload="reload"></div>
        <div is="valuate-table-form" :form="get_form('valuate_door_form')" v-if="formPages" :reload="reload"></div>
        <div is="valuate-table-form" :form="get_form('valuate_wood_form')" v-if="formPages" :reload="reload"></div>
        <div is="valuate-table-form" :form="get_form('valuate_fitting_form')" v-if="formPages" :reload="reload"></div>
        <div is="valuate-table-form" :form="get_form('valuate_other_form')" v-if="formPages" :reload="reload"></div>
        <div is="valuate-table-form" :form="get_form('valuate_server_form')" v-if="formPages" :reload="reload"></div>
      </div>
    </div>
    <div class="col-12 mt-2" v-if="error">{{ errorMsg }}</div>
    <div class="col-12 mt-2" v-if="loading"><i class="fa fa-spinner fa-spin fa-5x"></i></div>
  </div>
</template>

<script>
import { generateLink } from '@/assets/js/custom'
import ValuateTableForm from './ValuateTableForm'
export default {
  name: 'OrderCard',
  props: {
    card: {
      type: Object
    },
    formPages: {
      type: Object | Array
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
  computed: {
    orderData: {
      get () {
        return this.card.data
      },
      set () {}
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
    orderProductLink (Num, Table) {
      return generateLink(Num, this.card.elements.num, Table)
    },
    get_form ($Name) {
      return this.formPages.filter(__ => {
        return __.name === $Name
      })[0]
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
        self.loading = false
      })
    }
  },
  components: {
    ValuateTableForm
  }
}
</script>
