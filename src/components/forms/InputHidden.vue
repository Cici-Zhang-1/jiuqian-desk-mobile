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
      queryStr: ''
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
  methods: {
    parseQuery () {
      if (this.configs.query) {
        this.queryStr = this.configs.query
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
    },
    watchQuery () {
      this.$watch('query', function (to, from) {
        if (this.query[this.queryStr] !== undefined && this.value !== this.query[this.queryStr]) {
          this.value = this.query[this.queryStr]
        }
      }, {
        deep: true
      })
    }
  }
}
</script>
