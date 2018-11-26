<template>
  <div v-if="radioData && (radioData.length || radioData.num)" >
    <label>{{ configs.label }}<span v-if="required">*</span></label>
    <div v-for="(value, key, index) in radioData.content" :key="index" class="form-check">
      <input class="form-check-input" type="radio" :name="configs.name" :id="generateId(key)" v-model="formValue" :value="value.v" :disabled="readonly" :required="required" />
      <label class="form-check-label" :for="generateId(key)">{{ value.label || value.name || value.v }}</label>
    </div>
  </div>
</template>

<script>
import { formsMixins } from './mixins'

export default {
  mixins: [ formsMixins ],
  name: 'form-group-radio',
  computed: {
    formValue: {
      get () {
        return this.configs.dv
      },
      set (value) {
        this.configs.dv = value
      }
    },
    radioData: {
      get () {
        return this.$store.getters.getSourceData({ uri: this.configs.url })
      }
    }
  },
  created () {
    this.parseQuery()
    this.loadSourceData(true)
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
      if ((Reload || typeof this.radioData === 'undefined' || JSON.stringify(this.radioData) === '{}') && this.configs.url !== '') {
        let params = this.paramsValue || {}
        let related = this.relatedValue || {}
        this.$store.dispatch('FETCH_SOURCE_DATA', {
          url: this.configs.url,
          configs: {
            params: { ...params, ...related }
          },
          target: this.configs.url,
          local: this.local
        })
      }
    }
  }
}
</script>
