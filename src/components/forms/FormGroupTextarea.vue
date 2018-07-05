<template>
  <div class="form-group">
    <label :for="id">{{ configs.label }}</label>
    <textarea class="form-control" :name="configs.name" :id="id" rows="3" v-model="value" :readonly="readonly" :required="required" :max="max" :min="min" :maxlength="maxlength" :pattern="pattern"  ></textarea>
  </div>
</template>

<script>
import { nameToId, uuid } from '@/assets/js/custom'

export default {
  name: 'form-group-textarea',
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
    value: {
      get () {
        return this.configs.dv || ''
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
  }
}
</script>
