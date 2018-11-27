<template>
  <input type="hidden" :name="configs.name" v-model="formValue" :required="required" :max="max" :min="min" :maxlength="maxlength" />
</template>

<script>
import { formsMixins } from './mixins'
export default {
  mixins: [ formsMixins ],
  name: 'InputHidden',
  computed: {
    formValue: {
      get () {
        return this.configs.dv
      },
      set (value) {
        this.configs.dv = value
      }
    }
  },
  created () {
    this.parseQuery()
  }
}
</script>
