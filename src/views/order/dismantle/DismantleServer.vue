<template>
  <td>
    <input class="form-control input-sm" name="server" list="yPlate" type="text" v-model="dv" v-on:input="$emit('input', $event.target.value)" @focusout="$emit('focusout-server', getV($event.target))"/>
    <datalist id="yPlate" v-if="serverData && serverData.num">
      <option v-for="(value, key, index) in serverData.content" :value="value.name + '-' + value.speci + '-' + value.unit" :key="index" ></option>
    </datalist>
  </td>
</template>

<script>
export default {
  name: 'DismantleServer',
  props: {
    server: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      serverUrl: '/product/goods_speci/server'
    }
  },
  computed: {
    dv: {
      get () {
        return this.server
      },
      set (value) {}
    },
    serverData: {
      get () {
        return this.$store.getters.getSourceData({ uri: this.serverUrl })
      }
    }
  },
  created () {
    this.loadPlateData()
  },
  methods: {
    getV (e) {
      let v = this.serverData.content.filter(__ => {
        return __.name + '-' + __.speci + '-' + __.unit === e.value
      })[0]
      if (v) {
        v.target = e
      }
      return v
    },
    loadPlateData () {
      if ((typeof this.serverData === 'undefined' || JSON.stringify(this.serverData) === '{}')) {
        this.$store.dispatch('FETCH_SOURCE_DATA', {
          url: this.serverUrl,
          configs: {},
          target: this.serverUrl,
          local: true
        })
      }
    }
  }
}
</script>
