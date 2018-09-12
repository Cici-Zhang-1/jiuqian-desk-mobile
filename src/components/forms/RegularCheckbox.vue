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
  name: 'form-group-checkbox',
  props: {
    configs: {
      type: [Array, Object],
      required: true
    },
    forms: {
      type: [Array, Object],
      required: true
    }
  },
  data () {
    return {
      checkValue: []
    }
  },
  computed: {
    id () {
      return nameToId(this.configs.name) + uuid()
    },
    checkData: {
      get () {
        return this.$store.getters.getSourceData({ uri: this.configs.url })
      }
    },
    dynamic: {
      get () {
        return (this.configs.query !== '' && this.forms[this.configs.query].dv) || '' // 这里query定义的是相关表单变量
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
    this.loadSourceData()
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
    dynamic: {
      handler: function (to, from) {
        this.dynamicCheck()
      }
    },
    checkValue: {
      handler: function (to, from) {
        this.configs.dv = to
      },
      deep: true
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
        this.$store.dispatch('FETCH_SOURCE_DATA', {
          url: this.configs.url,
          configs: {
            params: this.configs.params || {}
          },
          target: this.configs.url
        })
      }
    }
  }
}
</script>
