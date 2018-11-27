<template>
  <fieldset class="form-group" v-if="radioData && (radioData.length || radioData.num)">
    <div class="row">
      <legend class="col-form-label col-md-2 pt-0">{{ configs.label }}<small class="j-pc-none text-danger" v-if="required">*</small></legend>
      <div class="col-md-9">
        <div v-for="(value, key, index) in radioData.content" :key='index' class="custom-control custom-radio">
          <input type="radio" :name="configs.name" class="custom-control-input" :id="generateId(key)" v-model="formValue" :value="value.v" :disabled="readonly" :multiple="multiple" :max="max" :min="min" :maxlength="maxlength" :pattern="pattern"/>
          <label class="custom-control-label" :for="generateId(key)" >{{ value.label || value.name || value.v }}</label>
        </div>
      </div>
      <div class="j-phone-none col-md-1">
        <small class="text-danger" v-if="required">*</small>
      </div>
    </div>
  </fieldset>
</template>

<script>
import { nameToId, uuid } from '@/assets/js/custom'
import { formsMixins } from './mixins'

export default {
  mixins: [ formsMixins ],
  name: 'regular-radio',
  computed: {
    id () {
      return nameToId(this.configs.name) + uuid()
    },
    radioData: {
      get () {
        return this.$store.getters.getSourceData({ uri: this.configs.url })
      }
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
    this.loadSourceData()
  },
  watch: {
    'configs.url': {
      handler: function (to, from) {
        this.loadSourceData(true)
      },
      deep: true
    }
  },
  methods: {
    generateId (key) {
      return this.id + key
    },
    loadSourceData (Reload = false) {
      if ((Reload || typeof this.selectData === 'undefined' || JSON.stringify(this.selectData) === '{}') && this.configs.url !== '') {
        this.$store.dispatch('FETCH_SOURCE_DATA', {
          url: this.configs.url,
          target: this.configs.url
        })
      }
    }
  }
}
</script>
