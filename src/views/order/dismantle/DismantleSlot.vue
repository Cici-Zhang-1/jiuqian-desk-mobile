<template>
  <td>
    <select class="form-control input-sm" name="slot" v-model="dv" v-if="slotData && slotData.num" v-on:input="$emit('input', $event.target.value)">
      <option value="">--请选择--</option>
      <option v-for="(value, key, index) in slotData.content" :key="index" :value="value.v">{{ value.label || value.name || value.v }}</option>
    </select>
  </td>
</template>

<script>
export default {
  name: 'DismantleSlot',
  props: {
    slots: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      slotUrl: '/data/slot/read'
    }
  },
  computed: {
    dv: {
      get () {
        return this.slots
      },
      set (value) {}
    },
    slotData: {
      get () {
        return this.$store.getters.getSourceData({ uri: this.slotUrl })
      }
    }
  },
  created () {
    this.loadSlotData()
  },
  methods: {
    loadSlotData () {
      if ((typeof this.slotData === 'undefined' || JSON.stringify(this.slotData) === '{}')) {
        this.$store.dispatch('FETCH_SOURCE_DATA', {
          url: this.slotUrl,
          configs: {},
          target: this.slotUrl
        })
      }
    }
  }
}
</script>
