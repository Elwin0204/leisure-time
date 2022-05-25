<!--
 * @Author: Elwin
 * @Date: 2022-04-01 15:04:43
 * @LastEditTime: 2022-04-02 09:10:57
 * @LastEditors: Please set LastEditors
 * @Description: game route link
 * @FilePath: \vite-vue3-ts-demo\src\layout\sidebar\index.vue
-->
<script setup lang="ts">
import { computed } from 'vue'
import { UserStore } from '@/store/user'
import RouteCard from '@/components/route-card/index.vue'

const userStore = UserStore()
const routeList = computed(() => userStore.userRoutes)
// console.log('app', routeList)
</script>
<template>
  <ul class="route-list">
    <li v-for="route in routeList" class="route">
      <router-link :to="route.name">
        <route-card :title="route.meta.title" />
      </router-link>
    </li>
  </ul>
</template>
<style lang="less" scoped>
.route-list {
  list-style: none;
  margin: 0;
  padding: 24px;
}
</style>