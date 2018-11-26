<template>
  <div class="form-group">
    <label :for="id">{{ configs.label }}<span v-if="required">*</span></label>
    <input :type="configs.form_type_v" :name="configs.name" class="form-control" :id="id" v-model="formValue" :readonly="readonly" :required="required" :max="max" :min="min" :maxlength="maxlength" :pattern="pattern" :placeholder="placeholder" />
  </div>
</template>

<script>
import { nameToId, uuid } from '@/assets/js/custom'
import { formsMixins } from './mixins'

export default {
  mixins: [ formsMixins ],
  name: 'form-group-input',
  computed: {
    id () {
      return nameToId(this.configs.name) + uuid()
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
          this.formValue = this.$router.currentRoute.query[this.queryStr]
        }
        this.watchQuery()
      }
    },
    watchQuery () {
      this.$watch('query', function (to, from) {
        if (this.query[this.queryStr] !== undefined && this.query[this.queryStr] !== this.formValue) {
          this.formValue = this.query[this.queryStr]
        }
      }, {
        deep: true
      })
    }
  }
}
</script>
