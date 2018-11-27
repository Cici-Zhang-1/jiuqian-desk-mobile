<template>
  <fieldset class="form-group" v-if="checkData && (checkData.length || checkData.num)">
    <div class="row">
      <legend class="col-form-label col-md-2 pt-0">{{ configs.label }}<small class="j-pc-none text-danger" v-if="required">*</small></legend>
      <div class="col-md-9">
        <div v-for="(value, key, index) in checkData.content" :key='index' class="custom-control custom-checkbox">
          <input type="checkbox" :name="configs.name" class="custom-control-input" :id="generateId(key)" v-model="formValue" :value="value.v" :disabled="readonly" :multiple="multiple" :max="max" :min="min" :maxlength="maxlength" :pattern="pattern"/>
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
import { formsMixins } from './mixins'

export default {
  mixins: [ formsMixins ],
  name: 'regular-checkbox',
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
    dynamic: {
      get () {
        return this.configs.query && this.forms[this.configs.query] && this.forms[this.configs.query].dv // 这里query定义的是相关表单变量
      }
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
    generateId (key) {
      return this.id + key
    },
    dynamicCheck () {
      if (this.formValue.indexOf(this.dynamic) < 0) {
        this.checkData.content.filter(__ => {
          return __.v === this.dynamic
        }).length > 0 && this.formValue.push(this.dynamic)
      }
    },
    defaultCheck () {
      this.formValue = this.checkData.content.filter(__ => {
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
          target: this.configs.url,
          local: true
        })
      }
    }
  }
}
</script>
