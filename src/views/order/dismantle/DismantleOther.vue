<template>
  <td>
    <input class="form-control input-sm" name="other" list="yPlate" type="text" v-model="dv" v-on:input="$emit('input', $event.target.value)" @focusout="$emit('focusout-other', getV($event.target))"/>
    <datalist id="yPlate" v-if="otherData && otherData.num">
      <option v-for="(value, key, index) in otherData.content" :value="value.name + '-' + value.speci + '-' + value.unit" :key="index" ></option>
    </datalist>
  </td>
</template>

<script>
export default {
  name: 'DismantleOther',
  props: {
    other: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      otherUrl: '/product/goods_speci/other'
    }
  },
  computed: {
    dv: {
      get () {
        return this.other
      },
      set (value) {}
    },
    otherData: {
      get () {
        return this.$store.getters.getSourceData({ uri: this.otherUrl })
      }
    }
  },
  created () {
    this.loadPlateData()
  },
  methods: {
    getV (e) {
      let v = this.otherData.content.filter(__ => {
        return __.name + '-' + __.speci + '-' + __.unit === e.value
      })[0]
      if (v) {
        v.target = e
      }
      return v
    },
    loadPlateData () {
      if ((typeof this.otherData === 'undefined' || JSON.stringify(this.otherData) === '{}')) {
        this.$store.dispatch('FETCH_SOURCE_DATA', {
          url: this.otherUrl,
          configs: {},
          target: this.otherUrl,
          local: true
        })
      }
    }
  }
}
</script>
