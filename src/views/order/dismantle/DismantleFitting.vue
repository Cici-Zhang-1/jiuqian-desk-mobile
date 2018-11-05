<template>
  <td>
    <input class="form-control input-sm" name="fitting" list="yPlate" type="text" v-model="dv" v-on:input="$emit('input', $event.target.value)" @focusout="$emit('focusout-fitting', getV($event.target))"/>
    <datalist id="yPlate" v-if="fittingData && fittingData.num">
      <option v-for="(value, key, index) in fittingData.content" :value="value.name + '-' + value.speci + '-' + value.unit" :key="index" ></option>
    </datalist>
  </td>
</template>

<script>
export default {
  name: 'DismantlePlate',
  props: {
    fitting: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      fittingUrl: '/product/goods_speci/fitting'
    }
  },
  computed: {
    dv: {
      get () {
        return this.fitting
      },
      set (value) {}
    },
    fittingData: {
      get () {
        return this.$store.getters.getSourceData({ uri: this.fittingUrl })
      }
    }
  },
  created () {
    this.loadPlateData()
  },
  methods: {
    getV (e) {
      let v = this.fittingData.content.filter(__ => {
        return __.name + '-' + __.speci + '-' + __.unit === e.value
      })[0]
      if (v) {
        v.target = v && e
      }
      return v
    },
    loadPlateData () {
      if ((typeof this.fittingData === 'undefined' || JSON.stringify(this.fittingData) === '{}')) {
        this.$store.dispatch('FETCH_SOURCE_DATA', {
          url: this.fittingUrl,
          configs: {},
          target: this.fittingUrl,
          local: true
        })
      }
    }
  }
}
</script>
