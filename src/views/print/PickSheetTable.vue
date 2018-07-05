<template>
  <div class="paging print-page">
    <h4 style="text-align: center; font-weight: bold;">九千定制家具厂</h4>
    <table class="basic-info text-nowrap">
      <tbody>
      <tr>
        <th style="width: 12%">发货日期:</th>
        <td style="width: 20%">{{ tables.end_datetime}}</td>
        <th style="width: 12%">发货车次:</th>
        <td style="width: 20%">{{ tables.train }}</td>
        <th style="width: 12%">发货车辆:</th>
        <td>{{ tables.truck }}</td>
      </tr>
      <tr>
        <th>货到地区:</th>
        <td>{{ tables.delivery_address }}</td>
        <th>收货人:</th>
        <td>{{ tables.delivery_linker }}</td>
        <th>联系方式:</th>
        <td>{{ tables.delivery_phone }}</td>
      </tr>
      <tr>
        <th>要求物流:</th>
        <td>{{ tables.logistics }}</td>
        <th>业主:</th>
        <td>{{ tables.owner }}</td>
        <th>备注:</th>
        <td></td>
      </tr>
      </tbody>
    </table>
    <table class="pick-sheet text-nowrap">
      <tbody>
        <tr>
          <th class="col-one" >#</th>
          <th class="col-two" >编号</th>
          <th class="col-two">名称</th>
          <th class="col-one">柜体</th>
          <th class="col-one">背板</th>
          <th class="division col-one">件数</th>
          <th class="col-one">#</th>
          <th class="col-two">编号</th>
          <th class="col-two">名称</th>
          <th class="col-one">柜体</th>
          <th class="col-one">背板</th>
          <th class="col-one">件数</th>
        </tr>
        <tr is="pick-sheet-tr" v-for="(value, key, index) in tables.trs" :trs="value" :key="index" ></tr>
      </tbody>
    </table>
    <table class="pick-sheet-footer">
      <tfoot>
        <tr>
          <td>第{{ tables.p }}页，共{{ num }}页</td>
          <th style="text-align: right;">打单时间:</th>
          <td style="text-align: left;">{{ new Date().Format("yyyy-MM-dd HH:mm:ss") }}</td>
          <th style="text-align: right;">件数:</th>
          <th style="text-align: left;">{{ tables.page_pack }}/{{ pack }}</th>
          <th style="text-align: right;">代收:</th>
          <th style="text-align: left;">{{ tables.page_collection }}元</th>
          <th style="text-align: left;">签收:</th>
        </tr>
      </tfoot>
    </table>
  </div>
</template>

<script>
import PickSheetTr from './PickSheetTr'
Date.prototype.Format = function (fmt) {
  var o = {
    'M+': this.getMonth() + 1,
    'd+': this.getDate(),
    'H+': this.getHours(),
    'm+': this.getMinutes(),
    's+': this.getSeconds(),
    'S+': this.getMilliseconds()
  }

  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  for (var k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(String(o[k]).length)))
    }
  }
  return fmt
}

export default {
  name: 'PickSheetTable',
  props: {
    tables: {
      type: [Array, Object],
      required: true
    },
    num: {
      type: [ Number, String ]
    },
    pack: {
      type: [ Number, String ]
    }
  },
  components: {
    PickSheetTr
  }
}
</script>

<style scoped>
  table {
    width: 100%;
  }
  table thead {
    text-align: center;
  }
  .pick-sheet {
    text-align: center;
  }
  .pick-sheet thead td, .pick-sheet thead th, .pick-sheet tbody td, .pick-sheet tbody th{
    border: 1px solid #000;
  }
  .pick-sheet .division {
    border-right: 2mm double #000;
  }
  @media print {
    @page {
      size: auto;
      margin: 4.2mm 10mm;
    }
    .paging {
      page-break-after: always;
    }
    .print-page {
      position: relative;
      top: 10mm;
      left: 10mm;
      width: 203mm;
      height: 130mm;
    }
    .print-page h4 {
      height: 6mm;
      margin: 0;
      font-size: 5mm;
    }
    .print-page table {
      width: 203mm;
      font-size: 4.5mm;
      line-height: 4.8mm;
      border-collapse: collapse;
    }
    .print-page table thead {
      text-align: center;
    }
    .print-page .basic-info {
      height: 15mm;
    }
    .pick-sheet {
      text-align: center;
    }
    .pick-sheet thead td, .pick-sheet thead th, .pick-sheet tbody td, .pick-sheet tbody th{
      border: 0.5mm solid #000;
    }
    .pick-sheet .division {
      border-right: 2mm double #000;
    }
    .col-one {
      width: 16.9mm;
    }
    .col-two {
      width: 33.8mm;
    }
    .print-page > .pick-sheet-footer {
      position: absolute;
      bottom: 1mm;
      line-height: 4.8mm;
    }
  }
</style>
