<template>
  <fieldset class="form-group" v-if="radioData && (radioData.length || radioData.num)">
    <div class="row">
      <legend class="col-form-label col-md-2 pt-0">{{ configs.label }}<small class="j-pc-none text-danger" v-if="required">*</small></legend>
      <div class="col-md-9">
        <div v-for="(value, key, index) in radioData.content" :key='index' class="custom-control custom-radio">
          <input type="radio" :name="configs.name" class="custom-control-input" :id="generateId(key)" v-model="radioValue" :value="value.v" :disabled="readonly" :multiple="multiple" :max="max" :min="min" :maxlength="maxlength" :pattern="pattern"/>
          <label class="custom-control-label" :for="generateId(key)" >{{ value.label || value.name || value.v }}</label>
        </div>
      </div>
      <div class="j-phone-none col-md-1">
        <small class="text-danger" v-if="required">*</small>
      </div>
    </div>
  </fieldset>
</template>

<script>
import { nameToId, uuid } from '@/assets/js/custom'

export default {
  name: 'regular-radio',
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
          this.radioValue = this.$router.currentRoute.query[this.queryStr]
          this.multipleDv()
        }
        this.watchQuery()
      }
    },
    watchQuery () {
      this.$watch('query', function (to, from) {
        if (this.query[this.queryStr] !== undefined && this.query[this.queryStr] !== this.radioValue) {
          this.radioValue = this.query[this.queryStr]
          this.multipleDv()
        }
      }, {
        deep: true
      })
    },
    generateId (key) {
      return this.id + key
    },
    loadSourceData (Reload = false) {
      if ((Reload || typeof this.selectData === 'undefined' || JSON.stringify(this.selectData) === '{}') && this.configs.url !== '') {
        this.$store.dispatch('FETCH_SOURCE_DATA', {
          url: this.configs.url,
          target: this.configs.url
        })
      }
    }
  }
}
</script>
