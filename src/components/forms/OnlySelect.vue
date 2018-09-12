<template>
  <select class="form-control" :name="configs.name" :id="id" v-model="selectValue" :required="required" :multiple="multiple" >
    <option value="" v-if="!required">---</option>
    <option v-for="(value, key, index) in selectData.content" :value="value.v" :key="index">{{ value.class_alien || '' }}{{ value.label || value.truename || value.name || value.v }}</option>
  </select>
</template>

<script>
import { nameToId, uuid } from '@/assets/js/custom'
import $ from 'jquery'

export default {
  name: 'only-select',
  props: {
    configs: {
      type: [Array, Object],
      required: true
    }
  },
  data () {
    return {}
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
    this.loadSourceData()
  },
  watch: {
    'configs.dv': {
      handler: function (to, from) {
        this.multipleDv()
      }
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
    }
  },
  methods: {
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
