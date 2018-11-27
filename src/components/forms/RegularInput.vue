<template>
  <div class="form-group row">
    <label :for="id" class="col-md-2 col-form-label">{{ configs.label }}<small class="j-pc-none text-danger" v-if="required">*</small></label>
    <div class="col-md-9">
      <input :type="configs.form_type_v" :name="configs.name" class="form-control" :id="id" v-model="formValue" :readonly="readonly" :required="required" :max="max" :min="min" :maxlength="maxlength" :pattern="pattern" :placeholder="placeholder" />
    </div>
    <div class="j-phone-none col-md-1">
      <small class="text-danger" v-if="required">*</small>
    </div>
  </div>
</template>

<script>
import { nameToId, uuid } from '@/assets/js/custom'
import { formsMixins } from './mixins'

export default {
  mixins: [ formsMixins ],
  name: 'regular-input',
  computed: {
    id () {
      return nameToId(this.configs.name) + uuid()
    },
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
