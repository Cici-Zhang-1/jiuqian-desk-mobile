<template>
  <div class="col-md-3 mb-2 mb-md-3 d-print-none">
    <form @submit.prevent="onSubmit">
      <div class="input-group" id="pageSearch" v-if="error">
        <div class="input-group-prepend">
          <button class="btn btn-outline-secondary" type="button" data-toggle="modal" data-target="#pageSearchModal"><i class="fa fa-search"></i></button>
        </div>
        <input class="form-control" v-for="(value, key, index) in pageSearches" v-model="value.dv" :key="index" :name="value.name" :type="value.type_name" :placeholder="value.placeholder || value.label"/>
        <div class="input-group-append">
          <button class="btn btn-outline-secondary" type="submit">Go!</button>
        </div>
      </div>
    </form>
    <div is="RegularModal" :modal="modal"></div>
  </div>
</template>

<script type="module">
import FormGroupInput from '@/components/forms/FormGroupInput'
import FormGroupSelect from '@/components/forms/FormGroupSelect'
import FormGroupRadio from '@/components/forms/FormGroupRadio'
import FormGroupCheckbox from '@/components/forms/FormGroupCheckbox'
import FormGroupTextarea from '@/components/forms/FormGroupTextarea'
import RegularModal from '@/components/modals/RegularModal'

export default {
  name: 'PageSearch',
  props: {
    pageSearches: {
      type: [Array, Object],
      required: true
    }
  },
  computed: {
    modal: {
      get () {
        return {
          target: '#pageSearchModal',
          label: '搜索设置',
          forms: this.pageSearches,
          modal_type_v: 'filter'
        }
      }
    },
    error: {
      get () {
        return !(JSON.stringify(this.pageSearches) === '{}' || JSON.stringify(this.pageSearches) === '[]' || JSON.stringify(this.pageSearches) === '')
      }
    }
  },
  methods: {
    onSubmit () {
      this.$store.commit('SET_APP_RELOAD', { reload: true })
    }
  },
  components: {
    FormGroupInput,
    FormGroupCheckbox,
    FormGroupSelect,
    FormGroupRadio,
    FormGroupTextarea,
    RegularModal
  }
}
</script>
