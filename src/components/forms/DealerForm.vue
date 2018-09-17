<template>
  <div>
    <div class="form-group row">
      <label for="orderAddDealer" class="col-md-2 col-form-label">客户<small class="j-pc-none text-danger">*</small></label>
      <div class="col-md-9">
        <input type="hidden" name="dealer_id" v-model="dealerId" required />
        <input class="non-dv" type="hidden" name="shop_id" required v-model="shopId"/>
        <input class="form-control non-dv" name="dealer" id="orderAddDealer" v-model="dealer" type="text" required maxlength="512" placeholder="请选择客户"/>
      </div>
      <div class="j-phone-none col-1">
        <small class="text-danger">*</small>
      </div>
    </div>
    <div class="form-group row">
      <label class="col-md-2 col-form-label"></label>
      <div class="col-md-9">
        <button class="btn btn-light" id="orderAddEditDealer" type="button" @click="toggleDealerInfo">编辑客户信息</button>
      </div>
    </div>
    <fieldset class="d-none" id="orderAddDealerInfo">
      <div class="form-group row">
        <label class="col-md-2 col-form-label">对单:</label>
        <div class="col-md-9">
          <input class="form-control non-dv" name="checker" type="text" v-model="checker" maxlength="64" placeholder="对单联系人" />
        </div>
      </div>
      <div class="form-group row">
        <label class="col-md-2 col-form-label"></label>
        <div class="col-md-9">
          <input class="form-control non-dv" name="checker_phone" type="tel" v-model="checkerPhone" maxlength="16" placeholder="对单联系电话" />
        </div>
      </div>
      <div class="form-group row" v-if="logisticsData && (logisticsData.length || logisticsData.num)">
        <label class="col-md-2 col-form-label">要求物流:</label>
        <div class="col-md-9">
          <select class="form-control non-dv" name='logistics' v-model="logistics">
            <option value="">--选择物流--</option>
            <option v-for="(value, key, index) in logisticsData.content" :value="value.v" :key="index">{{ value.label || value.name }}</option>
          </select>
        </div>
      </div>
      <div class="form-group row" v-if="outMethodData && (outMethodData.length || outMethodData.num)">
        <label class="col-md-2 col-form-label">出厂方式:</label>
        <div class="col-md-9">
          <select class="form-control non-dv" name='out_method' v-model="outMethod">
            <option v-for="(value, key, index) in outMethodData.content" :value="value.v" :key="index">{{ value.label || value.name }}</option>
          </select>
        </div>
      </div>
      <div class="form-group row" v-if="areaData && (areaData.length || areaData.num)">
        <label class="col-md-2 col-form-label">收货:</label>
        <div class="col-md-9">
          <select class="form-control non-dv" name="delivery_area" v-model="deliveryArea">
            <option v-for="(value, key, index) in areaData.content" :value="value.name" :key="index">{{ value.label || value.name }}</option>
          </select>
        </div>
      </div>
      <div class="form-group row">
        <label class="col-md-2 col-form-label"></label>
        <div class="col-md-9">
          <input class="form-control non-dv" name="delivery_address" v-model="deliveryAddress" type="text" placeholder="收货详细地址" />
        </div>
      </div>
      <div class="form-group row">
        <label class="col-md-2 col-form-label"></label>
        <div class="col-md-9">
          <input class="form-control non-dv" name="delivery_linker" v-model="deliveryLinker" type="text" maxlength="32" placeholder="收货人姓名" />
        </div>
      </div>
      <div class="form-group row">
        <label class="col-md-2 col-form-label"></label>
        <div class="col-md-9">
          <input class="form-control non-dv" name="delivery_phone" v-model="deliveryPhone" type="text" maxlength="64" placeholder="收货人联系方式" />
        </div>
      </div>
      <div class="form-group row">
        <label class="col-md-2 col-form-label"></label>
        <div class="col-md-9">
          <input class="form-control non-dv" name="payer" type="text" v-model="payer" maxlength="64" placeholder="支付人姓名" />
        </div>
      </div>
      <div class="form-group row">
        <label class="col-md-2 col-form-label">付款:</label>
        <div class="col-md-9">
          <input class="form-control non-dv" name="payer_phone" type="tel" v-model="payerPhone" maxlength="16" placeholder="支付人系方式" />
        </div>
      </div>
    </fieldset>
  </div>
</template>

<script>
import $ from 'jquery'
import '@/assets/js/autocomplete'
let formatItem = function (row) {
  return row.name
}
let self
export default {
  name: 'DealerForm',
  props: {
    configs: {
      type: [Array, Object],
      required: true
    },
    forms: {
      type: [Array, Object],
      required: true
    },
    query: {
      type: [Array, Object]
    }
  },
  data () {
    return {
      shopId: '',
      dealer: '',
      checker: '',
      checkerPhone: '',
      logistics: '',
      outMethod: '',
      deliveryArea: '',
      deliveryAddress: '',
      deliveryLinker: '',
      deliveryPhone: '',
      payer: '',
      payerPhone: '',
      logisticsUri: '/data/logistics/read',
      outMethodUri: '/data/out_method/read',
      areaUri: '/data/area/read',
      queryStr: '',
      params: [],
      paramsValue: {},
      related: [],
      relatedValue: {}
    }
  },
  computed: {
    dealerData: {
      get () {
        return this.$store.getters.getSourceData({ uri: this.configs.url })
      }
    },
    dealerId: {
      get () {
        return this.configs.dv
      },
      set (Value) {
        this.configs.dv = Value
      }
    },
    logisticsData: {
      get () {
        return this.$store.getters.getSourceData({ uri: this.logisticsUri })
      }
    },
    outMethodData: {
      get () {
        return this.$store.getters.getSourceData({ uri: this.outMethodUri })
      }
    },
    areaData: {
      get () {
        return this.$store.getters.getSourceData({ uri: this.areaUri })
      }
    }
  },
  created () {
    self = this
    this.parseQuery()
    this.loadSourceData(true)
    this.loadLogisticsData()
    this.loadOutMethodData()
    this.loadAreaData()
  },
  watch: {
    query: {
      handler: function (to, from) {
        if (this.queryStr && this.query[this.queryStr] !== undefined) {
          this.dealerId = this.query[this.queryStr]
        }
        if (this.params.length > 0) {
          this.params.map(__ => {
            if (this.query[__] !== undefined) {
              this.paramsValue[__] = this.query[__]
            }
            return __
          })
        }
      },
      deep: true
    },
    /* 'configs.dv': {
      handler: function (to, from) {
        this.dealerId = to
      },
      deep: true
    }, */
    'configs.url': {
      handler: function (to, from) {
        this.loadSourceData(true)
      },
      deep: true
    },
    'paramsValue': {
      handler: function (to, from) {
        this.loadSourceData(true)
      },
      deep: true
    },
    dealerData: {
      handler: function (to, from) {
        this.autoComplete()
      },
      deep: true
    }
  },
  methods: {
    parseQuery () {
      if (this.configs.query) {
        [ this.queryStr = '', this.params = '', this.related = '' ] = this.configs.query.split('-')
        this.params = this.params.split(',')
        this.related = this.related.split(',')
        this.initQuery()
      }
    },
    initQuery () {
      if (this.queryStr) {
        if (this.$router.currentRoute.query[this.queryStr] !== undefined) {
          this.dealerId = this.query[this.queryStr]
        }
      }
      if (this.params.length > 0) {
        this.params.map(__ => {
          if (this.$router.currentRoute.query[__] !== undefined) {
            this.paramsValue[__] = this.query[__]
          }
          return __
        })
      }
    },
    toggleDealerInfo () {
      $('#orderAddDealerInfo').toggleClass('d-none')
    },
    autoComplete () {
      if (JSON.stringify(this.dealerData) !== '{}') {
        $('#orderAddDealer').autocomplete({
          minLength: 0,
          autoselect: true,
          showHint: false,
          source: [this.dealerData.content],
          valueKey: 'name',
          getValue: formatItem,
          getTitle: formatItem
        }).on('selected.xdsoft', function (e, row) {
          self.dealer = row.name
          self.shopId = row.shop_id
          self.dealerId = row.dealer_id
        })
      }
    },
    loadSourceData (Reload = false) {
      if ((Reload || typeof this.dealerData === 'undefined' || JSON.stringify(this.dealerData) === '{}') && this.configs.url !== '') {
        this.$store.dispatch('FETCH_SOURCE_DATA', {
          url: this.configs.url,
          configs: {
            params: this.paramsValue || {}
          },
          target: this.configs.url
        })
      }
    },
    loadLogisticsData (Reload = false) {
      if ((Reload || typeof this.logisticsData === 'undefined' || JSON.stringify(this.logisticsData) === '{}')) {
        this.$store.dispatch('FETCH_SOURCE_DATA', {
          url: this.logisticsUri,
          target: this.logisticsUri
        })
      }
    },
    loadOutMethodData (Reload = false) {
      if ((Reload || typeof this.outMethodData === 'undefined' || JSON.stringify(this.outMethodData) === '{}')) {
        this.$store.dispatch('FETCH_SOURCE_DATA', {
          url: this.outMethodUri,
          target: this.outMethodUri
        })
      }
    },
    loadAreaData (Reload = false) {
      if ((Reload || typeof this.areaData === 'undefined' || JSON.stringify(this.areaData) === '{}')) {
        this.$store.dispatch('FETCH_SOURCE_DATA', {
          url: this.areaUri,
          target: this.areaUri
        })
      }
    }
  }
}
</script>
