<template>
  <div class="col-md-6 text-md-right d-print-none j-func">
    <button class="btn btn-primary" data-action="/order/post_sale/edit" type="button" value="确认" @click="$emit('save', $event.target)"><i class="fa fa-save"></i>&nbsp;&nbsp;确认</button>
    <button class="btn btn-default" data-toggle="refresh" type="button" value="刷新" @click="refresh()"><i class="fa fa-refresh"></i>&nbsp;&nbsp;刷新</button>
  </div>
</template>

<script>
export default {
  name: 'PostSaleFunc',
  methods: {
    refresh () {
      this.$store.commit('SET_APP_RELOAD', { reload: true })
    }
  }
}
</script>
