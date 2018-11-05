<template>
    <div class="row mt-5 j-page" id="signIn">
        <div class="col-sm-12 offset-md-3 col-md-6">
            <div class="card">
                <div class="card-header">
                    九千系统-登录
                </div>
                <div class="card-body">
                    <form @submit.prevent="sign_in">
                        <div class="form-group">
                            <label for="name">用户名</label>
                            <input type="text" class="form-control" name="name" id="name" placeholder="请输入登录用户名" maxlength="64" required>
                        </div>
                        <div class="form-group">
                            <label for="password">密码</label>
                            <input type="password" class="form-control" name="password" id="password" placeholder="请输入密码" maxlength="16" minlength="6" required>
                        </div>
                        <div :class="{show: alert}" class="alert alert-danger fade" role="alert">{{ message }}</div>
                        <button type="submit" class="btn btn-primary">登录</button>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import service from '@/axios'
import VueCookies from 'vue-cookies'

export default {
  name: 'SignIn',
  data () {
    return {
      message: '',
      uri: '/sign/in',
      alert: false
    }
  },
  created () {
    VueCookies.isKey('uid') && VueCookies.remove('uid')
    VueCookies.isKey('truename') && VueCookies.remove('truename')
    this.$store.commit('SET_SIGNIN', { signin: true })
  },
  methods: {
    async sign_in (event) { // Modal数据数据提交
      let postReturn = await service.post(this.uri, { name: document.getElementById('name').value, password: document.getElementById('password').value })
      if (postReturn.code > 0) {
        this.message = postReturn.message
        this.alert = true
        event.target.addEventListener('click', this.errorClear)
      } else {
        this.$store.commit('SET_USER', { contents: { truename: VueCookies.get('truename') } })
        this.$store.commit('SET_SIGNIN', { signin: false })
        this.$store.dispatch('FETCH_APPS', {
          label: false,
          path: ''
        })
        this.$router.push('/')
      }
    },
    errorClear (event) { // 清除错误提示
      this.alert = false
      event.target.removeEventListener(event.type, this.errorClear)
    }
  }
}
</script>
