<template>
  <fieldset class="form-group" v-if="checkData && (checkData.length || checkData.num)">
    <div class="row">
      <legend class="col-form-label col-md-2 pt-0">{{ configs.label }}<small class="j-pc-none text-danger" v-if="required">*</small></legend>
      <div class="col-md-9">
        <div v-for="(value, key, index) in checkData.content" :key='index' class="custom-control custom-checkbox">
          <input type="checkbox" :name="configs.name" class="custom-control-input" :id="generateId(key)" v-model="checkValue" :value="value.v" :disabled="readonly" :multiple="multiple" :max="max" :min="min" :maxlength="maxlength" :pattern="pattern"/>
          <label class="custom-control-label" :for="generateId(key)" >{{ value.label || value.name || value.v }}</label>
        </div>
      </div>
      <div class="j-phone-none col-md-1">
        <small class="text-danger" v-if="required">*</small>
      </div>
    </div>
  </fieldset>
</template>

<script>
import { nameToId, uuid } from '@/assets/js/custom'

export default {
  name: 'regular-checkbox',
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
    checkValue: {
      get () {
        return this.configs.dv
      },
      set (Value) {
        this.configs.dv = Value
      }
    },
    checkData: {
      get () {
        return this.$store.getters.getSourceData({ uri: this.configs.url })
      }
    },
    dynamic: {
      get () {
        return this.configs.query && this.forms[this.configs.query] && this.forms[this.configs.query].dv // 这里query定义的是相关表单变量
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
    (this.checkData && this.checkData.content) && this.defaultCheck()
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
    },
    dynamic: {
      handler: function (to, from) {
        this.dynamicCheck()
      }
    },
    checkData: {
      handler: function (to, from) {
        (to && to.content) && this.defaultCheck()
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
          this.checkValue = this.$router.currentRoute.query[this.queryStr]
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
        if (this.query[this.queryStr] !== undefined && this.query[this.queryStr] !== this.checkValue) {
          this.checkValue = this.query[this.queryStr]
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
    multipleDv () {
      if (!(this.checkValue instanceof Array)) {
        this.checkValue = this.checkValue ? [ this.checkValue ] : []
      }
      return this.checkValue
    },
    generateId (key) {
      return this.id + key
    },
    dynamicCheck () {
      if (this.checkValue.indexOf(this.dynamic) < 0) {
        this.checkData.content.filter(__ => {
          return __.v === this.dynamic
        }).length > 0 && this.checkValue.push(this.dynamic)
      }
    },
    defaultCheck () {
      this.checkValue = this.checkData.content.filter(__ => {
        return __.checked
      }).map(__ => {
        return __.v
      })
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
