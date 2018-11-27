<template>
    <div class="form-group" v-if="dataList && (dataList.length || dataList.num)">
        <label :for="id">{{ configs.label }}<span v-if="required">*</span></label>
        <input type="text" :name="configs.name" class="form-control" :id="id" v-model="formValue" :readonly="readonly" :required="required" :max="max" :min="min" :maxlength="maxlength" :pattern="pattern" :placeholder="placeholder" :list="listId"/>
        <datalist :id="listId">
            <option v-for="(value, key, index) in dataList.content" :value="value.v" :key="index">{{ value.class_alien || '' }}{{ value.label || value.truename || value.name || value.v }}</option>
        </datalist>
    </div>
</template>

<script>
import { nameToId, uuid } from '@/assets/js/custom'
import { formsMixins } from './mixins'
export default {
  mixins: [ formsMixins ],
  name: 'InputDatalist',
  computed: {
    id () {
      return nameToId(this.configs.name) + uuid()
    },
    listId () {
      return this.id + uuid()
    },
    dataList: {
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
    configs: {
      handler: function (to, from) {
        this.loadSourceData()
      },
      deep: true
    }
  },
  methods: {
    loadSourceData () {
      if (typeof this.dataList === 'undefined' || JSON.stringify(this.dataList) === '{}') {
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
