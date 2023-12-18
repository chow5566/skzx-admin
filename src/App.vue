<script setup>
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
const config = ref({
  button: {
    autoInsertSpace: true
  },
  message: {
    max: 1
  },
  locale: zhCn
})
</script>

<template>
  <el-config-provider :locale="config.locale" :button="config.button" :message="config.message">
    <RouterView />
  </el-config-provider>
</template>

<style scoped></style>
