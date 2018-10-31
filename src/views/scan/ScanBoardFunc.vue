<template>
  <div class="col-md-9 text-md-right d-print-none j-func" id="saveBoardFunc">
    <div class="btn-group mb-2 mb-md-3" role="group">
      <button id="saveBoardFuncGroup" type="button" class="btn btn-primary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
        显示<span class="caret"></span>
      </button>
      <div class="dropdown-menu" aria-labelledby="saveBoardFuncGroup">
        <a class="dropdown-item mt-1 mb-1" href="javascript:void(0);" data-toggle="front" @click="$emit('show', 1)"><i class="mr-1"></i>全部</a>
        <a class="dropdown-item mt-1 mb-1" href="javascript:void(0);" data-toggle="front" @click="$emit('show', 0)"><i class="mr-1"></i>未扫描</a>
      </div>
    </div>
    <a class="btn btn-primary mb-2 mb-md-3" href="/order/scan_board/edit" data-toggle="save" data-target="#scanBoardTable" data-multiple="true" @click.prevent="$emit('save', $event.currentTarget)" ><i class="fa fa-save"></i>确认</a>
    <a class="btn btn-default mb-2 mb-md-3" href="/order/scan_board/edit" data-toggle="refresh" data-target="#scanBoardTable" data-multiple="true" @click.prevent="$emit('refresh', $event.currentTarget)"><i class="fa fa-refresh"></i>&nbsp;&nbsp;刷新</a>
    <a class="btn btn-default mb-2 mb-md-3" href="#/order/scan/index/read?today=1" data-toggle="child" ><i class="fa fa-calendar-check-o"></i>今日完成</a>
    <a class="btn btn-default mb-2 mb-md-3" href="javascript:void(0);" data-toggle="last" @click.prevent="$emit('last', $event.currentTarget)"><i class="fa fa-arrow-up"></i>上次扫描</a>
  </div>
</template>

<script>
export default {
  name: 'ScanBoardFunc'
}
</script>
