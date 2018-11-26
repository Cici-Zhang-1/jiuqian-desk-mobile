<template>
  <div class="col-12">
    <div class="card mb-3" v-if="!error && !loading">
      <div class="card-body p-0 card-body-h">
        <order-product-fitting-table v-for="(value, key, index) in detailData" :key="index" :table="value" :tableThead="card.elements" />
      </div>
    </div>
    <div class="col-12 mt-2" v-if="loading"><i class="fa fa-spinner fa-spin fa-5x"></i></div>
  </div>
</template>

<script>
import { detailCardMixins } from './mixins'
import OrderProductFittingTable from './OrderProductFittingTable'
export default {
  mixins: [ detailCardMixins ],
  name: 'OrderProductFittingCard',
  components: {
    OrderProductFittingTable
  }
}
</script>
