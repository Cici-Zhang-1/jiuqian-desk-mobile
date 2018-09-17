<template>
  <div class="col-12">
    <form role="form" @submit.prevent="formSubmit" :id="id" :action="form.url">
      <div v-for="(value, key, index) in form.page_forms" :is="formGroupType(value.form_type_v)" :forms="form.page_forms" :data-query="disposeQuery(value)" :configs="value" :key="index"></div>
      <div class="alert alert-danger fade" role="alert"></div>
      <button type="submit" class="btn btn-primary"><i class="fa fa-save"></i>保存</button>
    </form>
  </div>
</template>

<script>
import RegularInput from '@/components/forms/RegularInput'
import RegularSelect from '@/components/forms/RegularSelect'
import RegularRadio from '@/components/forms/RegularRadio'
import RegularCheckbox from '@/components/forms/RegularCheckbox'
import RegularTextarea from '@/components/forms/RegularTextarea'
import RegularButton from '@/components/forms/RegularButton'
import InputHidden from '@/components/forms/InputHidden'
import DealerForm from '@/components/forms/DealerForm'
import service from '@/axios'
import { nameToId, uuid } from '@/assets/js/custom'
import $ from 'jquery'

export default {
  name: 'RegularForm',
  props: {
    form: {
      type: [Array, Object],
      required: true
    }
  },
  inject: ['reload'],
  data () {
    return {
      v: '',
      alertMessage: '' // 表单提交时错误
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
        if (to) {
          this.form.source_url && this.fetchData()
          this.$store.commit('SET_APP_RELOAD', { reload: false })
        }
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
          type = 'regular-input'
          break
        case 'select':
          type = 'regular-select'
          break
        case 'checkbox':

          type = 'regular-checkbox'
          break
        case 'radio':
          type = 'regular-radio'
          break
        case 'textarea':
          type = 'regular-textarea'
          break
        case 'button':
        case 'submit':
          type = 'regular-button'
          break
        case 'hidden':
          type = 'input-hidden'
          break
        case 'dealer':
          type = 'dealer-form'
          break
        default:
          type = 'regular-input'
      }
      return type
    },
    getNonDv () {
      let data = {}
      $('.non-dv').each(function (i, v) {
        data[v.name] = v.value
      })
      return data
    },
    async formSubmit (e) { // Modal数据数据提交
      if (e.target.checkValidity() === false) {
        e.stopPropagation()
      } else {
        let nonDvData = this.getNonDv()
        let dvData = this.$store.getters.generatePostData({ forms: this.form.page_forms })
        let postReturn = await service.post(this.form.url, { ...nonDvData, ...dvData })
        if (!postReturn.code) {
          if (postReturn.location !== '') {
            if (postReturn.confirm !== '') {
              if (window.confirm(postReturn.confirm)) {
                this.$router.push(postReturn.location)
              } else {
                // this.$store.commit('SET_APP_RELOAD', { reload: true })
                this.reload()
              }
            } else {
              this.$router.push(postReturn.location)
            }
          } else {
            alert('保存成功!')
            this.$store.commit('SET_APP_RELOAD', { reload: true })
          }
        } else {
          $('.alert').addClass('show').text(postReturn.message)
          e.target.addEventListener('click', this.errorClear)
        }
      }
    },
    errorClear (e) { // 清除错误提示
      $('.alert').removeClass('show').text('')
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
    RegularInput,
    RegularCheckbox,
    RegularSelect,
    RegularRadio,
    RegularTextarea,
    DealerForm,
    RegularButton,
    InputHidden
  }
}
</script>
