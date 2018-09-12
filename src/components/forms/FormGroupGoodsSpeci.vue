<template>
  <div v-if="checkData && (checkData.length || checkData.num)">
    <div v-for="(value, key, index) in checkData.content" :key='index' class="custom-control custom-checkbox">
      <input type="checkbox" :name="configs.name" class="custom-control-input" :id="generateId(key)" v-model="checkValue" :value="value.v" :disabled="readonly"  :required="required" :max="max" :min="min" :maxlength="maxlength" :pattern="pattern"/>
      <label class="custom-control-label" :for="generateId(key)" >{{ value.label || value.name || value.v }}</label>
    </div>
  </div>
</template>

<script>
import { nameToId, uuid } from '@/assets/js/custom'
let timeCount
let self

export default {
  name: 'form-group-goods-speci',
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
    related: {
      get () {
        return (this.configs.query && this.forms[this.configs.query].dv) || '' // 这里query定义的是相关表单变量
      }
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
    }
  },
  created () {
    (this.checkData && this.checkData.content) || this.defaultCheck()
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
    related: {
      handler: function (to, from) {
        clearTimeout(timeCount)
        timeCount = setTimeout(function () {
          self.loadSourceData(true)
        }, 1000)
      }
    },
    checkValue: {
      handler: function (to, from) {
        this.configs.dv = to
      }
    },
    checkData: {
      handler: function (to, from) {
        (to && to.content) && this.defaultCheck()
      }
    }
  },
  methods: {
    generateId (key) {
      return this.id + key
    },
    defaultCheck () {
      this.checkValue = this.configs.dv ? (this.configs.dv instanceof Array ? this.configs.dv : [this.configs.dv]) : []
    },
    loadSourceData (Reload = false) {
      if ((Reload || typeof this.selectData === 'undefined' || JSON.stringify(this.selectData) === '{}') && this.configs.url !== '') {
        let params = this.configs.params || {}
        let query = {}
        query[this.configs.query] = (this.configs.query && this.related) || ''
        this.$store.dispatch('FETCH_SOURCE_DATA', {
          url: this.configs.url,
          configs: {
            params: { ...params, ...query }
          },
          target: this.configs.url
        })
      }
    }
  }
}
</script>
