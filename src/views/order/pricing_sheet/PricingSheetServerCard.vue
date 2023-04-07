<template>
  <div class="col-12">
    <div class="card mb-3" v-if="!error && !loading">
      <div class="card-body p-0 card-body-h">
        <pricing-sheet-server-table v-for="(value, key, index) in pricingSheetData" :key="index" :table="value" :tableThead="card.elements" />
      </div>
    </div>
    <div class="col-12 mt-2" v-if="loading"><i class="fa fa-spinner fa-spin fa-5x"></i></div>
  </div>
</template>

<script>
import { pricingSheetCardMixins } from './mixins'
import PricingSheetServerTable from './PricingSheetServerTable.vue'
export default {
  mixins: [ pricingSheetCardMixins ],
  name: 'PricingSheetServerCard',
  components: {
    PricingSheetServerTable
  }
}
</script>
