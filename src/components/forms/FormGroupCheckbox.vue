<template>
  <div v-if="checkData && (checkData.length || checkData.num)">
    <label>{{ configs.label }}<span v-if="required">*</span></label>
    <div v-for="(value, key, index) in checkData.content" :key='index' class="custom-control custom-checkbox">
      <input type="checkbox" :name="configs.name" class="custom-control-input" :id="generateId(key)" v-model="checkValue" :value="value.v" :disabled="readonly" :multiple="multiple" :max="max" :min="min" :maxlength="maxlength" :pattern="pattern" @change="checkChange"/>
      <label class="custom-control-label" :for="generateId(key)" >{{ value.class_alien || '' }}{{ value.label || value.name || value.v }}</label>
    </div>
  </div>
</template>

<script>
import { nameToId, uuid } from '@/assets/js/custom'
import $ from 'jquery'
let self

export default {
  name: 'form-group-checkbox',
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
    dynamic: { // 相关表单的动作选定
      get () {
        return this.configs.query && this.forms[this.configs.query] && this.forms[this.configs.query].dv // 这里query定义的是相关表单变量
      }
    },
    readonly () {
      return this.forceReadonly && this.configs.readonly_v === '1'
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
    this.loadSourceData(true)
    self = this
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
        self.dynamicCheck(to)
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
    dynamicCheck (dynamic) {
      if (this.checkValue.indexOf(dynamic) < 0) {
        this.checkData.content.filter(__ => {
          return __.v === dynamic
        }).length > 0 && this.checkValue.push(dynamic)
      }
    },
    checkChange (e) {
      let $Target = $(e.currentTarget)
      let Val = $Target.val()
      let Status = $Target.prop('checked')
      let Current = this.checkData.content.filter(__ => {
        return __.v === Val
      })[0]
      let Parent = Current['parent'] !== undefined
      Parent && this.checkData.content.forEach(function (v, i) {
        if (v.parent === Val) {
          let P = $.inArray(v.v, self.checkValue)
          if (P >= 0 && !Status) {
            self.checkValue.splice(P, 1)
          } else if (P < 0 && Status) {
            self.checkValue.push(v.v)
          }
        }
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
