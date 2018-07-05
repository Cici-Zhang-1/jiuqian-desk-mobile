<template>
  <div class="row">
    <form v-if="addAction || editAction" @submit.prevent="addEditSubmit" class="needs-validation col-12" novalidate>
      <div class="form-group">
        <label>库位名称:</label>
        <input v-model="sn" class="form-control" name="sn" type="text" placeholder="请填写库位名称" required />
        <div class="invalid-feedback">必须填写库位名称</div>
      </div>
      <div class="form-group">
        <label>库位状态:</label>
        <select v-model="status" class="form-control" name='status'>
          <option value="0">空</option>
          <option value="1">未装满</option>
          <option value="2">满</option>
        </select>
      </div>
      <div :class="{show: alert}" class="alert alert-danger fade" role="alert">{{ message }}</div>
      <button class="btn btn-primary w-100" type="submit">保存</button>
    </form>
    <form v-if="inAction || outAction" @submit.prevent="inOutSubmit" onkeydown="if(event.keyCode==13) return false;" class="needs-validation col-12" novalidate>
      <div class="form-group">
        <label>库位名称:</label>
        <input v-model="sn" class="form-control" name="sn" type="text" placeholder="请填写库位名称" readonly required />
      </div>
      <div v-if="outAction" class="form-group">
        <label>库位状态:</label>
        <select v-model="status" class="form-control" name='status'>
          <option value="0">空</option>
          <option value="1">未装满</option>
          <option value="2">满</option>
        </select>
      </div>
      <label v-if="inAction" for="searchOrder">搜索订单</label>
      <div v-if="inAction" class="input-group">
        <input @keydown.enter="search($event.currentTarget)" v-model="searchOrder" id="searchOrder" name="search_order" class="form-control" type="search" placeholder="请输入要入库的订单" />
        <div class="input-group-append">
          <button @click="search($event.currentTarget.parentNode.parentNode.firstChild)" class="btn btn-outline-secondary" type="button"><i class="fa fa-search"></i></button>
        </div>
      </div>
      <div class="form-group">
        <label>请选择订单:</label>
        <select v-model="order" id="locationOrder" name="order" class="form-control" multiple required></select>
        <div class="invalid-feedback">请先选择订单再保存</div>
      </div>
      <div :class="{show: alert}" class="alert alert-danger fade" role="alert">{{ message }}</div>
      <button class="btn btn-primary w-100" type="submit">保存</button>
    </form>
  </div>
</template>

<script type="module">
import { mapState, mapMutations } from 'vuex'
import service from '@/axios'
// import { getData, postData } from '@/service/service'

export default {
  name: 'FuncLocation',
  props: {
    action: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      id: 0,
      sn: '',
      status: 0,
      message: '',
      order: [],
      inOrder: [],
      searchOrder: '',
      alert: false
    }
  },
  computed: {
    ...mapState([
      'activeLine'
    ]),
    orderPrefix () {
      let d = new Date()
      let y = d.getFullYear()
      let m = d.getMonth().toString()
      return 'X' + y + m.padStart(2, '0')
    },
    uri () {
      return '/location/' + this.action
    },
    addAction () {
      return this.action === 'add'
    },
    editAction () {
      return this.action === 'edit'
    },
    removeAction () {
      return this.action === 'remove'
    },
    inAction () { // 是否为入库
      return this.action === 'in'
    },
    outAction () { // 是否为出库
      return this.action === 'out'
    }
  },
  async created () {
    if (this.editAction) { // 当是编辑库位时需要从服务器获取相应数据
      this.createEdit()
    } else if (this.removeAction) { // 当需要删除库位时运行
      this.createRemove()
    } else if (this.inAction) { // 当需要入库时运行
      this.searchOrder = this.orderPrefix
      this.createIn()
    } else if (this.outAction) {
      this.createOut()
    }
  },
  methods: {
    ...mapMutations({
      set_reload: 'SET_RELOAD'
    }),
    resolveData (keys) {
      if (this.activeLine) {
        let child = this.activeLine.firstChild
        while (child) {
          if (keys.includes(child.getAttribute('name'))) {
            this[child.getAttribute('name')] = child.textContent
          }
          child = child.nextSibling
        }
      }
    },
    async addEditSubmit (e) { // 编辑库位或增加库位数据提交
      if (e.target.checkValidity() === false) {
        e.stopPropagation()
        e.target.classList.add('was-validated')
      } else {
        let postReturn = await service.post(this.uri, { sn: this.sn, status: this.status })
        if (!postReturn.code) {
          this.set_reload({reload: true})
          this.$router.go(-1)
        } else {
          this.message = postReturn.message
          this.alert = true
          e.target.addEventListener('click', this.errorClear)
        }
      }
    },
    async inOutSubmit (e) {
      if (e.target.checkValidity() === false) {
        e.stopPropagation()
        e.target.classList.add('was-validated')
      } else {
        let postReturn = await service.post(this.uri, { id: this.id, sn: this.sn, order: this.order })
        if (postReturn.code > 0) {
          this.message = postReturn.message
          this.alert = true
          e.target.addEventListener('click', this.errorClear)
        } else {
          this.set_reload({reload: true})
          this.$router.go(-1)
        }
      }
    },
    errorClear (e) { // 清除错误提示
      this.alert = false
      e.currentTarget.removeEventListener(e.type, this.errorClear)
    },
    async createEdit () { // Init Edit
      this.resolveData(['id'])
      if (!this.id) {
        alert('请选择需要修改的库位')
        this.$router.go(-1)
      } else {
        let getReturn = await service.get(this.uri, { params: { id: this.id } })
        if (!getReturn.code) {
          this.sn = getReturn.contents.sn
          this.status = getReturn.contents.status
        } else {
          alert(getReturn.message)
          this.$router.go(-1)
        }
      }
    },
    async createRemove () { // Init Remove
      this.resolveData(['id'])
      if (!this.id) {
        alert('请选择需要删除的库位')
        this.$router.go(-1)
      } else {
        if (window.confirm('您确定要删除库位?')) {
          let postReturn = await service.post(this.uri, { id: this.id })
          if (!postReturn.code) {
            window.alert('库位删除成功!')
            this.$router.go(-1)
          } else {
            window.alert(postReturn.message)
            this.$router.go(-1)
          }
        } else {
          this.$router.go(-1)
        }
      }
    },
    async createIn () { // Init In Action
      this.resolveData(['id', 'sn'])
      if (!this.id) {
        alert('请选择需要入库的库位')
        this.$router.go(-1)
      }
    },
    search (ele) { // 搜索订单
      if (this.searchOrder === '') {
        this.message = '请输入要搜索的订单'
        this.alert = true
        ele.addEventListener('focus', this.errorClear)
      } else {
        let This = this
        service.get('/order/search', { params: { num: this.searchOrder } }).then(function (getReturn) {
          if (getReturn.code > 0) { // 出现错误
            This.message = getReturn.message
            This.alert = true
            ele.addEventListener('focus', This.errorClear)
          } else {
            if (!This.order.includes(getReturn.contents.id)) {
              let a = document.createElement('option')
              a.value = getReturn.contents.id
              a.textContent = getReturn.contents.num
              // a.selected = true

              ele.parentNode.parentNode.getElementsByTagName('select')[0].add(a)

              This.order.push(getReturn.contents.id)
            }
            /* if (!This.inOrder.includes(getReturn.contents.num)) {
              This.inOrder.push(getReturn.contents.id) // 将选择的订单推入
              let id = 'inOrder' + (This.inOrder.length + 1) // 设置in订单Id

              let a = document.createElement('div') // div
              let b = document.createElement('input') // input
              let c = document.createElement('label') // label

              a.classList.add('form-check')

              b.classList.add('form-check-input')
              b.setAttribute('id', id)
              b.setAttribute('name', 'in_order')
              b.setAttribute('type', 'checkbox')
              b.setAttribute('checked', 'checked')
              b.value = getReturn.contents.id
              b.addEventListener('change', This.changeInOrder)

              c.classList.add('form-check-label')
              c.setAttribute('for', id)
              c.textContent = getReturn.contents.num

              a.appendChild(b)
              a.appendChild(c)

              ele.parentNode.parentNode.insertBefore(a, ele.parentNode.nextSibling)
            } */
          }
        })
      }
      this.searchOrder = this.orderPrefix
      ele.blur()
    },

    createOut () {
      this.resolveData(['id', 'sn', 'status'])
      if (!this.id) {
        alert('请选择需要出库的库位')
        this.$router.go(-1)
      } else {
        let This = this
        service.get('/location/search', { params: { id: this.id } }).then(function (getReturn) {
          if (getReturn.code > 0) { // 出现错误
            alert(getReturn.message)
            This.$router.go(-1)
          } else {
            let d = document.createElement('div')
            for (let i in getReturn.contents) {
              let a = document.createElement('option')
              a.value = getReturn.contents[i].id
              a.textContent = getReturn.contents[i].num
              d.appendChild(a)
            }
            document.getElementById('locationOrder').innerHTML = d.innerHTML
          }
        })
      }
    }
    /* ,
    changeInOrder (e) {
      if (e.currentTarget.checked) {
        this.inOrder.push(e.currentTarget.value)
      } else {
        this.inOrder.splice(this.inOrder.indexOf(e.currentTarget.value))
      }
    } */
  }
}
</script>
