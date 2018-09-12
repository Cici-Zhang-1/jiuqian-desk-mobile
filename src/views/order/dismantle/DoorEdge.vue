<template>
  <div class="form-group col-md-2">
    <label>封边</label>
    <select class="form-control" name="edge" v-model="dv" v-if="doorEdgeData && doorEdgeData.num" v-on:input="$emit('input', $event.target.value)">
      <option value="">--请选择封边--</option>
      <option v-for="(value, key, index) in doorEdgeData.content" :key="index" :value="value.v">{{ value.label || value.name || value.v }}</option>
    </select>
  </div>
</template>

<script>
export default {
  name: 'DoorEdge',
  props: {
    edge: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      doorEdgeUrl: '/data/door_edge/read'
    }
  },
  computed: {
    dv: {
      get () {
        return this.edge
      },
      set (value) {}
    },
    doorEdgeData: {
      get () {
        return this.$store.getters.getSourceData({ uri: this.doorEdgeUrl })
      }
    }
  },
  created () {
    this.loadDoorEdgeData()
  },
  methods: {
    loadDoorEdgeData () {
      if ((typeof this.doorEdgeData === 'undefined' || JSON.stringify(this.doorEdgeData) === '{}')) {
        this.$store.dispatch('FETCH_SOURCE_DATA', {
          url: this.doorEdgeUrl,
          configs: {},
          target: this.doorEdgeUrl
        })
      }
    }
  }
}
</script>
