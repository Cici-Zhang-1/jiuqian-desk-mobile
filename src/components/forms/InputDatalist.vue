<template>
    <div class="form-group" v-if="dataList && (dataList.length || dataList.num)">
        <label :for="id">{{ configs.label }}<span v-if="required">*</span></label>
        <input type="text" :name="configs.name" class="form-control" :id="id" v-model="value" :readonly="readonly" :required="required" :max="max" :min="min" :maxlength="maxlength" :pattern="pattern" :placeholder="placeholder" :list="listId"/>
        <datalist :id="listId">
            <option v-for="(value, key, index) in dataList.content" :value="value.v" :key="index">{{ value.class_alien || '' }}{{ value.label || value.truename || value.name || value.v }}</option>
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
    forms: {
      type: [Array, Object],
      required: true
    },
    query: {
      type: [Array, Object]
    }
  },
  data () {
    return {
      queryStr: '',
      params: [],
      paramsValue: {},
      related: [],
      relatedValue: {}
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
    parseQuery () {
      if (this.configs.query) {
        [ this.queryStr = '', this.params = '', this.related = '' ] = this.configs.query.split('-')
        this.params = this.params.split(',')
        this.related = this.related.split(',')
        this.initQuery()
      }
    },
    initQuery () {
      if (this.queryStr) {
        if (this.$router.currentRoute.query[this.queryStr] !== undefined) {
          this.value = this.$router.currentRoute.query[this.queryStr]
        }
        this.watchQuery()
      }
      if (this.params.length > 0) {
        this.params.map(__ => {
          if (this.$router.currentRoute.query[__] !== undefined) {
            this.paramsValue[__] = this.$router.currentRoute.query[__]
          } else {
            this.paramsValue[__] = ''
          }
          return __
        })
        this.watchParams()
      }
      if (this.related.length > 0) {
        this.related.map(__ => {
          if (this.forms[__] !== undefined) {
            this.relatedValue[__] = this.forms[__].dv
          }
          return __
        })
        this.watchForms()
      }
    },
    watchQuery () {
      this.$watch('query', function (to, from) {
        if (this.query[this.queryStr] !== undefined && this.query[this.queryStr] !== this.value) {
          this.value = this.query[this.queryStr]
        }
      }, {
        deep: true
      })
    },
    watchParams () {
      this.$watch('query', function (to, from) {
        let Flag = false
        this.params.map(__ => {
          if (this.query[__] !== undefined && this.query[__] !== this.paramsValue[__]) {
            this.paramsValue[__] = this.query[__]
            Flag = true
          }
          return __
        })
        if (Flag) {
          this.loadSourceData(true)
        }
      }, {
        deep: true
      })
    },
    watchForms () {
      this.related.map(__ => {
        this.$watch(function () {
          return this.forms[__].dv
        }, function (to, from) {
          if (this.forms[__].dv !== this.relatedValue[__]) {
            this.relatedValue[__] = this.forms[__].dv
            this.loadSourceData(true)
          }
        })
        return __
      }, {
        deep: true
      })
    },
    loadSourceData () {
      if (typeof this.dataList === 'undefined' || JSON.stringify(this.dataList) === '{}') {
        let params = this.paramsValue || {}
        let related = this.relatedValue || {}
        this.$store.dispatch('FETCH_SOURCE_DATA', {
          url: this.configs.url,
          configs: {
            params: { ...params, ...related }
          },
          target: this.configs.url
        })
      }
    }
  }
}
</script>
