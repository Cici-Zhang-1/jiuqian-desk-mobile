<template>
  <div class="form-group">
    <label :for="id">{{ configs.label }}<span v-if="required">*</span></label>
    <input type="hidden" :name="configs.name" class="form-control auto-complete-val" :id="id" v-model="formValue" :required="required" :max="max" :min="min" :maxlength="maxlength" :pattern="pattern" />
    <input class="form-control auto-complete" name="auto_complete" :id="autoCompleteId" type="text" :readonly="readonly" :required="required" :placeholder="placeholder" v-model="autoCompleteText" />
  </div>
</template>

<script>
import $ from 'jquery'
import service from '@/axios'
import '@/assets/js/autocomplete'
import { nameToId, uuid } from '@/assets/js/custom'
import { formsMixins } from './mixins'

let formatItem = function (row) {
  return row.name
}
let self = {}

export default {
  mixins: [ formsMixins ],
  name: 'FormGroupRemote',
  data () {
    return {
      id: '',
      autoCompleteId: '',
      autoCompleteText: ''
    }
  },
  computed: {
    formValue: {
      get () {
        return this.configs.dv
      },
      set (value) {
        this.configs.dv = value
      }
    }
  },
  created () {
    this.id = nameToId(this.configs.name) + uuid()
    this.autoCompleteId = this.id + 'AutoComplete'
    this.parseQuery()
  },
  mounted () {
    self[this.autoCompleteId] = this
    this.autoComplete()
  },
  methods: {
    autoComplete () {
      if (this.configs && this.configs.url) {
        let url = this.configs.url
        $('#' + this.autoCompleteId).autocomplete({
          minLength: 0,
          autoselect: true,
          showHint: false,
          appendMethod: 'replace',
          source: [
            function (q, add) {
              service.get(url, { params: { keyword: encodeURIComponent(q) } }).then(function (data) {
                if (data.code > 0) {
                  add([])
                } else {
                  add([])
                  add(data.contents)
                }
              })
            }
          ],
          valueKey: 'name',
          getValue: formatItem,
          getTitle: formatItem
        }).on('selected.xdsoft', function (e, row) {
          self[this.id].formValue = row.v
          self[this.id].autoCompleteText = row.name
        })
      }
    }
  }
}
</script>
