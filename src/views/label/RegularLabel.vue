<template>
  <div class="print-label">
    <div class="delivery-address"><div class="middle">{{ unqrcode.delivery_area }}</div></div>
    <div class="order-product-num"><div class="middle">{{ unqrcode.num }}</div></div>
    <div class="package-type"><div class="middle">{{ unqrcode.product }}</div></div>
    <div class="dealer"><div class="middle">{{ unqrcode.dealer }}</div></div>
    <div class="delivery-linker"><div class="middle">{{ unqrcode.delivery_linker }}</div></div>
    <div class="owner"><div class="middle">业主: {{ unqrcode.owner }}</div></div>
    <div class="date"><div class="middle">日期: {{ new Date().Format("yyyy-MM-dd") }}</div></div>
    <img  src="@/assets/truck-7.png" />
    <div class="package-total"><div class="middle">共<span class="package-num">{{ unqrcode.pack }}</span>件<br />第<span class="package-num">{{ index }}</span>件</div></div>
    <div class="qrcode" :data-url="qrcode" :id="id"></div>
  </div>
</template>

<script>
import { pubUrl } from '@/axios/env'
import $ from 'jquery'
import 'jquery.qrcode'
import { uuid } from '@/assets/js/custom'

export default {
  name: 'RegularLabel',
  props: {
    unqrcode: {
      type: [Array, Object],
      required: true
    },
    index: {
      type: [ Number, String ]
    }
  },
  computed: {
    qrcode () {
      return pubUrl + '/' + this.unqrcode.num + '-' + this.unqrcode.pack + '-' + this.index + '-'
    },
    id () {
      return 'qrcode' + uuid()
    }
  },
  mounted () {
    $('#' + this.id).qrcode({
      width: 93,
      height: 93,
      text: $('#' + this.id).data('url')
    })
  }
}
</script>

<style scoped>
.print-label {
  position: relative;
  width: 100%;
  height: 7.9cm;
  page-break-after: always;
}
.print-label > div {
  display: table;
  margin-left: 2mm;
  margin-top: auto;
  margin-bottom: auto;
  width: 66mm;
}
.print-label > div > .middle{
  display:table-cell;
  vertical-align:middle;
  width:100%;
}
.print-label .delivery-address {
  height: 23mm;
  font-size: 8mm;
  font-weight: bold;
  text-align: center;
}
.print-label .order-product-num {
  height: 7.8mm;
  font-size: 5mm;
  font-weight: bold;
  text-align: center;
}
.print-label .package-type, .print-label .dealer, .print-label .delivery-linker, .print-label .owner, .print-label .product, .print-label .date {
  height: 7.8mm;
  font-size: 4mm;
  font-weight: bolder;
  text-align: right;
}
.print-label > img {
  position: absolute;
  width: 100%;
  height: 79.5mm;
  top: 0;
  left: 0;
  z-index: -1;
}
.print-label .package-total {
  position: absolute;
  top: 37mm;
  left: 72mm;
  width: 21mm;
  height: 15mm;
  font-weight: bolder;
  text-align: center;
  border-bottom: 2px solid #000000;
}
.print-label .package-total .package-num {
  font-size: 7mm;
}
.print-label > .qrcode {
  width: 28mm;
  height: 28mm;
  position: absolute;
  top: 4mm;
  left: 69mm;
}
</style>
