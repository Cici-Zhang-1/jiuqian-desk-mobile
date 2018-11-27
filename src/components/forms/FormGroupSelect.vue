<template>
  <div class="form-group" v-if="selectData && (selectData.length || selectData.num)">
    <label :for="id">{{ configs.label }}<span v-if="required">*</span></label>
    <select class="form-control" :name="configs.name" :id="id" v-model="formValue" :required="required" :readonly="readonly" :multiple="multiple" >
      <option value="" v-if="!required">---</option>
      <option v-for="(value, key, index) in selectData.content" :value="value.v" :key="index">{{ value.class_alien || '' }}{{ value.label || value.truename || value.name || value.v }}</option>
    </select>
    <small class="form-text text-muted" v-if="multiple && this.selectData &&  (selectData.length || selectData.num)">{{ showSelect()}}</small>
  </div>
</template>

<script>
import { nameToId, uuid } from '@/assets/js/custom'
import { formsMixins } from './mixins'

export default {
  mixins: [ formsMixins ],
  name: 'form-group-select',
  computed: {
    id () {
      return nameToId(this.configs.name) + uuid()
    },
    selectData: {
      get () {
        return this.$store.getters.getSourceData({ uri: this.configs.url })
      }
    },
    formValue: {
      get () {
        return this.multipleDv(this.configs.dv)
      },
      set (Value) {
        this.configs.dv = Value
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
    showSelect () {
      let selected = []
      let self = this

      this.selectData.content.map(__ => {
        if (self.formValue.includes(__.v)) {
          selected.push(__.label || __.name || __.v)
        }
        return __
      })
      return selected.toString()
    },
    loadSourceData (Reload = false) {
      if ((Reload || typeof this.selectData === 'undefined' || JSON.stringify(this.selectData) === '{}') && this.configs.url !== '') {
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
