<template>
  <div class="form-group col-md-1">
    <label>正面封边</label>
    <select class="form-control" name="facefb" v-model="dv" v-if="facefbData && facefbData.num" v-on:input="$emit('input', $event.target.value)">
      <option v-for="(value, key, index) in facefbData.content" :key="index" :value="value.v">{{ value.label || value.name || value.v }}</option>
    </select>
  </div>
</template>

<script>
export default {
  name: 'DismantleFacefb',
  props: {
    facefb: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      facefbUrl: '/data/facefb/read'
    }
  },
  computed: {
    dv: {
      get () {
        return this.facefb
      },
      set (value) {}
    },
    facefbData: {
      get () {
        return this.$store.getters.getSourceData({ uri: this.facefbUrl })
      }
    }
  },
  created () {
    this.loadFacefbData()
  },
  methods: {
    loadFacefbData () {
      if ((typeof this.facefbData === 'undefined' || JSON.stringify(this.facefbData) === '{}')) {
        this.$store.dispatch('FETCH_SOURCE_DATA', {
          url: this.facefbUrl,
          configs: {},
          target: this.facefbUrl,
          local: true
        })
      }
    }
  }
}
</script>
