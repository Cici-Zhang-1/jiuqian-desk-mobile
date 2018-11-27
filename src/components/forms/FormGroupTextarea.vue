<template>
  <div class="form-group">
    <label :for="id">{{ configs.label }}<span v-if="required">*</span></label>
    <textarea class="form-control" :name="configs.name" :id="id" rows="3" v-model="formValue" :readonly="readonly" :required="required" :max="max" :min="min" :maxlength="maxlength" :pattern="pattern"  ></textarea>
  </div>
</template>

<script>
import { nameToId, uuid } from '@/assets/js/custom'
import { formsMixins } from './mixins'

export default {
  mixins: [ formsMixins ],
  name: 'form-group-textarea',
  computed: {
    id () {
      return nameToId(this.configs.name) + uuid()
    },
    formValue: {
      get () {
        return this.configs.dv || ''
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
