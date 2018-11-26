<template>
  <div class="row mt-3 j-page" :id="title">
    <div class="col-12 border-bottom rounded-bottom mb-2 border-primary text-center d-print-none"><h5>{{ label }}</h5></div>
    <div class="col-md-3 mb-2 mb-md-3 d-print-none"></div>
    <div is="print-order-table" :card="get_card('print_opf_basic_info')" v-if="cards" :reload="reload"></div>
    <div is="print-order-product-fitting-table" :card="get_card('print_order_product_fitting_table')" v-if="cards" :reload="reload"></div>
  </div>
</template>

<script>
import PrintOrderProductFittingTable from './PrintOrderProductFittingTable'
import { printMixins } from './mixins'

export default {
  mixins: [ printMixins ],
  name: 'PrintOrderProductFitting',
  data () {
    return {
      c: 'print_order_product_fitting'
    }
  },
  components: {
    PrintOrderProductFittingTable
  }
}
</script>
