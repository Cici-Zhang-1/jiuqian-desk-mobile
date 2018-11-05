<template>
  <td>
    <input class="form-control input-sm" name="slot" list="wySlot" type="text" v-model="dv" v-on:input="$emit('input', $event.target.value)"/>
    <datalist id="wySlot" v-if="slotData && slotData.num">
      <option v-for="(value, key, index) in slotData.content" :value="value.v" :key="index">{{ value.label || value.name || value.v }}</option>
    </datalist>
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
          target: this.slotUrl,
          local: true
        })
      }
    }
  }
}
</script>
