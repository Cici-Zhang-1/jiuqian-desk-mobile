<template>
  <div v-if="checkData && (checkData.length || checkData.num)">
    <div v-for="(value, key, index) in checkData.content" :key='index' class="custom-control custom-checkbox">
      <input type="checkbox" :name="configs.name" class="custom-control-input" :id="generateId(key)" v-model="checkValue" :value="value.v" :disabled="readonly" :multiple="multiple" :max="max" :min="min" :maxlength="maxlength" :pattern="pattern"/>
      <label class="custom-control-label" :for="generateId(key)" >{{ value.label || value.name || value.v }}</label>
    </div>
  </div>
</template>

<script>
import { nameToId, uuid } from '@/assets/js/custom'
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
        return this.forms[this.configs.query].dv // 这里query定义的是相关表单变量
      }
    },
    readonly () {
      return this.configs.readonly_v === '1'
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
    this.defaultCheck((this.checkData && this.checkData.content) || [])
    this.loadSourceData(true)
    self = this
  },
  watch: {
    configs: {
      handler: function (to, from) {
        this.loadSourceData()
      },
      deep: true
    },
    dynamic: {
      handler: function (to, from) {
        self.dynamicCheck()
      }
    },
    checkValue: {
      handler: function (to, from) {
        this.configs.dv = to
      }
    },
    checkData: {
      handler: function (to, from) {
        this.defaultCheck((to && to.content) || [])
      }
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
    defaultCheck (Data) {
      this.checkValue = Data && Data.filter(__ => {
        return __.checked
      }).map(__ => {
        return __.v
      })
    },
    loadSourceData (Update = false) {
      if (Update || this.checkData === undefined || JSON.stringify(this.checkData) === '{}') {
        this.$store.dispatch('FETCH_SOURCE_DATA', {
          url: this.configs.url,
          configs: {
            params: {
              ...this.$router.currentRoute.query
            }
          },
          target: this.configs.url
        })
      }
    }
  }
}
</script>
