<template>
  <div class="col-md-6 text-md-right d-print-none j-func">
    <a class="btn btn-default mb-2 mb-md-3" :href="pricingSheetHref" ><i class="fa fa-quote-right"></i>&nbsp;&nbsp;核价单</a>
    <button class="btn btn-primary mb-2 mb-md-3" data-action="/order/pricing/edit" type="button" value="确认" @click="$emit('save', $event.target)"><i class="fa fa-save"></i>&nbsp;&nbsp;确认</button>
    <button class="btn btn-default mb-2 mb-md-3" data-toggle="refresh" type="button" value="刷新" @click="refresh()"><i class="fa fa-refresh"></i>&nbsp;&nbsp;刷新</button>
  </div>
</template>

<script>
export default {
  name: 'PricingFunc',
  computed: {
    pricingSheetHref: {
      get () {
        console.log(this.$router.currentRoute.query['v'] || this.$router.currentRoute.query['order_id'])
        return '#/order/pricing_sheet?order_id=' + (this.$router.currentRoute.query['v'] || this.$router.currentRoute.query['order_id'])
      },
      set (Value) {
      }
    }
  },
  methods: {
    refresh () {
      this.$store.commit('SET_APP_RELOAD', { reload: true })
    }
  }
}
</script>
