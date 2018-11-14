import { nameToId, uuid } from '@/assets/js/custom'
let formsMixins = {
  computed: {
    id () {
      return nameToId(this.configs.name) + uuid()
    },
    readonly () {
      return this.forceReadonly && this.configs.readonly_v === '1'
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
  methods: {
    generateId (key) {
      return this.id + key
    }
  }
}

export { formsMixins }
