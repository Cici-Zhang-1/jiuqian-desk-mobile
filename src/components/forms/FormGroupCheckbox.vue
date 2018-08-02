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
    }
  },
  data () {
    return {
      // checkValue: []
    }
  },
  computed: {
    id () {
      return nameToId(this.configs.name) + uuid()
    },
    checkValue: {
      get () {
        return this.multipleDv(this.configs.dv)
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
    // (this.checkData && this.checkData.content) && this.defaultCheck()
    this.loadSourceData(true)
    self = this
  },
  watch: {
    'configs.dv': {
      handler: function (to, from) {
        this.checkValue = to
      },
      deep: true
    },
    'configs.url': {
      handler: function (to, from) {
        this.loadSourceData(true)
      },
      deep: true
    },
    'configs.params': {
      handler: function (to, from) {
        this.loadSourceData(true)
      },
      deep: true
    },
    'configs.related': {
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
    /* checkValue: {
      handler: function (to, from) {
        this.configs.dv = to
      }
    },
    checkData: {
      handler: function (to, from) {
        (to && to.content) && this.defaultCheck()
      }
    } */
  },
  methods: {
    multipleDv () {
      if (!(this.configs.dv instanceof Array)) {
        this.configs.dv = this.configs.dv ? [ this.configs.dv ] : []
      }
      return this.configs.dv
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
    /* defaultCheck () {
      this.checkValue = this.configs.dv ? (this.configs.dv instanceof Array ? this.configs.dv : [this.configs.dv]) : []
    }, */
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
        let params = this.configs.params || {}
        let related = this.configs.related || {}
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
