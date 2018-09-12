<template>
  <td>
    <input class="form-control input-sm" name="plate_name" list="yPlate" type="text" v-model="dv" v-on:input="$emit('input', $event.target.value)"/>
    <datalist id="yPlate" v-if="plateData && plateData.num">
      <option v-for="(value, key, index) in plateData.content" :value="value.v" :key="index">{{ value.label || value.name || value.v }}</option>
    </datalist>
  </td>
</template>

<script>
export default {
  name: 'WoodPlate',
  props: {
    plate: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      plateUrl: '/data/wood_plate/read'
    }
  },
  computed: {
    dv: {
      get () {
        return this.plate
      },
      set (value) {}
    },
    plateData: {
      get () {
        return this.$store.getters.getSourceData({ uri: this.plateUrl })
      }
    }
  },
  created () {
    this.loadPlateData()
  },
  methods: {
    loadPlateData () {
      if ((typeof this.plateData === 'undefined' || JSON.stringify(this.plateData) === '{}')) {
        this.$store.dispatch('FETCH_SOURCE_DATA', {
          url: this.plateUrl,
          configs: {},
          target: this.plateUrl
        })
      }
    }
  }
}
</script>
