<template>
  <div class="col-md-6 text-md-right d-print-none j-func">
    <button class="btn btn-primary" data-action="/order/dismantle/edit" type="button" value="暂存" @click="$emit('save-tmp', $event.target)"><i class="fa fa-save"></i>&nbsp;&nbsp;暂存</button>
    <button class="btn btn-primary" data-action="/order/dismantle/edit" type="button" value="确认" @click="$emit('save', $event.target)"><i class="fa fa-save"></i>&nbsp;&nbsp;确认</button>
    <button id="orderDismantleRemoveFunc" type="button" class="btn btn-danger dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
      处理<span class="caret"></span>
    </button>
    <div class="dropdown-menu" aria-labelledby="orderDismantleRemoveFunc">
      <button class="dropdown-item mt-1 mb-1" data-action="/order/dismantle/remove" type="button" value="清除" @click="$emit('clear', $event.target)"><i class="fa fa-remove"></i>&nbsp;&nbsp;清除</button>
      <button class="dropdown-item mt-1 mb-1" data-action="/order/order_product/remove" type="button" value="作废" @click="$emit('remove', $event.target)"><i class="fa fa-trash-o"></i>&nbsp;&nbsp;作废</button>
    </div>
    <button class="btn btn-default" data-toggle="refresh" type="button" value="刷新" @click="refresh()"><i class="fa fa-refresh"></i>&nbsp;&nbsp;刷新</button>
    <button class="btn btn-light" data-action="/order/order_product/add" type="button" value="新建" @click="$emit('add', $event.target)"><i class="fa fa-plus"></i>&nbsp;&nbsp;新建</button>
    <button class="btn btn-light" data-action="/order/order_product/repeat" type="button" value="复制" @click="$emit('repeat', $event.target)"><i class="fa fa-copy"></i>&nbsp;&nbsp;复制</button>
  </div>
</template>

<script>
export default {
  name: 'OrderDismantleFunc',
  methods: {
    refresh () {
      this.$store.commit('SET_APP_RELOAD', { reload: true })
    }
  }
}
</script>
