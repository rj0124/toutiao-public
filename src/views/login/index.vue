<template>
  <div class="login-container">
    <!--
      el-form 表单组件
      每个表单项都必须使用 el-form-item 组件包裹
     -->

    <div class="login-form-wrap">
      <div class="login-head">
        <div class="logo"></div>
      </div>
      <el-form class="login-form" ref="login-form" :model="user" :rules="formRules">
        <el-form-item prop="mobile">
          <el-input
            v-model="user.mobile"
            placeholder="请输入手机号"
          ></el-input>
        </el-form-item>
        <el-form-item prop="code">
          <el-input
            v-model="user.code"
            placeholder="请输入验证码"
          ></el-input>
        </el-form-item>
        <el-form-item prop="agree">
          <el-checkbox v-model="user.agree">我已阅读并同意用户协议和隐私条款</el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-button
            class="login-btn"
            type="primary"
            :loading="loginLoading"
            @click="onLogin"
          >登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>

import { login } from '@/api/user'

export default {
  name: 'LoginIndex',
  components: {},
  props: {},
  data () {
    return {
      user: {
        mobile: '13911111111', // 手机号
        code: '246810' // 验证码
      },
      checked: false, // 是否同意协议的选中状态
      loginLoading: false, // 登录的 loading 状态
      formRules: {
        mobile: [
          { required: true, message: '手机号不能为空', trigger: 'change' },
          { pattern: /^1[3|5|7|8|9]\d{9}$/, message: '请输入正确的号码格式' }
        ],
        code: [
          { required: true, message: '验证码不能为空', trigger: 'change' },
          { pattern: /^\d{6}$/, message: '请输入正确的验证码格式' }
        ],
        agree: [
          {
            validator: (rule, value, callback) => {
              if (value) {
                callback()
              } else {
                callback(new Error('请同意用户协议'))
              }
            },
            trigger: 'change'
          }
        ]
      }
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    onLogin () {
      // 获取表单数据（根据接口要求绑定数据）
      // const user = this.user

      // 表单验证
      this.$refs['login-form'].validate(valid => {
        if (!valid) {
          return
        }
        this.login()
      })

      // 验证通过，提交登录
    },

    async login () {
    // 开启登陆中 loading...
      this.loginLoading = true

      try {
        const res = await login(this.user)

        // console.log(res)
        // 登录成功
        this.$message({
          message: '登录成功',
          type: 'success'
        })

        // 关闭 loading
        this.loginLoading = false
        // 将接口返回的用户相关的数据放在本地存储,方便应用
        // 本地存储只能存字符串
        window.localStorage.setItem('user', JSON.stringify(res.data.data))
        // 跳转到首页
        this.$router.push({
          name: 'home'
        })
      } catch (err) {
        console.log('登录失败', err)
        this.$message.error('登录失败，手机号或验证码错误')

        // 关闭 loading
        this.loginLoading = false
      }
    }
    // login () {
    //   // 开启登陆中 loading...
    //   this.loginLoading = true

    //   login(this.user).then(res => {
    //     // console.log(res)
    //     // 登录成功
    //     this.$message({
    //       message: '登录成功',
    //       type: 'success'
    //     })

    //     // 关闭 loading
    //     this.loginLoading = false

    //     // 将接口返回的用户相关的数据放在本地存储,方便应用
    //     // 本地存储只能存字符串
    //     window.localStorage.setItem('user', JSON.stringify(res.data.data))

    //     // 跳转到首页
    //     this.$router.push({
    //       name: 'home'
    //     })
    //   }).catch(err => { // 登录失败
    //     console.log('登录失败', err)
    //     this.$message.error('登录失败，手机号或验证码错误')

    //     // 关闭 loading
    //     this.loginLoading = false
    //   })
    // }
  }
}
</script>

<style scoped lang="less">
.login-container {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: url("./login_bg.jpg") no-repeat;
  background-size: cover;
  .login-form-wrap {
    min-width: 300px;
    padding: 30px 50px 10px;
    background-color: #fff;
    .login-head {
      display: flex;
      justify-content: center;
      .logo {
        width: 200px;
        height: 57px;
        background: url("./logo_index.png") no-repeat;
        background-size: contain;
      }
    }
    .login-form {
      .login-btn {
        width: 100%;
      }
    }
  }
}
</style>
