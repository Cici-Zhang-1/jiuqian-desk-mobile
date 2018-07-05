<template>
  <div>
    <div class="row d-print-none">
      <div class="col-6">
        <div class="alert alert-danger" role="alert" v-if="PickSheetData.message">
          {{ PickSheetData.message || '' }}
        </div>
      </div>
      <div class="col-6 text-right">
        <button class="btn btn-primary" type="button" @click.prevent="printPickSheet" value="打印"><i class="fa fa-print"></i>&nbsp;&nbsp;打印</button>
      </div>
    </div>
    <div is="pick-sheet-table" v-for="(value, key, index) in PickSheetData.tables" :tables="value" :num="PickSheetData.num" :pack="PickSheetData.pack" v-if="PickSheetData" :key="index"></div>
  </div>
</template>

<script>
import PickSheetTable from './PickSheetTable'
import service from '@/axios'

export default {
  name: 'PickSheet',
  data () {
    return {
      PickSheetData: {}
    }
  },
  created () {
    this.fetchData(this.pageSearchValues)
  },
  methods: {
    printPickSheet () {
      this.$bar.start()
      let self = this
      service.post('warehouse/pick_sheet_print/edit', { ...this.$router.currentRoute.query }).then(function (data) {
        if (data.code > 0) {
          alert(data.message)
        } else {
          window.print()
          self.$bar.finish()
        }
      })
    },
    fetchData () {
      this.$bar.start()
      let self = this
      service.get('warehouse/pick_sheet_print/read', { params: { ...this.$router.currentRoute.query } }).then(function (data) {
        if (data.code > 0) {
          alert(data.message)
        } else {
          self.PickSheetData = data.contents
        }
        self.$bar.finish()
      })
    }
  },
  components: {
    PickSheetTable
  }
}
</script>
