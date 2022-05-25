<!--
 * @Author: Elwin
 * @Date: 2022-04-01 15:04:43
 * @LastEditTime: 2022-04-02 09:05:08
 * @LastEditors: Please set LastEditors
 * @Description: sidebar entey
 * @FilePath: \vite-vue3-ts-demo\src\layout\sidebar\index.vue
-->
<script setup lang="ts">
import RouteHeader from './components/RouteHeader.vue'
import RouteList from './components/RouteList.vue'
</script>
<template>
  <div class="sidebar">
    <RouteHeader title="Leisure Time" />
    <RouteList class="router-list" />
  </div>
</template>
<style lang="less" scoped>
.sidebar {
  width: 300px;
  float: left;
  background: #fff;
  height: 100%;
  background-image: linear-gradient(to bottom, #fff , #75C82B);
  box-shadow: 0px 0px 4px #cdcdcd;
}
</style>