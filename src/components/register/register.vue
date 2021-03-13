<template>
  <div class="register-wrap">

<el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
    <el-form-item label="名字" prop="name">
    <el-input v-model="ruleForm.name"></el-input>
  </el-form-item>
   <el-form-item label="邮箱" prop="email">
    <el-input v-model="ruleForm.email"></el-input>
  </el-form-item>
   <el-form-item label="手机号" prop="phone">
    <el-input v-model="ruleForm.phone"></el-input>
  </el-form-item>
  <el-form-item label="密码" prop="password">
    <el-input type="password" v-model="ruleForm.password" autocomplete="off"></el-input>
  </el-form-item>
  <el-form-item label="确认密码" prop="checkPass">
    <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off"></el-input>
  </el-form-item>

  <el-form-item>
    <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
  </el-form-item>
</el-form>

  </div>
</template>

<script>
  export default {
    data() {
      var checkEmpty = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('名字不能为空'));
        }
      };

      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          if (this.ruleForm.checkPass !== '') {
            this.$refs.ruleForm.validateField('checkPass');
          }
          callback();
        }
      };

      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.ruleForm.password) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };

      return {
        ruleForm: {
          password: '',
          name: '',
          email: '',
          phone: ''
        },
        rules: {
          password: [
            { validator: validatePass, trigger: 'blur' }
          ],
          checkPass: [
            { validator: validatePass2, trigger: 'blur' }
          ],
          name: [
            { validator: checkEmpty, trigger: 'blur' }
          ]
        }
      };

    },

    methods: {
        async submitForm (ruleForm) {
        const res = await this.$http.post(`register/`,this.ruleForm)
        const {
          meta: { msg, status }
        } = res.data
        if (status === 200) {
          this.$message.success(msg)
          this.$router.push({'name': 'login'})
        } else {
          this.$message.warning(msg)
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
};


</style>
