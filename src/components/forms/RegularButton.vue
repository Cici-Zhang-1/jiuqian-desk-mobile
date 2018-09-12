<template>
  <div class="form-group row">
    <label class="col-2 col-form-label"></label>
    <div class="col-9">
      <button :type="configs.form_type_v" class="btn btn-primary my-1">{{ configs.label}}</button>
    </div>
    <div class="col-1">
      <small class="text-danger" v-if="required">*</small>
    </div>
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
    }
  },
  computed: {
    id () {
      return nameToId(this.configs.name) + uuid()
    }
  }
}
</script>
