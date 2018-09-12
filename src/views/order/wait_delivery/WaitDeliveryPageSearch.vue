<template>
  <div class="col-md-9 mb-2 mb-md-3 d-print-none">
    <form @submit.prevent="$emit('work-out', $event.target)">
      <div class="input-group" id="pageSearch">
        <div v-for="(value, key, index) in pageSearches" :key="index" :is="formGroupType(value.form_type_v)" :configs="value"></div>
        <div class="input-group-append">
          <button class="btn btn-outline-secondary" type="submit">拟定</button>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import OnlyInput from '@/components/forms/OnlyInput'
import OnlySelect from '@/components/forms/OnlySelect'
export default {
  name: 'WaitDeliveryPageSearch',
  props: {
    pageSearches: {
      type: [Array, Object],
      required: true
    }
  },
  methods: {
    formGroupType (value) {
      let type = ''
      switch (value) {
        case 'text':
        case 'password':
        case 'number':
        case 'date':
          type = 'only-input'
          break
        case 'select':
          type = 'only-select'
          break
        default:
          type = 'only-input'
      }
      return type
    }
  },
  components: {
    OnlyInput,
    OnlySelect
  }
}
</script>
