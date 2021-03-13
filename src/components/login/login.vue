<template>
  <div class="login-wrap">
    <el-form label-position="top" label-width="80px" :model="user" class="login-form">
      <h1>用户登录</h1>
      <el-form-item label="用户名">
        <el-input v-model="user.name"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="user.password" show-password></el-input>
      </el-form-item>
      <el-button type="primary" @click="login" class="login-button">登录</el-button>
       <el-link class="register_link" @click="register" target="_blank">注册</el-link>
    </el-form>
  </div>
</template>

<script>
export default {
  data () {
    return {
      user: {
        name: '',
        password: ''
      }
    }
  },
  methods: {
    async login () {
      const res = await this.$http.post('login/', this.user)
      const data = res.data
      const { meta: { status, msg } } = data
      if (status === 200) {
        const token = data.data.token
        sessionStorage.setItem('token', token)
        this.$message.success(msg)
        this.$router.push({'name': 'home'})
      } else {
        this.$message.error(msg)
      }
    },
    async register () {
      this.$router.push({'name': 'register'})
    }
  }
}
</script>

<style>
.login-wrap {
    background-color: #324152;
    height: 100%;
    width: 100%;
    display: flex;
    /* 水平居中 */
    justify-content: center;
    align-items: center;
}
.login-form{
     width: 400px;
    background-color:#fff;
    padding: 30px;
    border-radius: 5px;
}
.login-button {
  width: 100%;
}
.register_link {
  float: right;
  margin-top: 20px;
}
</style>
