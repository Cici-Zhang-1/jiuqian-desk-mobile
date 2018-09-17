<template>
  <input type="hidden" :name="configs.name" v-model="value" :required="required" :max="max" :min="min" :maxlength="maxlength" :pattern="pattern" />
</template>

<script>
export default {
  name: 'InputHidden',
  props: {
    configs: {
      type: [ Array, Object ],
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
    value: {
      get () {
        return this.configs.dv
      },
      set (value) {
        this.configs.dv = value
      }
    },
    required () {
      return this.configs.required_name === '1'
    },
    max () {
      return this.configs.max
    },
    min () {
      return this.configs.min
    },
    maxlength () {
      return this.configs.maxlength !== '0' ? this.configs.maxlength : ''
    },
    pattern () {
      return this.configs.pattern
    }
  },
  created () {
    this.parseQuery()
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
