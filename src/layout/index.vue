<!--
 * @Author: Elwin
 * @Date: 2022-04-01 14:43:55
 * @LastEditTime: 2022-04-01 15:15:35
 * @LastEditors: Please set LastEditors
 * @Description: project layout entry
 * @FilePath: \vite-vue3-ts-demo\src\layout\index.vue
-->
<script setup lang="ts">
import Sidebar from './sidebar/index.vue'
import Main from './main/index.vue'
</script>
<template>
  <div class="app-wrapper">
    <Sidebar />
    <Main />
  </div>
</template>
<style lang="less" scoped>
.app-wrapper {
  width: 100%;
  height: 100%;
  // background: #eee;
}
</style>