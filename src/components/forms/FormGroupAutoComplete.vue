<template>
  <div class="form-group">
    <label :for="id">{{ configs.label }}<span v-if="required">*</span></label>
    <input type="hidden" :name="configs.name" class="form-control auto-complete-val" :id="id" v-model="autoCompleteValue" :required="required" :max="max" :min="min" :maxlength="maxlength" :pattern="pattern" />
    <input class="form-control auto-complete" name="auto_complete" :id="autoCompleteId" type="text" :readonly="readonly" :required="required" :placeholder="placeholder" v-model="autoCompleteText" />
  </div>
</template>

<script>
import $ from 'jquery'
import '@/assets/js/autocomplete'
import { nameToId, uuid } from '@/assets/js/custom'

let formatItem = function (row) {
  return row.name
}
let self = {}

export default {
  name: 'FormGroupAutoComplete',
  props: {
    configs: {
      type: [Array, Object],
      required: true
    },
    forms: {
      type: [Array, Object],
      required: true
    },
    forceReadonly: {
      type: [Boolean],
      required: true
    },
    query: {
      type: [Array, Object]
    }
  },
  data () {
    return {
      id: '',
      autoCompleteId: '',
      autoCompleteText: '',
      queryStr: '',
      params: [],
      paramsValue: {},
      related: [],
      relatedValue: {}
    }
  },
  computed: {
    autoCompleteData: {
      get () {
        return this.$store.getters.getSourceData({ uri: this.configs.url })
      }
    },
    autoCompleteValue: {
      get () {
        return this.configs.dv
      },
      set (value) {
        this.configs.dv = value
      }
    },
    readonly () {
      return this.forceReadonly || this.configs.readonly_v === '1'
    },
    required () {
      return this.configs.required_v === '1'
    },
    max () {
      return this.configs.max === '' ? false : this.configs.max
    },
    min () {
      return this.configs.min === '' ? false : this.configs.min
    },
    maxlength () {
      return this.configs.maxlength !== '0' ? this.configs.maxlength : ''
    },
    pattern () {
      return this.configs.pattern === '' ? false : this.configs.pattern
    },
    placeholder () {
      return this.configs.placeholder
    }
  },
  created () {
    this.id = nameToId(this.configs.name) + uuid()
    this.autoCompleteId = this.id + 'AutoComplete'
    this.parseQuery()
    this.loadSourceData()
  },
  mounted () {
    self[this.autoCompleteId] = this
    this.init()
  },
  watch: {
    'configs.url': {
      handler: function (to, from) {
        this.loadSourceData(true)
      },
      deep: true
    },
    autoCompleteData: {
      handler: function (to, from) {
        this.init()
      },
      deep: true
    },
    autoCompleteValue: {
      handler: function (to, from) {
        this.autoCompleteData && this.autoCompleteData.content && this.setAutoCompleteText()
      }
    }
  },
  methods: {
    parseQuery () {
      if (this.configs.query) {
        [ this.queryStr = '', this.params = '', this.related = '' ] = this.configs.query.split('-')
        this.params = this.params.split(',')
        this.related = this.related.split(',')
        this.initQuery()
      }
    },
    initQuery () {
      if (this.queryStr) {
        if (this.$router.currentRoute.query[this.queryStr] !== undefined) {
          this.autoCompleteValue = this.$router.currentRoute.query[this.queryStr]
        }
        this.watchQuery()
      }
      if (this.params.length > 0) {
        this.params.map(__ => {
          if (this.$router.currentRoute.query[__] !== undefined) {
            this.paramsValue[__] = this.$router.currentRoute.query[__]
          }
          return __
        })
        this.watchParams()
      }
    },
    watchQuery () {
      this.$watch('query', function (to, from) {
        if (this.query[this.queryStr] !== undefined && this.query[this.queryStr] !== this.autoCompleteValue) {
          this.autoCompleteValue = this.query[this.queryStr]
        }
      }, {
        deep: true
      })
    },
    watchParams () {
      this.$watch('query', function (to, from) {
        let Flag = false
        this.params.map(__ => {
          if (this.query[__] !== undefined && this.query[__] !== this.paramsValue[__]) {
            this.paramsValue[__] = this.query[__]
            Flag = true
          }
          return __
        })
        if (Flag) {
          this.loadSourceData(true)
        }
      }, {
        deep: true
      })
    },
    init () {
      if (this.autoCompleteData && this.autoCompleteData.content) {
        this.setAutoCompleteText()
        this.autoComplete(this.autoCompleteData.content)
      }
    },
    setAutoCompleteText () {
      let autoCompleted = this.autoCompleteData.content.filter(__ => {
        return __.v.toString() === this.autoCompleteValue.toString()
      })[0]
      this.autoCompleteText = (autoCompleted && autoCompleted['name']) || ''
      return true
    },
    autoComplete (Data) {
      $('#' + this.autoCompleteId).autocomplete({
        minLength: 0,
        autoselect: true,
        showHint: false,
        source: [Data],
        valueKey: 'name',
        getValue: formatItem,
        getTitle: formatItem
      }).on('selected.xdsoft', function (e, row) {
        self[this.id].autoCompleteValue = row.v
      })
    },
    loadSourceData (Reload = false) {
      if ((Reload || typeof this.autoCompleteData === 'undefined' || JSON.stringify(this.autoCompleteData) === '{}') && this.configs.url !== '') { // 加载初始数据
        this.$store.dispatch('FETCH_SOURCE_DATA', {
          url: this.configs.url,
          configs: {
            params: this.paramsValue || {}
          },
          target: this.configs.url
        })
      }
    }
  }
}
</script>
