<template>
  <div class="form-group">
    <label :for="id">{{ configs.label }}</label>
    <input :type="configs.form_type_name" :name="configs.name" class="form-control" :id="id" v-model="value" :readonly="readonly" :required="required" :max="max" :min="min" :maxlength="maxlength" :pattern="pattern" />
  </div>
</template>

<script>
import { nameToId } from '@/assets/js/custom'

export default {
  name: 'form-group-input',
  props: {
    configs: {
      type: [Array, Object],
      required: true
    }
  },
  computed: {
    id () {
      return nameToId(this.configs.name)
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
      return this.configs.readonly_name === '1'
    },
    required () {
      return this.configs.required_name === '1'
    },
    multiple () {
      return this.configs.multiple_name === '1'
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
