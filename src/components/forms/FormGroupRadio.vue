<template>
  <div v-if="radioData.length || radioData.num" >
    <div v-for="(value, key, index) in radioData.content" :key="index" class="form-check">
      <input class="form-check-input" type="radio" :name="configs.name" :id="generateId(key)" v-model="radioValue" :value="value.v" :readonly="readonly" :required="required" :multiple="multiple" :max="max" :min="min" :maxlength="maxlength" :pattern="pattern"  />
      <label class="form-check-label" :for="generateId(key)">{{ value.label || value.name || value.v }}</label>
    </div>
  </div>
</template>

<script>
import { nameToId, uuid } from '@/assets/js/custom'

export default {
  name: 'form-group-radio',
  props: {
    configs: {
      type: [Array, Object],
      required: true
    }
  },
  computed: {
    id () {
      return nameToId(this.configs.name) + uuid()
    },
    radioData: {
      get () {
        return this.$store.getters.getSourceData({ uri: this.configs.url })
      }
    },
    radioValue: {
      get () {
        return this.configs.dv
      },
      set (value) {
        this.configs.dv = value
      }
    },
    readonly () {
      return this.configs.readonly_v === '1'
    },
    required () {
      return this.configs.required_v === '1'
    },
    multiple () {
      return this.configs.multiple_v === '1'
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
  },
  created () {
    this.loadSourceData()
  },
  watch: {
    configs: {
      handler: function (to, from) {
        this.loadSourceData()
      },
      deep: true
    }
  },
  methods: {
    loadSourceData () {
      if (typeof this.radioData === 'undefined' || JSON.stringify(this.radioData) === '{}') {
        this.$store.dispatch('FETCH_SOURCE_DATA', {
          url: this.configs.url,
          target: this.configs.url
        })
      }
    },
    generateId (key) {
      return this.id + key
    }
  }
}
</script>
