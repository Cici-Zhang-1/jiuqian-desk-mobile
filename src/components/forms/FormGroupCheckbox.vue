<template>
  <div v-if="checkData && (checkData.length || checkData.num)">
    <label>{{ configs.label }}<span v-if="required">*</span></label>
    <div v-for="(value, key, index) in checkData.content" :key='index' class="custom-control custom-checkbox">
      <input type="checkbox" :name="configs.name" class="custom-control-input" :id="generateId(key)" v-model="formValue" :value="value.v" :disabled="readonly" :multiple="multiple" :max="max" :min="min" :maxlength="maxlength" :pattern="pattern" @change="checkChange"/>
      <label class="custom-control-label" :for="generateId(key)" >{{ value.class_alien || '' }}{{ value.label || value.name || value.v }}</label>
    </div>
  </div>
</template>

<script>
import { nameToId, uuid } from '@/assets/js/custom'
import $ from 'jquery'
import { formsMixins } from './mixins'
let self

export default {
  mixins: [ formsMixins ],
  name: 'form-group-checkbox',
  computed: {
    id () {
      return nameToId(this.configs.name) + uuid()
    },
    formValue: {
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
    generateId (key) {
      return this.id + key
    },
    dynamicCheck (dynamic) {
      if (this.formValue.indexOf(dynamic) < 0) {
        this.checkData.content.filter(__ => {
          return __.v === dynamic
        }).length > 0 && this.formValue.push(dynamic)
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
          let P = $.inArray(v.v, self.formValue)
          if (P >= 0 && !Status) {
            self.formValue.splice(P, 1)
          } else if (P < 0 && Status) {
            self.formValue.push(v.v)
          }
        }
      })
    },
    loadSourceData (Reload = false) {
      if ((Reload || typeof this.checkData === 'undefined' || JSON.stringify(this.checkData) === '{}') && this.configs.url !== '') {
        let params = this.paramsValue || {}
        let related = this.relatedValue || {}
        this.$store.dispatch('FETCH_SOURCE_DATA', {
          url: this.configs.url,
          configs: {
            params: { ...params, ...related }
          },
          target: this.configs.url,
          local: this.local
        })
      }
    }
  }
}
</script>
