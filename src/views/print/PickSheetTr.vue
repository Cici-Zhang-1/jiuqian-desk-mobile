<template>
  <tr >
    <td>{{ trs.one_no }}</td>
    <td>{{ trs.one_order_product_num }}</td>
    <td>{{ trs.one_product }}</td>
    <td>{{ trs.one_thick }}</td>
    <td>{{ trs.one_thin }}</td>
    <td class="division">{{ trs.one_pack }}</td>
    <td>{{ trs.two_no }}</td>
    <td>{{ trs.two_order_product_num }}</td>
    <td>{{ trs.two_product }}</td>
    <td>{{ trs.two_thick }}</td>
    <td>{{ trs.two_thin }}</td>
    <td>{{ trs.two_pack }}</td>
  </tr>
</template>

<script>

export default {
  name: 'PickSheetTr',
  props: {
    trs: {
      type: Object | Array,
      required: true
    }
  }
}
</script>

<style scoped>
  td{
    border: 1px solid #000;
  }
  .division {
    border-right: 2mm double #000;
  }
  @media print {
    td{
      border: 0.5mm solid #000;
    }
    .division {
      border-right: 2mm double #000;
    }
  }
</style>
