<template>
  <td>
    <select class="form-control input-sm" name="edge" v-model="dv" v-if="edgeData && edgeData.num" v-on:input="$emit('input', $event.target.value)">
      <option value="">--请选择--</option>
      <option v-for="(value, key, index) in edgeData.content" :key="index" :value="value.v">{{ value.label || value.name || value.v }}</option>
  </select></td>
</template>

<script>
export default {
  name: 'DismantleEdge',
  props: {
    edge: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      edgeUrl: '/data/edge/unique'
    }
  },
  computed: {
    dv: {
      get () {
        return this.edge
      },
      set (value) {}
    },
    edgeData: {
      get () {
        return this.$store.getters.getSourceData({ uri: this.edgeUrl })
      }
    }
  },
  created () {
    this.loadEdgeData()
  },
  methods: {
    loadEdgeData () {
      if ((typeof this.edgeData === 'undefined' || JSON.stringify(this.edgeData) === '{}')) {
        this.$store.dispatch('FETCH_SOURCE_DATA', {
          url: this.edgeUrl,
          configs: {},
          target: this.edgeUrl,
          local: true
        })
      }
    }
  }
}
</script>
