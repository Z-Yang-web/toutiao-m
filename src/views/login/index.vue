<template>
  <div class="login_container">
    <!-- 顶部导航栏 -->
    <van-nav-bar class="page-nav-bar" title="登录">
      <van-icon name="arrow-left" slot="left" @click="$router.back()" />
    </van-nav-bar>
    <!-- 登录表单 -->
    <!-- 给van-field配置表单验证规则 -->
    <!-- 表单提交的时候会自动触发表单验证 -->
    <!-- y验证通过;触发submit事件 -->
    <!-- 验证不通过则不会触发submit事件 -->
    <van-form ref="loginForm">
      <van-field
        v-model="user.mobile"
        required
        clearable
        placeholder="请输入手机号"
        :rules="userFormRules.mobile"
        type="number"
        maxlength="11"
        name="mobile"
      >
        <i slot="left-icon" class="toutiao toutiao-shouji"></i>
      </van-field>
      <van-field
        v-model="user.code"
        required
        type="number"
        maxlength="6"
        placeholder="请输入验证码"
        :rules="userFormRules.code"
        name="code"
      >
        <i slot="left-icon" class="toutiao toutiao-yanzhengma"></i>
        <!-- 通过插槽处理自定义图标 -->
        <template #button>
          <!-- 倒计时 -->
          <van-count-down
            :time="1000 * 60"
            format=" ss 秒"
            v-if="isCountDownShow"
            @finish="isCountDownShow = false"
          />
          <van-button
            v-else
            class="send-sms-btn"
            type="default"
            block
            size="mini"
            @click="onSendSms"
            native-type="button"
            >发送验证码</van-button
          >
        </template>
      </van-field>
      <div style="margin: 16px" class="login-btn-wrap">
        <van-button
          class="login-btn"
          block
          type="info"
          native-type="submit"
          @click="onSubmit"
          >登录</van-button
        >
      </div>
    </van-form>
  </div>
</template>

<script>
import { login, sendSms } from '@/api/user'
export default {
  name: 'loginIndex',
  // import引入的组件需要注入到对象中才能使用
  data () {
    // 这里存放数据
    return {
      user: {
        mobile: '',
        code: ''
      },
      userFormRules: {
        mobile: [
          { required: true, message: '请填写手机号' },
          {
            pattern: /^1[3|5|7|8]\d{9}$/,
            message: '手机号格式错误'
          }
        ],
        code: [
          { required: true, message: '请填写验证码' },
          {
            pattern: /^\d{6}$/,
            message: '验证码格式错误'
          }
        ]
      },
      isCountDownShow: false
    }
  },
  // 方法集合
  methods: {
    async onSubmit () {
      // console.log("submit", values);
      // 2,在组件中通过this.$toast提示用户
      this.$toast.loading({
        message: '登陆中...',
        forbidClick: true,
        duration: 0
      })
      // 3,提交表单请求登录
      try {
        const { data } = await login(this.user)
        this.$store.commit('setUser', data.data)
        this.$toast.success('登录成功')
        this.$route.push('/my')
      } catch (err) {
        // if (err.response.status === 400) {
        //   this.$toast.fail("手机号或者验证码错误");
        // } else {
        //   this.$toast.fail("登录失败，请稍候重试");
        // }
        console.log(err)
      }
    },
    async onSendSms () {
      // console.log("onSendSms");
      // 1,验证手机号
      try {
        await this.$refs.loginForm.validate('mobile')
      } catch (err) {
        return console.log('验证失败', err)
      }
      // 2,验证通过显示倒计时
      this.isCountDownShow = true
      // 3,请求发送验证码
      try {
        await sendSms(this.user.mobile)
        this.$toast('发送成功')
      } catch (err) {
        // 发送失败,关闭倒计时
        this.isCountDownShow = false
        if (err.response.status === 429) {
          this.$toast('发送过于频繁,请稍后重试!')
        } else {
          this.$toast('发送失败,请稍后重试!')
        }
      }
    }
  }
}
</script>
<style lang='less' scoped>
.login_container {
  .toutiao {
    font-size: 37px;
  }
  .send-sms-btn {
    width: 170px;
    height: 46px;
    line-height: 46px;
    background-color: #ededed;
    font-size: 22px;
    color: #666;
  }
  .login-btn-wrap {
    padding: 53px 33px;
    .login-btn {
      background-color: #6db4fb;
      border: none;
    }
  }
}
</style>
