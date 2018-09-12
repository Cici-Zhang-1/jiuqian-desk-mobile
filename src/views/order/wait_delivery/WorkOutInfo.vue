<template>
  <div class="col-12">
    <div class="card border-0 mb-3">
      <div class="card-body p-0 card-body-h">
        <table class="table table-striped table-bordered table-responsive-sm j-text-nowrap">
          <tbody >
            <tr>
              <td>车辆: </td>
              <td>{{ truck }}</td>
              <td>车次: </td>
              <td >{{ train }}</td>
              <td >发货日期: </td>
              <td >{{ end_datetime }}</td>
              <td >总件数: </td>
              <td >{{ pack }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'WorkOutInfo',
  data () {
    return {
      truck: '',
      train: '',
      end_datetime: '',
      pack: 0
    }
  },
  created () {
    this.truck = this.$route.query['truck']
    this.train = this.$route.query['train']
    this.end_datetime = this.$route.query['end_datetime']
    this.pack = this.$route.query['pack']
  }
}
</script>
