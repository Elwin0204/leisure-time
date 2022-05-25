<!--
 * @Author: Elwin
 * @Date: 2022-04-01 15:05:00
 * @LastEditTime: 2022-04-01 17:29:57
 * @LastEditors: Please set LastEditors
 * @Description: content entry
 * @FilePath: \vite-vue3-ts-demo\src\layout\main\index.vue
-->
<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
const $route = computed(() => useRoute())
</script>
<template>
  <section class="app-main">
    <router-view v-slot="{ Component }">
      <transition
        name="fade-transform"
        mode="out-in">
        <component :is="Component" />
        <!-- <keep-alive>
          <component :is="Component" />
        </keep-alive> -->
      </transition>
    </router-view>
  </section>
</template>
<style lang="less" scoped>
.app-main {
  // float: right;
  // background: yellow;
  height: 100%;
  margin-left: 300px;
  overflow: hidden;
}
// fade-transform
.fade-transform-leave-active,
.fade-transform-enter-active {
  transition: all .5s;
}

.fade-transform-enter {
  opacity: 0;
  transform: translateX(-30px);
}

.fade-transform-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
