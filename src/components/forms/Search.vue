<template>
  <div class="input-group">
    <div class="input-group-prepend" v-if="prepend">
      <button class="btn btn-outline-secondary" type="button"><i class="fa fa-search"></i></button>
    </div>
    <input type="search" class="form-control" :value="defaultValue" @change="valueChange($event.target.value)" aria-label="search" aria-describedby="basic-addon1" />
    <div class="input-group-append" v-if="append">
      <button @click="search" class="btn btn-outline-secondary" type="button"><i class="fa fa-search"></i></button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'search',
  props: {
    defaultValue: {
      type: String,
      required: true
    },
    prepend: {
      type: Boolean,
      required: false,
      default: true
    },
    append: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data () {
    return {}
  },
  computed: {},
  methods: {
    valueChange: function (value) { // Value Change Emit To Parents
      this.$emit('input', value)
    },
    search (e) {
      this.$emit('search')
    }
  }
}
</script>
