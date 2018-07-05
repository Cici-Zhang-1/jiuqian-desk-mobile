<template>
  <div>
    <div class="row d-print-none">
      <div class="offset-2 col-8" style="border: 3px solid red; border-radius: 10px;">
        <dl class="row">
          <dt class="col-3">订单编号:</dt>
          <dd class="col-9">{{ unqrcode.num }}</dd>
          <dt class="col-3">客户:</dt>
          <dd class="col-9">{{ unqrcode.dealer }}</dd>
          <dt class="col-3">业主:</dt>
          <dd class="col-9">{{ unqrcode.owner }}</dd>
          <dt class="col-3">货到地址:</dt>
          <dd class="col-9">{{ unqrcode.delivery_area}}{{ unqrcode.delivery_address }}</dd>
          <dt class="col-3">联系人:</dt>
          <dd class="col-9">{{ unqrcode.delivery_linker }}</dd>
          <dt class="col-3">联系方式:</dt>
          <dd class="col-9">{{ unqrcode.delivery_phone }}</dd>
          <dt class="col-3">打包件数:</dt>
          <dd class="col-9">{{ unqrcode.pack }}</dd>
        </dl>
      </div>
      <div class="col-md-2"></div>
      <div class="col-md-offset-4 col-md-8">
        <button class="btn btn-primary btn-lg" value="打印" type="button" @click="print()">打印</button>&nbsp;&nbsp;&nbsp;
        <button class="btn btn-default btn-lg" value="预览" type="button" @click="preview()">预览</button>&nbsp;&nbsp;&nbsp;
      </div>
    </div>
    <div class="print-area d-none d-print-block">
      <div is="regular-label" v-for="n in pack" :unqrcode="unqrcode" :key="n" :index="n"></div>
    </div>
  </div>
</template>

<script>
import RegularLabel from './RegularLabel'
import $ from 'jquery'
import service from '@/axios'
Date.prototype.Format = function (fmt) {
  var o = {
    'M+': this.getMonth() + 1,
    'd+': this.getDate(),
    'H+': this.getHours(),
    'm+': this.getMinutes(),
    's+': this.getSeconds(),
    'S+': this.getMilliseconds()
  }

  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  for (var k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(String(o[k]).length)))
    }
  }
  return fmt
}
export default {
  name: 'UnqrcodeLabel',
  data () {
    return {
      unqrcode: {},
      pack: 0
    }
  },
  created () {
    this.fetchData()
  },
  methods: {
    fetchData () {
      this.$bar.start()
      let self = this
      service.get('warehouse/unqrcode_label/read', { params: { ...this.$router.currentRoute.query } }).then(function (data) {
        if (data.code > 0) {
          alert(data.message)
        } else {
          self.unqrcode = data.contents
          self.pack = parseInt(data.contents.pack) || 0
        }
        self.$bar.finish()
      })
    },
    preview () {
      $('.print-area').removeClass('d-none')
    },
    print () {
      window.print()
    }
  },
  components: {
    RegularLabel
  }
}
</script>

<style scoped>
.print-area {
  width: 10cm;
}
</style>
