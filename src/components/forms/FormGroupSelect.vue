<template>
  <div class="form-group" v-if="selectData && (selectData.length || selectData.num)">
    <label :for="id">{{ configs.label }}</label>
    <select class="form-control" :name="configs.name" :id="id" v-model="selectValue" :readonly="readonly" :required="required" :multiple="multiple" :max="max" :min="min" :maxlength="maxlength" :pattern="pattern"  >
      <option value="" v-if="!required">---</option>
      <option v-for="(value, key, index) in selectData.content" :value="value.v" :key="index">{{ value.class_alien || '' }}{{ value.label || value.name || value.v }}</option>
    </select>
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
    configs: {
      handler: function (to, from) {
        this.loadSourceData()
      },
      deep: true
    }
  },
  methods: {
    loadSourceData () {
      if (typeof this.selectData === 'undefined' || JSON.stringify(this.selectData) === '{}') {
        this.$store.dispatch('FETCH_SOURCE_DATA', {
          url: this.configs.url,
          target: this.configs.url
        })
      }
    }
  }
}
</script>
