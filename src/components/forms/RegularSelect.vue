<template>
  <div class="form-group row" v-if="selectData && (selectData.length || selectData.num)">
    <label :for="id" class="col-md-2 col-form-label">{{ configs.label }}<small class="j-pc-none text-danger" v-if="required">*</small></label>
    <div class="col-md-9">
      <select class="form-control" :name="configs.name" :id="id" v-model="selectValue" :required="required" :multiple="multiple" >
        <option value="" v-if="!required">---</option>
        <option v-for="(value, key, index) in selectData.content" :value="value.v" :key="index">{{ value.class_alien || '' }}{{ value.label || value.truename || value.name || value.v }}</option>
      </select>
    </div>
    <div class="j-phone-none col-md-1">
      <small class="text-danger" v-if="required">*</small>
    </div>
  </div>
</template>

<script>
import { nameToId, uuid } from '@/assets/js/custom'

export default {
  name: 'regular-select',
  props: {
    configs: {
      type: [Array, Object],
      required: true
    },
    forms: {
      type: [Array, Object],
      required: true
    },
    query: {
      type: [Array, Object]
    }
  },
  data () {
    return {
      queryStr: '',
      params: [],
      paramsValue: {},
      related: [],
      relatedValue: {}
    }
  },
  computed: {
    id () {
      return nameToId(this.configs.name) + uuid()
    },
    selectData: {
      get () {
        return this.$store.getters.getSourceData({ uri: this.configs.url })
      }
    },
    selectValue: {
      get () {
        return this.configs.dv
      },
      set (Value) {
        this.configs.dv = Value
      }
    },
    readonly () {
      return this.configs.readonly_v === '1'
    },
    required () {
      return this.configs.required_v === '1'
    },
    multiple () {
      return this.configs.multiple_v === '1'
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
    }
  },
  created () {
    this.parseQuery()
    this.multipleDv()
    this.loadSourceData()
  },
  watch: {
    'configs.url': {
      handler: function (to, from) {
        this.loadSourceData(true)
      },
      deep: true
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
          this.selectValue = this.$router.currentRoute.query[this.queryStr]
          this.multipleDv()
        }
        this.watchQuery()
      }
      if (this.params.length > 0) {
        this.params.map(__ => {
          if (this.$router.currentRoute.query[__] !== undefined) {
            this.paramsValue[__] = this.$router.currentRoute.query[__]
          } else {
            this.paramsValue[__] = ''
          }
          return __
        })
        this.watchParams()
      }
      if (this.related.length > 0) {
        this.related.map(__ => {
          if (this.forms[__] !== undefined) {
            this.relatedValue[__] = this.forms[__].dv
          }
          return __
        })
        this.watchForms()
      }
    },
    watchQuery () {
      this.$watch('query', function (to, from) {
        if (this.query[this.queryStr] !== undefined && this.query[this.queryStr] !== this.selectValue) {
          this.selectValue = this.query[this.queryStr]
          this.multipleDv()
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
    watchForms () {
      this.related.map(__ => {
        this.$watch(function () {
          return this.forms[__].dv
        }, function (to, from) {
          if (this.forms[__].dv !== this.relatedValue[__]) {
            this.relatedValue[__] = this.forms[__].dv
            this.loadSourceData(true)
          }
        })
        return __
      }, {
        deep: true
      })
    },
    showSelect () {
      let selected = []
      let self = this
      this.selectData.content.map(__ => {
        if (self.selectValue.indexOf(__.v)) {
          selected.push(__.label || __.name || __.v)
        }
        return __
      })
      return selected.toString()
    },
    multipleDv (Dv = null) {
      if (this.multiple) {
        if (Dv !== null) {
          if (Dv instanceof Array) {
            this.selectValue = Dv
          } else {
            this.selectValue = [ Dv ]
          }
        } else if (!(this.selectValue instanceof Array)) {
          this.selectValue = this.selectValue ? [ this.selectValue ] : []
        }
      } else {
        if (Dv !== null) {
          this.selectValue = Dv
        }
      }
      return this.selectValue
    },
    loadSourceData (Reload = false) {
      if ((Reload || typeof this.selectData === 'undefined' || JSON.stringify(this.selectData) === '{}') && this.configs.url !== '') {
        let params = this.paramsValue || {}
        let related = this.relatedValue || {}
        this.$store.dispatch('FETCH_SOURCE_DATA', {
          url: this.configs.url,
          configs: {
            params: { ...params, ...related }
          },
          target: this.configs.url
        })
      }
    }
  }
}
</script>
