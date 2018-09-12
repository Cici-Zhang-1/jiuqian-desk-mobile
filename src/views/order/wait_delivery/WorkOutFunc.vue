<template>
  <div class="col-md-9 text-md-right d-print-none j-func">
    <button class="btn btn-primary mb-2 mb-md-3" data-action="/order/wait_delivery/edit" type="button" value="确认" @click="$emit('save', $event.target)"><i class="fa fa-save"></i>&nbsp;&nbsp;确认</button>
  </div>
</template>

<script>
export default {
  name: 'WorkOutFunc'
}
</script>
