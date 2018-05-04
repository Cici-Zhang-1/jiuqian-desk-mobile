<template>
  <input type="hidden" :name="configs.name" v-model="value" :required="required" :max="max" :min="min" :maxlength="maxlength" :pattern="pattern" />
</template>

<script>
export default {
  name: 'InputHidden',
  props: {
    configs: {
      type: [ Array, Object ],
      required: true
    }
  },
  computed: {
    value: {
      get () {
        return this.configs.value
      },
      set (value) {
        this.configs.value = value
      }
    },
    required () {
      return this.configs.required_name === '1'
    },
    max () {
      return this.configs.max
    },
    min () {
      return this.configs.min
    },
    maxlength () {
      return this.configs.maxlength !== '0' ? this.configs.maxlength : ''
    },
    pattern () {
      return this.configs.pattern
    }
  }
}
</script>
