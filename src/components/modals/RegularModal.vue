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
            <div v-for="(value, key, index) in modal.forms" :is="formGroupType(value.form_type_v)" :configs="value" :forms="modal.forms" :key="index" :data-query="disposeQuery(value)" :force-readonly="readonly"></div>
            <div class="alert alert-danger fade" role="alert" :class="{show: alert}">{{ alertMessage }}</div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">关闭</button>
            <button type="submit" class="btn btn-primary" :disabled="disabled" v-if="!error">保存</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import FormGroupInput from '@/components/forms/FormGroupInput'
import FormGroupNumber from '@/components/forms/FormGroupNumber'
import FormGroupSelect from '@/components/forms/FormGroupSelect'
import FormGroupSelectRecommend from '@/components/forms/FormGroupSelectRecommend'
import FormGroupRadio from '@/components/forms/FormGroupRadio'
import FormGroupCheckbox from '@/components/forms/FormGroupCheckbox'
import FormGroupTextarea from '@/components/forms/FormGroupTextarea'
import FormGroupAutoComplete from '@/components/forms/FormGroupAutoComplete'
import FormGroupRemote from '@/components/forms/FormGroupRemote'
import FormGroupGoodsSpeci from '@/components/forms/FormGroupGoodsSpeci'
import InputDatalist from '@/components/forms/InputDatalist'
import InputHidden from '@/components/forms/InputHidden'
import { trimLeft } from 'voca'
import service from '@/axios'
import $ from 'jquery'
import Vue from 'vue'

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
      readonly: false, // Query值时强制数据只读
      error: false, // Modal 载入时错误
      errorMessage: '',
      tr: [],
      v: '',
      alertMessage: '', // 表单提交时错误
      alert: false,
      disabled: false
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
        return this.modal.modal_type_v ? this.modal.modal_type_v : 'ajax'
      }
    },
    trs: {
      get () {
        return this.modalType === 'filter' || (!parseInt(this.modal.multiple_v) && !parseInt(this.modal.single_v)) ? [] : this.$store.getters.currentPageActiveLines({ source: this.modal.source, all: true })
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
          if (parseInt(this.modal.multiple_v)) {
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
        case 'date':
          type = 'form-group-input'
          break
        case 'number':
          type = 'form-group-number'
          break
        case 'select':
          type = 'form-group-select'
          break
        case 'recommend':
          type = 'form-group-select-recommend'
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
        case 'datalist':
          type = 'input-datalist'
          break
        case 'auto-complete':
          type = 'form-group-auto-complete'
          break
        case 'remote':
          type = 'form-group-remote'
          break
        case 'goods-speci':
          type = 'form-group-goods-speci'
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
          if (this.disabled) { // 防止重复提交
            return false
          } else {
            this.disabled = true
            let postReturn = await service.post(this.modal.url, this.$store.getters.generatePostData({ forms: this.modal.forms }))
            this.disabled = false
            if (postReturn.code === 0) {
              this.$store.commit('SET_APP_RELOAD', { reload: true })
              $('#' + this.id).modal('hide')
            } else {
              this.alertMessage = postReturn.message
              this.alert = true
              e.target.addEventListener('click', this.errorClear)
            }
          }
        }
      }
    },
    errorClear (e) { // 清除错误提示
      this.alert = false
      e.currentTarget.removeEventListener(e.type, this.errorClear)
    },
    disposeQuery (Value) {
      if (Value.query) {
        let [ Query = null, Params = null, Related = null ] = Value.query.split('-')
        Params = Params ? Params.split(',') : null
        Related = Related ? Related.split(',') : null
        if (Query) {
          let QueryValue = this.$store.getters.currentPageQuery({source: this.modal.source, query: Query}) // Query返回执
          if (JSON.stringify(QueryValue) !== '{}') {
            Value.dv = QueryValue[Query]
            this.readonly = true
          } else if (this.$router.currentRoute.query[Query]) {
            Value.dv = this.$router.currentRoute.query[Query]
            this.readonly = true
          } else {
            this.readonly = false
          }
        }
        if (Params) {
          let ParamsValue = this.$store.getters.currentPageQuery({source: this.modal.source, query: Params}) // Query返回执
          if (JSON.stringify(ParamsValue) !== '{}') {
          } else {
            let Length = Params.length
            for (let I = 0; I < Length; I++) {
              if (this.$router.currentRoute.query[Params[I]]) {
                ParamsValue[Params[I]] = this.$router.currentRoute.query[Params[I]]
              }
            }
          }
          Vue.set(Value, 'params', ParamsValue)
        }
        if (Related) {
          let RelatedValue = {}
          let Length = Related.length
          for (let I = 0; I < Length; I++) {
            if (this.modal.forms[Related[I]]) {
              RelatedValue[Related[I]] = this.modal.forms[Related[I]].dv
            }
          }
          Vue.set(Value, 'related', RelatedValue)
        }
        return Query
      }
      return null
    }
  },
  components: {
    FormGroupInput,
    FormGroupNumber,
    FormGroupCheckbox,
    FormGroupSelect,
    FormGroupSelectRecommend,
    FormGroupRadio,
    FormGroupTextarea,
    FormGroupAutoComplete,
    FormGroupRemote,
    FormGroupGoodsSpeci,
    InputDatalist,
    InputHidden
  }
}
</script>
