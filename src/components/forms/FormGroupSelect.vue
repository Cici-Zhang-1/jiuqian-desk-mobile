<template>
  <div class="form-group" v-if="selectData && (selectData.length || selectData.num)">
    <label :for="id">{{ configs.label }}<span v-if="required">*</span></label>
    <select class="form-control" :name="configs.name" :id="id" v-model="selectValue" :required="required" :readonly="readonly" :multiple="multiple" >
      <option value="" v-if="!required">---</option>
      <option v-for="(value, key, index) in selectData.content" :value="value.v" :key="index">{{ value.class_alien || '' }}{{ value.label || value.truename || value.name || value.v }}</option>
    </select>
    <small class="form-text text-muted" v-if="multiple && this.selectData &&  (selectData.length || selectData.num)">{{ showSelect()}}</small>
  </div>
</template>

<script>
import { nameToId, uuid } from '@/assets/js/custom'
import $ from 'jquery'

export default {
  name: 'form-group-select',
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
    selectData: {
      get () {
        return this.$store.getters.getSourceData({ uri: this.configs.url })
      }
    },
    selectValue: {
      get () {
        return this.multipleDv(this.configs.dv)
      },
      set (Value) {
        this.configs.dv = Value
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
        if (this.forms[__] !== undefined) {
          this.$watch(function () {
            return this.forms[__].dv
          }, function (to, from) {
            if (this.forms[__].dv !== this.relatedValue[__]) {
              this.relatedValue[__] = this.forms[__].dv
              this.loadSourceData(true)
            }
          })
        }
        return __
      }, {
        deep: true
      })
    },
    showSelect () {
      let selected = []
      let self = this

      this.selectData.content.map(__ => {
        if ($.inArray(__.v, self.selectValue) >= 0) {
          selected.push(__.label || __.name || __.v)
        }
        return __
      })
      return selected.toString()
    },
    multipleDv () {
      if (this.multiple && !(this.configs.dv instanceof Array)) {
        this.configs.dv = this.configs.dv ? [ this.configs.dv ] : []
      }
      return this.configs.dv
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
