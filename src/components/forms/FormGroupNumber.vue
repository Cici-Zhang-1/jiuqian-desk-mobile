<template>
  <div class="form-group">
    <label :for="id">{{ configs.label }}<span v-if="required">*</span></label>
    <input type="number" :name="configs.name" class="form-control" :id="id" v-model="value" :readonly="readonly" :required="required" :max="max" :min="min" :maxlength="maxlength" :pattern="pattern" :placeholder="placeholder" step="0.0000000001" />
  </div>
</template>

<script>
import { nameToId, uuid } from '@/assets/js/custom'

export default {
  name: 'form-group-input',
  props: {
    configs: {
      type: [Array, Object],
      required: true
    },
    query: {
      type: [Array, Object]
    }
  },
  computed: {
    id () {
      return nameToId(this.configs.name) + uuid()
    },
    value: {
      get () {
        return this.configs.dv
      },
      set (value) {
        this.configs.dv = value
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
    },
    placeholder () {
      return this.configs.placeholder
    }
  }
}
</script>
