<template>
  <td>
    <input class="form-control input-sm" list="yAbnormity" name="remark" type="text" v-model="dv" v-on:input="$emit('input', $event.target.value)"/>
    <datalist id="yAbnormity" v-if="abnormityData && abnormityData.num">
      <option v-for="(value, key, index) in abnormityData.content" :value="value.v" :key="index">{{ value.label || value.name || value.v }}</option>
    </datalist>
  </td>
</template>

<script>
export default {
  name: 'DismantleRemark',
  props: {
    remark: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      abnormityUrl: '/data/abnormity/read'
    }
  },
  computed: {
    dv: {
      get () {
        return this.remark
      },
      set (value) {}
    },
    abnormityData: {
      get () {
        return this.$store.getters.getSourceData({ uri: this.abnormityUrl })
      }
    }
  },
  created () {
    this.loadAbnormityData()
  },
  methods: {
    loadAbnormityData () {
      if ((typeof this.abnormityData === 'undefined' || JSON.stringify(this.abnormityData) === '{}')) {
        this.$store.dispatch('FETCH_SOURCE_DATA', {
          url: this.abnormityUrl,
          configs: {},
          target: this.abnormityUrl,
          local: true
        })
      }
    }
  }
}
</script>
