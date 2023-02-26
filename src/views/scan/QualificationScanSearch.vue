<template>
  <div class="col-md-3 mb-2 mb-md-3 d-print-none">
    <form @submit.prevent="qrcodeSubmit($event.target)">
      <div class="input-group" id="pageSearch" v-if="error">
        <div class="input-group-prepend">
          <button class="btn btn-outline-secondary" type="button"><i class="fa fa-search"></i></button>
        </div>
        <input type="search" class="form-control" name="keyword" id="qualificationBoardQrcode" v-model="keyword" placeholder="扫描板块二维码" autofocus autocomplete="off"/>
        <div class="input-group-append">
          <button class="btn btn-outline-secondary" type="submit">Go!</button>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import FormGroupInput from '@/components/forms/FormGroupInput'
import FormGroupSelect from '@/components/forms/FormGroupSelect'
import $ from 'jquery'
export default {
  name: 'QualificationScanSearch',
  props: {
    pageSearches: {
      type: [Array, Object],
      required: true
    },
    qrcodeFocus: {
      type: Boolean
    }
  },
  data () {
    return {
      keyword: ''
    }
  },
  computed: {
    error: {
      get () {
        return !(JSON.stringify(this.pageSearches) === '{}' || JSON.stringify(this.pageSearches) === '[]' || JSON.stringify(this.pageSearches) === '')
      }
    }
  },
  watch: {
    qrcodeFocus: {
      handler: function (to, from) {
        $('#qualificationBoardQrcode').focus()
      }
    }
  },
  methods: {
    qrcodeSubmit ($E) {
      this.pageSearches['qrcode'].dv = this.keyword
      this.keyword = ''
      this.$emit('search', $E)
    }
  },
  components: {
    FormGroupInput,
    FormGroupSelect
  }
}
</script>
