<template>
  <div class="form-group col-md-1">
    <label>厚度</label>
    <select class="form-control" name="change_line" v-model="dv" v-if="thickData && thickData.num" v-on:input="$emit('input', $event.target.value)">
      <option value="*">*</option>
      <option v-for="(value, key, index) in thickData.content" :key="index" :value="value.v">{{ value.label || value.name || value.v }}</option>
    </select>
  </div>
</template>

<script>
export default {
  name: 'Thick',
  props: {
    thick: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      thickUrl: '/data/board_thick/read'
    }
  },
  computed: {
    dv: {
      get () {
        return this.thick
      },
      set (value) {}
    },
    thickData: {
      get () {
        return this.$store.getters.getSourceData({ uri: this.thickUrl })
      }
    }
  },
  created () {
    this.loadThickData()
  },
  methods: {
    loadThickData () {
      if ((typeof this.thickData === 'undefined' || JSON.stringify(this.thickData) === '{}')) {
        this.$store.dispatch('FETCH_SOURCE_DATA', {
          url: this.thickUrl,
          configs: {},
          target: this.thickUrl
        })
      }
    }
  }
}
</script>
