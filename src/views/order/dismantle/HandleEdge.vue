<template>
  <td>
    <select class="form-control input-sm" name="handle_edge" v-model="dv" v-if="handleData && handleData.num" v-on:input="$emit('input', $event.target.value)" @focusout="$emit('focusout-handle', $event.target)">
      <option value="">--请选择--</option>
      <option v-for="(value, key, index) in handleData.content" :key="index" :value="value.v" :data-open-hole="value.open_hole === '1'" :data-invisibility="value.invisibility === '1'">{{ value.label || value.name || value.v }}</option>
  </select></td>
</template>

<script>
export default {
  name: 'HandleEdge',
  props: {
    handle: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      handleUrl: '/data/handle/read'
    }
  },
  computed: {
    dv: {
      get () {
        return this.handle
      },
      set (value) {}
    },
    handleData: {
      get () {
        return this.$store.getters.getSourceData({ uri: this.handleUrl })
      }
    }
  },
  created () {
    this.loadPunchData()
  },
  methods: {
    loadPunchData () {
      if ((typeof this.handleData === 'undefined' || JSON.stringify(this.handleData) === '{}')) {
        this.$store.dispatch('FETCH_SOURCE_DATA', {
          url: this.handleUrl,
          configs: {},
          target: this.handleUrl
        })
      }
    }
  }
}
</script>
