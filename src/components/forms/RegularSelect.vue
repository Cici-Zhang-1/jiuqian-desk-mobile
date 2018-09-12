<template>
  <div class="form-group row" v-if="selectData && (selectData.length || selectData.num)">
    <label :for="id" class="col-md-2 col-form-label">{{ configs.label }}<small class="j-pc-none text-danger" v-if="required">*</small></label>
    <div class="col-md-9">
      <select class="form-control" :name="configs.name" :id="id" v-model="selectValue" :required="required" :multiple="multiple" >
        <option value="" v-if="!required">---</option>
        <option v-for="(value, key, index) in selectData.content" :value="value.v" :key="index">{{ value.class_alien || '' }}{{ value.label || value.truename || value.name || value.v }}</option>
      </select>
    </div>
    <div class="j-phone-none col-md-1">
      <small class="text-danger" v-if="required">*</small>
    </div>
  </div>
</template>

<script>
import { nameToId, uuid } from '@/assets/js/custom'

export default {
  name: 'form-group-select',
  props: {
    configs: {
      type: [Array, Object],
      required: true
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
        return this.configs.dv || []
      },
      set (Value) {
        this.configs.dv = Value
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
    this.loadSourceData()
  },
  watch: {
    'configs.dv': {
      handler: function (to, from) {
        this.selectValue = to
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
    }
  },
  methods: {
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
