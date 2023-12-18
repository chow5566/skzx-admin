<script setup>
import LogoSrc from '@/assets/images/logo/ZX.svg'
import Verify from '@/components/verifition/Verify.vue'
import Cookies from 'js-cookie'
import { encrypt } from '@/utils/jsencrypt.js'
import { isCaptchaEnabled } from '@/api/login.js'
import useUserStore from '@/stores/modules/user.js'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const redirect = ref(undefined)

watch(
  route,
  (newRoute) => {
    redirect.value = newRoute.query && newRoute.query.redirect
  },
  { immediate: true }
)

const loginFormRef = ref()
const loginForm = ref({
  username: '',
  password: '',
  rememberMe: false,
  code: null
})
const loginRules = {
  username: [{ required: true, trigger: 'blur', message: '请输入您的账号' }],
  password: [{ required: true, trigger: 'blur', message: '请输入您的密码' }],
  code: [{ required: true, trigger: 'change', message: '请先通过验证' }]
}

const loading = ref(false)
// 验证码开关
const captchaEnabled = ref(false)
isCaptchaEnabled().then((data) => {
  captchaEnabled.value = data.isCaptchaEnabled ?? false
})
// 验证码弹框
const verify = ref()

/** 登录 */
const handleSubmit = () => {
  loginFormRef.value.validate((valid) => {
    if (valid) {
      loading.value = true
      // 勾选了需要记住密码设置在 cookie 中设置记住用户名和密码
      if (loginForm.value.rememberMe) {
        Cookies.set('username', loginForm.value.username, { expires: 30 })
        Cookies.set('password', encrypt(loginForm.value.password), { expires: 30 })
        Cookies.set('rememberMe', loginForm.value.rememberMe, { expires: 30 })
      } else {
        // 否则移除
        Cookies.remove('username')
        Cookies.remove('password')
        Cookies.remove('rememberMe')
      }
      // 调用action的登录方法
      useUserStore()
        .login({
          ...loginForm.value,
          password: encrypt(loginForm.value.password)
        })
        .then(() => {
          const query = route.query
          const otherQueryParams = Object.keys(query).reduce((acc, cur) => {
            if (cur !== 'redirect') {
              acc[cur] = query[cur]
            }
            return acc
          }, {})
          router.replace({ path: redirect.value || '/', query: otherQueryParams })
        })
        .catch(() => {
          loading.value = false
        })
    }
  })
}
/** 验证码回调 */
const capctchaCheckSuccess = (params) => {
  loginForm.value.code = params.captchaVerification
}
</script>

<template>
  <div class="login-view w-screen h-screen overflow-hidden flex flex-col">
    <header class="p-4 flex items-center justify-between">
      <div class="flex items-end">
        <img :src="LogoSrc" class="w-[26px] h-[26px]" />
        <!--        <div class="font-bold text-[20px] ml-1 mb-[1px]">SKZX Admin</div>-->
      </div>
    </header>
    <div class="w-full flex-1 flex items-center">
      <div class="ml-[5vw]">
        <div class="text-[30px]">登录到</div>
        <div class="text-[34px] mt-3">SKZX Admin</div>
        <el-form
          ref="loginFormRef"
          :model="loginForm"
          :rules="loginRules"
          class="w-[380px] mt-10"
          size="large"
        >
          <el-form-item prop="username">
            <el-input v-model="loginForm.username" placeholder="请输入账号" clearable></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              v-model="loginForm.password"
              placeholder="请输入密码"
              type="password"
              show-password
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item v-if="captchaEnabled" prop="code">
            <el-button type="success" plain class="w-full" @click="verify.show()"
              >点击验证</el-button
            >
          </el-form-item>
          <el-checkbox v-model="loginForm.rememberMe">记住密码</el-checkbox>
          <el-form-item>
            <el-button type="primary" class="w-full" @click="handleSubmit">登录</el-button>
          </el-form-item>
        </el-form>
        <div class="text-gray-400 text-sm pt-4">
          Copyright @ 2021-2023 SKZX. All Rights Reserved
        </div>
      </div>
    </div>
  </div>
  <!-- 验证码弹框 -->
  <Verify
    v-if="captchaEnabled"
    mode="pop"
    captchaType="blockPuzzle"
    :imgSize="{ width: '330px', height: '155px' }"
    ref="verify"
    @success="capctchaCheckSuccess"
  />
</template>

<style scoped lang="scss">
.login-view {
  background: url('@/assets/images/login/bg.webp') no-repeat right center;
  background-size: cover;
}
</style>
