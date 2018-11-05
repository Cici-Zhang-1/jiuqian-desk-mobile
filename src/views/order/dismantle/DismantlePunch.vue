<template>
  <td>
    <select class="form-control input-sm" name="punch" v-model="dv" v-if="punchData && punchData.num" v-on:input="$emit('input', $event.target.value)">
      <option value="">--请选择--</option>
      <option v-for="(value, key, index) in punchData.content" :key="index" :value="value.v">{{ value.label || value.name || value.v }}</option>
  </select></td>
</template>

<script>
export default {
  name: 'DismantlePunch',
  props: {
    punch: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      punchUrl: '/data/punch/read'
    }
  },
  computed: {
    dv: {
      get () {
        return this.punch
      },
      set (value) {}
    },
    punchData: {
      get () {
        return this.$store.getters.getSourceData({ uri: this.punchUrl })
      }
    }
  },
  created () {
    this.loadPunchData()
  },
  methods: {
    loadPunchData () {
      if ((typeof this.punchData === 'undefined' || JSON.stringify(this.punchData) === '{}')) {
        this.$store.dispatch('FETCH_SOURCE_DATA', {
          url: this.punchUrl,
          configs: {},
          target: this.punchUrl,
          local: true
        })
      }
    }
  }
}
</script>
