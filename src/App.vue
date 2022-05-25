<!--
 * @Author: Elwin
 * @Date: 2022-03-31 13:16:25
 * @LastEditTime: 2022-04-02 08:24:06
 * @LastEditors: Please set LastEditors
 * @Description: project entry
 * @FilePath: \vite-vue3-ts-demo\src\App.vue
-->
<script setup lang="ts">
import bootstrap from '@/core/bootstrap'
import { onBeforeMount } from 'vue'
import { UserStore } from '@/store/user'
onBeforeMount(() => {
  bootstrap()
  const userStore = UserStore()
  console.log('app', userStore.routeList)
})
</script>

<template>
  <router-view />
</template>
