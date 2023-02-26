<template>
  <div class="col-md-9 text-md-right d-print-none j-func" id="saveBoardFunc">
    <a class="btn btn-default mb-2 mb-md-3" href="/order/qualification_scan/edit" data-toggle="refresh" data-target="#qualificationScanTable" data-multiple="true" @click.prevent="$emit('refresh', $event.currentTarget)"><i class="fa fa-refresh"></i>&nbsp;&nbsp;刷新</a>
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'QualificationScanFunc'
}
</script>
