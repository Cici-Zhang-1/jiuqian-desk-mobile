<template>
  <td>
    <select class="form-control input-sm" name="wood_center" v-model="dv" v-if="centerData && centerData.num" v-on:input="$emit('input', $event.target.value)" >
      <option value="">--请选择--</option>
      <option v-for="(value, key, index) in centerData.content" :key="index" :value="value.v" :data-open-hole="value.open_hole === '1'" :data-invisibility="value.invisibility === '1'">{{ value.label || value.name || value.v }}</option>
    </select>
  </td>
</template>

<script>
export default {
  name: 'WoodCenter',
  props: {
    center: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      centerUrl: '/data/wood_center/read'
    }
  },
  computed: {
    dv: {
      get () {
        return this.center
      },
      set (value) {}
    },
    centerData: {
      get () {
        return this.$store.getters.getSourceData({ uri: this.centerUrl })
      }
    }
  },
  created () {
    this.loadPunchData()
  },
  methods: {
    loadPunchData () {
      if ((typeof this.centerData === 'undefined' || JSON.stringify(this.centerData) === '{}')) {
        this.$store.dispatch('FETCH_SOURCE_DATA', {
          url: this.centerUrl,
          configs: {},
          target: this.centerUrl
        })
      }
    }
  }
}
</script>
