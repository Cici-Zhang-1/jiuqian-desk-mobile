<template>
  <div class="form-group row">
    <label :for="id" class="col-md-2 col-form-label">{{ configs.label }}<small class="j-pc-none text-danger" v-if="required">*</small></label>
    <div class="col-md-9">
      <textarea class="form-control" :name="configs.name" :id="id" rows="3" v-model="value" :readonly="readonly" :required="required" :max="max" :min="min" :maxlength="maxlength" :pattern="pattern"  ></textarea>
    </div>
    <div class="j-phone-none col-md-1">
      <small class="text-danger" v-if="required">*</small>
    </div>
  </div>
</template>

<script>
import { nameToId, uuid } from '@/assets/js/custom'

export default {
  name: 'form-group-textarea',
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
      queryStr: ''
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
        if (this.query[this.queryStr] !== undefined && this.query[this.queryStr] !== this.value) {
          this.value = this.query[this.queryStr]
        }
      }, {
        deep: true
      })
    }
  }
}
</script>
