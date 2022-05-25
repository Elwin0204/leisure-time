<!--
 * @Author: Elwin
 * @Date: 2022-04-01 15:04:43
 * @LastEditTime: 2022-04-02 09:10:57
 * @LastEditors: Please set LastEditors
 * @Description: sidebar entey
 * @FilePath: \vite-vue3-ts-demo\src\layout\sidebar\index.vue
-->
<script setup lang="ts">
defineProps<{
  title: string
}>()
</script>
<template>
  <router-link to="home">
    <div class="header">
      <svg-icon icon-class="game" icon-size="30"></svg-icon>
      <h1>{{ title }}</h1>
    </div>
  </router-link>
</template>
<style lang="less" scoped>
.header {
  height: 60px;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  // border-radius: 16px;
  h1 {
    font-size: 30px;
    color: #75C82B;
  }
}
</style>