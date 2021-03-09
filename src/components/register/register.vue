<template>
  <div class="register-wrap">
    <el-form label-position="top" label-width="80px" :model="user" class="login-form">
      <h1>用户注册</h1>
      <el-form-item label="用户名">
        <el-input v-model="user.username"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="user.password"></el-input>
      </el-form-item>
       <el-form-item label="再次输入密码">
        <el-input v-model="user.password2"></el-input>
      </el-form-item>
      <el-button type="primary" @click="register" class="register-button">注册</el-button>
    </el-form>
  </div>
</template>

<script>
export default {
  data () {
    return {
      user: {
        username: '',
        password: '',
        password2: '',
      }
    }
  },
  methods: {
    async register () {
      const res = await this.$http.post('login', this.user)
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
    }



  }
}
</script>

<style>
.register-wrap {
    background-color: #324152;
    height: 100%;
    width: 100%;
    display: flex;
    /* 水平居中 */
    justify-content: center;
    align-items: center;
}
.register-form{
     width: 400px;
    background-color:#fff;
    padding: 30px;
    border-radius: 5px;
}
.register-button {
  width: 100%;
}

</style>
