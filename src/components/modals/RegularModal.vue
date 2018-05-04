<template>
  <div class="modal fade text-md-left" :id="id" tabindex="-1" role="dialog" :aria-labelledby="id + 'Title'" aria-hidden="true">
    <div class="modal-dialog modal-lg" role="document">
      <div class="modal-content">
        <form role="form" @submit.prevent="modalSubmit">
          <div class="modal-header">
            <h5 class="modal-title" :id="id + 'Title'">{{ modal.label }}</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body" v-if="error">
            <div class="alert alert-danger" role="alert">{{ errorMessage }}</div>
          </div>
          <div class="modal-body" v-else>
            <div v-for="(value, key, index) in modal.forms" :is="formGroupType(value.form_type_name)" :configs="value" :key="index"></div>
            <div class="alert alert-danger fade" role="alert" :class="{show: alert}">{{ alertMessage }}</div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">关闭</button>
            <button type="submit" class="btn btn-primary" v-if="!error">保存</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import FormGroupInput from '@/components/forms/FormGroupInput'
import FormGroupSelect from '@/components/forms/FormGroupSelect'
import FormGroupRadio from '@/components/forms/FormGroupRadio'
import FormGroupCheckbox from '@/components/forms/FormGroupCheckbox'
import FormGroupTextarea from '@/components/forms/FormGroupTextarea'
import InputHidden from '@/components/forms/InputHidden'
import { trimLeft } from 'voca'
import { postData } from '@/service/service'
import $ from 'jquery'
export default {
  name: 'regular-modal',
  props: {
    modal: {
      type: [Array, Object],
      required: false
    }
  },
  data () {
    return {
      error: false, // Modal 载入时错误
      errorMessage: '',
      tr: [],
      v: '',
      alertMessage: '', // 表单提交时错误
      alert: false
    }
  },
  computed: {
    id: {
      get () {
        return trimLeft(this.modal.target, '#')
      }
    },
    modalType: {
      get () {
        return this.modal.modal_type_name ? this.modal.modal_type_name : 'ajax'
      }
    },
    trs: {
      get () {
        return this.modalType === 'filter' ? [] : this.$store.getters.currentPageActiveLines({ source: this.modal.source, all: true })
      },
      set (Value) {}
    }
  },
  watch: {
    'trs': function (to, from) { // 监听数据对象
      if (this.modalType === 'ajax') {
        if (this.trs === false || this.trs.length === 0) {
          this.error = true
          this.errorMessage = '请先选择!'
          this.tr = []
          this.v = ''
        } else {
          this.error = false
          this.errorMessage = ''
          this.tr = this.trs.slice(0, 1)[0]
          if (this.modal.multiple) {
            this.v = this.trs.map(__ => {
              return __.v
            }).join(',')
          } else {
            this.v = this.tr.v
          }
          this.resolveData()
        }
      }
    },
    modal: {
      handler: function (to, from) {
        this.error = false
        this.errorMessage = ''
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
    resolveData () { // 分解数据赋值
      for (let i in this.modal.forms) {
        if (this.tr[i] !== undefined) {
          this.modal.forms[i].dv = this.tr[i]
        }
      }
      if (this.modal.forms.v !== undefined) {
        this.modal.forms.v.dv = this.v
      }
    },
    async modalSubmit (e) { // Modal数据数据提交
      if (e.target.checkValidity() === false) {
        e.stopPropagation()
      } else {
        if (this.modalType === 'search' || this.modalType === 'filter') {
          this.$store.commit('SET_APP_RELOAD', { reload: true })
          $('#' + this.id).modal('hide')
        } else {
          let postReturn = await postData(this.modal.url, this.$store.getters.generatePostData({ forms: this.modal.forms }))
          if (!postReturn.code) {
            this.$store.commit('SET_APP_RELOAD', { reload: true })
            $('#' + this.id).modal('hide')
          } else {
            this.alertMessage = postReturn.message
            this.alert = true
            e.target.addEventListener('click', this.errorClear)
          }
        }
      }
    },
    errorClear (e) { // 清除错误提示
      this.alert = false
      e.currentTarget.removeEventListener(e.type, this.errorClear)
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
