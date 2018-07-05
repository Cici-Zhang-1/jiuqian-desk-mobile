<template>
  <div class="col-md-9 text-md-right d-print-none j-func" id="function">
    <div is="BtnGroup" v-for="(funcGroup, key, index) in funcGroups" :funcGroup="funcGroup" :target="key" :key="index" :index="index"></div>
    <button is="Btn" v-for="(btn, key, index) in btnGroups" :func="btn" :key="index"></button>
    <a is="ABtn" v-for="(a, key, index) in aGroups" :func="a" :key="index"></a>
    <div is="RegularModal" v-for="(value, key, index) in funcs" :modal="value" :key="index" v-if="hasModal(value.forms)"></div>
  </div>
</template>

<script>
import BtnGroup from '@/components/forms/BtnGroup'
import Btn from '@/components/forms/Btn'
import ABtn from '@/components/forms/ABtn'
import RegularModal from '@/components/modals/RegularModal'

export default {
  name: 'Func',
  props: {
    funcs: {
      type: [Array, Object],
      required: true
    }
  },
  data () {
    return {
      funcGroups: {},
      btnGroups: [],
      aGroups: []
    }
  },
  created () {
    this.category_func()
  },
  methods: {
    hasModal (forms) {
      if ((forms instanceof Array && forms.length === 0) || (forms instanceof Object && JSON.stringify(forms) === '{}')) {
        return false
      } else {
        return true
      }
    },
    category_func () {
      this.funcGroups = {}
      this.btnGroups = []
      this.aGroups = []
      for (let func of this.funcs) {
        if (func.group_no !== '') {
          if (this.funcGroups[func.group_no] === undefined) {
            this.funcGroups[func.group_no] = { funcs: [] }
          }
          this.funcGroups[func.group_no].funcs.push(func)
        } else {
          if (func.tag_name === 'a') {
            this.aGroups.push(func)
          } else {
            this.btnGroups.push(func)
          }
        }
      }
    }
  },
  watch: {
    'funcs': function (to, from) { // route变化时更新数据
      this.category_func()
    }
  },
  components: {
    BtnGroup,
    Btn,
    ABtn,
    RegularModal
  }
}
</script>
