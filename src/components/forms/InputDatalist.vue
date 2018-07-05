<template>
    <div class="form-group" v-if="dataList && (dataList.length || dataList.num)">
        <label :for="id">{{ configs.label }}</label>
        <input type="text" :name="configs.name" class="form-control" :id="id" v-model="value" :readonly="readonly" :required="required" :max="max" :min="min" :maxlength="maxlength" :pattern="pattern" :placeholder="placeholder" :list="listId"/>
        <datalist :id="listId">
            <option v-for="(value, key, index) in dataList.content" :value="value.v" :key="index">{{ value.class_alien || '' }}{{ value.label || value.name || value.v }}</option>
        </datalist>
    </div>
</template>

<script>
import { nameToId, uuid } from '@/assets/js/custom'
export default {
  name: 'InputDatalist',
  props: {
    configs: {
      type: [Array, Object],
      required: true
    },
    query: {
      type: [String, Number, Boolean]
    }
  },
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
    value: {
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
    },
    placeholder () {
      return this.configs.placeholder
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
      if (typeof this.dataList === 'undefined' || JSON.stringify(this.dataList) === '{}') {
        this.$store.dispatch('FETCH_SOURCE_DATA', {
          url: this.configs.url,
          target: this.configs.url
        })
      }
    }
  }
}
</script>
