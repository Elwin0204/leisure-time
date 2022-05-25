/*
 * @Author: Elwin
 * @Date: 2022-04-02 08:45:53
 * @LastEditTime: 2022-05-06 10:27:56
 * @LastEditors: Elwin
 * @Description: router config
 * @FilePath: \vite-vue3-ts-demo\src\router\index.ts
 */
import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
// import { defineAsyncComponent } from 'vue'
import Layout from '../layout/index.vue'

export const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/leisuretime'
  },
  {
    path: '/leisuretime',
    component: Layout,
    redirect: '/home',
    children: [
      {
        path: '/home',
        name: 'home',
        component: () => import('../views/welcome/index.vue'),
        meta: {
          title: '欢迎'
        }
      },
      {
        path: '/2048',
        name: '2048',
        component: () => import('../views/2048/index.vue'),
        meta: {
          title: '2048',
          icon: 'game'
        }
      },
      {
        path: '/tank',
        name: 'tank',
        component: () => import('../views/tank/index.vue'),
        meta: {
          title: 'tank',
          icon: 'game'
        }
      },
      {
        path: '/test',
        name: 'test',
        component: () => import('../views/test/index.vue'),
        meta: {
          title: 'test',
          icon: 'game'
        }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router