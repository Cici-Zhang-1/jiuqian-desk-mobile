<template>
  <div class="form-group">
    <label :for="id">{{ configs.label }}<span v-if="required">*</span></label>
    <input :type="configs.form_type_v" :name="configs.name" class="form-control" :id="id" v-model="value" :readonly="readonly" :required="required" :max="max" :min="min" :maxlength="maxlength" :pattern="pattern" :placeholder="placeholder" />
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
  watch: {
    query: {
      handler: function (to, from) {
        if (this.queryStr && this.query[this.queryStr] !== undefined) {
          this.value = this.query[this.queryStr]
        }
        if (this.params.length > 0) {
          this.params.map(__ => {
            if (this.query[__] !== undefined) {
              this.paramsValue[__] = this.query[__]
            }
            return __
          })
        }
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
          this.dealerId = this.query[this.queryStr]
        }
      }
      if (this.params.length > 0) {
        this.params.map(__ => {
          if (this.$router.currentRoute.query[__] !== undefined) {
            this.paramsValue[__] = this.query[__]
          }
          return __
        })
      }
    }
  }
}
</script>
