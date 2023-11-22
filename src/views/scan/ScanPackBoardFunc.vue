<template>
  <div class="col-md-8 text-md-right d-print-none j-func" id="saveScanPackBoardFunc">
    <div class="btn-group mb-2 mb-md-3" role="group">
      <button id="saveScanPackBoardFuncGroup" type="button" class="btn btn-primary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
        显示<span class="caret"></span>
      </button>
      <div class="dropdown-menu" aria-labelledby="saveScanPackBoardFuncGroup">
        <a class="dropdown-item mt-1 mb-1" href="javascript:void(0);" data-toggle="front" @click="$emit('show', 1)"><i class="mr-1"></i>全部</a>
        <a class="dropdown-item mt-1 mb-1" href="javascript:void(0);" data-toggle="front" @click="$emit('show', 0)"><i class="mr-1"></i>未扫描</a>
        <a class="dropdown-item mt-1 mb-1" href="javascript:void(0);" data-toggle="front" @click="$emit('show', 2)"><i class="mr-1"></i>正在扫</a>
      </div>
    </div>
    <a class="btn btn-primary mb-2 mb-md-3" href="/order/scan_pack_board/edit" data-toggle="save" data-target="#scanPackBoardTable" data-multiple="true" @click.prevent="$emit('save', $event.currentTarget)" ><i class="fa fa-print"></i>&nbsp;&nbsp;打印</a>
    <a class="btn btn-primary mb-2 mb-md-3" href="/order/scan_pack_board/cancel" data-toggle="cancel" data-target="#scanPackBoardTable" data-multiple="true" @click.prevent="$emit('cancel', $event.currentTarget)" ><i class="fa fa-times"></i>&nbsp;&nbsp;取消</a>
    <a class="btn btn-default mb-2 mb-md-3" href="/order/scan_pack_board/refresh" data-toggle="refresh" data-target="#scanPackBoardTable" data-multiple="true" @click.prevent="$emit('refresh', $event.currentTarget)"><i class="fa fa-refresh"></i>&nbsp;&nbsp;刷新</a>
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'ScanBoardFunc'
}
</script>
