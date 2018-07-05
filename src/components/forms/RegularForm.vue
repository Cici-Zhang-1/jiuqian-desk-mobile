<template>
  <div class="col-12">
    <form role="form" @submit.prevent="formSubmit" :id="id" :action="form.url">
      <div v-for="(value, key, index) in form.page_forms" :is="formGroupType(value.form_type_v)" :forms="form.page_forms" :data-query="disposeQuery(value)" :configs="value" :key="index"></div>
      <div class="alert alert-danger fade" role="alert" :class="{show: alert}">{{ alertMessage }}</div>
      <button type="submit" class="btn btn-primary"><i class="fa fa-save"></i>保存</button>
    </form>
  </div>
</template>

<script>
import FormGroupInput from '@/components/forms/FormGroupInput'
import FormGroupSelect from '@/components/forms/FormGroupSelect'
import FormGroupRadio from '@/components/forms/FormGroupRadio'
import FormGroupCheckbox from '@/components/forms/FormGroupCheckbox'
import FormGroupTextarea from '@/components/forms/FormGroupTextarea'
import InputHidden from '@/components/forms/InputHidden'
import service from '@/axios'
import { nameToId, uuid } from '@/assets/js/custom'

export default {
  name: 'RegularForm',
  props: {
    form: {
      type: [Array, Object],
      required: true
    }
  },
  data () {
    return {
      v: '',
      alertMessage: '', // 表单提交时错误
      alert: false
    }
  },
  computed: {
    id () {
      return nameToId(this.form.name) + uuid()
    }
  },
  created () {
    if (this.form.source_url) {
      this.fetchData()
    }
  },
  watch: {
    '$store.state.app.reload': {
      handler: function (to, from) {
      },
      deep: true
    }
  },
  methods: {
    formGroupType (value) {
      let type = ''
      switch (value) {
        case 'text':
        case 'password':
        case 'number':
        case 'date':
          type = 'form-group-input'
          break
        case 'select':
          type = 'form-group-select'
          break
        case 'checkbox':
          type = 'form-group-checkbox'
          break
        case 'radio':
          type = 'form-group-radio'
          break
        case 'textarea':
          type = 'form-group-textarea'
          break
        case 'hidden':
          type = 'input-hidden'
          break
        default:
          type = 'form-group-input'
      }
      return type
    },
    async formSubmit (e) { // Modal数据数据提交
      if (e.target.checkValidity() === false) {
        e.stopPropagation()
      } else {
        let postReturn = await service.post(this.form.url, this.$store.getters.generatePostData({ forms: this.form.page_forms }))
        if (!postReturn.code) {
          alert('保存成功!')
          this.$store.commit('SET_APP_RELOAD', { reload: true })
        } else {
          this.alertMessage = postReturn.message
          this.alert = true
          e.target.addEventListener('click', this.errorClear)
        }
      }
    },
    errorClear (e) { // 清除错误提示
      this.alert = false
      e.currentTarget.removeEventListener(e.type, this.errorClear)
    },
    fetchData () { // 获取数据
      this.$bar.start()
      this.$store.dispatch('FETCH_FORM_SOURCE_DATA', {
        url: this.form.source_url,
        target: this.form.page_forms
      }).then(() => {
        this.$bar.finish()
      })
    },
    disposeQuery (Value) {
      let Query = Value.query
      if (Query) {
        Value.dv = this.$router.currentRoute.query[Query] ? this.$router.currentRoute.query[Query] : null// URLQuery
      }
      return Query
    }
  },
  components: {
    FormGroupInput,
    FormGroupCheckbox,
    FormGroupSelect,
    FormGroupRadio,
    FormGroupTextarea,
    InputHidden
  }
}
</script>
